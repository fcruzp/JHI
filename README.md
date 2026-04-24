# J Huge International (JHI) - Enterprise Commodity Trading Platform

A luxury enterprise marketing website for **J Huge International (JHI)**, a global commodity intermediaries company established in 2008. This platform showcases JHI's trade facilitation services across 50+ countries in commodities including sugar, meat, grains, coffee, edible oils, and dairy.

## ✨ Features

### User-Facing Features

- **🌍 Interactive 3D Globe** - Real-time visualization of trade routes from Brazil to 12+ destination countries using Three.js and globe.gl
- **🌐 Advanced Internationalization** - Multi-language support for English, Spanish, and Chinese (260+ translation keys) using Zustand-based state management and dynamic HubSpot data mapping for localized data visualization.
- **🔐 Broker Portal** - Secure authentication (NextAuth) and registration for brokers with a real-time dashboard tracking quote progress.
- **🤖 AI Sales Agent** - Gemini-powered chat that acts as a professional sales agent, collects quote information, and syncs directly with HubSpot CRM
- **📝 Validated Contact Forms** - Zod v4 schema validation on client and server with toast feedback
- **🎨 Premium Gold Aesthetic** - Dark/light theme with custom gold (#c9a84c) accent, glass morphism, and shimmer effects
- **📱 Responsive Design** - Mobile-first approach with smooth scroll navigation between sections
- **📊 Dynamic Animations** - Scroll-triggered animations powered by Framer Motion
- **📈 Animated Statistics** - Counter animations and SVG world map visualizations
- **❓ Interactive FAQ** - 10-item accordion covering brokerage process, commodities, and trade logistics

### Backend & CRM Integration (Phases 1-3 Complete ✅)

- **🔄 HubSpot CRM Integration** - Complete centralized service layer for Contacts, Companies, and Cotizaciones (custom object 0-3). Automatic contact creation, quote tracking, and association management.
- **📊 7-State Quote Machine** - Business state machine with validated transitions: `levantando_precio` → `validando_logistica` → `preparando_cotizacion_formal` → `cotizacion_enviada` → `en_negociacion` → `ganada`/`perdida`
- **📧 Email Automation** - React-based email templates powered by Resend (3,000 free emails/month). Automated notifications for quote sent, won, lost, and internal team alerts.
- **📋 Quote Status Lookup** - Users can check the status of their existing quotes by providing their email. The AI fetches and displays active quotes from HubSpot with stage, quantity, and creation date.
- **✅ Business Rules Engine** - Validation system enforcing enum constraints, required fields by state, automatic date setting, and association checks before state transitions.
- **🔒 Error Resilience** - Graceful error handling for AI quota limits, HubSpot conflicts, and connection failures. Quotes are always saved even if contact association fails.
- **📚 Complete API Routes** - RESTful endpoints for quote CRUD (`/api/cotizaciones`) and state transitions (`/api/cotizaciones/[id]/estado`), with full validation and error handling.

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Runtime** | Node.js / npm |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | shadcn/ui + Radix UI |
| **Icons** | Lucide React |
| **Animations** | Framer Motion |
| **3D Globe** | Three.js + @react-three/fiber + globe.gl |
| **Charts** | Recharts |
| **Markdown** | react-markdown |
| **State Management** | Zustand (with localStorage persistence) |
| **Forms** | React Hook Form + Zod v4 |
| **i18n** | Custom Unified System (EN/ES/ZH) + Dynamic Mapping |
| **Theme** | next-themes (dark/light) |
| **AI Engine** | Google Gemini via `@google/generative-ai` |
| **CRM** | HubSpot (contacts, companies, cotizaciones custom object) |
| **Email** | Resend (3,000 free/month) + React Email templates |
| **Toast** | Sonner |

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with full SEO metadata (Open Graph, Twitter Cards, sitemap)
│   │   ├── page.tsx           # Server Component (assembles all sections)
│   │   ├── globals.css        # Tailwind config + custom animations
│   │   ├── sitemap.ts         # Dynamic sitemap.xml generation
│   │   ├── robots.ts          # Dynamic robots.txt generation
│   │   └── api/
│   │       ├── route.ts       # GET /api (health check)
│   │       ├── chat/route.ts  # POST /api/chat (Gemini AI + HubSpot service integration)
│   │       ├── contact/route.ts # POST /api/contact (form submission + HubSpot service)
│   │       └── cotizaciones/  # ✅ NEW Quote management API
│   │           ├── route.ts   # POST/GET cotizaciones (CRUD)
│   │           └── [id]/
│   │               └── estado/
│   │                   └── route.ts # PATCH state transitions with validations
│   ├── components/
│   │   ├── jhi/               # JHI-specific components
│   │   │   ├── Header.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── Globe3D.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── CommoditiesSection.tsx
│   │   │   ├── GlobalReachSection.tsx
│   │   │   ├── WhyChooseSection.tsx
│   │   │   ├── FaqSection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   ├── SpeakWithTeamSection.tsx
│   │   │   ├── Footer.tsx          # Client Component (shared state support)
│   │   │   ├── ChatWidget.tsx      # AI chat with markdown rendering
│   │   │   └── ScrollAnimations.tsx
│   │   ├── broker/            # Broker-specific components
│   │   │   └── DashboardContent.tsx # Localized dashboard UI with HubSpot data mapping
│   │   └── ui/                # 38 shadcn/ui components
│   ├── hooks/
│   │   ├── use-mobile.ts      # Mobile breakpoint detection
│   │   └── use-toast.ts       # Custom toast management
│   └── lib/
│       ├── i18n.ts            # Translation system (EN/ES/ZH) - client-side
│       ├── i18n-server.ts     # Translation system - server-side (for Server Components)
│       ├── store.ts           # Zustand store (language, chatOpen)
│       ├── utils.ts           # cn() utility (clsx + tailwind-merge)
│       ├── hubspot/           # ✅ NEW HubSpot integration layer
│       │   ├── types.ts       # TypeScript types for all HubSpot objects
│       │   ├── service.ts     # CRUD service for Contacts, Companies, Cotizaciones
│       │   ├── index.ts       # Public API exports
│       │   └── docs/          # Data contracts for AI
│       │       ├── hubspot_schema.json    # Schema definition
│       │       ├── business_rules.md      # Business rules documentation
│       │       └── sync_actions.md        # Sync actions documentation
│       ├── cotizacion/        # ✅ NEW Quote business logic
│       │   ├── state-machine.ts  # 7-state machine with validations
│       │   └── validator.ts      # Input validation engine
│       └── email/             # ✅ NEW Email automation
│           ├── service.ts     # Resend integration
│           └── templates/     # React email templates
│               ├── cotizacion-enviada.tsx
│               ├── ganada.tsx
│               ├── perdida.tsx
│               └── internal-notification.tsx
├── public/
│   ├── images/                # Static assets (logos, commodities)
│   ├── logo.svg
│   └── robots.txt
├── .env.local                 # Environment variables (git-ignored)
├── Caddyfile                  # Reverse proxy configuration
├── netlify.toml               # Netlify deployment config
├── IMPLEMENTATION_COMPLETE.md # ✅ Phases 1-3 implementation summary
└── SETUP_COMPLETE_GUIDE.md    # ✅ Complete setup guide (Spanish)
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** (or your preferred package manager)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## ⚙️ Environment Variables

Create a `.env.local` file with the following:

```env
# Google AI (Gemini)
GOOGLE_AI_API_KEY=your_key_here
GOOGLE_MODEL=gemini-3-flash-preview

# HubSpot CRM
HUBSPOT_API_KEY=pat-na1-xxxxx
HUBSPOT_PIPELINE_ID=default

# Email Service (Resend - Free tier: 3,000 emails/month)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
EMAIL_FROM=onboarding@resend.dev  # Or your verified domain

# SEO
NEXT_PUBLIC_BASE_URL=https://jhugeint.com
GOOGLE_SITE_VERIFICATION=your_verification_code
```

### Getting Your API Keys

**Google AI Studio (Gemini):**
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key**
3. Free tier: 20 requests/day. Enable billing for higher limits.

**HubSpot Private App:**
1. Go to `Settings (⚙️) → Integrations → Private Apps`
2. **Create a private app** → Name it "JHI Chat Integration"
3. Enable scopes:
   - `crm.objects.contacts.write`
   - `crm.objects.deals.write`
   - `crm.schemas.contacts.write` (for creating custom fields)
   - `crm.schemas.deals.write` (for creating custom fields)
   - `crm.schemas.companies.write` (for creating custom fields)
4. Copy the token (starts with `pat-na1-...`)

**Resend (Email Service):**
1. Go to [resend.com](https://resend.com)
2. Sign up and create an API key
3. Free tier: 3,000 emails/month
4. For production, verify your domain in Resend dashboard

## 🌐 Deployment

### Netlify

Deploy with the included `netlify.toml` configuration:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Standalone Docker

The app builds to `standalone` output for containerized deployments:

```bash
npm run build
# Output: .next/standalone/
```

### Caddy Reverse Proxy

Use the included `Caddyfile` for reverse proxy setup on port 81:

```
:81 {
    reverse_proxy localhost:3000
}
```

## 📡 API Endpoints

### Public Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api` | GET | Health check - returns `{"message": "Hello, world!"}` |
| `/api/chat` | POST | AI Sales Agent chat - accepts `{messages, message, language}`, returns `{message}` with HubSpot sync via centralized service |
| `/api/contact` | POST | Contact form - validates `{name, email, commodity, quantity, origin, destination, incoterms, message}` and creates cotización in HubSpot |
| `/sitemap.xml` | GET | Auto-generated sitemap |
| `/robots.txt` | GET | Auto-generated robots.txt |

### Quote Management API (Internal/Backend)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/cotizaciones` | POST | Create new cotización with validation and HubSpot sync |
| `/api/cotizaciones` | GET | List/search cotizaciones (by status, email, or all) |
| `/api/cotizaciones/[id]` | GET | Get cotización details by ID |
| `/api/cotizaciones/[id]/estado` | PATCH | Transition cotización state with validations, auto-actions (emails, tasks, notes) |

### Admin Panel API (Phase 4)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/cotizaciones` | GET | List cotizaciones with advanced filters (estado_suplidor, estado_cotizacion, resultado, trial, tipo_proceso, date ranges) |
| `/api/admin/cotizaciones` | PATCH | Update operational fields with validation and business rules |
| `/api/admin/cotizaciones/[id]` | GET | Get full cotizacion details including operational fields |

## 🤖 AI Chat — How It Works

### Sales Agent Flow

The AI acts as a **professional sales agent** that collects quote information and syncs it to HubSpot via the centralized service layer:

1. **User** initiates a chat conversation
2. **AI** asks qualifying questions (commodity, quantity, origin, destination, incoterms, name, email)
3. **When all info is collected**, AI responds with a natural message + hidden JSON action block
4. **Backend** detects the action and creates a cotización via `HubSpotService.cotizaciones.create()`:
   - Finds or creates **Contact** in HubSpot (by email lookup)
   - Creates **Cotización** (custom object 0-3) with all quote details
   - Associates contact and company if available
   - Sets default state to `levantando_precio`
5. **User** sees a clean response (JSON is stripped from display)

### Quote Status Lookup

Users can check existing quotes:

1. **User**: "What's the status of my quote? My email is user@example.com"
2. **AI** generates a `check_status` action with the email
3. **Backend** calls `HubSpotService.cotizaciones.getByContactEmail(email)`:
   - Finds contact by email
   - Fetches associated cotizaciones
   - Filters out closed deals (ganada/perdida)
   - Returns formatted summary sorted by date
4. **Response** includes all pending quotes with stage, quantity, and creation date

### Email Automation

When cotización state changes (via API or manual transition), the state machine triggers:

| State Change | Email to Client | Email to Internal | Auto-Actions |
|--------------|----------------|-------------------|--------------|
| `levantando_precio` | ❌ Optional | ✅ Yes | Create task: "Conseguir precio base" (24h) |
| `validando_logistica` | ❌ Optional | ✅ Yes | Create task: "Validar logística" (24h) |
| `preparando_cotizacion_formal` | ❌ No | ❌ No | Create task: "Emitir cotización formal" (24h) |
| `cotizacion_enviada` | ✅ **YES** (automatic) | ✅ Yes | Set fecha_envio, create follow-up (48h) |
| `en_negociacion` | ❌ No | ✅ Yes | Create task: "Registrar ajustes" |
| `ganada` | ✅ Yes (confirmation) | ✅ Yes | Close open tasks |
| `perdida` | ⚠️ Optional | ✅ Yes | Record reason, close tasks |

### Error Resilience

| Scenario | Behavior |
|----------|----------|
| Gemini quota exceeded | Graceful error message to user, logs on server |
| Contact already exists in HubSpot | Reuses existing contact, creates cotización |
| Contact creation fails | Creates cotización without contact association — data is never lost |
| HubSpot API error | Logs error, retries once, doesn't block user request |
| Email sending fails | Logs failure, doesn't block state transition |
| Connection lost | User sees "Connection lost. Please try again." |

## 🎨 Design System

### Color Palette

- **Primary Gold**: `#c9a84c`
- **Dark Theme**: Custom CSS variables for semantic colors
- **Glass Morphism**: `.glass` and `.glass-light` utilities

### Custom Animations

- `animate-pulse-glow` - Pulsing glow effect
- `animate-bounce-gentle` - Gentle bounce animation
- `animate-fade-in-up` - Fade in from bottom

### Scroll Animation Components

```tsx
<ScrollAnimation animation="fade-in-up" delay={0.1}>
  <YourComponent />
</ScrollAnimation>

<StaggerContainer>
  <StaggerItem index={0}><Item1 /></StaggerItem>
  <StaggerItem index={1}><Item2 /></StaggerItem>
</StaggerContainer>
```

## 🌍 Internationalization (i18n)

Supported languages: **English (en)**, **Spanish (es)**, **Chinese Simplified (zh)**

```typescript
// Client-side
import { useAppStore } from '@/lib/store';
const { language, setLanguage } = useAppStore();

// Server-side (Server Components)
import { getTranslationServer } from '@/lib/i18n-server';
const t = getTranslationServer('en');
```

## 📦 Key Components

### Globe3D
Interactive 3D globe visualization showing trade routes:
- Dynamically imported with `ssr: false`
- Animated arcs from Brazil to 12 destinations
- Glowing dots and HTML labels

### ChatWidget
Floating AI chat with:
- **Gemini 2.5 Flash** with conversation history (last 20 messages)
- **Markdown rendering** (bold, lists, formatting via react-markdown)
- **Mobile responsive** — full-width panel with backdrop on small screens
- **HubSpot sync** — creates contacts and deals automatically
- **Quote status lookup** — fetches active deals from HubSpot
- **JSON stripping** — hidden action blocks are removed from display

### Footer
- **Server Component** — no `'use client'` directive
- Uses `i18n-server.ts` to read language from cookies
- Renders fully on the server for better SEO

### ContactSection
Zod-validated form with:
- Client and server-side validation
- Toast feedback via Sonner
- Commodity dropdown selection

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration (standalone output) |
| `tailwind.config.ts` | Tailwind CSS customization |
| `tsconfig.json` | TypeScript configuration (ES2017 target, strict mode) |
| `Caddyfile` | Reverse proxy setup |
| `netlify.toml` | Netlify deployment config |
| `eslint.config.mjs` | ESLint configuration (critical rules enabled) |

## 📝 Development Notes

- **`page.tsx` is a Server Component** — no `'use client'` directive
- **`Footer.tsx` is a Server Component** — uses `i18n-server.ts` for translations
- **Hydration safety** — Uses `suppressHydrationWarning` where needed
- **Theme-dependent rendering** — Guards with `mounted` state to prevent hydration mismatches
- **ESLint has critical rules enabled** — `no-console`, `prefer-const`, `no-debugger`, `@typescript-eslint/no-unused-vars`
- **Markdown in chat** — AI responses are rendered with `react-markdown` for proper formatting

## 🗺️ SEO

The project includes comprehensive SEO setup:
- **Open Graph** tags with social sharing image
- **Twitter Card** metadata
- **Dynamic sitemap.xml** at `/sitemap.xml`
- **Dynamic robots.txt** at `/robots.txt`
- **Canonical URLs** and Google site verification via env variable

To customize, update `metadata` in `src/app/layout.tsx`.

## 📄 License

This project is proprietary software for J Huge International.

---

## 🚀 Phase 4: Admin Panel - COMPLETE ✅

### Overview

Built a complete **Operations Command Center** for backoffice teams to manage the supplier workflow. The panel provides a streamlined interface for managing the 7 operational fields synced with HubSpot.

### Features Implemented

1. **Cotizaciones Table** (`/admin/cotizaciones`)
   - Full table with all operational columns
   - Inline editing (dropdowns, datepickers, toggles)
   - 7 preconfigured views (Pendientes, Esperando valores, Listas, Enviadas, Trials, Perdidas, Convertidas)
   - Advanced multi-select filters
   - Color-coded badges by state
   - Pagination

2. **Backend API**
   - GET with advanced filters (estado_suplidor, estado_cotizacion, resultado, trial, tipo_proceso, date ranges)
   - PATCH with validation and 4 business rules
   - Change logging for audit trail
   - Warnings/suggestions on state changes

3. **7 Operational Fields** (synced with HubSpot)
   - `tipo_de_proceso` - Cotización / Oportunidad Trial
   - `estado_del_suplidor` - Supplier progress tracking
   - `fecha_solicitud_a_suplidor` - When info was requested from supplier
   - `fecha_respuesta_del_suplidor` - When supplier responded
   - `estado_de_la_cotizacion` - Internal operational state
   - `trial_solicitado` - Trial requested flag
   - `resultado_de_la_cotizacion` - Final result

### Business Rules

| Rule | Action |
|------|--------|
| If `estado_suplidor = esperando_valores` → date must exist | ⚠️ Warning |
| If `estado_suplidor = valores_recibidos` → response date must exist | ⚠️ Warning |
| If `trial_solicitado = true` → suggest `tipo_proceso = oportunidad_trial` | 💡 Suggestion |
| If `resultado = perdida` → soft lock warning | 🔒 Warning |

### Architecture

```
Admin Panel (/admin/cotizaciones)
  • Inline editing
  • Preconfigured views
  • Advanced filters
  • Color badges
        ↓ sync
HubSpot CRM (Object 0-3 - Cotizaciones)
  • 7 operational fields
  • Historical tracking
  • System of record
```

### Access

- Dashboard: `http://localhost:3000/admin`
- Cotizaciones: `http://localhost:3000/admin/cotizaciones`

### Documentation

See these files for details:
- `PHASE4_IMPLEMENTATION_COMPLETE.md` - Complete Phase 4 implementation docs
- `PHASE4_ADMIN_PANEL_PLAN.md` - Original plan and requirements
- `scripts/check-hubspot-properties.ts` - Script to verify HubSpot field names

## 🌐 Phase 5: Broker Portal & Internationalization - COMPLETE ✅

### Features Implemented

1. **Broker Portal Refactoring** (NextAuth)
   - Secure Login/Registration system.
   - Real-time Dashboard for brokers to track their clients' quotes.
   - Hybrid rendering (Server data fetching + Client localization).

2. **Unified i18n Architecture**
   - Centralized `getTranslation` utility supporting EN, ES, and ZH.
   - Global state management via Zustand with localStorage persistence.
   - Full internationalization of Home, Broker Portal, and Admin layouts.

3. **Dynamic HubSpot Data Mapping**
   - Translation layer that converts internal HubSpot status/product/incoterm values (ES) into the user's interface language (EN/ZH).
   - Maintenance of Spanish backoffice consistency while providing a multilingual frontend experience.

4. **Code Quality & UI Consistency**
   - Full linting pass with 0 errors.
   - Conversion of Footer and Header to client-aware components for instant language switching.
   - SEO-optimized metadata across all portal pages.

---

**Built with ❤️ using Next.js, Gemini AI, HubSpot CRM, and Resend**
