# 🚀 Upload Instruktioner til Simply.com

## 📁 Hvad skal uploades

Upload **hele indholdet** af `nordic-autos-website` mappen til din Simply.com webhotel.

### Vigtige filer:
- ✅ `index.html` (forsiden)
- ✅ `kontakt.html` (kontaktside med formular)
- ✅ `send-email.php` (email script - VIGTIGT!)
- ✅ `assets/` mappe (CSS, JavaScript, billeder)
- ✅ `components/` mappe (navigation, footer)
- ✅ Alle andre HTML filer

## 📧 Email Funktionalitet

### Automatisk Email Setup:
- Emails sendes automatisk til `info@nordicautos.dk`
- Bruger Simply.com's PHP mail() funktion
- Spam beskyttelse inkluderet
- Alle form submissions logges i `contact_log.txt`

### Email Format:
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

## 🔧 Simply.com Specifikke Indstillinger

### PHP Support:
- Simply.com understøtter PHP som standard
- Ingen ekstra konfiguration nødvendig
- `send-email.php` virker automatisk

### Email Konfiguration:
- Emails sendes fra: `noreply@[dit-domæne].dk`
- Reply-to: Kundens email adresse
- Modtager: `info@nordicautos.dk`

## 🚀 Upload Proces

1. **Log ind på Simply.com** kontrolpanel
2. **Gå til File Manager** eller brug FTP
3. **Upload alle filer** til public_html mappen
4. **Test hjemmesiden** på dit domæne
5. **Test kontaktformularen** - du skulle modtage email på `info@nordicautos.dk`

## 🔐 Admin Adgang

### Hemmelige Admin Adgange:
- **Ctrl + Shift + A** (tastekombination)
- **NORDICADMIN** (skriv bogstaverne på forsiden)

### Admin Login:
- admin / nordic2024
- lars / porsche911
- maria / bmwx5

## ✅ Test Checklist

Efter upload, test følgende:

- [ ] Forsiden loader korrekt
- [ ] Navigation virker på alle sider
- [ ] Admin adgang virker (Ctrl+Shift+A)
- [ ] Kontaktformular sender emails
- [ ] Bil administration virker
- [ ] Alle billeder vises korrekt
- [ ] Responsive design på mobil

## 🆘 Fejlfinding

### Emails kommer ikke frem?
1. Tjek spam-mappen
2. Verificer at `send-email.php` er uploaded
3. Tjek Simply.com's error logs
4. Test med en anden email adresse

### Kontaktformular virker ikke?
1. Sørg for at `send-email.php` har korrekte rettigheder (755)
2. Tjek at PHP er aktiveret på Simply.com
3. Se browser console for JavaScript fejl

### Admin virker ikke?
1. Tjek at alle JavaScript filer er uploaded
2. Test de hemmelige adgange: Ctrl+Shift+A eller NORDICADMIN

## 📞 Support

Hvis du har problemer:
- Kontakt Simply.com support for server-relaterede problemer
- Tjek Simply.com's PHP dokumentation
- Alle filer er testet og klar til brug

---

**Din hjemmeside er nu klar til at køre på Simply.com med fuld email funktionalitet! 🎉**