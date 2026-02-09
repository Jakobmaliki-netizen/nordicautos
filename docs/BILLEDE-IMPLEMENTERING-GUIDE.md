# 🖼️ Billede Implementering Guide - Nordic Autos

## Problem: Billeder forsvinder når du uploader til Netlify

**Årsag:** Billeder gemt i localStorage forsvinder når du uploader til Netlify, fordi localStorage kun eksisterer i browseren.

**Løsning:** Billeder skal gemmes direkte i HTML filerne som base64 kode.

## 📋 Sådan implementerer du dine specifikke billeder

### Billede 1: Om Os Showroom Billede

1. **Åbn `om-os.html` filen**
2. **Find denne linje (omkring linje 85):**
   ```html
   <img src="https://images.unsplash.com/photo-1562141961-d0a6b5b5a2b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
        alt="Nordic Autos showroom" 
        class="w-full h-full object-cover">
   ```

3. **Erstat `src="..."` delen med dit billede:**
   ```html
   <img src="data:image/jpeg;base64,DIT_BILLEDE_BASE64_KODE_HER" 
        alt="Nordic Autos showroom" 
        class="w-full h-full object-cover">
   ```

### Billede 2: Import Hero Billede

1. **Åbn `import.html` filen**
2. **Find denne linje (omkring linje 50):**
   ```html
   <div class="aspect-[16/9] bg-cover bg-center bg-no-repeat" 
        style='background-image: linear-gradient(to right, rgba(10, 12, 16, 0.7) 0%, rgba(10, 12, 16, 0.3) 100%), url("https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1600&h=900&fit=crop&crop=center&q=80");'>
   ```

3. **Erstat `url("...")` delen med dit billede:**
   ```html
   <div class="aspect-[16/9] bg-cover bg-center bg-no-repeat" 
        style='background-image: linear-gradient(to right, rgba(10, 12, 16, 0.7) 0%, rgba(10, 12, 16, 0.3) 100%), url("data:image/jpeg;base64,DIT_BILLEDE_BASE64_KODE_HER");'>
   ```

## 🔧 Sådan konverterer du dine billeder til base64

### Metode 1: Brug Admin Systemet (Anbefalet)

1. **Åbn hjemmesiden i browseren**
2. **Tryk `Ctrl+Shift+A` for at åbne admin login**
3. **Log ind med: admin / nordic2024**
4. **Klik på "🖼️ Upload Import Billede" eller "🏢 Upload Showroom Billede"**
5. **Vælg dit billede - systemet konverterer automatisk til perfekt kvalitet**
6. **Kopier den genererede HTML kode**
7. **Indsæt koden i den rigtige HTML fil**

### Metode 2: Online Base64 Konverter

1. **Gå til https://base64.guru/converter/encode/image**
2. **Upload dit billede**
3. **Kopier base64 koden**
4. **Indsæt i HTML filen som vist ovenfor**

## ✅ Sådan sikrer du perfekt kvalitet

### For Showroom Billede (Om Os):
- **Anbefalet størrelse:** 1200x800 pixels
- **Format:** JPEG
- **Kvalitet:** 98%

### For Import Hero Billede:
- **Anbefalet størrelse:** 1600x900 pixels
- **Format:** JPEG
- **Kvalitet:** 98%

## 🚀 Sådan gør du ændringerne permanente

1. **Gem HTML filerne efter du har indsat base64 koderne**
2. **Upload hele `nordic-autos-website` mappen til Netlify**
3. **Billederne er nu permanente og forsvinder ikke mere!**

## 🔍 Test at det virker

1. **Åbn hjemmesiden lokalt og tjek billederne**
2. **Upload til Netlify**
3. **Tjek at billederne stadig er der efter upload**
4. **Hvis billederne er der - SUCCESS! 🎉**

## 📞 Hvis du har problemer

- Sørg for at base64 koden starter med `data:image/jpeg;base64,`
- Tjek at der ikke er mellemrum i base64 koden
- Kontroller at HTML syntaksen er korrekt (anførselstegn, etc.)
- Test først lokalt før upload til Netlify

## 💡 Pro Tips

- **Brug admin systemet** - det optimerer automatisk billederne
- **Test altid lokalt først** før upload til Netlify
- **Gem backup** af dine HTML filer før ændringer
- **Brug små billeder** for hurtigere loading (max 15MB)

---

**Denne guide løser permanent dit problem med forsvindende billeder! 🎯**