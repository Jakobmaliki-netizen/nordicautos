# Nordic Autos Website

Moderne bilforhandler website med Supabase database integration.

## 🚀 Features

- **Bil katalog** med søgning og filtrering
- **Admin dashboard** til bil administration  
- **Supabase database** for data storage
- **Real-time updates** via Supabase
- **Responsive design** til alle enheder
- **Image upload** til Supabase Storage

## 🛠 Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Hosting**: Simply.com

## 📋 Setup

1. **Clone repository**
2. **Setup Supabase** - følg `SUPABASE-SETUP-GUIDE.md`
3. **Opdater .env** med dine Supabase credentials
4. **Import data** via `import-cars-to-supabase.html`
5. **Test lokalt** - åbn `index.html`

## 🔧 Admin

- **Admin login**: `/admin/dashboard.html`
- **Debug tools**: `/debug-admin.html`
- **Import tool**: `/import-cars-to-supabase.html`

## 📁 Struktur

```
├── admin/              # Admin dashboard
├── assets/             # CSS, JS, images, data
├── components/         # Reusable components
├── tests/              # Test files
├── .env               # Environment variables
├── supabase-config.js # Supabase configuration
└── *.html             # Website pages
```

## 🚀 Deployment

Upload alle filer til Simply.com hosting. Sørg for at opdatere Supabase credentials i production.

---

**Powered by Supabase 🚀**