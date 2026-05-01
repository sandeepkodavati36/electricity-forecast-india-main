# Electricity Forecast - Full Stack Setup

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.9+ (for backend)

---

## Backend Setup (Port 8000)

### 1. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Run the Backend Server
```bash
cd backend
python main.py
```

The backend will start on `http://localhost:8000`

**Test the API:**
- Homepage: http://localhost:8000/
- Available states: http://localhost:8000/states
- Forecast (example): http://localhost:8000/predict?state=Tamil%20Nadu&year=2025

---

## Frontend Setup (Port 3000)

### 1. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 2. Run the Frontend Dev Server
```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│         React Frontend (Port 3000)              │
│  ├── Dashboard Component                        │
│  ├── Chart Component (Chart.js)                 │
│  └── Controls Component (State/Year Selector)   │
└────────────────┬────────────────────────────────┘
                 │ HTTP Requests (axios)
                 ▼
┌─────────────────────────────────────────────────┐
│         FastAPI Backend (Port 8000)             │
│  ├── /predict - Get forecast data               │
│  ├── /states - Get available states             │
│  └── /years - Get available years               │
│                                                 │
│  ✅ CORS Enabled for frontend communication    │
└─────────────────────────────────────────────────┘
```

---

## File Structure

```
electricity-forecast-india-main/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx      (Main component with state management)
│   │   │   ├── Chart.tsx          (Chart.js visualization)
│   │   │   └── Controls.tsx       (State/Year selectors)
│   │   ├── services/
│   │   │   └── api.ts            (Axios API client)
│   │   ├── App.tsx               (Root component)
│   │   ├── main.tsx              (Entry point)
│   │   └── index.css             (Tailwind CSS)
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
│
├── backend/
│   ├── main.py                    (FastAPI app with CORS)
│   └── requirements.txt           (Dependencies)
│
├── Electricity_Forecast_2025_2027.ipynb
└── README.md
```

---

## Key Features

✅ **React + Vite** - Fast development server
✅ **Tailwind CSS 4.0** - Modern styling
✅ **Chart.js** - Professional data visualization
✅ **Motion Animations** - Smooth UI transitions
✅ **FastAPI + CORS** - Backend API with cross-origin support
✅ **TypeScript** - Type-safe React components

---

## Troubleshooting

### Frontend can't connect to backend
- Make sure backend is running on `http://localhost:8000`
- Check that CORS is enabled (already done in main.py)
- Browser console should show error message if connection fails

### Port already in use
- Frontend: Change port in `frontend/vite.config.ts`
- Backend: Change port in `backend/main.py`

---

## Next Steps

1. **Replace sample data** with your actual ML forecast model
2. **Connect your notebook** to the backend API
3. **Deploy to production:**
   - Frontend: Vercel, Netlify, or GitHub Pages
   - Backend: Heroku, Railway, or AWS

---

## Environment Variables

Create `frontend/.env` if needed:
```
VITE_API_URL=http://localhost:8000
```

Access in React:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```
