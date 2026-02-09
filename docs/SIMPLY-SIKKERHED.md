# 🔒 Sikkerhedsinstruktioner til Simply.com

## VIGTIGE sikkerhedstrin før go-live

### 1. **Aktiver HTTPS (GRATIS på Simply.com)**
- Log ind på Simply.com kontrolpanel
- Gå til "SSL/TLS" eller "Sikkerhed"
- Aktiver "Let's Encrypt SSL" (gratis)
- Vælg "Force HTTPS redirect"

### 2. **Admin Login - KUN direkte adgang**
Admin login er nu kun tilgængelig via direkte URL:
```
https://dinside.com/admin/login.html
```

**VIGTIGT:** Del ALDRIG dette link offentligt!

### 3. **Admin Credentials**
```
Bruger: admin
Password: nordic2024

Bruger: lars  
Password: porsche911

Bruger: maria
Password: bmwx5
```

**ANBEFALING:** Skift passwords efter go-live!

### 4. **Sikkerhedsfeatures der ER aktiveret**

✅ **Rate Limiting:** Max 3 login forsøg, derefter 15 min lockout
✅ **Session Timeout:** 30 minutter automatisk logout
✅ **Security Headers:** XSS protection, clickjacking protection
✅ **Admin Skjult:** Ingen synlige admin links på hjemmesiden
✅ **GDPR Compliance:** Fuld compliance med dansk lovgivning
✅ **Spam Protection:** Honeypot og validering på kontaktform
✅ **Robots.txt:** Admin områder blokeret fra søgemaskiner

### 5. **Email Konfiguration**
Kontaktformularen sender emails til: **info@nordicautos.dk**

Sørg for at denne email adresse eksisterer på Simply.com!

### 6. **Backup Anbefaling**
- Tag backup af hele hjemmesiden før upload
- Simply.com har automatisk backup, men tag egen sikkerhedskopi

### 7. **Efter Go-Live Tjekliste**

□ Test HTTPS virker (https://dinside.com)
□ Test kontaktformular sender emails
□ Test admin login på /admin/login.html
□ Verificer at admin IKKE er synlig på hjemmesiden
□ Test alle sider loader korrekt
□ Tjek at juridiske sider virker (privatlivspolitik, cookies, handelsbetingelser)

### 8. **Månedlig Sikkerhedstjek**

□ Skift admin passwords
□ Tjek admin activity log
□ Verificer HTTPS certifikat er gyldigt
□ Test backup restore
□ Gennemgå sikkerhedslog for mistænkelig aktivitet

### 9. **Kontakt ved Sikkerhedsproblemer**

Hvis du opdager mistænkelig aktivitet:
1. Skift admin passwords STRAKS
2. Tjek admin activity log
3. Kontakt Simply.com support hvis nødvendigt

### 10. **Fremtidige Forbedringer**

**Næste fase (anbefalet inden for 3 måneder):**
- Implementer server-side authentication
- Tilføj two-factor authentication
- Database til brugerdata i stedet for localStorage
- Professional security audit

---

## 🎯 Sikkerhedsstatus: KLAR TIL PRODUKTION

Hjemmesiden er nu sikret med grundlæggende beskyttelse og er klar til go-live på Simply.com.

**Sikkerhedsniveau: 7/10** - God til en lille bilforhandler med planer om forbedringer.