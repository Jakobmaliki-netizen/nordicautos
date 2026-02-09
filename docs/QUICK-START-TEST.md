# 🚀 Quick Start Test - Kontaktformular

## Hvad Skal Du Gøre NU?

### Trin 1: Vent på Vercel Deployment (1-2 minutter)
Gå til https://vercel.com/dashboard og check at deployment er færdig (grøn "Ready" status).

### Trin 2: Test API'en (30 sekunder)
Åbn denne URL i din browser:
```
https://din-vercel-url.vercel.app/test-contact-simple.html
```

Klik "Send Test" knappen.

**Hvad skal du se?**
- ✅ Grøn tekst: "✅ SUCCESS!"
- ✅ Status: 200
- ✅ Response: {"success": true, "message": "Tak for din besked!..."}

**Hvis du ser fejl:**
- ❌ Rød tekst med fejlbesked
- Tag screenshot og send til mig

### Trin 3: Test Rigtige Formular (1 minut)
Gå til:
```
https://din-vercel-url.vercel.app/kontakt.html
```

Udfyld formularen og klik "Send besked".

**Hvad skal du se?**
- ✅ Grøn success besked: "Tak for din besked! Vi kontakter dig snarest."
- ✅ Formularen resetter

**Hvis du ser fejl:**
- ❌ Rød fejlbesked
- Åbn browser console (F12)
- Tag screenshot af console
- Send til mig

## Hvad Hvis Det Ikke Virker?

### Debug Checklist

1. **Check Vercel Deployment:**
   ```
   https://vercel.com/dashboard → Dit projekt → Deployments
   ```
   - Er seneste deployment "Ready"?
   - Er der fejl i build logs?

2. **Check API Endpoint:**
   Åbn denne URL direkte:
   ```
   https://din-vercel-url.vercel.app/api/send-email
   ```
   - Skal give: `{"success":false,"message":"Method not allowed"}`
   - Hvis 404: API'en er ikke deployed

3. **Check Browser Console:**
   - Åbn kontakt siden
   - Tryk F12 → Console tab
   - Send formular
   - Se efter fejl (røde linjer)

4. **Check Vercel Function Logs:**
   ```
   Vercel Dashboard → Dit projekt → Functions → /api/send-email
   ```
   - Se logs for fejl

## Almindelige Problemer

### Problem: "404 Not Found"
**Årsag:** API endpoint findes ikke
**Løsning:** 
- Check at `api/send-email.js` er i GitHub repo
- Vent på Vercel deployment
- Redeploy manuelt i Vercel Dashboard

### Problem: "CORS Error"
**Årsag:** Browser blokerer request
**Løsning:** API'en har allerede CORS headers - dette burde ikke ske

### Problem: "Validation Error"
**Årsag:** Formular data er ugyldig
**Løsning:** Check at alle felter er udfyldt korrekt

### Problem: "500 Internal Server Error"
**Årsag:** Fejl i serverless function
**Løsning:** Check Vercel function logs for detaljer

## Hvad Sker Der Bagved?

1. **Bruger udfylder formular** → `kontakt.html`
2. **JavaScript validerer data** → `assets/js/contact.js`
3. **Sender POST request** → `/api/send-email`
4. **Vercel kører function** → `api/send-email.js`
5. **Function validerer data** → Returnerer success/error
6. **JavaScript viser besked** → Grøn success eller rød fejl

## Email Sending Status

⚠️ **VIGTIGT:** Lige nu returnerer API'en success, men sender IKKE rigtige emails!

For at sende rigtige emails skal du:
1. Installere Resend package
2. Få Resend API key
3. Tilføje til Vercel environment variables
4. Uncomment email kode i `api/send-email.js`

Se `CONTACT-FORM-DEBUG-GUIDE.md` for detaljer.

## Test Resultat

Når du har testet, fortæl mig:

**Scenario A: Det virker! ✅**
- Test siden viser "SUCCESS"
- Kontakt siden viser grøn besked
- Næste skridt: Setup email sending

**Scenario B: Det virker ikke ❌**
- Send mig:
  - Screenshot af test siden
  - Screenshot af browser console
  - Screenshot af Vercel function logs
  - Vercel URL

## Hurtig Reference

**Test Sider:**
- `/test-contact-simple.html` - Quick test
- `/debug-contact-api.html` - Fuld debug
- `/kontakt.html` - Rigtig formular

**Guides:**
- `CONTACT-FORM-FIX-SUMMARY.md` - Oversigt
- `CONTACT-FORM-DEBUG-GUIDE.md` - Detaljeret guide
- `QUICK-START-TEST.md` - Denne fil

**Filer:**
- `api/send-email.js` - Serverless function
- `assets/js/contact.js` - Form handler
- `kontakt.html` - Contact page

---

**Klar? Start med Trin 1! 🚀**
