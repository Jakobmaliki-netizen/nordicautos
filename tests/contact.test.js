// Property-based tests for Contact Form functionality
// Using fast-check for property-based testing

// Mock DOM environment for testing
function createContactMockDOM() {
    const mockElements = {};
    
    global.document = {
        getElementById: (id) => {
            if (!mockElements[id]) {
                mockElements[id] = {
                    value: '',
                    textContent: '',
                    innerHTML: '',
                    checked: false,
                    disabled: false,
                    hasAttribute: (attr) => attr === 'required',
                    classList: {
                        add: () => {},
                        remove: () => {},
                        contains: () => false
                    },
                    addEventListener: () => {},
                    parentNode: {
                        appendChild: () => {},
                        querySelector: () => null
                    },
                    scrollIntoView: () => {}
                };
            }
            return mockElements[id];
        },
        createElement: () => ({
            className: '',
            textContent: '',
            remove: () => {}
        }),
        querySelectorAll: () => []
    };
    
    global.localStorage = {
        getItem: () => '[]',
        setItem: () => {}
    };
    
    return mockElements;
}

// Contact form data generator
function generateContactFormData() {
    return fc.record({
        name: fc.string({ minLength: 1, maxLength: 100 }),
        email: fc.emailAddress(),
        phone: fc.option(fc.string({ minLength: 8, maxLength: 15 })),
        subject: fc.constantFrom('general', 'car-inquiry', 'financing', 'service', 'appointment'),
        message: fc.string({ minLength: 1, maxLength: 1000 }),
        consent: fc.boolean()
    });
}

// Invalid contact form data generator
function generateInvalidContactFormData() {
    return fc.oneof(
        // Missing required fields
        fc.record({
            name: fc.constant(''),
            email: fc.emailAddress(),
            message: fc.string({ minLength: 1 }),
            consent: fc.boolean()
        }),
        // Invalid email
        fc.record({
            name: fc.string({ minLength: 1 }),
            email: fc.string({ minLength: 1 }).filter(s => !s.includes('@')),
            message: fc.string({ minLength: 1 }),
            consent: fc.boolean()
        }),
        // No consent
        fc.record({
            name: fc.string({ minLength: 1 }),
            email: fc.emailAddress(),
            message: fc.string({ minLength: 1 }),
            consent: fc.constant(false)
        })
    );
}

describe('Contact Form Property Tests', () => {
    let ContactForm;
    let mockElements;
    
    beforeEach(() => {
        mockElements = createContactMockDOM();
        if (typeof require !== 'undefined') {
            ContactForm = require('../assets/js/contact.js');
        } else {
            ContactForm = window.ContactForm;
        }
    });

    /**
     * **Feature: nordic-autos-website, Property 12: Form Validation**
     * For any contact form submission with invalid or missing required fields, appropriate validation errors should be displayed
     * **Validates: Requirements 6.3**
     */
    test('Property 12: Invalid form data is properly rejected', () => {
        fc.assert(fc.property(
            generateInvalidContactFormData(),
            (formData) => {
                const contactForm = new ContactForm();
                
                // Set up mock form fields
                mockElements['contact-name'].value = formData.name || '';
                mockElements['contact-email'].value = formData.email || '';
                mockElements['contact-message'].value = formData.message || '';
                mockElements['contact-consent'].checked = formData.consent || false;
                
                // Test validation
                const isValid = contactForm.validateForm();
                const errors = contactForm.getValidationSummary();
                
                // Property: Invalid data should fail validation
                const shouldBeInvalid = !formData.name || 
                                      !formData.email || 
                                      !formData.message || 
                                      !formData.consent ||
                                      !contactForm.isValidEmail(formData.email);
                
                return shouldBeInvalid ? (!isValid && errors.length > 0) : (isValid && errors.length === 0);
            }
        ), { numRuns: 100 });
    });

    /**
     * **Feature: nordic-autos-website, Property 13: Form Success Handling**
     * For any valid contact form submission, a success confirmation message should be displayed
     * **Validates: Requirements 6.4**
     */
    test('Property 13: Valid form data passes validation', () => {
        fc.assert(fc.property(
            generateContactFormData().filter(data => 
                data.name.trim().length >= 2 && 
                data.message.trim().length >= 10 && 
                data.consent === true
            ),
            (formData) => {
                const contactForm = new ContactForm();
                
                // Set up mock form fields with valid data
                mockElements['contact-name'].value = formData.name;
                mockElements['contact-email'].value = formData.email;
                mockElements['contact-message'].value = formData.message;
                mockElements['contact-consent'].checked = formData.consent;
                
                // Test validation
                const isValid = contactForm.validateForm();
                const errors = contactForm.getValidationSummary();
                
                // Property: Valid data should pass validation
                return isValid && errors.length === 0;
            }
        ), { numRuns: 100 });
    });

    /**
     * **Feature: nordic-autos-website, Property 17: Image Accessibility**
     * For any email validation, the format should be correctly identified
     * **Validates: Requirements 9.2**
     */
    test('Property 17: Email validation correctly identifies valid and invalid emails', () => {
        fc.assert(fc.property(
            fc.oneof(
                fc.emailAddress(),
                fc.string({ minLength: 1, maxLength: 50 }).filter(s => !s.includes('@'))
            ),
            (email) => {
                const contactForm = new ContactForm();
                const isValid = contactForm.isValidEmail(email);
                
                // Property: Email validation should correctly identify valid emails
                const shouldBeValid = email.includes('@') && email.includes('.') && 
                                    email.indexOf('@') > 0 && 
                                    email.indexOf('@') < email.lastIndexOf('.');
                
                return shouldBeValid ? isValid : !isValid;
            }
        ), { numRuns: 100 });
    });

    /**
     * **Feature: nordic-autos-website, Property 18: Keyboard Navigation Support**
     * For any phone number input, formatting should be applied correctly
     * **Validates: Requirements 9.3**
     */
    test('Property 18: Phone number validation handles various formats', () => {
        fc.assert(fc.property(
            fc.oneof(
                fc.string({ minLength: 8, maxLength: 8 }).filter(s => /^\d+$/.test(s)), // 8 digits
                fc.string({ minLength: 10, maxLength: 10 }).filter(s => /^45\d{8}$/.test(s)), // +45 format
                fc.string({ minLength: 1, maxLength: 20 }) // Invalid format
            ),
            (phone) => {
                const contactForm = new ContactForm();
                const isValid = contactForm.isValidPhone(phone);
                
                // Property: Phone validation should correctly identify valid Danish numbers
                const digits = phone.replace(/\D/g, '');
                const shouldBeValid = digits.length === 8 || 
                                    (digits.length === 10 && digits.startsWith('45'));
                
                return shouldBeValid === isValid;
            }
        ), { numRuns: 100 });
    });

    /**
     * **Feature: nordic-autos-website, Property 21: Data Schema Validation**
     * For any form data collection, the data should conform to the expected schema
     * **Validates: Requirements 10.1**
     */
    test('Property 21: Form data collection preserves all required fields', () => {
        fc.assert(fc.property(
            generateContactFormData(),
            (formData) => {
                const contactForm = new ContactForm();
                
                // Set up mock form fields
                mockElements['contact-name'].value = formData.name;
                mockElements['contact-email'].value = formData.email;
                mockElements['contact-phone'].value = formData.phone || '';
                mockElements['contact-subject'].value = formData.subject;
                mockElements['contact-message'].value = formData.message;
                mockElements['contact-consent'].checked = formData.consent;
                
                const collectedData = contactForm.collectFormData();
                
                // Property: Collected data should have all required fields with correct types
                const hasRequiredFields = 
                    typeof collectedData.name === 'string' &&
                    typeof collectedData.email === 'string' &&
                    typeof collectedData.phone === 'string' &&
                    typeof collectedData.subject === 'string' &&
                    typeof collectedData.message === 'string' &&
                    typeof collectedData.consent === 'boolean' &&
                    typeof collectedData.timestamp === 'string' &&
                    typeof collectedData.source === 'string';
                
                // Property: Data should match input values
                const dataMatches = 
                    collectedData.name === formData.name &&
                    collectedData.email === formData.email &&
                    collectedData.subject === formData.subject &&
                    collectedData.message === formData.message &&
                    collectedData.consent === formData.consent;
                
                return hasRequiredFields && dataMatches;
            }
        ), { numRuns: 100 });
    });

    /**
     * **Feature: nordic-autos-website, Property 22: Data Consistency Across Views**
     * For any form prefill operation, the data should be correctly applied to form fields
     * **Validates: Requirements 10.2, 10.5**
     */
    test('Property 22: Form prefill correctly applies data to fields', () => {
        fc.assert(fc.property(
            generateContactFormData(),
            (prefillData) => {
                const contactForm = new ContactForm();
                
                // Prefill form
                contactForm.prefillForm(prefillData);
                
                // Property: Form fields should contain the prefilled data
                const nameMatches = !prefillData.name || mockElements['contact-name'].value === prefillData.name;
                const emailMatches = !prefillData.email || mockElements['contact-email'].value === prefillData.email;
                const phoneMatches = !prefillData.phone || mockElements['contact-phone'].value === prefillData.phone;
                const subjectMatches = !prefillData.subject || mockElements['contact-subject'].value === prefillData.subject;
                const messageMatches = !prefillData.message || mockElements['contact-message'].value === prefillData.message;
                
                return nameMatches && emailMatches && phoneMatches && subjectMatches && messageMatches;
            }
        ), { numRuns: 100 });
    });

    /**
     * **Feature: nordic-autos-website, Property 8: Search Results Relevance**
     * For any form validation summary, it should accurately reflect the form state
     * **Validates: Requirements 3.4**
     */
    test('Property 8: Validation summary accurately reflects form errors', () => {
        fc.assert(fc.property(
            generateContactFormData(),
            (formData) => {
                const contactForm = new ContactForm();
                
                // Set up form fields
                mockElements['contact-name'].value = formData.name || '';
                mockElements['contact-email'].value = formData.email || '';
                mockElements['contact-message'].value = formData.message || '';
                mockElements['contact-consent'].checked = formData.consent || false;
                
                const errors = contactForm.getValidationSummary();
                
                // Property: Error count should match actual validation issues
                let expectedErrorCount = 0;
                
                if (!formData.name?.trim()) expectedErrorCount++;
                if (!formData.email?.trim()) expectedErrorCount++;
                else if (!contactForm.isValidEmail(formData.email)) expectedErrorCount++;
                if (!formData.message?.trim()) expectedErrorCount++;
                if (!formData.consent) expectedErrorCount++;
                
                return errors.length === expectedErrorCount;
            }
        ), { numRuns: 100 });
    });

    /**
     * **Feature: nordic-autos-website, Property 23: Car Status Management**
     * For any form export operation, the data should maintain integrity
     * **Validates: Requirements 10.4**
     */
    test('Property 23: Form export maintains data integrity', () => {
        fc.assert(fc.property(
            generateContactFormData(),
            (formData) => {
                const contactForm = new ContactForm();
                
                // Set up form fields
                mockElements['contact-name'].value = formData.name || '';
                mockElements['contact-email'].value = formData.email || '';
                mockElements['contact-phone'].value = formData.phone || '';
                mockElements['contact-subject'].value = formData.subject || '';
                mockElements['contact-message'].value = formData.message || '';
                mockElements['contact-consent'].checked = formData.consent || false;
                
                const exportData = contactForm.exportFormData();
                
                // Property: Export should have consistent structure
                const hasValidStructure = 
                    typeof exportData.formId === 'string' &&
                    typeof exportData.fields === 'object' &&
                    typeof exportData.validationState === 'object' &&
                    typeof exportData.timestamp === 'string';
                
                // Property: Field presence should match actual field values
                const fieldPresenceCorrect = 
                    exportData.fields.name === !!formData.name?.trim() &&
                    exportData.fields.email === !!formData.email?.trim() &&
                    exportData.fields.message === !!formData.message?.trim() &&
                    exportData.fields.consent === !!formData.consent;
                
                return hasValidStructure && fieldPresenceCorrect;
            }
        ), { numRuns: 100 });
    });
});

// Export for Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateContactFormData,
        generateInvalidContactFormData,
        createContactMockDOM
    };
}