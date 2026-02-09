# Supabase Database Setup for Nordic Autos

Denne mappe indeholder alle SQL scripts til at sætte Supabase databasen op.

## 🚀 Hurtig Setup (Anbefalet)

**Kopier og indsæt hele indholdet af `setup_complete_database.sql` i Supabase Dashboard > SQL Editor**

Dette script opretter:
- ✅ Cars tabel med alle kolonner
- ✅ Indexes for performance  
- ✅ Row Level Security policies
- ✅ Storage bucket til billeder
- ✅ 6 test biler
- ✅ Alt klar til brug!

## 📁 Fil Oversigt

### `setup_complete_database.sql`
**Alt-i-en script** - kør dette for komplet setup

### `migrations/`
- `001_create_cars_table.sql` - Opret cars tabel
- `002_create_storage.sql` - Opret storage bucket

### `policies/`
- `cars_policies.sql` - Row Level Security policies

### `seed/`
- `insert_sample_cars.sql` - Test data (6 biler)

## 🔧 Manuel Setup (Trin for trin)

Hvis du vil køre scripts separat:

1. **Kør migrations:**
   ```sql
   -- Først kør 001_create_cars_table.sql
   -- Derefter kør 002_create_storage.sql
   ```

2. **Kør policies:**
   ```sql
   -- Kør cars_policies.sql
   ```

3. **Indsæt test data:**
   ```sql
   -- Kør insert_sample_cars.sql
   ```

## 🔒 Sikkerhed

**Nuværende setup:** Offentlig adgang (demo mode)
- Alle kan læse, skrive, opdatere og slette biler
- Perfekt til udvikling og test

**Produktion:** Kommenter ud i `cars_policies.sql` for at aktivere authentication-krav

## ✅ Verifikation

Efter setup, tjek at alt virker:

```sql
-- Tjek at tabellen eksisterer
SELECT COUNT(*) FROM cars;

-- Tjek storage bucket
SELECT * FROM storage.buckets WHERE id = 'car-images';
```

Du skulle se 6 biler i tabellen.

## 🆘 Fejlfinding

**"Table already exists"** - Ignorer, det er normalt
**"Policy already exists"** - Ignorer, det er normalt  
**"Bucket already exists"** - Ignorer, det er normalt

Scripts er designet til at være idempotente (kan køres flere gange).

---

**Alt klar! Din Supabase database er nu sat op! 🎉**