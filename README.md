# Miro Clone

A full-featured collaborative whiteboard application built with modern React ecosystem. Implements board management with authentication, real-time-ready architecture, and a clean UI inspired by Miro.

> Runs fully on MSW mocks — no backend required to launch and explore.

---

## Features

- **Authentication** — JWT-based login/register with token refresh and protected routes
- **Board management** — create, rename, delete, favorite boards
- **Filtering & sorting** — search by name, sort by date/name, toggle list/grid view
- **Infinite scroll** — paginated board list with progressive loading
- **Optimistic updates** — instant UI feedback on mutations (favorites, rename)
- **Mock API** — MSW (Mock Service Worker) for fully offline development

---

## Tech Stack

| Layer | Tools |
|---|---|
| Framework | React 19, TypeScript, Vite |
| Routing | React Router v7 |
| Server state | TanStack Query v5 |
| API client | OpenAPI Fetch + type-safe generated schema |
| Forms | React Hook Form + Zod |
| UI | Tailwind CSS v4, Radix UI primitives |
| Auth | JWT (jwt-decode), localStorage session |
| Mocking | MSW v2, openapi-msw |
| Architecture | Feature-Sliced Design (FSD) |

---

## Architecture

The project follows **Feature-Sliced Design** — a scalable frontend architecture that enforces strict layer separation and prevents cross-feature coupling.

```
src/
├── app/          # App shell, router, providers
├── features/
│   ├── auth/            # Login, register forms and logic
│   ├── boards-list/     # Board listing, filters, CRUD
│   ├── board/           # Individual board page
│   ├── board-templates/ # Templates gallery
│   └── header/          # App header with user context
└── shared/
    ├── api/             # OpenAPI schema, MSW mocks, query client
    ├── model/           # Session store, routes, config
    ├── ui/kit/          # Reusable UI components (Button, Input, etc.)
    └── lib/             # Utility functions
```

Key patterns used:
- **Custom hooks** encapsulate all business logic (`useLogin`, `useBoardsList`, `useFavoriteBoard`)
- **OpenAPI-first** — TypeScript types generated from the YAML schema, zero manual type writing
- **Middleware pattern** — API client automatically injects Bearer tokens and handles 401 refresh
- **Composition** — complex UIs assembled from small focused components

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (MSW mocks are enabled automatically)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). No backend needed — all API calls are intercepted by MSW.

**Test credentials:** any email + password (registration and login both work via mocks)

---

## API

Defined in `src/shared/api/schema/schema.yaml` (OpenAPI 3.0):

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login user |
| POST | `/auth/register` | Register new user |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/boards` | List boards (pagination, search, sort) |
| POST | `/boards` | Create board |
| DELETE | `/boards/:id` | Delete board |
| PUT | `/boards/:id/rename` | Rename board |
| PUT | `/boards/:id/favorite` | Toggle favorite |

---

## Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # ESLint
npm run preview    # Preview production build
```