// Vercel Serverless Function for Contact Form
// Nordic Autos - GDPR Compliant Email Handler

import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            message: 'Method not allowed' 
        });
    }
    
    try {
        // Get form data
        const { name, email, phone, subject, message, consent } = req.body;
        
        // Validate required fields
        const errors = [];
        if (!name || name.trim() === '') errors.push('Navn er påkrævet');
        if (!email || email.trim() === '') errors.push('Email er påkrævet');
        if (!message || message.trim() === '') errors.push('Besked er påkrævet');
        if (!consent) errors.push('Du skal acceptere at vi kontakter dig');
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            errors.push('Ugyldig email adresse');
        }
        
        if (errors.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: errors.join(', ') 
            });
        }
        
        // Check for honeypot (spam protection)
        if (req.body['bot-field']) {
            console.log('Spam attempt detected');
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid request' 
            });
        }
        
        // Log submission (for debugging)
        console.log('Contact form submission:', {
            name,
            email,
            phone: phone || 'Ikke angivet',
            subject: subject || 'Generel henvendelse',
            timestamp: new Date().toISOString()
        });
        
        // Check if Resend is configured
        if (process.env.RESEND_API_KEY) {
            // Send email via Resend
            const data = await resend.emails.send({
                from: 'Nordic Autos <onboarding@resend.dev>',
                to: ['info@nordicautos.dk'],
                replyTo: email,
                subject: `Ny henvendelse: ${subject || 'Generel henvendelse'}`,
                text: `
Ny henvendelse fra Nordic Autos hjemmeside

Navn: ${name}
Email: ${email}
Telefon: ${phone || 'Ikke angivet'}
Emne: ${subject || 'Generel henvendelse'}

Besked:
${message}

---
Sendt: ${new Date().toLocaleString('da-DK')}
GDPR: Brugeren har givet samtykke til kontakt
                `
            });
            
            console.log('Email sent successfully via Resend:', data.id);
            
            return res.status(200).json({
                success: true,
                message: 'Tak for din besked! Vi kontakter dig snarest.'
            });
        } else {
            // Resend not configured - return success but log warning
            console.warn('RESEND_API_KEY not configured. Email not sent.');
            
            return res.status(200).json({
                success: true,
                message: 'Tak for din besked! Vi kontakter dig snarest.',
                note: 'Email service skal konfigureres. Se EMAIL-SETUP-VERCEL.md'
            });
        }
        
    } catch (error) {
        console.error('Error processing contact form:', error);
        return res.status(500).json({
            success: false,
            message: 'Der opstod en fejl. Prøv igen eller ring til os på +45 25 45 45 63.'
        });
    }
}
