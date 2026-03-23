# MWTL Studio — Content Studio per @man_withthelens

Webapp PWA per pianificare, generare e analizzare contenuti Instagram.
Stack: React + Vite + Supabase + Vercel.

---

## Setup locale

```bash
git clone https://github.com/TUO_USERNAME/mwtl-studio.git
cd mwtl-studio
npm install
cp .env.example .env.local
# Compila .env.local con le tue chiavi (vedi sotto)
npm run dev
```

---

## 1. Supabase — Database

1. Vai su [supabase.com](https://supabase.com) → apri il tuo progetto
2. **SQL Editor** → incolla e lancia il contenuto di `supabase/schema.sql`
3. **Project Settings → API** → copia:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`

---

## 2. Supabase — Edge Function (Claude Proxy)

Installa la Supabase CLI se non ce l'hai:
```bash
npm install -g supabase
```

Login e link al progetto:
```bash
supabase login
supabase link --project-ref IL_TUO_PROJECT_REF
```

Il project ref lo trovi in: **Project Settings → General → Reference ID**

Deploy della funzione:
```bash
supabase functions deploy claude-proxy
```

Imposta il secret con la tua chiave Anthropic:
```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

---

## 3. GitHub — Crea la repo

```bash
cd mwtl-studio
git init
git add .
git commit -m "feat: initial commit — MWTL Studio"
git remote add origin https://github.com/TUO_USERNAME/mwtl-studio.git
git push -u origin main
```

---

## 4. Vercel — Deploy

1. Vai su [vercel.com](https://vercel.com) → **Add New Project**
2. Importa la repo `mwtl-studio` da GitHub
3. Framework: **Vite** (rilevato automaticamente)
4. **Environment Variables** — aggiungi:
   | Nome | Valore |
   |------|--------|
   | `VITE_SUPABASE_URL` | `https://xxx.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJ...` |
5. Clicca **Deploy**

La `ANTHROPIC_API_KEY` non va su Vercel — vive solo nell'Edge Function Supabase.

---

## 5. PWA — Installazione su mobile

- **iOS Safari**: apri la webapp → Condividi → "Aggiungi a schermata Home"
- **Android Chrome**: apri la webapp → menu → "Installa app"

---

## Variabili d'ambiente

| Variabile | Dove si trova |
|-----------|--------------|
| `VITE_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon key |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) → API Keys |

---

## Struttura progetto

```
mwtl-studio/
├── public/
│   ├── icons/          # Icone PWA (192px, 512px)
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── UI.jsx      # Componenti condivisi
│   ├── hooks/
│   │   ├── usePosts.js
│   │   ├── useCompetitors.js
│   │   └── useChat.js
│   ├── lib/
│   │   ├── claude.js   # API helper
│   │   ├── design.js   # Stili e costanti
│   │   └── supabase.js
│   ├── tabs/
│   │   ├── Pianifica.jsx
│   │   ├── Calendario.jsx
│   │   ├── Competitors.jsx
│   │   └── Assistente.jsx
│   ├── App.jsx
│   └── main.jsx
├── supabase/
│   ├── schema.sql
│   └── functions/
│       └── claude-proxy/
│           └── index.ts
├── index.html
├── vite.config.js
├── package.json
└── .env.example
```
