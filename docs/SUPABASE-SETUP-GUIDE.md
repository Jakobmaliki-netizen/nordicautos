# Supabase Setup Guide for Nordic Autos

## 🚀 Hvad er Supabase?

Supabase er en open-source Firebase alternativ med:
- PostgreSQL database (mere kraftfuld end Firebase)
- Real-time subscriptions
- Built-in authentication
- File storage
- Bedre performance og pris

## 📋 Setup Steps

### 1. Opret Supabase Projekt

1. Gå til [supabase.com](https://supabase.com)
2. Klik "Start your project"
3. Log ind med GitHub/Google
4. Klik "New Project"
5. Vælg organization og indtast:
   - **Project name**: `nordic-autos-website`
   - **Database password**: (gem denne!)
   - **Region**: `West EU (Ireland)` (tættest på Danmark)
6. Klik "Create new project"

### 2. Hent API Keys

1. Gå til dit projekt dashboard
2. Klik på **Settings** (gear icon) i sidebar
3. Klik på **API**
4. Kopier følgende værdier:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Opdater .env Fil

Åbn `.env` filen og opdater:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Opret Database Tabel

1. Gå til **SQL Editor** i Supabase dashboard
2. Kør følgende SQL:

```sql
-- Create cars table
CREATE TABLE cars (
    id BIGINT PRIMARY KEY,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    variant TEXT,
    year INTEGER NOT NULL,
    mileage INTEGER NOT NULL,
    price INTEGER NOT NULL,
    "fuelType" TEXT NOT NULL,
    "bodyType" TEXT,
    horsepower INTEGER,
    images JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    status TEXT DEFAULT 'available',
    "isNew" BOOLEAN DEFAULT false,
    specifications JSONB DEFAULT '{}'::jsonb,
    history JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on cars" ON cars FOR ALL USING (true);

-- Create storage bucket for car images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('car-images', 'car-images', true) 
ON CONFLICT (id) DO NOTHING;

-- Create policy for storage bucket
CREATE POLICY "Allow all operations on car images" ON storage.objects 
FOR ALL USING (bucket_id = 'car-images');
```

### 5. Opdater Konfiguration

1. Åbn `supabase-config.js`
2. Opdater `supabaseConfig` med dine værdier:

```javascript
const supabaseConfig = {
    url: 'https://your-project-ref.supabase.co',
    anonKey: 'your-anon-key-here'
};
```

### 6. Test Forbindelse

1. Åbn `import-cars-to-supabase.html` i browser
2. Indtast dine Supabase credentials
3. Klik "Tjek Supabase Status"
4. Hvis grøn ✅ - du er klar!

### 7. Import Data

1. Klik "Import Biler til Supabase"
2. Vent på import af alle 6 biler
3. Tjek admin dashboard - bilerne skulle vises

## 🔧 Fejlfinding

### "Table 'cars' doesn't exist"
- Kør SQL fra step 4 igen
- Tjek at du er i det rigtige projekt

### "Invalid API key"
- Tjek at anon key er kopieret korrekt
- Ingen mellemrum før/efter key

### "CORS error"
- Supabase håndterer CORS automatisk
- Tjek at URL er korrekt

### "Row Level Security"
- Hvis du får adgangsfejl, disable RLS midlertidigt:
```sql
ALTER TABLE cars DISABLE ROW LEVEL SECURITY;
```

## 📊 Fordele ved Supabase

✅ **PostgreSQL**: Mere kraftfuld end Firebase Firestore  
✅ **Real-time**: Automatiske updates  
✅ **Gratis tier**: 500MB database, 1GB storage  
✅ **SQL**: Fuldt SQL support  
✅ **Performance**: Hurtigere end Firebase  
✅ **Open source**: Ingen vendor lock-in  

## 🚀 Næste Skridt

1. **Test lokalt**: Tjek at alt virker
2. **Upload til Simply**: Upload DEPLOY_SIMPLY mappen
3. **Opdater production**: Sæt rigtige Supabase credentials i production

## 💡 Tips

- **Backup**: Eksporter data regelmæssigt
- **Monitoring**: Brug Supabase dashboard til at overvåge
- **Scaling**: Upgrade plan når du får mere trafik
- **Security**: Implementer proper RLS policies i production

## 🆘 Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

---

**Supabase er nu konfigureret og klar til brug! 🎉**