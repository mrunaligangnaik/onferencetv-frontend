# OnferenceTV — Marketing Campaign Builder (Frontend)

Frontend for the Marketing Campaign Builder assignment — built with **React (Vite) + Tailwind CSS**.

## Live Demo

- **Live App**: https://onferencetv-frontend.vercel.app <!-- Vercel deploy zalyavar update kar -->
- **Backend API**: https://onferencetv-backend.onrender.com
- **Backend Repo**: https://github.com/mrunaligangnaik/onferencetv-backend

## Tech Stack

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router
- **HTTP**: Fetch API (via `services/api.js`)

## Features

- Login / Register with JWT auth
- Dashboard — campaign stats, recent activity
- Campaign Management — Create, Edit, Delete (confirm dialog), Search + filters
- AI Email Generator — Gemini-powered subject/preview/content/CTA generation
- Journey Builder — trigger → action → condition → yes/no outcomes, live workflow preview
- Settings — profile edit, password change
- Toast notifications for all actions

## Project Structure

```
├── src/
│   ├── components/    # Reusable UI (CampaignTable, ConfirmDialog, JourneyFlow...)
│   ├── context/        # ToastContext, UserContext
│   ├── layouts/         # MainLayout (sidebar + header)
│   ├── pages/            # Login, Dashboard, Campaigns, CreateCampaign, AIGenerator, JourneyBuilder, Settings
│   ├── services/         # api.js (backend calls)
│   └── App.jsx
├── .env.example
└── vite.config.js
```

## Setup Instructions (Local)

### 1. Clone the repo

```bash
git clone https://github.com/mrunaligangnaik/onferencetv-frontend.git
cd onferencetv-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Root मध्ये `.env` file बनव:

```env
VITE_API_URL=http://localhost:5000/api
```

Production backend सोबत test करायचं असेल तर:

```env
VITE_API_URL=https://onferencetv-backend.onrender.com/api
```

### 4. Run the dev server

```bash
npm run dev
```

App default `http://localhost:5173` वर चालेल.

### 5. Build for production

```bash
npm run build
```

## Deployment

Frontend **Vercel** वर deploy केलंय.

1. Vercel → Add New Project → GitHub repo connect
2. Framework Preset: Vite (auto-detected)
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variable: `VITE_API_URL` = backend live URL + `/api`

## Backend Repo

API साठी backend इथे आहे: https://github.com/mrunaligangnaik/onferencetv-backend

## Author

Mrunali Gangnaik — [GitHub](https://github.com/mrunaligangnaik)