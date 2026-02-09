# 📧 Email Setup Instruktioner for Nordic Autos

## ✅ Hvad er implementeret

Jeg har implementeret Netlify Forms så emails automatisk sendes til `info@nordicautos.dk` når nogen udfylder kontaktformularen.

### Ændringer der er lavet:

1. **Kontaktformular opdateret** (`kontakt.html`):
   - Tilføjet `data-netlify="true"` for at aktivere Netlify Forms
   - Tilføjet spam-beskyttelse med honeypot
   - Formularen sender nu til `/tak-for-din-besked.html`

2. **Tak-side oprettet** (`tak-for-din-besked.html`):
   - Bekræftelsesside som brugere ser efter at have sendt formularen
   - Automatisk redirect til forsiden efter 30 sekunder

3. **Netlify konfiguration** (`netlify.toml`):
   - Specificerer at emails skal sendes til `info@nordicautos.dk`
   - Custom email template med alle formulardata
   - Sikkerhedsindstillinger

4. **JavaScript opdateret** (`assets/js/contact.js`):
   - Lader Netlify håndtere email-afsendelse
   - Validerer stadig formularen før afsendelse

## 🚀 Sådan aktiverer du email-funktionaliteten

### Trin 1: Upload til Netlify
1. Upload alle filerne til din Netlify side
2. Netlify vil automatisk opdage `netlify.toml` filen

### Trin 2: Aktiver Netlify Forms
1. Gå til din Netlify dashboard
2. Vælg din site
3. Gå til **Site settings** → **Forms**
4. Sørg for at "Form detection" er aktiveret

### Trin 3: Test formularen
1. Gå til din hjemmeside
2. Udfyld kontaktformularen på `/kontakt.html`
3. Send formularen
4. Du skulle modtage en email på `info@nordicautos.dk`

## 📧 Email format

Emails vil se sådan ud:

```
Emne: Ny henvendelse fra Nordic Autos hjemmeside

Du har modtaget en ny henvendelse fra Nordic Autos hjemmesiden:

Navn: [Kundens navn]
Email: [Kundens email]
Telefon: [Kundens telefon]
Emne: [Valgte emne]

Besked:
[Kundens besked]

---
Sendt fra: Nordic Autos kontaktformular
Tidspunkt: [Timestamp]
```

## 🔧 Sådan ændrer du email-adressen

### Metode 1: Via Netlify Dashboard
1. Gå til **Site settings** → **Forms**
2. Klik på "contact" formularen
3. Ændre "Form notifications" email-adressen

### Metode 2: Via netlify.toml fil
1. Åbn `netlify.toml`
2. Ændre linjen: `to = "info@nordicautos.dk"`
3. Upload den opdaterede fil

## 🛡️ Spam-beskyttelse

Formularen har indbygget spam-beskyttelse:
- **Honeypot field**: Skjult felt som kun bots udfylder
- **Netlify's spam filter**: Automatisk spam-detektion
- **Form validation**: Validerer alle felter før afsendelse

## 📊 Se indsendte formularer

Du kan se alle indsendte formularer i Netlify:
1. Gå til din Netlify dashboard
2. Vælg din site
3. Gå til **Forms** fanen
4. Her kan du se alle indsendte formularer

## ⚠️ Vigtige noter

1. **Gratis plan**: Netlify's gratis plan inkluderer 100 form submissions per måned
2. **Email levering**: Emails sendes fra Netlify's servere, ikke din egen email
3. **Backup**: Alle form submissions gemmes også i Netlify's dashboard

## 🆘 Fejlfinding

### Emails kommer ikke frem?
1. Tjek spam-mappen
2. Verificer email-adressen i `netlify.toml`
3. Tjek Netlify Forms dashboard for submissions

### Formular virker ikke?
1. Sørg for at `data-netlify="true"` er på `<form>` tagget
2. Tjek at `name="contact"` matcher i både HTML og `netlify.toml`
3. Se Netlify's deploy log for fejl

### Behov for hjælp?
Kontakt mig hvis du har problemer med opsætningen!