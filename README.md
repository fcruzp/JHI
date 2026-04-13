# J Huge International (JHI) - Enterprise Commodity Trading Platform

A luxury enterprise marketing website for **J Huge International (JHI)**, a global commodity intermediaries company established in 2008. This platform showcases JHI's trade facilitation services across 50+ countries in commodities including sugar, meat, grains, coffee, edible oils, and dairy.

## ✨ Features

- **🌍 Interactive 3D Globe** - Real-time visualization of trade routes from Brazil to 12+ destination countries using Three.js and globe.gl
- **🌐 Multi-Language Support** - Full i18n for English, Spanish, and Chinese (130+ translation keys)
- **🤖 AI Sales Agent** - Gemini 2.5 Flash-powered chat that acts as a professional sales agent, collects quote information, and syncs directly with HubSpot CRM
- **🔄 HubSpot CRM Integration** - Automatic contact creation and deal tracking. Chat conversations convert to HubSpot contacts + deals with full quote details (commodity, quantity, origin, destination, incoterms)
- **📊 Quote Status Lookup** - Users can check the status of their existing quotes by providing their email. The AI fetches and displays active deals from HubSpot with stage, quantity, and creation date
- **🎨 Premium Gold Aesthetic** - Dark/light theme with custom gold (#c9a84c) accent, glass morphism, and shimmer effects
- **📱 Responsive Design** - Mobile-first approach with smooth scroll navigation between sections
- **📊 Dynamic Animations** - Scroll-triggered animations powered by Framer Motion
- **📝 Validated Contact Forms** - Zod v4 schema validation on client and server with toast feedback
- **📈 Animated Statistics** - Counter animations and SVG world map visualizations
- **❓ Interactive FAQ** - 10-item accordion covering brokerage process, commodities, and trade logistics
- **🔒 Error Resilience** - Graceful error handling for AI quota limits, HubSpot conflicts, and connection failures. Deals are always saved even if contact association fails

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
| **i18n** | Custom in-house (EN/ES/ZH) |
| **Theme** | next-themes (dark/light) |
| **AI Engine** | Google Gemini 2.5 Flash via `@google/generative-ai` |
| **CRM** | HubSpot (contacts, deals, pipeline) |
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
│   │       ├── chat/route.ts  # POST /api/chat (Gemini AI + HubSpot integration)
│   │       └── contact/route.ts # POST /api/contact (form submission)
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
│   │   │   ├── Footer.tsx          # Server Component (no 'use client')
│   │   │   ├── ChatWidget.tsx      # AI chat with markdown rendering
│   │   │   └── ScrollAnimations.tsx
│   │   └── ui/                # 38 shadcn/ui components
│   ├── hooks/
│   │   ├── use-mobile.ts      # Mobile breakpoint detection
│   │   └── use-toast.ts       # Custom toast management
│   └── lib/
│       ├── i18n.ts            # Translation system (EN/ES/ZH) - client-side
│       ├── i18n-server.ts     # Translation system - server-side (for Server Components)
│       ├── store.ts           # Zustand store (language, chatOpen)
│       └── utils.ts           # cn() utility (clsx + tailwind-merge)
├── public/
│   ├── images/                # Static assets (logos, commodities)
│   ├── logo.svg
│   └── robots.txt
├── .env.local                 # Environment variables (git-ignored)
├── Caddyfile                  # Reverse proxy configuration
├── netlify.toml               # Netlify deployment config
└── examples/websocket/        # WebSocket implementation examples
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
GOOGLE_MODEL=gemini-2.5-flash

# HubSpot CRM
HUBSPOT_API_KEY=pat-na1-xxxxx
HUBSPOT_PIPELINE_ID=default

# SEO
NEXT_PUBLIC_BASE_URL=https://jhugeinternational.com
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
3. Enable scopes: `crm.objects.contacts.write`, `crm.objects.deals.write`
4. Copy the token (starts with `pat-na1-...`)

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

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api` | GET | Health check - returns `{"message": "Hello, world!"}` |
| `/api/chat` | POST | AI Sales Agent chat - accepts `{messages, message, language}`, returns `{message}` with optional HubSpot sync |
| `/api/contact` | POST | Contact form - validates `{name, email, commodity, quantity, message}` |
| `/sitemap.xml` | GET | Auto-generated sitemap |
| `/robots.txt` | GET | Auto-generated robots.txt |

## 🤖 AI Chat — How It Works

### Sales Agent Flow

The AI acts as a **professional sales agent** that collects quote information and syncs it to HubSpot:

1. **User** initiates a chat conversation
2. **AI** asks qualifying questions (commodity, quantity, origin, destination, incoterms, name, email)
3. **When all info is collected**, AI responds with a natural message + hidden JSON action block
4. **Backend** detects the action and creates:
   - **Contact** in HubSpot (or reuses existing by email lookup)
   - **Deal** in HubSpot with all quote details in the deal name and description
5. **User** sees a clean response (JSON is stripped from display)

### Quote Status Lookup

Users can check existing quotes:

1. **User**: "What's the status of my quote? My email is user@example.com"
2. **AI** generates a `check_status` action with the email
3. **Backend** searches HubSpot for deals associated with that contact
4. **Response** includes a formatted summary of all pending deals sorted by date

### Error Resilience

| Scenario | Behavior |
|----------|----------|
| Gemini quota exceeded | Graceful error message to user, logs on server |
| Contact already exists in HubSpot | Reuses existing contact, creates deal |
| Contact creation fails | Creates deal without contact association — data is never lost |
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

**Built with ❤️ using Next.js, Gemini AI, and HubSpot CRM**
