# EmailJS Setup Guide - Nordic Autos

Denne guide hjælper dig med at opsætte EmailJS til kontaktformularen på Nordic Autos hjemmesiden.

## Hvad er EmailJS?

EmailJS er en gratis service der lader dig sende emails direkte fra JavaScript uden at skulle have en backend server. Perfekt til statiske hjemmesider!

## Trin 1: Opret EmailJS Konto

1. Gå til [https://www.emailjs.com/](https://www.emailjs.com/)
2. Klik på "Sign Up" og opret en gratis konto
3. Bekræft din email adresse

## Trin 2: Tilføj Email Service

1. Log ind på EmailJS dashboard
2. Gå til "Email Services" i menuen
3. Klik på "Add New Service"
4. Vælg din email udbyder (Gmail anbefales):
   - **Gmail**: Nemmest at sætte op
   - **Outlook**: Også god
   - **Custom SMTP**: Hvis du har din egen email server

### Gmail Setup (Anbefalet)

1. Vælg "Gmail"
2. Klik på "Connect Account"
3. Log ind med den Gmail konto du vil sende fra (f.eks. info@nordicautos.dk hvis det er en Gmail)
4. Giv EmailJS tilladelse til at sende emails
5. Gem din **Service ID** (f.eks. "service_abc123")

## Trin 3: Opret Email Template

1. Gå til "Email Templates" i menuen
2. Klik på "Create New Template"
3. Brug denne template:

```
Subject: Ny henvendelse fra {{from_name}} - {{subject}}

Fra: {{from_name}}
Email: {{from_email}}
Telefon: {{phone}}
Emne: {{subject}}

Besked:
{{message}}

---
Sendt fra Nordic Autos kontaktformular
Modtager: {{to_email}}
```

4. Konfigurer template settings:
   - **To Email**: `info@nordicautos.dk`
   - **From Name**: `Nordic Autos Kontaktformular`
   - **Reply To**: `{{from_email}}`

5. Test templaten med "Test it" knappen
6. Gem din **Template ID** (f.eks. "template_xyz789")

## Trin 4: Få din Public Key

1. Gå til "Account" → "General" i menuen
2. Find din **Public Key** (f.eks. "abcdefghijklmnop")
3. Kopier denne nøgle

## Trin 5: Opdater emailjs-config.js

Åbn filen `emailjs-config.js` i roden af projektet og erstat placeholder værdierne:

```javascript
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_abc123',      // Din Service ID fra trin 2
    TEMPLATE_ID: 'template_xyz789',    // Din Template ID fra trin 3
    PUBLIC_KEY: 'abcdefghijklmnop'     // Din Public Key fra trin 4
};
```

## Trin 6: Test Kontaktformularen

1. Åbn `http://localhost:8000/kontakt.html` i din browser
2. Udfyld kontaktformularen
3. Klik "Send besked"
4. Tjek om du modtager emailen på info@nordicautos.dk

## Fejlfinding

### "EmailJS not loaded" fejl
- Tjek at EmailJS SDK scriptet er loaded i `kontakt.html`
- Åbn browser console og se efter fejl

### "EmailJS config not loaded" fejl
- Tjek at `emailjs-config.js` er loaded korrekt
- Verificer at filen er i roden af projektet

### Emails sendes ikke
- Tjek at alle 3 credentials er korrekte (Service ID, Template ID, Public Key)
- Verificer at din email service er connected i EmailJS dashboard
- Tjek EmailJS dashboard for fejlmeddelelser

### Gmail blokerer emails
- Gå til Gmail settings → Security
- Aktivér "Less secure app access" (hvis nødvendigt)
- Eller brug Gmail's App Password feature

## Gratis Plan Begrænsninger

EmailJS gratis plan inkluderer:
- **200 emails per måned**
- Alle features
- Ingen kreditkort påkrævet

Hvis du har brug for mere, kan du opgradere til en betalt plan.

## Sikkerhed

EmailJS Public Key er sikker at dele offentligt - den kan kun bruges til at sende emails gennem din konfigurerede service, ikke til at læse eller ændre noget.

## Support

Hvis du har problemer:
1. Tjek EmailJS dokumentation: https://www.emailjs.com/docs/
2. Se EmailJS dashboard for fejlmeddelelser
3. Kontakt EmailJS support

## Alternativ: Resend (Tidligere Setup)

Hvis du foretrækker at bruge Resend i stedet (kræver Vercel deployment):
- Se `docs/EMAIL-SETUP-VERCEL.md` for instruktioner
- Resend kræver en backend (Vercel serverless function)
- EmailJS virker direkte fra browseren uden backend

---

**Held og lykke med opsætningen! 🚀**
