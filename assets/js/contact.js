// Contact Form functionality for Nordic Autos Website

class ContactForm {
    constructor() {
        this.form = null;
        this.messageContainer = null;
        this.submitButton = null;
        this.isSubmitting = false;
        
        this.init();
    }

    /**
     * Initialize contact form
     */
    init() {
        this.bindElements();
        this.setupEventListeners();
        this.setupValidation();
    }

    /**
     * Bind DOM elements
     */
    bindElements() {
        this.form = document.getElementById('main-contact-form');
        this.messageContainer = document.getElementById('form-message');
        this.submitButton = this.form?.querySelector('button[type="submit"]');
        
        // Form fields
        this.nameField = document.getElementById('contact-name');
        this.emailField = document.getElementById('contact-email');
        this.phoneField = document.getElementById('contact-phone');
        this.subjectField = document.getElementById('contact-subject');
        this.messageField = document.getElementById('contact-message');
        this.consentField = document.getElementById('contact-consent');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        if (!this.form) return;

        // Form submission - ONLY ONE LISTENER
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Prevent multiple submissions
            if (this.isSubmitting) {
                console.log('⚠️ Already submitting, ignoring duplicate submission');
                return false;
            }
            
            // Validate form before submission
            const isValid = this.validateForm();
            if (!isValid) {
                this.showMessage('Ret venligst fejlene i formularen.', 'error');
                return false;
            }
            
            // Handle form submission
            this.handleFormSubmission();
        }, { once: false }); // Don't use 'once' - we want to allow resubmission after reset

        // Real-time validation
        const fields = [this.nameField, this.emailField, this.phoneField, this.messageField];
        fields.forEach(field => {
            if (field) {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearFieldError(field));
            }
        });

        // Email validation on input
        if (this.emailField) {
            this.emailField.addEventListener('input', this.debounce(() => {
                this.validateEmail();
            }, 500));
        }

        // Phone formatting
        if (this.phoneField) {
            this.phoneField.addEventListener('input', () => {
                this.formatPhoneNumber();
            });
        }

        // Consent checkbox
        if (this.consentField) {
            this.consentField.addEventListener('change', () => {
                this.updateSubmitButton();
            });
        }
    }

    /**
     * Setup form validation
     */
    setupValidation() {
        // Add required field indicators
        const requiredFields = this.form?.querySelectorAll('input[required], textarea[required]');
        requiredFields?.forEach(field => {
            const label = this.form.querySelector(`label[for="${field.id}"]`);
            if (label && !label.textContent.includes('*')) {
                label.innerHTML = label.innerHTML.replace('*', '<span class="text-red-500">*</span>');
            }
        });
    }

    /**
     * Handle form submission
     */
    async handleFormSubmission() {
        // Double check we're not already submitting
        if (this.isSubmitting) {
            console.log('⚠️ Already submitting, aborting');
            return;
        }
        
        console.log('📤 Starting form submission...');
        this.isSubmitting = true;
        this.setSubmitButtonState(true);

        try {
            // Submit using EmailJS
            await this.submitWithEmailJS();
        } catch (error) {
            console.error('❌ Form submission error:', error);
            this.showMessage('Der opstod en fejl. Prøv igen eller ring til os på +45 25 45 45 63.', 'error');
            this.isSubmitting = false;
            this.setSubmitButtonState(false);
        }
    }

    /**
     * Submit form using EmailJS
     */
    async submitWithEmailJS() {
        // Check if EmailJS is loaded
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS not loaded');
        }

        // Check if config is available
        if (!window.EMAILJS_CONFIG) {
            throw new Error('EmailJS config not loaded');
        }

        const config = window.EMAILJS_CONFIG;

        // Collect form data
        const templateParams = {
            from_name: this.nameField?.value.trim() || '',
            from_email: this.emailField?.value.trim() || '',
            phone: this.phoneField?.value.trim() || 'Ikke angivet',
            subject: this.subjectField?.value || 'Generel henvendelse',
            message: this.messageField?.value.trim() || '',
            to_email: 'info@nordicautos.dk'
        };

        console.log('📧 Sending email with params:', {
            from_name: templateParams.from_name,
            from_email: templateParams.from_email,
            subject: templateParams.subject
        });

        try {
            console.log('📧 Sending main email to info@nordicautos.dk...');
            
            // Send main email to Nordic Autos
            const response1 = await emailjs.send(
                config.SERVICE_ID,
                config.TEMPLATE_ID,
                templateParams
            );

            console.log('✅ Main email sent successfully. Status:', response1.status, 'Text:', response1.text);
            
            // Send auto-reply to customer ONLY if auto-reply template is configured
            // TEMPORARILY DISABLED FOR TESTING
            if (false && config.AUTO_REPLY_TEMPLATE_ID && config.AUTO_REPLY_TEMPLATE_ID !== 'YOUR_AUTO_REPLY_TEMPLATE_ID') {
                console.log('📧 Sending auto-reply to customer:', templateParams.from_email);
                
                try {
                    const response2 = await emailjs.send(
                        config.SERVICE_ID,
                        config.AUTO_REPLY_TEMPLATE_ID,
                        templateParams
                    );
                    console.log('✅ Auto-reply sent successfully. Status:', response2.status, 'Text:', response2.text);
                } catch (autoReplyError) {
                    console.warn('⚠️ Auto-reply failed (optional):', autoReplyError);
                    // Don't throw error - auto-reply is optional
                }
            } else {
                console.log('ℹ️ Auto-reply template not configured, skipping');
            }
            
            // Show success message
            this.showMessage('✅ Tak for din besked! Vi kontakter dig snarest.', 'success');
            
            // Reset form after 3 seconds
            setTimeout(() => {
                this.resetForm();
                this.isSubmitting = false;
                this.setSubmitButtonState(false);
                console.log('✅ Form reset complete');
            }, 3000);

        } catch (error) {
            console.error('❌ EmailJS error:', error);
            this.isSubmitting = false;
            this.setSubmitButtonState(false);
            throw error;
        }
    }

    /**
     * Handle local form submission (for testing)
     */
    async handleLocalSubmission() {
        try {
            // Collect form data for local storage
            const formData = this.collectFormData();
            
            // Store in localStorage for demo
            const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
            submissions.push(formData);
            localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            this.showMessage('✅ Besked modtaget! (Lokal test - på Simply.com sendes rigtige emails til info@nordicautos.dk)', 'success');
            
            // Reset form after success
            setTimeout(() => {
                this.resetForm();
            }, 4000);

        } catch (error) {
            console.error('Local submission error:', error);
            this.showMessage('Der opstod en fejl. Prøv igen.', 'error');
        }
    }

    /**
     * Validate entire form
     */
    validateForm() {
        let isValid = true;

        // Validate required fields
        const requiredFields = [
            { field: this.nameField, name: 'Navn' },
            { field: this.emailField, name: 'Email' },
            { field: this.messageField, name: 'Besked' }
        ];

        requiredFields.forEach(({ field, name }) => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Validate email format
        if (this.emailField?.value && !this.isValidEmail(this.emailField.value)) {
            this.showFieldError(this.emailField, 'Indtast en gyldig email adresse');
            isValid = false;
        }

        // Validate phone format (if provided)
        if (this.phoneField?.value && !this.isValidPhone(this.phoneField.value)) {
            this.showFieldError(this.phoneField, 'Indtast et gyldigt telefonnummer');
            isValid = false;
        }

        // Validate consent
        if (!this.consentField?.checked) {
            this.showFieldError(this.consentField, 'Du skal acceptere at vi kontakter dig');
            isValid = false;
        }

        return isValid;
    }

    /**
     * Validate individual field
     */
    validateField(field) {
        if (!field) return true;

        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');

        // Check if required field is empty
        if (isRequired && !value) {
            this.showFieldError(field, 'Dette felt er påkrævet');
            return false;
        }

        // Field-specific validation
        if (field === this.nameField && value) {
            if (value.length < 2) {
                this.showFieldError(field, 'Navn skal være mindst 2 tegn');
                return false;
            }
        }

        if (field === this.messageField && value) {
            if (value.length < 10) {
                this.showFieldError(field, 'Besked skal være mindst 10 tegn');
                return false;
            }
        }

        // Clear any existing errors
        this.clearFieldError(field);
        return true;
    }

    /**
     * Validate email format
     */
    validateEmail() {
        if (!this.emailField) return;

        const email = this.emailField.value.trim();
        if (email && !this.isValidEmail(email)) {
            this.showFieldError(this.emailField, 'Indtast en gyldig email adresse');
            return false;
        }

        this.clearFieldError(this.emailField);
        return true;
    }

    /**
     * Format phone number
     */
    formatPhoneNumber() {
        if (!this.phoneField) return;

        let value = this.phoneField.value.replace(/\D/g, ''); // Remove non-digits
        
        // Add Danish country code if not present
        if (value.length === 8 && !value.startsWith('45')) {
            value = '45' + value;
        }

        // Format as +45 XX XX XX XX
        if (value.startsWith('45') && value.length === 10) {
            const formatted = `+45 ${value.slice(2, 4)} ${value.slice(4, 6)} ${value.slice(6, 8)} ${value.slice(8, 10)}`;
            this.phoneField.value = formatted;
        }
    }

    /**
     * Show field error
     */
    showFieldError(field, message) {
        if (!field) return;

        // Remove existing error
        this.clearFieldError(field);

        // Add error styling
        field.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
        field.classList.remove('border-slate-300', 'focus:border-primary', 'focus:ring-primary');

        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'text-red-600 text-sm mt-1 field-error';
        errorElement.textContent = message;

        // Insert error message after field
        field.parentNode.appendChild(errorElement);
    }

    /**
     * Clear field error
     */
    clearFieldError(field) {
        if (!field) return;

        // Remove error styling
        field.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
        field.classList.add('border-slate-300', 'focus:border-primary', 'focus:ring-primary');

        // Remove error message
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * Collect form data
     */
    collectFormData() {
        return {
            name: this.nameField?.value.trim() || '',
            email: this.emailField?.value.trim() || '',
            phone: this.phoneField?.value.trim() || '',
            subject: this.subjectField?.value || 'general',
            message: this.messageField?.value.trim() || '',
            consent: this.consentField?.checked || false,
            timestamp: new Date().toISOString(),
            source: 'website_contact_form'
        };
    }

    /**
     * Submit form data (simulate API call)
     */
    async submitForm(formData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Store in localStorage for demo purposes
        const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions.push(formData);
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

        // In a real application, this would be an API call:
        // const response = await fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });
        // 
        // if (!response.ok) {
        //     throw new Error('Failed to submit form');
        // }

        return { success: true };
    }

    /**
     * Reset form to initial state
     */
    resetForm() {
        if (!this.form) return;

        this.form.reset();
        
        // Clear all field errors
        const fields = [this.nameField, this.emailField, this.phoneField, this.messageField, this.consentField];
        fields.forEach(field => this.clearFieldError(field));

        // Update submit button state
        this.updateSubmitButton();
    }

    /**
     * Set submit button loading state
     */
    setSubmitButtonState(isLoading) {
        if (!this.submitButton) return;

        if (isLoading) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = `
                <span class="material-symbols-outlined animate-spin">refresh</span>
                Sender besked...
            `;
        } else {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = `
                <span class="material-symbols-outlined">send</span>
                Send besked
            `;
        }
    }

    /**
     * Update submit button based on form state
     */
    updateSubmitButton() {
        if (!this.submitButton || !this.consentField) return;

        const isFormValid = this.consentField.checked && 
                           this.nameField?.value.trim() && 
                           this.emailField?.value.trim() && 
                           this.messageField?.value.trim();

        this.submitButton.disabled = !isFormValid;
        
        if (isFormValid) {
            this.submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            this.submitButton.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }

    /**
     * Show form message
     */
    showMessage(message, type) {
        if (!this.messageContainer) return;

        const bgColor = type === 'success' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 
                       'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200';

        this.messageContainer.className = `text-sm text-center py-3 rounded-lg ${bgColor}`;
        this.messageContainer.textContent = message;
        this.messageContainer.classList.remove('hidden');

        // Scroll to message
        this.messageContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.messageContainer.classList.add('hidden');
            }, 5000);
        }
    }

    /**
     * Validation helper functions
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        // Remove all non-digits
        const digits = phone.replace(/\D/g, '');
        
        // Check for Danish phone number (8 digits) or international format
        return digits.length === 8 || (digits.length === 10 && digits.startsWith('45'));
    }

    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Get form validation summary
     */
    getValidationSummary() {
        const errors = [];
        
        if (!this.nameField?.value.trim()) {
            errors.push('Navn er påkrævet');
        }
        
        if (!this.emailField?.value.trim()) {
            errors.push('Email er påkrævet');
        } else if (!this.isValidEmail(this.emailField.value.trim())) {
            errors.push('Email format er ugyldigt');
        }
        
        if (!this.messageField?.value.trim()) {
            errors.push('Besked er påkrævet');
        }
        
        if (!this.consentField?.checked) {
            errors.push('Samtykke er påkrævet');
        }

        return errors;
    }

    /**
     * Pre-fill form with data
     */
    prefillForm(data) {
        if (data.name && this.nameField) {
            this.nameField.value = data.name;
        }
        
        if (data.email && this.emailField) {
            this.emailField.value = data.email;
        }
        
        if (data.phone && this.phoneField) {
            this.phoneField.value = data.phone;
        }
        
        if (data.subject && this.subjectField) {
            this.subjectField.value = data.subject;
        }
        
        if (data.message && this.messageField) {
            this.messageField.value = data.message;
        }

        // Update submit button state
        this.updateSubmitButton();
    }

    /**
     * Export form data for analytics
     */
    exportFormData() {
        return {
            formId: 'main-contact-form',
            fields: {
                name: !!this.nameField?.value.trim(),
                email: !!this.emailField?.value.trim(),
                phone: !!this.phoneField?.value.trim(),
                subject: this.subjectField?.value || 'none',
                message: !!this.messageField?.value.trim(),
                consent: this.consentField?.checked
            },
            validationState: {
                isValid: this.getValidationSummary().length === 0,
                errors: this.getValidationSummary()
            },
            timestamp: new Date().toISOString()
        };
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactForm;
} else {
    window.ContactForm = ContactForm;
}

// NOTE: ContactForm is initialized in kontakt.html, not here
// This prevents double initialization