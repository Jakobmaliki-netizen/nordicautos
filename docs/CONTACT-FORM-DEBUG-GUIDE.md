# 🔧 Contact Form Debug Guide

## Problem
Kontaktformularen viser fejlmeddelelsen "der opstod en fejl" når brugere prøver at sende en besked.

## Løsning Implementeret

### 1. Bug Fix i contact.js
**Problem:** ContactForm klassen blev ikke instantieret korrekt.

**Fix:** Ændret fra:
```javascript
window.ContactForm = ContactForm; // Forkert - gemmer kun klassen
```

Til:
```javascript
window.contactForm = new ContactForm(); // Korrekt - opretter en instans
```

### 2. Debug Værktøj Oprettet
Jeg har lavet en debug side til at teste API'en: `debug-contact-api.html`

## Test Procedure

### Trin 1: Test API Endpoint
1. Gå til: `https://din-vercel-url.vercel.app/debug-contact-api.html`
2. Klik på "1. Test API Endpoint (GET)"
3. **Forventet resultat:** Status 405 (Method Not Allowed) - dette betyder API'en findes!

### Trin 2: Test Valid Submission
1. Klik på "2. Test Valid Submission"
2. **Forventet resultat:** 
   - Status 200
   - `success: true`
   - Besked: "Tak for din besked! Vi kontakter dig snarest."

### Trin 3: Test Kontaktformularen
1. Gå til: `https://din-vercel-url.vercel.app/kontakt.html`
2. Udfyld formularen:
   - Navn: Test Bruger
   - Email: test@example.com
   - Besked: Test besked
   - Accepter samtykke
3. Klik "Send besked"
4. **Forventet resultat:** Grøn success besked

## Mulige Problemer og Løsninger

### Problem 1: API endpoint findes ikke (404)
**Symptom:** Debug siden viser 404 error

**Løsning:**
1. Check at `api/send-email.js` filen er deployed
2. Vercel deployer automatisk filer i `/api` mappen som serverless functions
3. Vent 1-2 minutter efter push for deployment

### Problem 2: CORS fejl
**Symptom:** Browser console viser CORS error

**Løsning:** API'en har allerede CORS headers sat:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

### Problem 3: Validation fejl
**Symptom:** Status 400 med fejlbesked

**Løsning:** Check at alle required felter er udfyldt:
- Navn (minimum 2 tegn)
- Email (gyldig email format)
- Besked (minimum 10 tegn)
- Samtykke (skal være checked)

### Problem 4: Server fejl (500)
**Symptom:** Status 500 Internal Server Error

**Løsning:**
1. Check Vercel function logs:
   - Gå til Vercel Dashboard
   - Vælg dit projekt
   - Klik på "Functions" tab
   - Find `/api/send-email`
   - Se logs for fejl

## Email Konfiguration (Valgfrit)

Lige nu returnerer API'en success, men sender ikke rigtige emails. For at sende emails:

### Trin 1: Installer Resend Package
```bash
npm install resend
```

### Trin 2: Få Resend API Key
1. Gå til https://resend.com
2. Opret en konto
3. Få din API key

### Trin 3: Tilføj til Vercel Environment Variables
1. Gå til Vercel Dashboard
2. Vælg dit projekt
3. Gå til Settings → Environment Variables
4. Tilføj:
   - Key: `RESEND_API_KEY`
   - Value: din-resend-api-key

### Trin 4: Uncomment Email Kode
I `api/send-email.js`, uncomment:
```javascript
// Linje 3-4
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

// Linje 52-73 (email sending kode)
```

### Trin 5: Redeploy
```bash
git add api/send-email.js package.json package-lock.json
git commit -m "Add Resend email sending"
git push origin main
```

## Test Checklist

- [ ] Debug siden loader uden fejl
- [ ] Test 1: API endpoint findes (405 response)
- [ ] Test 2: Valid submission virker (200 + success)
- [ ] Test 3: Invalid email validation virker (400 + error)
- [ ] Test 4: Missing fields validation virker (400 + error)
- [ ] Kontaktformularen på kontakt.html virker
- [ ] Success besked vises efter submission
- [ ] Form resetter efter success

## Vercel Deployment Status

Check deployment status:
1. Gå til https://vercel.com/dashboard
2. Find dit projekt
3. Se seneste deployment
4. Status skal være "Ready"

## Browser Console Debug

Åbn browser console (F12) og check for:
- ✅ Ingen JavaScript fejl
- ✅ Fetch request til `/api/send-email` succeeds
- ✅ Response status 200
- ✅ Response body har `success: true`

## Support

Hvis problemet fortsætter:
1. Tag screenshot af debug siden
2. Tag screenshot af browser console
3. Check Vercel function logs
4. Send mig informationen

## Filer Ændret
- ✅ `assets/js/contact.js` - Fixed initialization bug
- ✅ `debug-contact-api.html` - New debug tool
- ✅ `api/send-email.js` - Serverless function (existing)

## Status
🟢 **Klar til test på Vercel**

Alle ændringer er pushed til GitHub og vil automatisk deploye til Vercel.
