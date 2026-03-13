# 💰 Spendly - Expense Tracker

A full stack expense tracker with React frontend and Node.js/Express backend.

## Features
- ✅ User authentication (register/login with JWT)
- ✅ Add income & expense entries with categories
- ✅ Filter by month/year
- ✅ Pie chart: spending by category
- ✅ Bar chart: income vs expenses
- ✅ Edit & delete entries
- ✅ Balance summary cards
- ✅ SQLite database (no setup needed)

## Tech Stack
| Layer    | Tech                       |
|----------|----------------------------|
| Frontend | React + Vite + Recharts    |
| Backend  | Node.js + Express          |
| Database | SQLite (better-sqlite3)    |
| Auth     | JWT + bcrypt               |

## Project Structure
```
expense-tracker/
├── backend/
│   ├── server.js          # Express app entry point
│   ├── db.js              # SQLite setup & schema
│   ├── middleware/
│   │   └── auth.js        # JWT middleware
│   └── routes/
│       ├── auth.js        # Register, login, /me
│       └── expenses.js    # CRUD + summary
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── context/AuthContext.jsx
    │   └── pages/
    │       ├── AuthPage.jsx
    │       └── Dashboard.jsx
    └── index.html
```

## Setup & Run

### 1. Backend
```bash
cd backend
cp .env.example .env      # Edit JWT_SECRET
npm install
npm run dev               # Runs on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev               # Runs on http://localhost:5173
```

## API Endpoints
| Method | Endpoint                  | Description         |
|--------|---------------------------|---------------------|
| POST   | /api/auth/register        | Create account      |
| POST   | /api/auth/login           | Login               |
| GET    | /api/auth/me              | Get current user    |
| GET    | /api/expenses             | Get all expenses    |
| GET    | /api/expenses/summary     | Get stats           |
| POST   | /api/expenses             | Create entry        |
| PUT    | /api/expenses/:id         | Update entry        |
| DELETE | /api/expenses/:id         | Delete entry        |

### Query Params for filtering:
- `?month=3&year=2026` — filter by month/year
- `?type=expense` — filter by type
- `?category=Food` — filter by category
