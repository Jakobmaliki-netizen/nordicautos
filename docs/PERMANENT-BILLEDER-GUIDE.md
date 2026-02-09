# 🖼️ PERMANENT BILLEDER GUIDE

## ❌ PROBLEMET: Hvorfor forsvinder billederne?

Når du uploader billeder gennem admin systemet, gemmes de kun i **localStorage** (din browsers hukommelse). 

**Hvad sker der:**
1. Du uploader billeder → Gemmes i localStorage
2. Du dropper mappen i Netlify → Overskriver alle filer
3. De nye filer har ikke dine billeder → Billederne er væk!

## ✅ LØSNINGEN: Permanent gemning i HTML filer

Det nye system giver dig **kode** som du indsætter direkte i HTML-filerne, så billederne bliver permanente.

## 🚀 NY HURTIG METODE: Brug implementerings tool

**Nemmeste måde at implementere dine specifikke billeder:**

1. **Åbn `implementer-billeder.html` i din browser**
2. **Upload Billede 1 (Om Os showroom) og Billede 2 (Import hero)**
3. **Kopier den genererede HTML kode for hver**
4. **Indsæt koderne i de rigtige HTML filer**
5. **Upload til Netlify - billederne er nu permanente!**

### 📋 SÅDAN FUNGERER DET:

#### Metode 1: Brug implementerings tool (ANBEFALET)
- Åbn `implementer-billeder.html`
- Upload dine billeder
- Få optimeret HTML kode automatisk
- Indsæt i de rigtige filer

#### Metode 2: Brug admin systemet
- Log ind på admin (Ctrl+Shift+A)
- Klik "🖼️ Upload Import Billede" eller "🏢 Upload Showroom Billede"
- Vælg dit billede
- Kopier den genererede kode

#### 3. Indsæt koden i HTML filen

**For IMPORT billede (Billede 2):**
- Åbn `import.html` filen
- Find linjen: `<div class="aspect-[16/9] bg-cover bg-center bg-no-repeat"`
- Erstat `style="..."` delen med den kopierede kode

**For SHOWROOM billede (Billede 1):**
- Åbn `om-os.html` filen  
- Find linjen: `<img src="https://images.unsplash.com/photo-1562141961-d0a6b5b5a2b5`
- Erstat `src="..."` delen med den kopierede kode

#### 4. Gem og upload
- Gem HTML filen
- Upload hele mappen til Netlify
- **Billedet er nu permanent!** 🎉

## 🔄 EKSEMPEL PÅ KODE:

### Import billede kode:
```html
style='background-image: linear-gradient(to right, rgba(10, 12, 16, 0.7) 0%, rgba(10, 12, 16, 0.3) 100%), url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...");'
```

### Showroom billede kode:
```html
src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
```

## 💡 TIPS:

✅ **Brug implementerings tool**: `implementer-billeder.html` er nemmest  
✅ **Brug høj opløsning**: Upload billeder i mindst 1600x900  
✅ **Perfekt kvalitet**: Systemet optimerer automatisk til 98% kvalitet  
✅ **Kopier præcist**: Sørg for at kopiere hele koden  
✅ **Gem altid**: Husk at gemme HTML filen efter ændringer  

## 🚨 VIGTIGT:

- **Billederne forsvinder ALTID** hvis de kun er i localStorage
- **Kun HTML-ændringer** bliver permanente på Netlify
- **Følg guiden nøjagtigt** for at undgå tab af billeder
- **Brug implementerings tool** for nemmeste løsning

## 🎯 RESULTAT:

Efter at have fulgt denne guide:
- ✅ Billederne forsvinder ALDRIG mere
- ✅ Perfekt kvalitet på alle billeder  
- ✅ Fungerer på alle hosting platforme
- ✅ Ingen afhængighed af localStorage
- ✅ Dine specifikke billeder er implementeret korrekt

---
*Opdateret: Januar 2026 - Permanent billede løsning med implementerings tool*