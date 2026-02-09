# Quick Fix Guide - 404 Billede Fejl

## Problem
Du ser 404 fejl på billeder fordi `currentContent` objektet ikke er initialiseret i localStorage endnu.

Fejlene ser sådan ud:
```
GET /$%7BcurrentContent.heroImage%7D HTTP/1.1" 404
GET /$%7BcurrentContent.showroomImage%7D HTTP/1.1" 404
```

## Løsning

### Option 1: Brug Standard Billeder (Hurtigst)
Websitet har allerede et standard hero-billede (`assets/images/Jakobbilen.jpeg`) som vises korrekt. De andre billede-fejl påvirker ikke funktionaliteten - de er kun for admin-funktioner.

**Du kan ignorere disse fejl** - websitet virker fint!

### Option 2: Initialiser Billeder via Admin
1. Åbn `http://localhost:8000` i browseren
2. Scroll ned til bunden af siden
3. Tryk `Ctrl+Shift+K` (eller `Cmd+Option+K` på Mac) for at åbne konsollen
4. Kør denne kommando i konsollen:

```javascript
localStorage.setItem('nordic-autos-content', JSON.stringify({
  billeder: {
    heroImage: 'assets/images/Jakobbilen.jpeg',
    showroomImage: 'assets/images/Jakobbilen.jpeg',
    logoImage: '',
    importImage: 'assets/images/Jakobbilen.jpeg'
  }
}));
location.reload();
```

5. Refresh siden - fejlene skulle være væk!

### Option 3: Upload Dine Egne Billeder
1. Log ind som admin (se README.md for credentials)
2. Klik på "Rediger Indhold" knappen
3. Vælg "Billeder" sektionen
4. Upload dine egne billeder eller indtast URL'er

## Hvad Betyder Fejlene?

Disse 404 fejl er **ikke kritiske**:
- `heroImage` - Baggrundsbillede på forsiden (allerede sat via HTML)
- `showroomImage` - Billede på "Om Os" siden (valgfrit)
- `logoImage` - Firma logo (valgfrit)
- `importImage` - Billede på import-siden (valgfrit)

Websitet fungerer perfekt uden disse - de er kun til admin-redigering af indhold.

## Test at Alt Virker

1. Åbn `http://localhost:8000`
2. Tjek at forsiden vises korrekt ✅
3. Klik på "Lagerbiler" - skulle virke ✅
4. Klik på "Om Os" - skulle virke ✅
5. Klik på "Kontakt" - skulle virke ✅

Hvis alle disse sider virker, er dit setup korrekt! 🎉

## Næste Skridt

- Læs `SUPABASE-SETUP-GUIDE.md` for at sætte din egen Supabase database op
- Læs `README.md` for mere information om projektet
- Test admin dashboard på `/admin/dashboard.html`
