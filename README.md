# Voi Tours — Web Frontend

Customer-facing and admin web application for Voi Tours (branded in-app as
"Savanna Crown"), a Kenyan tour operator offering safaris, SGR transfers,
hotel bookings, event planning, and door-to-door delivery.

**There is no separate backend.** Firebase is the entire backend:
**Auth** (sign-in/up), **Firestore** (all app data), **Storage** (avatars),
and **Cloud Functions** (`firebase_functions/`, M-Pesa payments via
PayHero). The frontend talks to Firebase directly — no REST API server.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 + Vite 8 |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 (design tokens) |
| Client State | Zustand v5 |
| Server State | TanStack React Query v5 |
| Forms | React Hook Form v7 + Zod v3 |
| Backend | Firebase v11 (Auth + Firestore + Storage + Functions) |
| Payments | PayHero (M-Pesa STK push) via Cloud Functions |
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
│   └── firebase/
│       ├── firebase.js             # Firebase app, auth, db, storage, functions, analytics
│       ├── firestore.rules         # Firestore security rules (not deployed by the agent)
│       ├── firestore.indexes.json  # Composite indexes (kept deliberately minimal)
│       └── storage.rules           # Firebase Storage rules (avatars only)
├── app/
│   ├── layouts/                # RootLayout · AuthLayout · DashboardLayout · AdminLayout
│   └── pages/                  # NotFoundPage
├── shared/
│   ├── api/                    # AppError + normaliseError (Firebase-error-aware)
│   ├── components/
│   │   ├── ui/                 # Button · Input · Select · Textarea · Card · Modal ·
│   │   │                       # Badge · Avatar · Alert · Pagination · Spinner · Skeleton ·
│   │   │                       # ThemeToggle
│   │   ├── layout/              # Navbar · Footer · PageTransition
│   │   └── feedback/            # ErrorBoundary · ErrorHandler · LoadingState · EmptyState
│   ├── hooks/                   # useDebounce · useLocalStorage · usePagination ·
│   │                            # useMediaQuery · useTheme
│   ├── providers/                # AppProvider · AuthProvider · QueryProvider · ThemeProvider
│   ├── store/                    # auth.store (Zustand)
│   ├── types/                    # enums.js · models.js (JSDoc typedefs)
│   └── utils/                    # formatters · validators (Kenyan phone) · cn
└── features/
    ├── auth/                    # Login · Register · ForgotPassword · ProtectedRoute · RoleGuard
    ├── home/                    # HomePage (real destinations/packages/reviews data)
    ├── destinations/            # Listing · Detail · Gallery · RegionFilter · Admin CRUD
    ├── packages/                # Listing · Detail · Itinerary · PricingTable · Admin CRUD
    ├── bookings/                # 5 typed forms (safari · transfer · delivery · hotel · event)
    ├── payments/                # PayHero/M-Pesa flow · live status listener · Receipt
    ├── reviews/                 # ReviewForm · ReviewList · StarRating · homepage Carousel
    ├── inquiries/                # Public lead form (honeypot protected)
    ├── admin/                    # Dashboard · Bookings · Users · Inquiries · Packages
    └── profile/                  # Avatar upload · ProfileForm · TierBadge · PasswordChange

firebase_functions/              # Cloud Functions — PayHero payments (see its own README)
firebase.json / .firebaserc      # Firebase CLI project config (points at src/config/firebase/)
```

---

## Route Zones

| Zone | Path | Auth |
|---|---|---|
| Public | `/` | None |
| Auth | `/auth` | Unauthenticated only |
| Dashboard | `/dashboard` | Any logged-in user |
| Admin | `/admin` | `admin` or `agent` role (packages/users management further restricted to `admin` only — see `src/features/admin/README.md`) |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
cd firebase_functions && npm install && cd ..
```

### 2. Configure environment

```bash
cp .env.example .env
cp firebase_functions/.env.example firebase_functions/.env
```

Fill in `.env` with your Firebase project's web config (Project settings →
General → Your apps), and `firebase_functions/.env` with PayHero
credentials (see `firebase_functions/README.md`).

### 3. Run the dev server

```bash
npm run dev
```

### 4. Other commands

```bash
npm run build        # Production build
npm run preview      # Preview production build locally
npm run lint         # ESLint
npm run format       # Prettier
npm run typecheck    # No-op (JS project — kept for the verification pipeline)
```

---

## Environment Variables

See [.env.example](.env.example) for the frontend and
[firebase_functions/.env.example](firebase_functions/.env.example) for
Cloud Functions. There is no `VITE_API_BASE_URL` or Stripe key — neither
is used.

---

## Firebase Setup

Firestore, Storage, and Functions all need to exist in your Firebase
project before the app works end-to-end. Config files live under
[src/config/firebase/](src/config/firebase/).

1. Create/select a Firebase project and enable **Authentication**
   (Email/Password provider), **Firestore**, and **Storage** in the
   Firebase console.
2. Log in and select the project locally:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use --add        # pick your project, alias it "default"
   ```
3. Review `src/config/firebase/firestore.rules`,
   `src/config/firebase/firestore.indexes.json`, and
   `src/config/firebase/storage.rules`, then deploy them **when you're
   ready** (not run by the agent that generated this setup):
   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only firestore:indexes
   firebase deploy --only storage:rules
   ```
4. Set PayHero secrets and deploy Cloud Functions (see
   `firebase_functions/README.md` for the full variable list):
   ```bash
   firebase functions:secrets:set PAYHERO_API_KEY
   firebase functions:secrets:set PAYHERO_API_SECRET
   firebase functions:secrets:set PAYHERO_CHANNEL_ID
   firebase functions:secrets:set PAYHERO_CALLBACK_URL
   firebase functions:secrets:set PAYHERO_CALLBACK_SECRET
   firebase deploy --only functions
   ```
5. **Bootstrap your first admin.** There's no invite flow — register a
   normal account through the app, then in the Firestore console open
   `users/{your-uid}` and change `role` from `"customer"` to `"admin"`.

### Why the indexes are minimal

Most list queries use a single Firestore `where`/`orderBy` (auto-indexed)
and apply secondary filters client-side instead of chaining more
`where()` clauses — see `src/features/packages/api/packages.api.js` for
the pattern this follows throughout the app.
`src/config/firebase/firestore.indexes.json` only contains the 5
composite indexes that are actually required by a real query in the
codebase; each one is documented in the owning feature's README.

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

Safari package prices vary by **passenger tier** (`citizen` · `resident` ·
`international`) and **season** (`low` · `regular` · `peak`), looked up
from the package's `pricing` array. The other 5 service types have no
fixed catalogue — they're created as quote requests and priced by an
admin before the customer can pay (see `src/features/bookings/README.md`
and `src/features/admin/README.md`).

## Payments

M-Pesa only, via [PayHero](https://payhero.co.ke), called directly from
the frontend as Firebase Cloud Functions (`startPayheroPayment` /
`checkPaymentStatus`) — see `src/features/payments/README.md` and
`firebase_functions/README.md` for the full flow.
