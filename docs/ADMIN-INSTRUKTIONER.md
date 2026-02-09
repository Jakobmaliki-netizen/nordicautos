# Nordic Autos Admin System - Instruktioner

## 🚨 VIGTIGT: Hvorfor forsvinder billederne?

**PROBLEMET:** Billederne gemmes kun i localStorage (din browsers hukommelse). Når du uploader til Netlify, overskriver du alle filer, og billederne forsvinder.

**LØSNINGEN:** Det nye system giver dig kode som du indsætter direkte i HTML-filerne for permanent gemning.

## 🖼️ PERMANENT BILLEDE SYSTEM

### Sådan uploader du billeder PERMANENT:

1. **Log ind på admin** (Ctrl+Shift+A eller skriv "NORDICADMIN")
2. **Upload billede** - systemet optimerer til perfekt kvalitet
3. **Kopier koden** - systemet viser en dialog med HTML kode
4. **Indsæt i HTML fil** - følg instruktionerne nøjagtigt
5. **Gem og upload** - billedet er nu permanent!

### 📋 KODE PLACERING:

**Import billede (import.html):**
- Find: `<div class="aspect-[16/9] bg-cover bg-center bg-no-repeat"`
- Erstat: `style="..."` delen med kopieret kode

**Showroom billede (om-os.html):**
- Find: `<img src="https://images.unsplash.com/photo-1562141961-d0a6b5b5a2b5`
- Erstat: `src="..."` delen med kopieret kode

## Sådan bruger du admin systemet:

### 1. Log ind på admin
- Gå til forsiden (index.html)
- Tryk **Ctrl+Shift+A** eller skriv **NORDICADMIN** for at åbne admin login
- Log ind med: admin/nordic2024, lars/porsche911, eller maria/bmwx5

### 2. Upload billeder PERMANENT
- **🖼️ Upload Import Billede**: Til import-siden (1600x900, perfekt kvalitet)
- **🏢 Upload Showroom Billede**: Til Om Os-siden (1200x800, perfekt kvalitet)
- **🔍 Test Billede Kvalitet**: Tjek kvaliteten af dine uploadede billeder
- **Følg instruktionerne** for at indsætte koden i HTML filerne

### 3. Administrer biler
- **Tilføj ny bil**: Upload billeder direkte fra din computer (høj kvalitet)
- **Rediger bil**: Ændre alle oplysninger og billeder
- **Slet bil**: Fjerner bilen fra hjemmesiden permanent

### 4. Rediger indhold
- **Rediger Indhold** knappen lader dig ændre al tekst på hjemmesiden
- Ændringer vises øjeblikkeligt på alle sider

## 🎯 PERMANENT GEMNING PROCES:

### ✅ RIGTIG måde (billeder forsvinder ALDRIG):
1. Upload billede i admin
2. Kopier den genererede HTML kode
3. Indsæt koden i den rigtige HTML fil
4. Gem HTML filen
5. Upload hele mappen til Netlify
6. **Billedet er permanent!**

### ❌ FORKERT måde (billeder forsvinder):
1. Upload billede i admin
2. Upload mappen til Netlify uden at indsætte kode
3. **Billedet forsvinder!**

## 💡 TIPS FOR BEDSTE RESULTAT:

✅ **Høj opløsning**: Upload billeder i mindst 1600x900  
✅ **Perfekt kvalitet**: Systemet optimerer automatisk til 98% kvalitet  
✅ **Følg instruktionerne**: Indsæt koden præcist som beskrevet  
✅ **Gem altid**: Husk at gemme HTML filen efter ændringer  
✅ **Test kvalitet**: Brug test-knappen til at tjekke billedkvalitet  

## Support

Hvis billeder stadig forsvinder:
1. **Tjek at du har indsat koden** i HTML filerne
2. **Brug Test Billede Kvalitet** funktionen
3. **Følg PERMANENT-BILLEDER-GUIDE.md** nøjagtigt
4. Kontakt support hvis problemer fortsætter

---
*Opdateret: Januar 2026 - Permanent billede løsning implementeret!*