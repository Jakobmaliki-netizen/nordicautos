// EmailJS Configuration for Nordic Autos
// 
// SETUP INSTRUCTIONS:
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Add an email service (Gmail, Outlook, etc.)
// 3. Create TWO email templates:
//    
//    TEMPLATE 1 - "Contact Us" (Email til dig):
//    - Template variables: {{from_name}}, {{from_email}}, {{phone}}, {{subject}}, {{message}}
//    - To Email: info@nordicautos.dk
//    - Reply To: {{from_email}}
//    
//    TEMPLATE 2 - "Auto-Reply" (Email til kunden):
//    - Template variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
//    - To Email: {{from_email}}
//    - Reply To: info@nordicautos.dk
//
// 4. Get your Service ID, Template IDs, and Public Key from EmailJS dashboard
// 5. Replace the values below with your actual credentials

const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_18hjgdd',              // Replace with your EmailJS Service ID
    TEMPLATE_ID: 'template_8m0sjf6',            // Replace with your "Contact Us" Template ID
    AUTO_REPLY_TEMPLATE_ID: 'template_ponmlxl',  // Replace with your "Auto-Reply" Template ID (optional)
    PUBLIC_KEY: 'nnBPNzgb2HA415O5T'               // Replace with your EmailJS Public Key
};

// Initialize EmailJS when script loads
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('✅ EmailJS initialized');
    } else {
        console.error('❌ EmailJS library not loaded');
    }
})();

// Export config for use in contact form
window.EMAILJS_CONFIG = EMAILJS_CONFIG;
