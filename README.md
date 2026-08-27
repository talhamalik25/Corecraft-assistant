# AI Lead Assistant — Reusable Client Template

> A web-embeddable AI chat widget that answers visitor questions from a
> business knowledge base, captures leads automatically, and notifies the
> business owner by email. Built as a reusable template: swap ONE config file
> to deploy for any local/SMB client.

This README documents the *BrightPath Dental Clinic* example skin. All
business-specific values (name, phone, services, colors, copy) live in
`data/clientConfig.js` — editing that single file is enough to rebrand the
entire project for a different client.

---

## ✨ Features at a Glance

| Capability | Details |
|---|---|
| **AI chat widget** | Floating bubble + in-page hero panel, powered by Google Gemini (`gemini-3.6-flash`) |
| **Knowledge-grounded replies** | Every answer reads from `clientConfig` (services, hours, FAQs, phone, address) — no hallucinations of policy |
| **Intent-aware lead capture** | Lead form appears after **3 user messages** OR when the AI marks buying intent with a hidden `[LEAD_READY]` marker |
| **Instant email alerts** | New lead saved → Resend fires a plain-text + HTML email to the owner |
| **Lead log dashboard** | Password-protected page at `/dashboard` with a sortable, expandable summary table |
| **Mobile-optimized** | `< 640px` width the widget becomes a full-width bottom sheet; dashboard falls back to stacked cards |
| **Warm, SMB-friendly design** | Sage-teal accent, soft off-white base, no dark "tech startup" aesthetic. Typography: Manrope headings / Inter body / IBM Plex Mono timestamps |
| **Calm motion** | 200–250 ms ease-out transitions, staggered typing indicator, one-shot entrance pulse. Full `prefers-reduced-motion` override |
| **Single-source client config** | All business strings + theme tokens read from `data/clientConfig.js` — no hard-coded branding in component logic |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18 (Next.js 16 requires it)
- **npm** (or `pnpm`/`yarn`)
- A **MongoDB Atlas** cluster (free tier works)
- A **Google AI Studio** API key (for Gemini)
- A **Resend** API key (for new-lead emails — free tier works for testing)

### 1. Install dependencies

```bash
cd ai-lead-assistant
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in real values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

| Variable | Where to get it | Example |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas → Connect → Drivers | `mongodb+srv://user:pass@cluster.mongodb.net/ai-lead-assistant?retryWrites=true&w=majority` |
| `GEMINI_API_KEY` | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | `AIzaSy…` |
| `RESEND_API_KEY` | [resend.com/api-keys](https://resend.com/api-keys) | `re_123abc…` |
| `OWNER_EMAIL` | Business owner's inbox — receives new-lead alerts | `dr.smith@brightpathdental.com` |
| `DASHBOARD_PASSWORD` | Password for `/dashboard/login` (use a strong password in production) | `Clinic2026!` |

> ⚠️ **Resend sandbox note:** Until you verify a sending domain in Resend,
> Resend only allows sending *from* `onboarding@resend.dev` and *to* the
> email address on your Resend account. During testing, set `OWNER_EMAIL` to
> that same account email so test notifications actually arrive.

### 3. Run the dev server

```bash
npm run dev
```

- Demo landing page: **http://localhost:3000**
- Dashboard login: **http://localhost:3000/dashboard/login**

### 4. Sanity-check the full flow

```
1. Open / → Click the hero chat or floating bubble
2. Send "What are your hours?"     → AI replies from the knowledge base
3. Send "I need a cleaning, do you take insurance?"
4. Send 1 more message              → Inline lead form appears (after 3 msgs)
5. Submit name + phone/email        → Lead saved to MongoDB
6. Check OWNER_EMAIL inbox          → Resend notification arrives
7. Visit /dashboard/login → enter DASHBOARD_PASSWORD
   → New lead appears in the table with relative timestamp + expandable summary
```

---

## 🏗️ Project Architecture

```
ai-lead-assistant/
├── app/
│   ├── layout.js                  Root layout — fonts (Manrope/Inter/IBM Plex Mono), CSS vars, metadata
│   ├── globals.css                Theme tokens, animations, scrollbar, mobile widget sheet
│   ├── page.js                    Landing/demo page — hero IS the live chat widget
│   ├── dashboard/
│   │   ├── page.js                Protected lead dashboard (table + custom loading state)
│   │   └── login/page.js          Minimal centered-card password login
│   └── api/
│       ├── chat/route.js          POST {message, history} → AI reply text
│       ├── leads/route.js         POST saves lead + emails; GET returns all leads (auth required)
│       └── auth/route.js          POST sets cookie; GET checks auth; DELETE clears cookie
│
├── components/
│   ├── ChatWidget.jsx             Floating bubble (sage-teal, one-shot pulse) + open/close
│   ├── ChatWindow.jsx             360–380 px panel: header, scroll, typing dots, inline lead form
│   ├── MessageBubble.jsx          User (accent pill) vs Assistant (elevated-surface pill)
│   └── LeadTable.jsx              Table (md+) / stacked cards (mobile), expandable summaries
│
├── lib/
│   ├── ai.js                      Gemini API wrapper — injects KB into system prompt, converts roles, reads [LEAD_READY] marker
│   ├── knowledgeBase.js           Serializes clientConfig → plain-text knowledge block for the AI
│   ├── mongodb.js                 Cached mongoose connection (serverless-safe — reused across API calls)
│   ├── notify.js                  Resend sender — fails silently (lead save never blocked by email)
│   └── auth.js                    Cookie-name constant + isDashboardAuthenticated() guard
│
├── data/
│   ├── clientConfig.js            ★ SINGLE SOURCE OF TRUTH per client — every name, color, CTA, FAQ, hour
│   └── businessInfo.json          (Legacy — kept for reference; replaced by clientConfig.js)
│
├── models/
│   └── Lead.js                    Mongoose schema: { name, contact, conversationSummary, createdAt }
│
├── public/                        Static assets (icons)
├── next.config.mjs                Next.js config
├── postcss.config.mjs             Tailwind v4 PostCSS pipeline (via @tailwindcss/postcss)
├── eslint.config.mjs              ESLint (next/core-web-vitals)
├── jsconfig.json                  Path alias: @/* → ./*
├── package.json
├── .env.local.example             ☑️ COMMITTED — safe template (no real values)
└── .gitignore                     ☒ Blocks .env, .env.local, .env.* (but re-allows .env.local.example)
```

---

## 🧩 How Lead Capture Works (End-to-End)

```
User message → /api/chat → lib/ai.js
                        │
                        ├─ Builds system prompt =
                        │    "You are an assistant for BRIGHTPATH DENTAL.
                        │     Here is the knowledge base: [services, hours, faqs, phone, address].
                        │     When you detect buying intent, append [LEAD_READY] at the END."
                        │
                        ├─ Calls Gemini 3.6 Flash with conversation history
                        │
                        └─ Returns reply text to ChatWindow.jsx

ChatWindow.jsx inspects every reply:
  • Did 3+ user messages arrive?  → showLeadForm = true
  • OR reply contains the hidden marker "[LEAD_READY]"?  → showLeadForm = true
    (the marker is STRIPPED before rendering to the visitor)

User fills the inline form → POST /api/leads →
  → connectDB() (cached mongoose)
  → Lead.create({ name, contact, conversationSummary })
  → sendLeadNotification(lead)  (Resend — failure is logged, never thrown)
  → Dashboard shows the new lead on next refresh with relative time + full chat log
```

---

## 🛠️ API Reference

All routes live under `/app/api/*` (Next.js App Router route handlers).

### `POST /api/chat`

Generates a single AI reply grounded in the business knowledge base.

**Request body (JSON):**
```json
{
  "message": "Do you take walk-ins?",
  "history": [
    { "role": "assistant", "content": "Hi there! I'm BrightPath's front-desk assistant…" }
  ]
}
```

**Success (200):**
```json
{ "reply": "We prefer appointments so we can give you our full attention, but we'll always fit in an emergency whenever possible. [LEAD_READY]" }
```

The `[LEAD_READY]` marker is **not rendered** to the user — `ChatWindow.jsx` strips it.

**Errors:** 400 (missing message) / 500 (Gemini failure or missing key).

---

### `POST /api/leads`

Saves a lead and triggers the Resend email. **Public endpoint** — anyone on the site can submit.

**Request body (JSON):**
```json
{
  "name": "Alex Johnson",
  "contact": "(555) 111-2222",
  "conversationSummary": "Visitor: Do you take walk-ins?\nAssistant: We prefer appointments…\n…"
}
```

**Success (200):**
```json
{ "success": true, "leadId": "67…abc" }
```

**Errors:** 400 (name/contact missing) / 500 (MongoDB failure).

---

### `GET /api/leads`

Returns all leads, sorted newest first. **Requires dashboard auth cookie.**

**Success (200):**
```json
{
  "leads": [
    {
      "_id": "67…abc",
      "name": "Alex Johnson",
      "contact": "(555) 111-2222",
      "conversationSummary": "…",
      "createdAt": "2026-08-25T14:12:00.000Z"
    }
  ]
}
```

**401 Unauthorized** when the `dashboard-authenticated` cookie is missing.

---

### Auth routes (`/api/auth`)

| Method | Purpose |
|---|---|
| `POST` | Body `{ password }`. Compares to `DASHBOARD_PASSWORD`. On match sets an **httpOnly, secure (prod only), 7-day cookie** named `dashboard-authenticated = true`. Returns `{ success: true }` or 401. |
| `GET`  | Returns `{ authenticated: boolean }` — used by the dashboard client-side guard. |
| `DELETE` | Expires the auth cookie (logout). |

---

## 🎨 Customizing for a New Client (10-Minute Re-Skin)

**All business-specific values live in one file. Do NOT edit component logic.**

### 1. Open `data/clientConfig.js`

```js
export const clientConfig = {
  business: {
    name: "BrightPath Dental Clinic",       // ← Full name
    shortName: "BrightPath Dental",         // ← Widget header, login badge
    phone: "(555) 234-5678",                // ← Error copy, header, footer
    address: "123 Maple Street, Springfield",
    hours: "Mon-Fri 8am–6pm, Sat 9am–2pm",
  },

  theme: {
    colors: {
      baseBackground: "#FAFAF8",            // ← Warm off-white page
      surface: "#FFFFFF",                   // ← Cards/panels
      elevatedSurface: "#F0F4F2",           // ← Assistant bubbles, inputs
      primaryText: "#1F2937",               // ← Soft charcoal
      secondaryText: "#6B7280",             // ← Muted gray
      primaryAccent: "#4A9B8E",             // ← SAGE-TEAL accent
    },
    // …borderRadii
  },

  copy: {
    trustIndicator: "Usually replies in under a minute",
    heroHeadline: "Got a question? Ask us anything — day or night.",
    primaryCta: "Ask about an appointment",
    commonQuestions: [ { q, a }, … ],
    bookingSteps: [ { label, detail }, … ],
    privacyLine, followupLine,
  },

  services: [ … ],                         // ← Knowledge base
  faqs: [ { question, answer }, … ],       // ← Knowledge base

  chat: { greeting, leadFormPrompt, leadSuccess: (name) => `…` },
  dashboard: { title, subtitle, emptyState, tableColumns },
  login: { title, subtitle, passwordLabel, submit, submitting },
};
```

### 2. Save. That's it.

Every surface updates automatically:

- Landing hero + sections + footer
- Widget greeting, header, error copy ("That didn't go through — try again, or call us directly at [phone]")
- Lead form success message
- AI knowledge base prompt (services, hours, FAQs, phone, address — see `lib/knowledgeBase.js`)
- Dashboard title/copy, login page badge/copy

### 3. (Optional) Fine-tune the visual tokens

CSS theme variables live in `app/globals.css` (`--color-base`, `--color-accent`, etc.). The `clientConfig.theme` block is your reference copy of the tokens — to change them for a client, update both the `clientConfig` color values AND the matching `:root` CSS variables in `globals.css`.

---

## 🎯 Design System (Reusable Token Reference)

**Color palette** (`app/globals.css:3-14`):
- **Warm** — no stark-white, no dark-tech. Base `#FAFAF8` reads softer than pure `#FFF`.
- **Accent `#4A9B8E`** (sage-teal) — "clean & trustworthy" without reading as cold/corporate.
- **Elevated `#F0F4F2`** — a whisper of accent in surfaces so bubbles/inputs feel intentional, not flat gray.

**Typography** (`app/layout.js:4-20`):
- **Manrope 600–700** → headings. Rounded-but-professional, friendly without being playful.
- **Inter 400–500** → body. Highly legible, disappears into content.
- **IBM Plex Mono** → timestamps / tabular data in the dashboard.

**Radii** (`globals.css:20-23`):
- Cards 16 px · Panels 18 px · Inputs 14 px · Buttons + bubble full-round.
- Slightly softer than a typical SaaS → "well-designed waiting room" feel.

**Motion** (`globals.css:96-183`):
- Widget panel-in: 220 ms ease-out scale + fade.
- New messages: 250 ms slide-up + fade.
- Bubble pulse on entry: single 1.6 s loop (not continuous).
- Typing dots: staggered 1.2 s bounce, 0.15 s offset per dot.
- Full `prefers-reduced-motion` override disables all animation + smooth scroll.

---

## ☁️ Deployment (Vercel + MongoDB Atlas — ~5 min)

This project is a standard Next.js 16 App Router app — **Vercel is the recommended target** (optimized for Server Components, App Router edge caching, env variable UI).

### Step-by-step

```bash
# 1. Push to GitHub / GitLab
git add .
git commit -m "Set up BrightPath Dental template"
git push -u origin main

# 2. Import into Vercel
#    https://vercel.com/new → Import your repo
#    Framework preset = Next.js (auto-detected)

# 3. Add all 5 Environment Variables in Vercel → Settings → Env Vars:
MONGODB_URI=mongodb+srv://…
GEMINI_API_KEY=…
RESEND_API_KEY=re_…
OWNER_EMAIL=dr.smith@brightpathdental.com
DASHBOARD_PASSWORD=StrongPassword123!

# 4. Click "Deploy"
#    First build completes in ~60 s.
```

### Post-deploy checklist

- [ ] Visit `/` — confirm hero widget renders with the client's name.
- [ ] Send a chat message — confirm 200 OK in Network tab.
- [ ] Submit a test lead → check MongoDB Atlas → check `OWNER_EMAIL` inbox.
- [ ] Log into `/dashboard/login` → confirm the lead appears.
- [ ] Add a **custom domain** in Vercel (e.g. `chat.brightpathdental.com`).
- [ ] Verify a sender domain in Resend so emails come from `hello@brightpathdental.com` (not `onboarding@resend.dev`).

### Embedding on the client's real website

**Option A — iframe (simplest, works with any stack: WP, Squarespace, Wix):**

```html
<iframe
  src="https://chat.brightpathdental.com/"
  width="100%"
  height="720"
  frameborder="0"
  title="BrightPath Dental Chat"></iframe>
```

**Option B — Next.js / React site:**

Copy these 3 files into the client's repo + add the `@/` alias:
- `components/ChatWidget.jsx`
- `components/ChatWindow.jsx`
- `components/MessageBubble.jsx`

Then point their fetch calls at your deployed `/api/chat` and `/api/leads` URLs instead of relative paths.

---

## 🧪 Scripts

| `npm run …` | What it does |
|---|---|
| `dev` | Next.js dev server (Turbopack) on `:3000` |
| `build` | Production build (`.next/`) |
| `start` | Serve the production build |
| `lint` | `eslint` using Next.js core-web-vitals config |

---

## 🔒 Security Notes

1. **Secrets stay in env vars.** Never commit `.env.local` — the `.gitignore`
   explicitly blocks it (and we re-allow only `.env.local.example`).
2. **Dashboard auth is a cookie flag**, not crypto-grade. It's enough to keep
   casual visitors out of the lead log. For a multi-user admin, replace with
   NextAuth / bcrypt hashes.
3. **Lead PII stored in Mongo.** If you need GDPR/CCPA compliance, add a
   retention cron (e.g. delete leads older than 90 days).
4. **Public `/api/leads` POST** — add a very simple cloudflare-turnstile or
   hCaptcha challenge if bots become an issue.
5. **httpOnly + secure cookies** in production for dashboard auth.

---

## 🧱 Tech Stack

| Layer | Library / Service | Version / Model |
|---|---|---|
| Framework | **Next.js** (App Router, JavaScript) | 16.3.2 (Turbopack) |
| Styling | **Tailwind CSS** v4 via `@tailwindcss/postcss` | 4.x |
| Database | **MongoDB Atlas** via Mongoose | 9.x |
| LLM | **Google Gemini API** | `gemini-3.6-flash` |
| Email | **Resend** | 6.x |
| Deployment | **Vercel** (recommended) | — |
| Hosting companion | **MongoDB Atlas** | Free tier works |

---

## 🗂️ File-by-File Quick Index

| File | What it does | Key exports / contents |
|---|---|---|
| [clientConfig.js](file:///f:/programming/Ai-assistant/ai-lead-assistant/data/clientConfig.js) | **Single config source** — every brand value, string, color, CTA, FAQ | `clientConfig` object |
| [layout.js](file:///f:/programming/Ai-assistant/ai-lead-assistant/app/layout.js) | Root: loads fonts, sets metadata, applies base bg/fonts | Manrope + Inter + IBM Plex Mono |
| [globals.css](file:///f:/programming/Ai-assistant/ai-lead-assistant/app/globals.css) | CSS vars, utility classes, all animations, mobile sheet | Theme tokens + motion |
| [page.js](file:///f:/programming/Ai-assistant/ai-lead-assistant/app/page.js) | Landing page — hero IS embedded live ChatWindow | Sections: hero, common Qs, booking, services, FAQ |
| [dashboard/page.js](file:///f:/programming/Ai-assistant/ai-lead-assistant/app/dashboard/page.js) | Protected dashboard: auth guard (fetches /api/auth), LeadTable | Logout, custom loading dots |
| [dashboard/login/page.js](file:///f:/programming/Ai-assistant/ai-lead-assistant/app/dashboard/login/page.js) | Minimal centered card, one input, one pill button | Links back to / |
| [ChatWidget.jsx](file:///f:/programming/Ai-assistant/ai-lead-assistant/components/ChatWidget.jsx) | Floating bubble, one-shot pulse, open/close transition | ChatWindow host |
| [ChatWindow.jsx](file:///f:/programming/Ai-assistant/ai-lead-assistant/components/ChatWindow.jsx) | Panel, messages, typing indicator, lead form, fetches /api/chat and /api/leads | `isEmbedded` prop for hero |
| [MessageBubble.jsx](file:///f:/programming/Ai-assistant/ai-lead-assistant/components/MessageBubble.jsx) | Assistant vs. User bubble styles, slide-up entrance | `role="user\|assistant"` |
| [LeadTable.jsx](file:///f:/programming/Ai-assistant/ai-lead-assistant/components/LeadTable.jsx) | Desktop table + mobile cards, expandable summary, relative timestamps | Mono font for times |
| [ai.js](file:///f:/programming/Ai-assistant/ai-lead-assistant/lib/ai.js) | Gemini wrapper, system prompt injection, role mapping, [LEAD_READY] passthrough | `getAIResponse(msg, history)` |
| [knowledgeBase.js](file:///f:/programming/Ai-assistant/ai-lead-assistant/lib/knowledgeBase.js) | Serializes clientConfig → plain-text KB block | `getKnowledgeBaseText()`, `getBusinessName()` |
| [mongodb.js](file:///f:/programming/Ai-assistant/ai-lead-assistant/lib/mongodb.js) | Cached serverless-safe Mongoose connect | `connectDB()` default export |
| [notify.js](file:///f:/programming/Ai-assistant/ai-lead-assistant/lib/notify.js) | Resend sender (plain + HTML), failures logged, not thrown | `sendLeadNotification(lead)` |
| [auth.js](file:///f:/programming/Ai-assistant/ai-lead-assistant/lib/auth.js) | Cookie name + auth guard for `/api/leads GET` | `AUTH_COOKIE_NAME`, `isDashboardAuthenticated()` |
| [Lead.js](file:///f:/programming/Ai-assistant/ai-lead-assistant/models/Lead.js) | Mongoose schema | `{ name, contact, conversationSummary, createdAt }` |
| [api/chat/route.js](file:///f:/programming/Ai-assistant/ai-lead-assistant/app/api/chat/route.js) | Chat API endpoint | `POST` only |
| [api/leads/route.js](file:///f:/programming/Ai-assistant/ai-lead-assistant/app/api/leads/route.js) | Lead save + list endpoints | `POST`, `GET` (auth) |
| [api/auth/route.js](file:///f:/programming/Ai-assistant/ai-lead-assistant/app/api/auth/route.js) | Dashboard login session | `POST`, `GET`, `DELETE` |

---

## 🤝 Acceptance Testing Checklist

After every deploy or major edit, walk through this list:

- [ ] **Landing page loads** — hero widget chat window is already open & greeting is visible.
- [ ] **Trust cue shows** — green dot + "Usually replies in under a minute" in both hero header and widget header.
- [ ] **Colors are correct** — accent `#4A9B8E` on buttons/user bubbles, base `#FAFAF8` bg, `#F0F4F2` assistant bubbles/inputs.
- [ ] **Fonts load** — Manrope on headings, Inter on body, mono on dashboard timestamps.
- [ ] **Knowledge-based reply works** — "What are your hours?" returns the hours from clientConfig (no hallucination).
- [ ] **Lead form appears after 3 messages** — and the form text uses copy from `chat.leadFormPrompt`.
- [ ] **Lead form submits →** MongoDB doc created, owner email arrives, dashboard list updates.
- [ ] **Dashboard login works** with `DASHBOARD_PASSWORD`. Logout clears the session.
- [ ] **Mobile 375px** — floating widget full sheet, dashboard cards (not table), all sections stack with no horizontal overflow.
- [ ] **Reduced motion** — enable `prefers-reduced-motion` in DevTools → no pulse/animation.
- [ ] **No console errors** (Next hydration warnings from the browser dev overlay are OK in dev only).

---

## 📝 License & Usage

Internal project template. Deploy once per client using the customization
guide above. No business names, API keys, or patient/customer data should
ever be committed to source control.
