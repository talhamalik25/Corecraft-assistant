+# CoreCraft Assistant
+
+CoreCraft's web-embeddable AI assistant answers questions about web development and AI automation, captures qualified project inquiries, and sends the team a notification by email.
+
+## Features
+
+- Live chat widget with an embedded landing-page preview
+- Gemini-powered answers grounded in `data/clientConfig.js`
+- Lead capture after three visitor messages or an AI `[LEAD_READY]` signal
+- MongoDB-backed inquiry dashboard protected by a password
+- Resend notification for every new inquiry
+- Responsive dark interface with reduced-motion support
+
+## Quick start
+
+1. Install dependencies:
+
+   ```bash
+   npm install
+   ```
+
+2. Copy the environment template and fill in your credentials:
+
+   ```bash
+   cp .env.local.example .env.local
+   ```
+
+   | Variable | Purpose |
+   | --- | --- |
+   | `MONGODB_URI` | MongoDB connection string for inquiries |
+   | `GEMINI_API_KEY` | Google AI Studio key for chat responses |
+   | `RESEND_API_KEY` | Resend key for inquiry notifications |
+   | `OWNER_EMAIL` | Inbox that receives new inquiry alerts |
+   | `DASHBOARD_PASSWORD` | Password for `/dashboard/login` |
+
+3. Start the development server:
+
+   ```bash
+   npm run dev
+   ```
+
+   Visit `http://localhost:3000` for the assistant and `http://localhost:3000/dashboard/login` for the dashboard.
+
+## Brand configuration
+
+Business content lives in `data/clientConfig.js`:
+
+- Agency name, contact details, location, and availability
+- Hero, call-to-action, inquiry form, dashboard, and login copy
+- Services, FAQs, and knowledge-base content used by the assistant
+
+Visual tokens live only in `app/globals.css`. CoreCraft uses a dark base, white text, a teal accent, and Syne, DM Sans, and JetBrains Mono font families.
+
+## How an inquiry is captured
+
+1. A visitor sends a message to `/api/chat`.
+2. The route builds a CoreCraft knowledge-base prompt and requests a Gemini response.
+3. The inline form opens after three visitor messages or a `[LEAD_READY]` marker.
+4. Submitting the form creates a MongoDB lead and attempts an email notification.
+5. The protected dashboard displays the inquiry and its conversation summary.
+
+## Project structure
+
+```text
+app/                 App Router pages, API routes, root layout, and styles
+components/          Chat widget, chat window, message bubbles, and lead table
data/clientConfig.js  CoreCraft content and knowledge-base configuration
+lib/                 AI, database, authentication, notification, and KB helpers
+models/Lead.js       MongoDB inquiry schema
+```
+
+## Scripts
+
+| Command | Purpose |
+| --- | --- |
+| `npm run dev` | Run the Next.js development server |
+| `npm run build` | Create a production build |
+| `npm run start` | Run the production server |
+| `npm run lint` | Run ESLint |
+
+## Deployment checks
+
+- Confirm the landing page displays CoreCraft branding and the teal accent.
+- Send a chat message and verify an answer is returned.
+- Submit a test inquiry and verify it is saved and emailed.
+- Sign in at `/dashboard/login` and verify the inquiry appears.
+- Verify mobile layouts and reduced-motion behavior.
