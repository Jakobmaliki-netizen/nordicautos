# ✅ Resend Email Setup - Næsten Færdig!

## Hvad Har Jeg Gjort?

1. ✅ Installeret Resend package (`npm install resend`)
2. ✅ Aktiveret email sending i `api/send-email.js`
3. ✅ Tilføjet API key til `.env` fil (lokal)
4. ✅ Pushed ændringer til GitHub

## Hvad Skal DU Gøre Nu? (2 minutter)

### Trin 1: Tilføj API Key til Vercel

Du skal tilføje din Resend API key til Vercel's environment variables:

1. **Gå til Vercel Dashboard:**
   ```
   https://vercel.com/dashboard
   ```

2. **Vælg dit projekt** (nordic-autos eller hvad det hedder)

3. **Gå til Settings:**
   - Klik på "Settings" tab øverst
   - Vælg "Environment Variables" i venstre menu

4. **Tilføj ny variable:**
   - **Key:** `RESEND_API_KEY`
   - **Value:** `re_9Zo3hwE4_2MoEyck8kfBufMETFuHzGvYJ`
   - **Environments:** Vælg alle (Production, Preview, Development)
   - Klik "Save"

5. **Redeploy:**
   - Gå til "Deployments" tab
   - Find seneste deployment
   - Klik på de tre prikker (...)
   - Vælg "Redeploy"
   - Vent 1-2 minutter

### Trin 2: Test Email Sending

Efter redeployment:

1. **Gå til test siden:**
   ```
   https://din-vercel-url.vercel.app/test-contact-simple.html
   ```

2. **Klik "Send Test"**

3. **Forventet resultat:**
   - ✅ Grøn "SUCCESS!" besked
   - ✅ Email sendt til info@nordicautos.dk

4. **Check din email:**
   - Åbn info@nordicautos.dk
   - Du skulle have modtaget en email fra "Nordic Autos <onboarding@resend.dev>"
   - Emne: "Ny henvendelse: general"

### Trin 3: Test Rigtig Formular

1. **Gå til kontakt siden:**
   ```
   https://din-vercel-url.vercel.app/kontakt.html
   ```

2. **Udfyld formularen med rigtige data**

3. **Klik "Send besked"**

4. **Check email igen** - du skulle modtage beskeden!

## Email Detaljer

### Hvad Sendes?

Når nogen udfylder kontaktformularen, sendes en email til `info@nordicautos.dk` med:

```
Ny henvendelse fra Nordic Autos hjemmeside

Navn: [Brugerens navn]
Email: [Brugerens email]
Telefon: [Brugerens telefon eller "Ikke angivet"]
Emne: [Valgt emne]

Besked:
[Brugerens besked]

---
Sendt: [Dato og tid]
GDPR: Brugeren har givet samtykke til kontakt
```

### Email Afsender

**Midlertidig:** `Nordic Autos <onboarding@resend.dev>`

Dette er Resend's test afsender. Det virker fint, men:
- Emails kan ende i spam
- Ser ikke professionelt ud

### Opgradér til Custom Domain (Valgfrit)

For at sende fra `info@nordicautos.dk` eller `noreply@nordicautos.dk`:

1. **Gå til Resend Dashboard:**
   ```
   https://resend.com/domains
   ```

2. **Tilføj dit domain:**
   - Klik "Add Domain"
   - Indtast: `nordicautos.dk`

3. **Verificer domain:**
   - Resend giver dig DNS records
   - Tilføj dem til din domain provider (Simply.com)
   - Vent på verification (kan tage op til 48 timer)

4. **Opdater email afsender:**
   I `api/send-email.js`, ændr:
   ```javascript
   from: 'Nordic Autos <onboarding@resend.dev>',
   ```
   Til:
   ```javascript
   from: 'Nordic Autos <noreply@nordicautos.dk>',
   ```

## Resend Limits

**Gratis tier:**
- 100 emails per dag
- 3,000 emails per måned
- Perfekt til kontaktformular!

**Hvis du får mere trafik:**
- Upgrade til Pro: $20/måned
- 50,000 emails per måned

## Troubleshooting

### Problem: Email modtages ikke

**Check 1: Vercel Environment Variable**
- Gå til Vercel → Settings → Environment Variables
- Verificer at `RESEND_API_KEY` er sat korrekt
- Hvis ikke, tilføj den og redeploy

**Check 2: Spam folder**
- Check spam/junk folder i info@nordicautos.dk
- Emails fra `onboarding@resend.dev` kan ende der

**Check 3: Resend Dashboard**
- Gå til https://resend.com/emails
- Se alle sendte emails
- Check status (delivered, bounced, etc.)

**Check 4: Vercel Function Logs**
- Vercel Dashboard → Functions → /api/send-email
- Se logs for fejl

### Problem: "RESEND_API_KEY not configured"

**Løsning:**
- Du har glemt at tilføje API key til Vercel
- Følg Trin 1 ovenfor

### Problem: "Invalid API key"

**Løsning:**
- API key er forkert indtastet
- Check at du har kopieret hele key'en: `re_9Zo3hwE4_2MoEyck8kfBufMETFuHzGvYJ`
- Ingen mellemrum før eller efter

## Test Checklist

- [ ] API key tilføjet til Vercel
- [ ] Vercel redeployed
- [ ] Test side viser SUCCESS
- [ ] Email modtaget i info@nordicautos.dk
- [ ] Kontakt formular virker
- [ ] Email indeholder korrekt data

## Status

🟡 **Næsten færdig!**

Du skal bare:
1. Tilføje API key til Vercel (2 minutter)
2. Redeploy
3. Test

Så virker det! 🎉

## Næste Skridt

1. ⏳ Tilføj API key til Vercel (DU ER HER)
2. ⏳ Test email sending
3. ⏳ Verificer emails modtages
4. ⏳ (Valgfrit) Setup custom domain

---

**Spørgsmål?** Fortæl mig når du har tilføjet API key til Vercel, så kan vi teste! 🚀
