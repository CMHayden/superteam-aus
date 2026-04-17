# Superteam Australia

Marketing site, member portal, and admin CMS for **Superteam Australia** — the Solana builder community in Australia. Built with **Next.js** (App Router), **Supabase** (Postgres + Auth), and **Resend** (transactional email).

---

## Local development

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- A **Supabase** project ([supabase.com](https://supabase.com)) with migrations applied and (optionally) seed data loaded
- A **Resend** account ([resend.com](https://resend.com)) if you want to send emails (welcome mail on application approval)

### Environment variables

Copy the example file and fill in real values:

```bash
cp .env.example .env
```

| Variable | Where to get it |
|----------|-----------------|
| `NEXT_PUBLIC_SITE_URL` | Your app’s public origin, no trailing slash (e.g. `http://localhost:3000` locally, or your Vercel URL in production). Used for metadata (Open Graph, emails). |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → **Project Settings → API → Project URL** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → **Project Settings → API → anon public** key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → **Project Settings → API → service_role** key (server-only; never expose to the client) |
| `RESEND_API_KEY` | Resend → **API Keys** |
| `RESEND_FROM_EMAIL` | A verified sender in Resend (e.g. `Superteam Australia <noreply@yourdomain.com>`) |

**Security:** Only `NEXT_PUBLIC_*` variables are embedded in the browser. Keep `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` secret.

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm start       # run production server locally
npm run lint    # ESLint
```

---

## Database: migrations and seed

SQL lives under `supabase/migrations/` (run **in order**):

| File | Purpose |
|------|---------|
| `00001_create_cms_tables.sql` | Core CMS tables (stats, partners, testimonials, `community_members`, `join_applications`, FAQs, site config, etc.) |
| `00002_join_form_config.sql` | Join form configuration tables (roles, locations, skills, etc.) |
| `00003_extend_community_members.sql` | Extra profile fields for members |
| `00004_member_auth.sql` | `auth_user_id` on `community_members`, RLS so members can read/update their own row |

`supabase/seed.sql` inserts demo content (stats, partners, testimonials, tweets, carousel placeholders, FAQs, join-form options, sample members, etc.).

### Applying migrations (Supabase Cloud)

1. Open the Supabase **SQL Editor** for your project.
2. Paste and run each migration file **in numeric order** (or use the Supabase CLI below).

### Using the Supabase CLI (optional)

If the repo is linked to a project:

```bash
# Install: https://supabase.com/docs/guides/cli
supabase login
supabase link --project-ref <your-project-ref>
supabase db push    # applies pending migrations from supabase/migrations
```

To load seed data, run `supabase/seed.sql` in the SQL Editor (or pipe it with `psql` against your DB). Re-running seed may duplicate rows unless tables are truncated first — use a fresh project or adjust for idempotency.

---

## Create an admin user

Admins are Supabase Auth users with `app_metadata.is_admin === true`. The middleware and `/api/admin/*` routes rely on that flag.

With `.env` populated (including **service role** key), run:

```bash
npx tsx scripts/create-admin.ts <email> <password>
```

Example:

```bash
npx tsx scripts/create-admin.ts admin@example.com 'a-strong-password'
```

Then sign in at **`/admin/login`**. Non-admin users are redirected with `?error=forbidden` if they try to access the admin area.

---

## Feature overview

### Public site

- **Home:** hero, animated stats, partners, “what we do”, community block (testimonials, X posts, member carousel, join CTA), events (Luma), FAQs.
- **Members:** searchable directory and **`/members/[slug]`** public profiles (driven by `community_members.profile_link`).
- **Join application:** modal form; submissions stored in **`join_applications`** (configurable roles/locations/skills via admin).

### Member portal (`/portal`)

- **Login** at `/portal/login` (Supabase Auth).
- **Profile:** community members linked via **`community_members.auth_user_id`** can edit their own profile (API + RLS). Includes avatar upload to Supabase Storage where configured.
- Middleware protects `/portal/*` except the login page.

### Admin (`/admin`)

Requires an authenticated **admin** user. Typical areas:

| Area | Role |
|------|------|
| **Dashboard / navigation** | Entry point to CMS sections |
| **Content** | Stats, partners, FAQs, testimonials, carousel, tweets, “what we do”, footer copy, join copy, site config keys |
| **Community members** | CRUD for directory / profile data shown on the public site |
| **Join form** | Manage roles, locations, skills, experience options, “looking for” options |
| **Submissions** | Review **`join_applications`**; **approve** creates a member Auth user, seeds **`community_members`**, links `auth_user_id`, and sends a **welcome email** (Resend) with login instructions |
| **Insights** | Reads aggregated **`join_applications`** + **`community_members`** data for internal analytics (roles, locations, skills) |

Admin **API routes** use the server Supabase client and **`withAdminAuth`** (`src/lib/admin-api.ts`) to enforce admin-only access.

---

## Architecture (high level)

- **Next.js App Router** — Server Components for public pages; **client components** where interactivity, motion, or forms are needed.
- **Supabase**
  - **Postgres** holds all CMS and application data.
  - **Auth** stores users; **admin** flag lives in **`app_metadata.is_admin`** (not in a public table).
  - **Row Level Security** on **`community_members`** restricts reads/updates to the row whose **`auth_user_id`** matches the logged-in user. Inserts and bulk admin edits go through trusted APIs with the service role where appropriate.
- **Session refresh** — `@supabase/ssr` + **`middleware.ts`** refresh cookies for `/admin`, `/api/admin`, and `/portal` routes so server components see a current session.
- **Emails** — Resend + React email templates (e.g. welcome on approval).
- **Styling** — Tailwind CSS v4; brand tokens in `globals.css`.
- **No separate “headless CMS” product** — content is edited in-app via the admin UI talking to your Supabase tables.

This keeps deployment simple (e.g. Vercel + Supabase + Resend) and avoids syncing a third CMS with your schema.

---

## Deployment notes

- Set **`NEXT_PUBLIC_SITE_URL`** to the production URL so Open Graph tags and email links are correct.
- Configure **Supabase Auth** redirect URLs for your production domain if you use magic links or OAuth later.
- Ensure **Storage** buckets and policies match what the portal upload API expects if you use avatar uploads.

---

## License / contributing

Private project unless otherwise noted. Adjust this section for your team’s workflow.
