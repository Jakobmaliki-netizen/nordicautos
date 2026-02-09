# 🚗 LAGERBILER PERMANENT GUIDE

## Problemet: Bil-billeder forsvinder

Når du tilføjer biler med billeder i admin systemet, gemmes de kun i localStorage og forsvinder når du uploader til Netlify.

## Løsningen: Manuel kopiering til HTML

### 📋 TRIN-FOR-TRIN GUIDE:

#### 1. Tilføj bil i admin systemet
- Log ind på admin (Ctrl+Shift+A)
- Tilføj ny bil med alle billeder
- Gem bilen

#### 2. Kopier bil-dataen
- Åbn Developer Tools (F12 eller Cmd+Option+I på Mac)
- Gå til Console tab
- Skriv: `JSON.stringify(JSON.parse(localStorage.getItem('nordic-autos-cars')), null, 2)`
- Kopier hele resultatet

#### 3. Indsæt i HTML filen
- Åbn `index.html` filen
- Find linjen der starter med: `let cars = [`
- Erstat hele `cars` array med den kopierede data

#### 4. Gem og upload
- Gem `index.html` filen
- Upload hele mappen til Netlify
- **Bilerne er nu permanente!**

## 🔍 EKSEMPEL:

### Før (forsvinder):
```javascript
let cars = [
    // Kun hardcoded test-biler
];
```

### Efter (permanent):
```javascript
let cars = [
    {
        id: 1,
        brand: "Mercedes-Benz",
        model: "EQA 250",
        year: 2023,
        mileage: 12000,
        price: 485000,
        fuelType: "El",
        status: "available",
        icon: "⚡",
        images: [
            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
        ],
        imageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
    }
    // Dine andre biler...
];
```

## ⚠️ VIGTIGT:

- **Kun localStorage data forsvinder** - HTML ændringer er permanente
- **Følg guiden nøjagtigt** for at undgå tab af data
- **Test altid** efter upload til Netlify
- **Backup dine bil-data** før store ændringer

## 🎯 ALTERNATIV LØSNING:

Hvis du vil have et **automatisk system**, kan jeg lave en funktion der:
1. Eksporterer bil-data til en fil
2. Automatisk opdaterer HTML koden
3. Gør processen nemmere

Vil du have denne løsning?

---
*Opdateret: Januar 2026*