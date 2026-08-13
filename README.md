# Typeform Clone

A full-stack Typeform-inspired form builder built as a Scaler assignment. Create multi-page forms with drag-and-drop reordering, real-time respondent view, and a results dashboard — all with a polished, pixel-close UI.

---

## Features

- **Form Builder** — drag-and-drop question reordering, multi-page grouping, inline editing
- **Question Types** — Short text, Long text, Multiple choice, Dropdown, Email, Number, Yes/No, Rating
- **Right Panel Settings** — per-question configuration (required, max length, randomize, etc.)
- **Respondent View** — keyboard-navigable form flow with animated transitions
- **Results Dashboard** — response table with completion metrics
- **Preview Mode** — live in-builder preview before publishing
- **Mobile / Desktop canvas toggle** — switch canvas aspect ratio in the builder
- **Publish & Share** — generate a shareable link with one click

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| DnD | @dnd-kit/core + @dnd-kit/sortable |
| Animations | Framer Motion |
| Backend | FastAPI (Python) |
| Database | SQLite via SQLAlchemy |

---

## Project Structure

```
typeform-clone/
├── backend/              # FastAPI REST API
│   ├── main.py           # Route definitions
│   ├── models.py         # SQLAlchemy ORM models
│   ├── schemas.py        # Pydantic request/response schemas
│   ├── database.py       # DB session setup
│   └── seed.py           # Optional seed data
│
└── frontend/
    └── typeform-clone/   # Next.js application
        ├── app/          # App Router pages & layouts
        ├── src/
        │   ├── components/
        │   │   ├── builder/      # Form builder UI
        │   │   ├── respondent/   # Respondent flow
        │   │   └── ui/           # Shared components
        │   ├── store/            # Zustand state management
        │   └── types/            # TypeScript type definitions
        └── public/
            └── icons/            # Question type SVG icons
```

---

## Setup Guide

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.10
- **npm** (comes with Node.js)

---

### 1 — Backend

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv

# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy pydantic

# (Optional) Seed the database with sample data
python seed.py

# Start the API server
uvicorn main:app --reload --port 8000
```

The API will be available at **http://localhost:8000**.  
Interactive docs: **http://localhost:8000/docs**

---

### 2 — Frontend

```bash
# Navigate to the frontend directory
cd frontend/typeform-clone

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**.

---

### Environment Variables

Create a `.env.local` file inside `frontend/typeform-clone/` if you need to override the API base URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> No secrets are required to run the project locally.

---

## Available Scripts (Frontend)

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## License

MIT
