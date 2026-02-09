# EmailJS Quick Start - 5 Minutter Setup

Hurtig guide til at få kontaktformularen til at virke med EmailJS.

## 🚀 Hurtig Opsætning (5 minutter)

### 1. Opret EmailJS Konto
- Gå til [emailjs.com](https://www.emailjs.com/)
- Sign up (gratis)
- Bekræft email

### 2. Tilføj Gmail Service
- Dashboard → "Email Services" → "Add New Service"
- Vælg "Gmail"
- Connect din Gmail konto
- **Gem Service ID** (f.eks. `service_abc123`)

### 3. Opret Template
- Dashboard → "Email Templates" → "Create New Template"
- Brug denne template:

**Subject:**
```
Ny henvendelse fra {{from_name}} - {{subject}}
```

**Content:**
```
Fra: {{from_name}}
Email: {{from_email}}
Telefon: {{phone}}
Emne: {{subject}}

Besked:
{{message}}

---
Sendt til: {{to_email}}
```

**Settings:**
- To Email: `info@nordicautos.dk`
- Reply To: `{{from_email}}`

- **Gem Template ID** (f.eks. `template_xyz789`)

### 4. Få Public Key
- Dashboard → "Account" → "General"
- **Kopier Public Key** (f.eks. `abcdefghijklmnop`)

### 5. Opdater emailjs-config.js

Åbn `emailjs-config.js` og indsæt dine værdier:

```javascript
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_abc123',      // Din Service ID
    TEMPLATE_ID: 'template_xyz789',    // Din Template ID
    PUBLIC_KEY: 'abcdefghijklmnop'     // Din Public Key
};
```

### 6. Test!
- Åbn `http://localhost:8000/kontakt.html`
- Udfyld formularen
- Send besked
- Tjek din inbox på info@nordicautos.dk

## ✅ Færdig!

Kontaktformularen sender nu emails direkte til info@nordicautos.dk via EmailJS.

## 📊 Gratis Plan
- 200 emails/måned
- Alle features
- Ingen kreditkort

## 🆘 Problemer?

**Emails sendes ikke?**
- Tjek at alle 3 IDs er korrekte i `emailjs-config.js`
- Se EmailJS dashboard for fejl
- Verificer Gmail connection

**"EmailJS not loaded"?**
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
- Tjek browser console for fejl

Se fuld guide: `docs/EMAILJS-SETUP-GUIDE.md`
