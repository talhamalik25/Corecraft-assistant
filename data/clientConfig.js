// CoreCraft's config for the AI lead-capture assistant.
// Search for "TODO" below — that's the only value you need to fill in
// yourself (real contact info). Everything else is ready to use.

export const clientConfig = {
  business: {
    name: "CoreCraft",
    shortName: "CoreCraft",
    // TODO: replace with your real contact (email or WhatsApp number) —
    // this is what leads see if something goes wrong submitting the form.
    phone: "YOUR-EMAIL-OR-WHATSAPP-HERE",
    address: "Karachi, Pakistan — remote, serving clients worldwide",
    hours: "Usually replies within a few hours",
  },

  theme: {
    colors: {
      baseBackground: "#0D0D0D",
      surface: "#1A1A1A",
      elevatedSurface: "#242424",
      primaryText: "#F5F5F5",
      secondaryText: "#A3A3A3",
      primaryAccent: "#00E6D9",
    },
    borderRadius: {
      card: "16px",
      panel: "18px",
      button: "9999px",
      input: "14px",
    },
  },

  copy: {
    trustIndicator: "Usually replies within a few hours",
    heroHeadline: "Got a project in mind? Let's build it.",
    heroSubheadline:
      "CoreCraft builds websites and AI automation systems for small businesses — like this very chatbot. Ask a question or tell us about your project.",
    primaryCta: "Get a free quote",
    privacyLine: "Your information stays private and is never shared.",
    followupLine: "We'll get back to you shortly.",
    bookingSteps: [
      { label: "Tell us", detail: "Share what you're building or automating" },
      { label: "Share details", detail: "Give us your name and best contact" },
      { label: "We follow up", detail: "We'll reply with next steps and a quote" },
    ],
    commonQuestions: [
      {
        q: "What services do you offer?",
        a: "We build custom websites (React/Next.js) and AI automation tools — like lead-capture chatbots, similar to this one — for small and medium businesses.",
      },
      {
        q: "Do you offer ongoing support?",
        a: "Yes — we offer a monthly retainer for updates, maintenance, and improvements after your project launches.",
      },
      {
        q: "How long does a project take?",
        a: "Most websites take 1–3 weeks depending on scope. AI automation add-ons are scoped and timed separately based on complexity.",
      },
      {
        q: "What's your pricing like?",
        a: "Pricing depends on the project — tell us what you need and we'll share a clear quote, with an optional retainer for ongoing work.",
      },
    ],
  },

  services: [
    "Custom website design & development",
    "AI-powered chatbots & lead-capture systems",
    "Business process automation",
    "Ongoing retainer support & maintenance",
  ],

  faqs: [
    {
      question: "What industries do you work with?",
      answer:
        "We work with small and medium businesses across most industries — from local service businesses to online stores.",
    },
    {
      question: "Can you build something like this chatbot for my business?",
      answer:
        "Yes — this exact system can be customized and deployed for your business, with your own branding, knowledge base, and lead notifications.",
    },
    {
      question: "Do I need to know how to code to work with you?",
      answer:
        "Not at all. We handle the full build, deployment, and setup — you just tell us what you need.",
    },
  ],

  chat: {
    greeting:
      "Hi! I'm CoreCraft's assistant. Ask me about our web design or AI automation services, or tell me about your project.",
    leadFormPrompt:
      "Great — what's your name and best way to reach you (email or WhatsApp)?",
    leadFormNamePlaceholder: "Your full name",
    leadFormContactPlaceholder: "Email or WhatsApp number",
    leadFormSubmit: "Send my details",
    leadSuccess: (name) =>
      `Thanks, ${name}! I've passed your details along — we'll follow up soon.`,
    errorRetry: (phone) =>
      `That didn't go through — try again, or reach us directly at ${phone}.`,
  },

  dashboard: {
    title: "Messages & Inquiries",
    subtitle: (count) =>
      `${count} message${count !== 1 ? "s" : ""} received`,
    emptyState:
      "No messages yet. Once your widget is live, questions and project inquiries will show up here as they come in.",
    tableColumns: {
      name: "Name",
      contact: "Contact",
      captured: "Captured",
      summary: "Summary",
    },
  },

  login: {
    title: "Sign in to dashboard",
    subtitle: "Enter your password to view messages and inquiries.",
    passwordLabel: "Password",
    submit: "Sign in",
    submitting: "Signing in...",
  },
};

export default clientConfig;
