# 📋 Instruktioner: Tilføj 13 Nye Biler til Nordic Autos

## ✅ Filen er klar!

Filen `add-all-new-cars.html` er nu komplet og klar til brug.

## 🚗 Hvad indeholder filen?

Filen tilføjer **13 nye biler** til din Nordic Autos database:

1. **VW ID.3 45 Pure Performance** - 139.800 kr.
2. **Mercedes EQA250+ Progressive Advance** (6814919) - 284.935 kr.
3. **Mercedes EQA250+ Progressive Advance** (6811739) - 289.800 kr.
4. **BMW X5 30 xDrive45e M Sport** - **LEASING 5.000 kr./md.** 🔑
5. **Mercedes EQB250+ Electric Art** - 216.400 kr.
6. **Mini Cooper SE Classic Trim** - 159.000 kr.
7. **Skoda Enyaq 80 iV Sportline** - 268.000 kr.
8. **Alfa Romeo Junior Elettrica Speciale** - 194.800 kr.
9. **Mercedes EQB250+ Progressive Advance Plus** - 328.400 kr.
10. **Mercedes EQA250 Progressive** - 229.400 kr.
11. **Mercedes EQB350 Progressive Advance Plus 4Matic** - 319.200 kr.
12. **Mercedes EQA250 Progressive Advance** (6837840) - 284.600 kr.
13. **Mercedes EQA350 AMG Advance Plus 4Matic** - 328.900 kr.

## 📝 Sådan bruger du filen:

### Trin 1: Åbn filen
1. Find filen `add-all-new-cars.html` i dit projekt
2. Dobbeltklik på filen for at åbne den i din browser
   - Eller højreklik → "Åbn med" → Vælg din browser

### Trin 2: Gennemse bilerne
- Du vil se alle 13 biler vist i et grid
- Hver bil viser:
  - Navn og model
  - Pris (eller leasingydelse for BMW X5)
  - Årgang, kilometerstand, brændstof og hestekræfter

### Trin 3: Tilføj bilerne
1. Klik på den store knap: **"➕ Tilføj Alle 13 Biler til Database"**
2. Vent mens bilerne tilføjes (du vil se en progress bar)
3. Hver bil tilføjes én ad gangen med en lille pause imellem
4. Du vil se status for hver bil der tilføjes

### Trin 4: Se resultatet
- Når alle biler er tilføjet, vil du se en grøn besked med:
  - ✅ Antal biler der blev tilføjet
  - Liste over alle tilføjede biler med deres ID
- Hvis nogen biler fejler, vil du se:
  - ⚠️ Hvilke biler der blev tilføjet
  - ❌ Hvilke biler der fejlede og hvorfor

## ⚙️ Tekniske detaljer:

### BMW X5 Leasing-konfiguration
BMW X5 er konfigureret som en leasingbil:
- `price: 1` (teknisk værdi for database)
- `specifications.monthlyLeasing: 5000` (leasingydelse)
- Vises som "🔑 5.000 kr./md." på hjemmesiden

### Alle andre biler
- Bruger normal pris-felt
- Ingen leasingydelse
- Vises med normal pris i kroner

### Bilstatus
- Alle biler har `status: 'available'`
- De vil være synlige på lagerbiler-siden med det samme

### Billeder
- Hver bil har 16 placeholder-billeder
- Du kan senere opdatere med rigtige billeder fra Bilbasen

## 🔧 Hvis noget går galt:

### Fejl: "Supabase ikke tilgængelig"
- Tjek at du har internetforbindelse
- Prøv at genindlæse siden (F5 eller Cmd+R)

### Fejl: "Duplicate key value"
- Bilen findes allerede i databasen
- Du kan ignorere denne fejl - bilen er allerede tilføjet

### Nogle biler fejler
- Filen fortsætter med at tilføje de resterende biler
- Du kan se hvilke biler der fejlede i resultat-beskeden
- Klik på "🔄 Prøv igen" for at forsøge at tilføje de fejlede biler igen

## 📞 Næste skridt:

1. **Åbn filen og tilføj bilerne**
2. **Tjek din hjemmeside** (https://nordicautos.vercel.app/lagerbiler.html)
3. **Opdater billeder** hvis nødvendigt (brug rigtige billeder fra Bilbasen)
4. **Opdater beskrivelser** hvis du vil have mere detaljerede beskrivelser

## ✨ Funktioner i filen:

- ✅ Viser alle 13 biler før tilføjelse
- ✅ Progress bar der viser fremskridt
- ✅ Tilføjer biler én ad gangen
- ✅ Fejlhåndtering (fortsætter hvis én bil fejler)
- ✅ Detaljeret resultat-besked
- ✅ Korrekt leasing-konfiguration for BMW X5
- ✅ Alle biler har danske beskrivelser
- ✅ Embedded Supabase-konfiguration (virker med file://)

---

**Held og lykke! 🚗💨**

Hvis du har spørgsmål eller problemer, så spørg mig!
