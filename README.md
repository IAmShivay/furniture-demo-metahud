# LuxeHouse — Mini Digital Catalogue

A full-stack product catalogue for a furniture business, built for the **Mini Digital Catalogue**
technical assessment.

The storefront and the admin panel are the existing **LuxeHouse furniture application UI**, ported
one-to-one into **Next.js 15 (App Router)** and backed by **PostgreSQL through Drizzle ORM**.

| | |
| --- | --- |
| **Stack** | Next.js 15 · React 19 · TypeScript · Tailwind CSS 3 · Redux Toolkit / RTK Query · Drizzle ORM · PostgreSQL (Neon) · Zod · Cloudinary |
| **Database** | PostgreSQL (Neon serverless, pooled connection) |
| **Images** | Cloudinary (uploaded from the admin panel, only the URL is stored) |
| **Payments / hosting / domains** | Not required — the app runs fully on a local machine |
| **Seed data** | 12 dummy furniture products (free Pexels images) |

---

## 1. Running the application

### Prerequisites

* Node.js 18.18+ (tested on Node 25)
* A PostgreSQL database — a free Neon project works out of the box
  (Neon serverless driver, no TCP tunnel needed)

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Configure the database connection
cp .env.example .env.local
# then edit .env.local and paste your PostgreSQL connection string:
# DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"
# plus the Cloudinary credentials for image uploads:
# CLOUDINARY_CLOUD_NAME=...  CLOUDINARY_API_KEY=...  CLOUDINARY_API_SECRET=...
# and a random JWT_SECRET for the session cookie

# 3. Create the tables (applies the Drizzle migrations)
npm run db:migrate

# 4. Load the dummy catalogue data
npm run db:seed

# 5. Start the dev server
npm run dev
```

Open <http://localhost:3000>.

| Route | Purpose |
| --- | --- |
| `/` | Storefront home page (hero, collections, featured products, newsletter) |
| `/products` | Customer catalogue — category filter, search, sorting, grid/list view |
| `/product/[id]` | Individual product detail page (gallery, price, features, stock) |
| `/login` · `/register` | Sign in / create an account |
| `/account` | Profile, wishlist and notification preferences |
| `/admin` | Admin dashboard — catalogue statistics |
| `/admin/products` | Admin panel — add, edit, delete and manage products |

### Demo accounts (created by `npm run db:seed`)

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@luxehouse.in` | `admin123` |
| Manager | `manager@luxehouse.in` | `manager123` |
| Support agent | `support@luxehouse.in` | `support123` |
| Customer | `customer@luxehouse.in` | `customer123` |

Sign in at `/login` with one of the accounts above. The admin area is protected: visiting
`/admin` or `/admin/products` without a session redirects to `/login?next=…`, and the header
profile menu only shows the account menu (Dashboard, My Account, Sign Out) once a session exists.
Passwords are stored as bcrypt hashes; the session itself lives in an **httpOnly cookie**, so no
token is ever written to `localStorage`.

The credentials can be changed through environment variables (`SEED_ADMIN_EMAIL`,
`SEED_ADMIN_PASSWORD`, …) before running the seed script.


### All npm scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` / `npm start` | Production build and serve |
| `npm run typecheck` | `tsc --noEmit` type check |
| `npm run db:generate` | Generate SQL migrations from the Drizzle schema |
| `npm run db:migrate` | Apply the migrations to PostgreSQL (`-- --reset` drops everything first) |
| `npm run db:seed` | Insert the 12 dummy products |
| `npm run db:studio` | Open Drizzle Studio to inspect the data |

---

## 2. Requirement checklist

| Assignment requirement | Where it lives |
| --- | --- |
| Admin panel to add, edit, delete and manage products | `src/components/pages/admin/Products.tsx` → `/admin/products` |
| Product information: name, price, category, image | `src/db/schema.ts` (`products` table) + admin form |
| Responsive customer catalogue with category filtering and product search | `src/components/pages/ProductListingPage.tsx` → `/products` |
| Individual product detail pages | `src/components/pages/ProductPage.tsx` → `/product/[id]` |
| Backend APIs integrated with a PostgreSQL database | `src/app/api/**` + Drizzle ORM (`src/db/**`) |
| Basic input validation and error handling | Zod schemas in `src/lib/validation.ts`, error envelope in `src/lib/api.ts` |
| Dummy data, no paid tools | `scripts/seed.ts` (free Pexels images) |
| Screenshots | `screenshots/` |
| Run instructions | This file |

---

## 3. Screenshots

| File | Screen |
| --- | --- |
| `screenshots/01-home-desktop.png` | Storefront home page |
| `screenshots/02-catalogue-desktop.png` | Customer catalogue with filter, search and sorting |
| `screenshots/03-product-detail-desktop.png` | Product detail page |
| `screenshots/04-admin-dashboard.png` | Admin dashboard with live catalogue statistics |
| `screenshots/05-admin-products.png` | Admin product table (add / edit / delete) |
| `screenshots/06-catalogue-mobile.png` | Catalogue on a 390 px phone |
| `screenshots/07-home-mobile.png` | Home page on a 390 px phone |
| `screenshots/08-admin-products-mobile.png` | Admin panel on a 390 px phone |
| `screenshots/09-login.png` | Sign in page |
| `screenshots/10-account-profile.png` | Profile page of the signed in administrator |
| `screenshots/11-register.png` | Create account page |
| `screenshots/12-admin-image-upload.png` | Admin panel uploading a product image to Cloudinary |

**Responsiveness** was verified with a headless browser at **360 / 390 / 768 / 1024 / 1440 px** on
the home page, catalogue, product detail page, admin dashboard and admin product table —
**zero horizontal overflow** in all 25 combinations.

---

## 4. API reference

All routes live under `src/app/api` and answer with a consistent envelope:

```jsonc
{ "success": true,  "data": { ... }, "message": "..." }   // 2xx
{ "success": false, "message": "Validation failed", "errors": { "fieldErrors": { ... } } }  // 4xx/5xx
```

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/products` | List products. Query: `page`, `limit`, `search`, `category`, `subcategory`, `minPrice`, `maxPrice`, `sortBy`, `sortOrder`, `featured`, `onSale`, `inStock`, `ids`, `includeInactive` |
| `POST` | `/api/products` | Create a product (validated) |
| `GET` | `/api/products/:id` | Single product |
| `PUT` / `PATCH` | `/api/products/:id` | Update a product (partial body) |
| `DELETE` | `/api/products/:id` | Delete a product |
| `GET` | `/api/products/categories` | Categories with product counts |
| `GET` | `/api/products/featured` | Featured products for the home page |
| `GET` | `/api/products/search?q=sofa` | Full text search over name, description, brand, subcategory |
| `GET` | `/api/admin/dashboard` | Catalogue statistics for the admin dashboard |
| `POST` | `/api/upload` | Upload a product image to Cloudinary (multipart `file`) |
| `POST` | `/api/auth/register` | Create an account (returns a session cookie) |
| `POST` | `/api/auth/login` | Sign in (returns a session cookie) |
| `POST` | `/api/auth/logout` | Sign out (clears the session cookie) |
| `GET` / `PUT` | `/api/auth/profile` | Read / update the signed in profile |
| `PUT` | `/api/auth/change-password` | Change the password of the signed in user |
| `POST` | `/api/newsletter/subscribe` | Newsletter signup (used by the footer form) |
| `GET` | `/api/health` | Liveness probe |

### Examples

```bash
# list, filter and sort
curl "http://localhost:3000/api/products?category=sofas&sortBy=price-low&limit=5"

# search
curl "http://localhost:3000/api/products/search?q=velvet"

# upload a product image (signed in as manager or admin)
curl -X POST http://localhost:3000/api/upload \
  -b cookies.txt \
  -F "file=@./chair.jpg"
# -> { "success": true, "data": { "image": { "url": "https://res.cloudinary.com/…", "width": 800, … } } }

# create (the body is validated with zod)
curl -X POST http://localhost:3000/api/products \
  -H "content-type: application/json" \
  -d '{
        "name": "Oak Dining Chair Set",
        "description": "Set of four solid oak dining chairs.",
        "brand": "LuxeHouse",
        "category": "dining",
        "subcategory": "dining-chairs",
        "basePrice": 959,
        "originalPrice": 1199,
        "images": ["https://res.cloudinary.com/dyiso4ohk/image/upload/luxehouse/products/chair.jpg"],
        "materials": ["Solid Oak"],
        "colors": ["Natural Oak"],
        "inventory": { "quantity": 14, "lowStockThreshold": 4 },
        "status": "active"
      }'

# invalid payload -> 422 with per field messages
curl -X POST http://localhost:3000/api/products \
  -H "content-type: application/json" \
  -d '{"name": "", "category": "invalid", "basePrice": -5}'
```

---

## 5. Project structure

```
furniture-catalogue/
├── drizzle/                 # generated SQL migrations
├── scripts/
│   ├── env.ts               # loads .env.local / .env for the CLI
│   ├── migrate.ts           # applies the migrations
│   └── seed.ts              # 12 dummy products
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (shop)/          # storefront route group (home, products, product/[id], login, register, account)
│   │   ├── admin/           # admin dashboard + product management
│   │   └── api/             # route handlers (products, categories, dashboard, auth, newsletter, health)
│   ├── components/          # UI copied from the LuxeHouse furniture application
│   │   ├── auth/            # ProtectedRoute
│   │   ├── common/          # SEOHead, ErrorBoundary
│   │   ├── layout/          # Header, Footer
│   │   ├── layouts/         # AdminLayout
│   │   ├── pages/           # catalogue, product detail, account, admin products, dashboard
│   │   ├── product/         # add to cart, product customizer
│   │   ├── sections/        # home page sections
│   │   └── ui/              # shopping cart drawer
│   ├── db/
│   │   ├── index.ts         # Neon serverless client
│   │   └── schema.ts        # Drizzle schema (products, newsletter subscribers, users)
│   ├── hooks/               # useProducts, useCart, useWishlist, useAuth …
│   ├── lib/
│   │   ├── api.ts           # response envelope + error handling wrapper
│   │   ├── auth.ts          # password hashing, session helpers
│   │   ├── cloudinary.ts    # image upload client
│   │   ├── product.ts       # row -> DTO mapper
│   │   ├── products.ts      # query layer (filters, sorting, pagination, statistics)
│   │   ├── rbac.ts          # roles and access levels
│   │   ├── session.ts       # JWT signing/verification (Edge safe)
│   │   ├── storage.ts       # SSR safe localStorage wrapper
│   │   ├── users.ts         # user queries
│   │   └── validation.ts    # all zod schemas
│   ├── store/               # Redux Toolkit store, slices and RTK Query API
│   ├── types/  utils/  config/  constants/
│   ├── middleware.ts        # protects /admin/* and redirects logged in users away from /login
│   └── app/globals.css      # Tailwind entry point + design tokens
└── public/                  # logo, favicon, web manifest
```

---

## 6. Implementation notes

* **UI fidelity** — the storefront and admin panel are the original furniture application
  components. Only the plumbing changed: `react-router` → `next/link` + `next/navigation`,
  `react-helmet-async` → React 19 head hoisting, and the RTK Query base URL now points at the
  internal `/api` route handlers. Markup and Tailwind classes are untouched.
* **Data layer** — Drizzle ORM with the Neon serverless HTTP driver (works locally and on
  serverless platforms). Arrays are stored as `text[]`, structured data (dimensions, inventory,
  rating, customization) as `jsonb`, money as `numeric(12,2)`.
* **Validation** — every request body and query string is parsed with Zod before it reaches the
  database. Invalid input returns `422` with per-field messages, unknown ids return `404`, and a
  global wrapper turns unexpected errors into a `500` JSON response instead of an HTML error page.
* **Caching** — a GET route handler is statically rendered at build time by default in Next.js 15.
  The routes that read from the database without touching the request (`/api/products/:id`,
  `/api/products/categories`, `/api/products/featured`, `/api/admin/dashboard`, `/api/health`) are
  therefore marked `export const dynamic = 'force-dynamic'`. The remaining routes are already
  dynamic by definition — they read `request.nextUrl.searchParams`, call `cookies()` or use a
  non-GET method — so they do not need the flag.
* **Sessions** — the JWT session is stored in an httpOnly, sameSite=lax cookie and verified on the
  server by `src/middleware.ts`, which protects `/admin/*` and enforces the role levels
  (support → dashboard, manager → products, admin → full access). Nothing sensitive is kept in
  `localStorage`; only the user profile is cached there for instant rendering.
* **Image uploads** — the admin panel uploads product images to Cloudinary through
  `POST /api/upload` (`multipart/form-data`). The API secret stays on the server, the upload is
  restricted to manager and admin roles, and the route validates the mime type (JPG, PNG, WEBP,
  AVIF) and the size (max 5 MB) before the file ever reaches Cloudinary. Only the resulting
  `secure_url` is stored in the product row.
* **SSR safety** — `localStorage` is only read in the browser (`src/lib/storage.ts`). Persisted
  state (cart, session profile, theme) is hydrated in an effect after mount, which avoids
  hydration mismatches between the server and the client render.

---

## 7. Deployment (optional)

The project is deployment ready — it builds to a standard Next.js bundle:

```bash
npm run build
npm start
```

Any Node host works; on Vercel just import the repository and set `DATABASE_URL`.
