# Setup Instruktioner - Nordic Autos

## Problem: Bilerne loader ikke

Hvis bilerne ikke vises på lagerbiler-siden, er her hvad du skal gøre:

## Løsning 1: Tjek Browser Konsollen

1. Åbn `http://localhost:8000/lagerbiler.html` i browseren
2. Åbn Developer Tools (F12 eller Cmd+Option+I på Mac)
3. Gå til "Console" fanen
4. Se efter fejlmeddelelser

### Forventede Beskeder:
```
🚀 Initializing CarCatalog...
📡 Loading from Supabase...
✅ Loaded X cars from Supabase
```

### Hvis du ser fejl:
```
❌ Supabase load failed, trying fallback
📄 Loading from assets/data/cars.json...
```

## Løsning 2: Test Supabase Forbindelse

Åbn browser konsollen og kør:

```javascript
// Test Supabase forbindelse
window.supabaseCarManager.initialize().then(() => {
  window.supabaseCarManager.getCars().then(cars => {
    console.log('Biler fra Supabase:', cars);
  });
});
```

## Løsning 3: Brug JSON Fallback

Hvis Supabase ikke virker, skulle systemet automatisk falde tilbage til `assets/data/cars.json`.

Test at JSON filen loader:

```javascript
fetch('assets/data/cars.json')
  .then(r => r.json())
  .then(cars => console.log('Biler fra JSON:', cars));
```

## Løsning 4: Manuel Initialisering

Hvis ingenting virker, prøv at initialisere manuelt i konsollen:

```javascript
// Stop eksisterende instance
if (window.carCatalog) {
  window.carCatalog = null;
}

// Opret ny instance
window.carCatalog = new CarCatalog();
```

## Løsning 5: Tjek CORS

Hvis du ser CORS fejl, skal du bruge en rigtig HTTP server (ikke bare åbne HTML filen direkte).

Du kører allerede `npm run dev`, så det skulle være OK.

## Løsning 6: Hardcode Test Data

Hvis alt andet fejler, kan du hardcode test data i `lagerbiler.html`:

Åbn `lagerbiler.html` og tilføj efter linje 100:

```javascript
// TEMPORARY: Hardcode test data
window.testCars = [
  {
    id: 1,
    brand: "Porsche",
    model: "911 Carrera S",
    variant: "3.0 Turbo PDK",
    year: 2022,
    mileage: 15000,
    price: 1895000,
    fuelType: "Benzin",
    bodyType: "Coupe",
    horsepower: 450,
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDksibLrJ7HkhzUCgofsn55oxY07JdlTjmqKrmAZquxdBnpB8ZUPPYYmzgxG-cd0H04_jPcFixTuFmUaObppFKJseamsrcxUfMNxyyFKyL9MZDFaZ0G1ZdBQDRmteSUe5ab-BaN_XzwJdZ-5mWCyTnNFf984m-S39S3g2GPVgMeM2i5qQOZ7wiDvrm4pez4N0RtmoxdYwtNHl1x_My17U-_OgaR0Hq36EFv5ok8IIKRdIra2Jz5ht8m_POzHlqpaDwNXkse9D1ov8kj"],
    status: "available",
    isNew: true
  }
];

// Force use test data
if (window.carCatalog) {
  window.carCatalog.cars = window.testCars;
  window.carCatalog.applyFiltersAndSort();
}
```

## Debug Kommandoer

Kør disse i browser konsollen for at debugge:

```javascript
// 1. Tjek om CarCatalog er loaded
console.log('CarCatalog:', window.CarCatalog);

// 2. Tjek om supabaseCarManager er loaded
console.log('SupabaseCarManager:', window.supabaseCarManager);

// 3. Tjek om carCatalog instance eksisterer
console.log('carCatalog instance:', window.carCatalog);

// 4. Tjek antal biler
if (window.carCatalog) {
  console.log('Antal biler:', window.carCatalog.cars.length);
  console.log('Filtrerede biler:', window.carCatalog.filteredCars.length);
}

// 5. Force refresh
if (window.carCatalog) {
  window.carCatalog.forceRefreshFromSupabase();
}

// 6. Test manual refresh function
window.testRefreshCars();
```

## Almindelige Problemer

### Problem: "CarCatalog is not defined"
**Løsning:** Vent 2-3 sekunder og prøv igen. Scripts loader asynkront.

### Problem: "Failed to fetch cars.json"
**Løsning:** Tjek at du kører serveren med `npm run dev` og ikke bare åbner HTML filen direkte.

### Problem: "Supabase connection failed"
**Løsning:** Det er OK! Systemet skulle automatisk falde tilbage til JSON filen.

### Problem: Bilerne vises ikke selvom der er data
**Løsning:** Tjek at `#cars-grid` elementet eksisterer og at der ikke er CSS fejl.

## Kontakt

Hvis ingen af disse løsninger virker, send mig:
1. Screenshot af browser konsollen
2. Screenshot af Network tab (F12 → Network)
3. Hvilken browser du bruger

## Næste Skridt

Når bilerne loader korrekt:
1. Test filtrering (vælg et mærke)
2. Test sortering (pris, årgang, etc.)
3. Klik på en bil for at se detaljer
4. Test admin dashboard (Ctrl+Shift+A på forsiden)
