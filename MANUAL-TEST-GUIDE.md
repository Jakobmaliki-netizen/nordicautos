# 🧪 Manual Test Guide - Car Name Update Fix

## Hurtig Test (5 minutter)

Følg disse trin for at verificere at fix'et virker:

### Trin 1: Åbn Admin Dashboard
1. Åbn `admin/dashboard.html` i din browser
2. Log ind med admin credentials
3. Find en bil i listen (f.eks. "Porsche 911 Carrera S")

### Trin 2: Opdater Bilnavn
1. Klik på **edit** knappen (blyant-ikon) ved bilen
2. Ændre "Model" feltet til noget nyt, f.eks.:
   - Fra: "911 Carrera S"
   - Til: "911 Carrera S UPDATED"
3. Klik **"Gem bil"**
4. Du skulle se en grøn success besked

### Trin 3: Tjek Lagerbiler Side
1. Åbn `lagerbiler.html` i en **ny tab**
2. Find bilen i grid'et
3. **✅ FORVENTET**: Bilnavnet skulle vise "911 Carrera S UPDATED"
4. Hvis ikke, vent 5-10 sekunder (automatisk refresh) eller klik "Manual Refresh"

### Trin 4: Tjek Bil-Detaljer Side
1. Klik på bilen i lagerbiler grid'et
2. Du kommer til `bil-detaljer.html?id=X`
3. **✅ FORVENTET**: Bilnavnet i titlen og alle steder skulle vise "911 Carrera S UPDATED"

### Trin 5: Verificer Konsistens
1. Gå tilbage til admin dashboard
2. Bilnavnet i tabellen skulle også vise "911 Carrera S UPDATED"
3. **✅ SUCCESS**: Alle tre sider viser det samme opdaterede navn!

## Detaljeret Test

### Test 1: Real-Time Update på Lagerbiler
1. Åbn `lagerbiler.html` i tab 1
2. Åbn `admin/dashboard.html` i tab 2
3. I admin: Rediger en bil og gem
4. Skift til tab 1 (lagerbiler)
5. **✅ FORVENTET**: Inden for 5-10 sekunder skulle bilnavnet opdatere automatisk

### Test 2: Bil-Detaljer Loader Fra Supabase
1. Åbn `bil-detaljer.html?id=1` direkte
2. Åbn browser console (F12)
3. Se efter disse log beskeder:
   - "🔍 Loading car data for ID: 1"
   - "📡 Loading from Supabase..."
   - "✅ Loaded X cars from Supabase"
   - "✅ Found car: {brand: ..., model: ...}"
4. **✅ FORVENTET**: Alle logs skulle vise success

### Test 3: Data Konsistens
1. Åbn `test-car-name-update.html`
2. Vælg en bil fra dropdown
3. Indtast et nyt navn
4. Klik "Update Car Name in Supabase"
5. **✅ FORVENTET**: Alle tre kolonner (Supabase, Lagerbiler, Bil-Detaljer) skulle vise det samme opdaterede navn

## Fejlfinding

### Problem: Bilnavn opdaterer ikke på lagerbiler
**Løsning:**
1. Åbn browser console (F12)
2. Kør: `localStorage.clear()`
3. Refresh siden (Cmd+Shift+R / Ctrl+Shift+R)
4. Prøv igen

### Problem: "Supabase not initialized" fejl
**Løsning:**
1. Vent 2-3 sekunder efter siden loader
2. Tjek at `supabase-config.js` loader korrekt
3. Se efter fejl i console

### Problem: Ændringer vises ikke med det samme
**Løsning:**
- Dette er normalt! Siden refresher automatisk hver 5-10 sekunder
- Klik "Manual Refresh" knappen for øjeblikkelig opdatering
- Eller refresh siden manuelt

## Success Kriterier

Fix'et virker korrekt hvis:

✅ Admin dashboard kan opdatere bilnavne
✅ Lagerbiler side viser opdaterede navne (inden for 5-10 sek)
✅ Bil-detaljer side viser opdaterede navne
✅ Alle tre sider viser konsistent data
✅ Ingen "hardcoded" eller "stale" data vises

## Tekniske Detaljer

### Hvad Blev Ændret
- `bil-detaljer.html` loader nu fra Supabase (ikke localStorage)
- Fjernet hardcoded fallback data
- Tilføjet real-time update listeners
- Begge sider bruger nu samme datakilde

### Data Flow
```
Admin Dashboard
    ↓ (gemmer til)
Supabase Database
    ↓ (loader fra)
├─ lagerbiler.html (CarCatalog)
└─ bil-detaljer.html (loadCarData)
```

## Næste Skridt

Hvis alle tests passer:
1. ✅ Fix'et virker korrekt
2. ✅ Klar til produktion
3. ✅ Ingen yderligere ændringer nødvendige

Hvis der er problemer:
1. Tjek browser console for fejl
2. Verificer Supabase connection
3. Clear cache og prøv igen
