# Voi Tours — Web Frontend

Customer-facing and admin web application for Voi Tours, a Kenyan tour operator offering safaris, SGR transfers, hotel bookings, event planning, and door-to-door delivery.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 + Vite 8 |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 (design tokens) |
| Server State | TanStack Query v5 |
| Client State | Zustand v5 |
| Forms | React Hook Form v7 + Zod v3 |
| Auth / DB | Firebase v11 (Auth + Firestore + Storage) |
| Payments | Stripe v5 + M-Pesa (STK Push) |
| Animation | Framer Motion v12 |
| Charts | Recharts v2 |

---

## Project Structure

```
src/
├── App.jsx                     # Root — AppProvider + RouterProvider
├── routes.jsx                  # Full route tree (createBrowserRouter)
├── index.css                   # Tailwind v4 directives + CSS design tokens
├── config/
│   └── firebase.js             # Firebase app, auth, db, storage, analytics
├── app/
│   ├── layouts/                # RootLayout · AuthLayout · DashboardLayout · AdminLayout
│   └── pages/                  # NotFoundPage
├── shared/
│   ├── api/                    # Axios client, interceptors, error normalisation
│   ├── components/
│   │   ├── ui/                 # Button · Input · Card · Modal · Badge · Avatar · ...
│   │   ├── layout/             # Navbar · Footer · Sidebar · PageHeader
│   │   └── feedback/           # ErrorBoundary · ErrorHandler · LoadingState · EmptyState
│   ├── hooks/                  # useDebounce · useLocalStorage · usePagination · useMediaQuery
│   ├── providers/              # AppProvider · AuthProvider · QueryProvider · ThemeProvider
│   ├── store/                  # auth.store (Zustand)
│   ├── types/                  # enums.js · models.js (JSDoc typedefs from schema)
│   └── utils/                  # formatters · validators · cn
└── features/
    ├── auth/                   # Login · Register · ForgotPassword · ProtectedRoute · RoleGuard
    ├── home/                   # Hero · FeaturedDestinations · FeaturedPackages · Testimonials
    ├── destinations/           # Listing · Detail · Gallery · RegionFilter
    ├── packages/               # Listing · Detail · Itinerary · PricingTable
    ├── bookings/               # 5 typed forms (safari · transfer · delivery · hotel · event)
    ├── payments/               # Stripe + M-Pesa flows · StatusPoller · Receipt
    ├── reviews/                # ReviewForm · ReviewList · StarRating · Carousel
    ├── inquiries/              # Public lead form (honeypot protected)
    ├── admin/                  # Dashboard · Bookings · Users · Inquiries · Packages
    └── profile/                # Avatar · ProfileForm · TierBadge · PasswordChange
```

---

## Route Zones

| Zone | Path | Auth |
|---|---|---|
| Public | `/` | None |
| Auth | `/auth` | Unauthenticated only |
| Dashboard | `/dashboard` | Any logged-in user |
| Admin | `/admin` | `admin` or `agent` role |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in all values in `.env` (Firebase keys, Stripe publishable key, API base URL).

### 3. Run dev server

```bash
npm run dev
```

### 4. Other commands

```bash
npm run build        # Production build
npm run preview      # Preview production build locally
npm run lint         # ESLint
npm run format       # Prettier
```

---

## Environment Variables

See [.env.example](.env.example) for the full list. Required groups:

- **API** — `VITE_API_BASE_URL`
- **Firebase** — 7 keys (`VITE_FIREBASE_*`)
- **Stripe** — `VITE_STRIPE_PUBLISHABLE_KEY`
- **M-Pesa** — `VITE_MPESA_ENABLED`
- **App** — `VITE_APP_NAME`, `VITE_APP_ENV`

---

## Service Types

| Type | Description |
|---|---|
| `safari` | Multi-day curated safari package |
| `sgr_transfer` | SGR / airport point-to-point transfer |
| `flight` | Flight coordination |
| `hotel` | Independent hotel booking |
| `event` | Corporate retreat / wedding planning |
| `delivery` | Door-to-door parcel delivery |

## Pricing Model

Package prices vary by **passenger tier** (`citizen` · `resident` · `international`) and **season** (`low` · `regular` · `peak`). Citizens/residents are billed in KES; international in USD.
