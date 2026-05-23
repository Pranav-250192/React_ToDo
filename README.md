# Notes App — React + Supabase + Coolify

A minimal full-stack Notes App to test the complete stack:
- ⚛️ **React + Vite** frontend
- 🟩 **Supabase** database (migration) + Edge Function
- 🚀 **Coolify** deployment via Docker

---

## Project Structure

```
TEST/
├── frontend/              # React Vite app
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── supabaseClient.js
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── Dockerfile         ← For Coolify
│   └── .env               ← Local env vars
│
└── supabase/
    ├── config.toml
    ├── migrations/
    │   └── 20240101000000_create_notes.sql
    └── functions/
        └── hello/
            └── index.ts   ← Edge Function
```

---

## Step 1 — Apply the Database Migration

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/ojhfgfblwfvwnofoniuk)
2. Click **SQL Editor** → **New Query**
3. Paste the contents of `supabase/migrations/20240101000000_create_notes.sql`
4. Click **Run**

---

## Step 2 — Deploy the Edge Function

Install Supabase CLI if you haven't:
```bash
npm install -g supabase
```

Login and link the project:
```bash
supabase login
supabase link --project-ref ojhfgfblwfvwnofoniuk
```

Deploy the function:
```bash
supabase functions deploy hello
```

Test it:
```bash
curl https://ojhfgfblwfvwnofoniuk.supabase.co/functions/v1/hello \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qaGZnZmJsd2Z2d25vZm9uaXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MTA5OTQsImV4cCI6MjA5NTA4Njk5NH0.oiI8usUJnpZxsSKIhAL4D0HROrkd9kQ5vZa8KgeC_g4"
```

---

## Step 3 — Run Locally

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

---

## Step 4 — Deploy Frontend to Coolify

1. Push this repo to GitHub/GitLab
2. In Coolify → **New Resource** → **Application**
3. Select your repo, set **Root Directory** to `frontend`
4. Coolify will auto-detect the `Dockerfile`
5. Add **Build Arguments** (Environment Variables):
   - `VITE_SUPABASE_URL` = `https://ojhfgfblwfvwnofoniuk.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `<your anon key>`
6. Deploy! 🚀

---

## Features

- ✅ Create notes
- ✅ View all notes (newest first)
- ✅ Delete notes
- ✅ Test Edge Function with one click
- ✅ Dark mode UI
- ✅ Fully responsive
