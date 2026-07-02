# OnferenceTV — Marketing Campaign Builder (Frontend)

Frontend for the Marketing Campaign Builder assignment, built with **React (Vite) and Tailwind CSS**.

## Live Demo

- **Live App**: https://onferencetv-frontend.vercel.app
- **Backend API**: https://onferencetv-backend.onrender.com
- **Backend Repo**: https://github.com/mrunaligangnaik/onferencetv-backend

## Tech Stack

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router
- **HTTP**: Fetch API (via `services/api.js`)

## Features

- Login / Register with JWT authentication
- Dashboard with campaign stats and recent activity
- Campaign Management — Create, Edit, Delete (with confirmation dialog), Search + filters
- AI Email Generator — Gemini-powered subject line, preview text, content, and CTA generation
- Journey Builder — trigger → action → condition → yes/no outcomes, with a live workflow preview
- Settings — profile edit, password change
- Toast notifications for all actions

## Project Structure

```
├── src/
│   ├── components/  # Reusable UI (CampaignTable, ConfirmDialog, JourneyFlow, etc.)
│   ├── context/      # ToastContext, UserContext
│   ├── layouts/      # MainLayout (sidebar + header)
│   ├── pages/        # Login, Dashboard, Campaigns, CreateCampaign, AIGenerator, JourneyBuilder, Settings
│   ├── services/     # api.js (backend calls)
│   └── App.jsx
├── .env.example
└── vite.config.js
```

## Setup Instructions (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/mrunaligangnaik/onferencetv-frontend.git
cd onferencetv-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

To test against the deployed backend instead, use:

```env
VITE_API_URL=https://onferencetv-backend.onrender.com/api
```

### 4. Run the dev server

```bash
npm run dev
```

The app runs on `http://localhost:5173` by default.

### 5. Build for production

```bash
npm run build
```

## Deployment

The frontend is deployed on **Vercel**.

- **Framework Preset**: Vite (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variable**: `VITE_API_URL` = backend live URL + `/api`

## Backend Repository

The API for this app lives here: https://github.com/mrunaligangnaik/onferencetv-backend

## Author

Mrunali Gangnaik — [GitHub](https://github.com/mrunaligangnaik)