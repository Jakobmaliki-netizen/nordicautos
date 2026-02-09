# 📧 Email Setup for Vercel - Nordic Autos

## Problem
Vercel understøtter ikke PHP, så `send-email.php` virker ikke. I stedet skal vi bruge en serverless function med en email service.

## Løsning: Resend (Anbefalet)

Resend er gratis for op til 3,000 emails/måned og meget nemt at sætte op.

### Trin 1: Opret Resend Konto

1. Gå til [resend.com](https://resend.com)
2. Opret en gratis konto
3. Verificer din email

### Trin 2: Tilføj Dit Domæne

1. I Resend dashboard, gå til **Domains**
2. Klik **Add Domain**
3. Indtast `nordicautos.dk`
4. Følg instruktionerne for at tilføje DNS records hos Simply.com:
   - SPF record
   - DKIM record
   - DMARC record (valgfri)

### Trin 3: Få API Key

1. I Resend dashboard, gå til **API Keys**
2. Klik **Create API Key**
3. Giv den et navn (f.eks. "Nordic Autos Website")
4. Kopier API key'en (den starter med `re_`)

### Trin 4: Tilføj API Key til Vercel

1. Gå til dit Vercel projekt
2. Gå til **Settings** → **Environment Variables**
3. Tilføj ny variabel:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Din API key fra Resend
   - **Environment**: Production, Preview, Development (vælg alle)
4. Klik **Save**

### Trin 5: Installer Resend Package

Kør i din terminal:

```bash
npm install resend
```

### Trin 6: Opdater Serverless Function

Filen `api/send-email.js` er allerede oprettet. Opdater den med:

```javascript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            message: 'Method not allowed' 
        });
    }
    
    try {
        const { name, email, phone, subject, message, consent } = req.body;
        
        // Validate
        if (!name || !email || !message || !consent) {
            return res.status(400).json({ 
                success: false, 
                message: 'Alle påkrævede felter skal udfyldes' 
            });
        }
        
        // Send email via Resend
        const data = await resend.emails.send({
            from: 'Nordic Autos <noreply@nordicautos.dk>',
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
        
        console.log('Email sent successfully:', data.id);
        
        return res.status(200).json({
            success: true,
            message: 'Tak for din besked! Vi kontakter dig snarest.'
        });
        
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
            success: false,
            message: 'Der opstod en fejl. Prøv igen eller ring til os på +45 25 45 45 63.'
        });
    }
}
```

### Trin 7: Deploy til Vercel

```bash
git add .
git commit -m "Add Resend email integration"
git push
```

Vercel vil automatisk deploye ændringerne.

## Test Email Funktionalitet

### Lokal Test

1. Kør `vercel dev` i terminalen
2. Åbn `http://localhost:3000/kontakt.html`
3. Udfyld formularen og send
4. Tjek konsollen for fejl

### Produktion Test

1. Gå til din live site: `https://nordicautos.vercel.app/kontakt.html`
2. Udfyld formularen med rigtige data
3. Send besked
4. Tjek `info@nordicautos.dk` for email

## Alternative Email Services

### SendGrid (Gratis: 100 emails/dag)

```bash
npm install @sendgrid/mail
```

```javascript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
    to: 'info@nordicautos.dk',
    from: 'noreply@nordicautos.dk',
    subject: 'Ny henvendelse',
    text: message
});
```

### Mailgun (Gratis: 5,000 emails/måned)

```bash
npm install mailgun.js form-data
```

### Nodemailer med SMTP (Brug Simply.com's SMTP)

```bash
npm install nodemailer
```

```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.simply.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

await transporter.sendMail({
    from: 'noreply@nordicautos.dk',
    to: 'info@nordicautos.dk',
    subject: 'Ny henvendelse',
    text: message
});
```

## Fejlfinding

### "API key not found"
- Tjek at `RESEND_API_KEY` er sat i Vercel environment variables
- Redeploy projektet efter at have tilføjet environment variable

### "Domain not verified"
- Gå til Resend dashboard og verificer at domænet er godkendt
- Tjek DNS records hos Simply.com

### "Email not sent"
- Tjek Vercel function logs: `vercel logs`
- Tjek Resend dashboard for fejl
- Verificer at email adressen er korrekt

### Emails går til spam
- Tilføj SPF, DKIM og DMARC records
- Brug en verificeret afsender email
- Undgå spam-ord i emne og besked

## Status

✅ Serverless function oprettet: `api/send-email.js`
✅ Contact form opdateret til at bruge ny API
⏳ Resend skal konfigureres (følg trin ovenfor)
⏳ Environment variables skal tilføjes i Vercel

## Næste Skridt

1. Opret Resend konto
2. Tilføj API key til Vercel
3. Installer `npm install resend`
4. Opdater `api/send-email.js` med Resend kode
5. Deploy og test!

## Support

Hvis du har problemer:
- Resend docs: https://resend.com/docs
- Vercel docs: https://vercel.com/docs/functions/serverless-functions
- Kontakt support hvis nødvendigt
