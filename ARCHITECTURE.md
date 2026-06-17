# System Architecture Document — Precision Pro's

This document details the folder structure, data flow, security model, and styling system of the **Precision Pro's** Next.js application, serving as a developer's guide to understanding the codebase.

---

## 📁 1. Project Directory Structure

```text
precision-pros/
├── app/                           # Next.js App Router & Routes
│   ├── (public)/                  # Public pages (cached via ISR)
│   │   ├── layout.tsx             # Navbar & Footer wrapper
│   │   ├── page.tsx               # Homepage (loads 3D background & sections)
│   │   ├── about/                 # About/Agency details
│   │   ├── services/              # Freelancing Services listing
│   │   ├── works/                 # Works / Portfolio showcase
│   │   ├── team/                  # Team overview
│   │   └── contact/               # Contact Request Form
│   ├── admin/                     # Admin dashboard (gated)
│   │   ├── login/                 # Admin login credentials form
│   │   └── dashboard/             # Admin console subpages (Services, Projects, Team, Settings)
│   ├── api/                       # API Endpoints
│   │   ├── auth/                  # NextAuth credentials endpoints
│   │   └── revalidate/            # On-demand cache invalidation trigger
│   ├── globals.css                # Global CSS & Tailwind CSS v4 directives
│   └── layout.tsx                 # Root HTML layout (theme, toaster, backgrounds)
├── components/                    # Reusable React components
│   ├── admin/                     # Dashboard CRUD clients & drag-to-reorder components
│   ├── layout/                    # Layout shells (Navbar, Footer, 3D Canvas, Mesh background)
│   ├── sections/                  # Homepage UI sections (Hero, About, WorksPage, etc.)
│   └── ui/                        # Low-level primitives (GlassCard, CustomButton, Confetti)
├── hooks/                         # Custom hooks (reduced motion, 3D card tilt, media queries)
├── lib/                           # Core server utilities & database wrappers
│   ├── actions.ts                 # Secure Server Actions (Guarded database mutations)
│   ├── auth.ts                    # NextAuth credentials configuration
│   ├── auth-guard.ts              # Server Action authorization helper (requireAdmin)
│   ├── revalidate.ts              # Route-based static page invalidation (next/cache)
│   └── supabase.ts                # Supabase DB & Storage Client initializations
├── types/                         # Central TypeScript model interfaces
│   └── index.ts                   # Central exports (Service, Work, TeamMember, etc.)
├── public/                        # Static files, assets, and images
├── proxy.ts                       # Next.js 16.2+ Proxy Interceptor (Authentication Guard)
└── next.config.ts                 # Next.js configuration (CORS origins, CSP headers)
```

---

## 🔄 2. Data Flow & Synchronization

Precision Pro's uses a hybrid architecture combining **Server Actions** for secure mutations and **Incremental Static Regeneration (ISR)** with on-demand invalidation to serve content with minimal load time.

```
+-----------------+                      +-------------------+
| Admin Dashboard |                      |  Public Visitor   |
+--------+--------+                      +---------+---------+
         |                                         |
         | (Calls Server Action)                   | (Loads cached page)
         v                                         v
+--------+--------+                      +---------+---------+
| Server Action   |                      | Vercel Edge Cache |
|  (requireAdmin) |                      +---------+---------+
+--------+--------+                                ^
         |                                         |
         | (Updates database)                      | (On-demand revalidation)
         v                                         |
+--------+--------+                      +---------+---------+
|    Supabase     | -------------------> | /api/revalidate   |
|    Database     |   (Supabase webhook  +-------------------+
+-----------------+    or direct call)
```

### On-Demand Cache Invalidation
1. **Mutations via Dashboard:** Admin actions (like updating a service) are performed using Next.js **Server Actions** defined in [lib/actions.ts](file:///d:/precisionpros/lib/actions.ts).
2. **Immediate Invalidation:** Successful actions call `revalidatePublicSite()` and `revalidateAdminPaths()` from [lib/revalidate.ts](file:///d:/precisionpros/lib/revalidate.ts), which triggers `revalidatePath('/')` on-demand.
3. **Database Changes (External):** If the database is edited directly, a Supabase Database Webhook calls `/api/revalidate?secret=YOUR_REVALIDATE_SECRET`, which updates the CDN cache immediately.

---

## 🔒 3. Security & Authentication Guarding

### Route Guarding
* **Admin Layout Check:** [app/admin/dashboard/layout.tsx](file:///d:/precisionpros/app/admin/dashboard/layout.tsx) checks the user session on every request:
  ```typescript
  const session = await auth()
  if (!session) redirect('/admin/login')
  ```
* **Proxy Middleware:** [proxy.ts](file:///d:/precisionpros/proxy.ts) acts as a gateway interceptor for `/admin/dashboard/:path*` to verify NextAuth session tokens prior to rendering.

### Action Guarding
Any administrative mutation in [lib/actions.ts](file:///d:/precisionpros/lib/actions.ts) starts with `await requireAdmin()`. This ensures that even if a server action is invoked maliciously, it will fail unless signed in as an admin:
```typescript
export async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return session
}
```

### Content Security Policy (CSP)
Defined in [next.config.ts](file:///d:/precisionpros/next.config.ts), the CSP locks down data sources, scripts, and framing:
* `script-src 'self' 'unsafe-inline'` — Blocks malicious third-party scripts while permitting Next.js hydration.
* `img-src 'self' data: https://images.unsplash.com https://*.supabase.co` — Limits images to trusted sources (Unsplash & Supabase Storage).
* `frame-ancestors 'none'` — Prevents clickjacking by disabling embedding in external `<iframe>`s.

---

## 🎨 4. Design & Styling System (Tailwind CSS v4)

Styling is handled using **Tailwind CSS v4** with CSS-variables-based theme overrides.

* **CSS Directives:** The configuration imports the Tailwind stylesheet via `@import "tailwindcss"` in [app/globals.css](file:///d:/precisionpros/app/globals.css).
* **Theme Variables:** Dark and light colors are defined as HSL values directly under the `:root` and `.dark` selectors in `globals.css`:
  - `--background`: Flat dark spruce black base (`#030504`) for high-contrast presentation.
  - `--primary`: Warm luminous honey gold (`#e3c8a8`).
  - `--accent`: Emerald highlight (`#5dc1a4`).
* **Visual Effects:**
  - **3D Quantum Rings:** Rendered on the homepage Hero section using a high-performance WebGL context ([components/layout/ThreeDBackground.tsx](file:///d:/precisionpros/components/layout/ThreeDBackground.tsx)).
  - **Glassmorphism:** Styled via the `.glass` class (combining backdrop filters and HSL borders).
  - **Film Grain:** A fixed full-screen SVG noise overlay (`.grain`) applied to the body to introduce depth.
