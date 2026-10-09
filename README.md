# Lobito Farms

Full-stack marketing site + NGO hub for a fictional cocoa/plantain/cashew/coffee exporter, with
a custom CMS admin so non-developers can edit copy, images, and page layout without touching code.

- **`server/`** — Node.js/Express API, MongoDB (Mongoose), JWT auth, role-based permissions,
  content revisions, media library, scheduled publishing.
- **`client/`** — React (Vite) frontend: the public marketing site and the CMS admin dashboard,
  styled with Bootstrap 5 and a custom earthy theme.

## Prerequisites

- Node.js 18+ (tested on 20.18)
- MongoDB running locally on `27017` (a Windows service named "MongoDB" works fine — no auth
  configured by default) or a connection string to any reachable MongoDB instance

## Setup

```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Configure the server
cd ../server
cp .env.example .env
# edit .env if your MongoDB URI, port, or JWT secret differ from the defaults

# 3. Seed the database (creates users, sample content, and the block-based pages)
npm run seed

# 4. Run both apps (separate terminals)
npm run dev              # server — http://localhost:5000
cd ../client && npm run dev   # client — http://localhost:5173
```

The client's Vite dev server proxies `/api` and `/uploads` to `http://localhost:5000`, so no
client-side `.env` is needed for local development.

Open **http://localhost:5173** for the public site, and **http://localhost:5173/admin/login**
for the CMS.

### Seeded login credentials




Re-run `npm run seed` at any time from `server/` to reset the database back to this state.

## Roles & permissions

- **Contributor** — create/edit content, saves only to `draft` or `in_review`.
- **Editor** — everything a Contributor can do, plus publish/archive content, view the audit log.
- **Super Admin** — everything an Editor can do, plus manage users and site-wide settings.

## Content model

- **Crops, Products, Blog Posts, NGO Programs** — structured content types with a status
  workflow (`draft → in_review → published → archived`), revision history with restore, and
  per-item SEO fields. Managed generically in the admin under a single config-driven
  list/editor (see `client/src/config/contentTypes.js`).
- **Pages** — a small page builder (Home, About, and the NGO hub ship as page-builder pages)
  made of reorderable blocks: Hero, Stat Counters, Card Grid (pulls live from Crops/Products/
  NGO Programs/Blog), Testimonial Carousel, CTA Banner, Text + Image, Gallery Grid.
- **Testimonials, Media Library, Inquiries (contact/quote/volunteer/donation), Site Settings,
  Users, Audit Log** — supporting admin sections.

## Known limitations (by design, given project scope)

- **Rich text editor** is a small dependency-free `contentEditable` + `execCommand` component
  (`client/src/components/ui/RichTextEditor.jsx`), not a full library like TipTap/Quill. It
  covers bold/italic/headings/lists/links, which is enough for body copy, but isn't a
  full-featured editor.
- **Donations** are not wired to a real payment processor — the Donate page collects intent via
  the inquiry form and says so explicitly to the visitor.
- **Contact page map** is a placeholder — no maps API key is configured.
- `npm audit` flags moderate advisories in `vite`/`esbuild` (dev-server-only, not present in
  production builds) and `react-router-dom` (open-redirect class issue; not exploitable here
  since no user-controlled redirect targets are used). Left unpatched to avoid a major-version
  bump churn; revisit before any real production deployment.

## Project structure

```
server/
  src/
    config/       # env + db connection
    models/       # Mongoose schemas
    middleware/    # auth, role checks
    routes/        # REST endpoints, generic content-type CRUD factory
    seed/          # seed.js — sample data + block-based pages
client/
  src/
    api/           # axios instance
    context/       # auth + site settings
    components/
      layout/      # public Navbar/Footer, AdminLayout
      blocks/      # page-builder block renderers (public side)
      ui/          # shared inputs, image picker, rich text editor, etc.
    pages/
      public/      # marketing site pages
      admin/       # CMS dashboard, content manager, page builder, users, etc.
    config/        # contentTypes.js — field config driving the generic admin CRUD UI
```
