import Link from "next/link";
import ChatWidget from "@/components/ChatWidget";
import ChatWindow from "@/components/ChatWindow";
import clientConfig from "@/data/clientConfig";

const { business, copy, services, faqs } = clientConfig;

/**
 * Demo landing page — the hero is an in-page open chat window so visitors see
 * the widget in action immediately. Swap clientConfig.js to re-theme per client.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-base text-primary font-body">
      {/* Top bar */}
      <header className="border-b border-border/60 bg-surface/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <p className="text-base font-semibold text-primary font-display tracking-tight">
            {business.name}
          </p>
          <div className="flex items-center gap-2">
            <a
              href={`tel:${business.phone.replace(/\D/g, "")}`}
              className="hidden text-sm text-secondary transition hover:text-primary sm:inline"
            >
              {business.phone}
            </a>
            <Link
              href="/dashboard/login"
              className="ml-2 text-sm text-secondary transition hover:text-primary"
            >
              Dashboard →
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO: live widget, open */}
        <section className="relative">
          <div className="mx-auto max-w-5xl px-4 pt-16 pb-24 sm:px-6 sm:pt-24 sm:pb-32">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1.5">
                <span className="h-2 w-2 rounded-full bg-online" />
                <span className="text-xs font-medium text-secondary font-body">
                  {copy.trustIndicator}
                </span>
              </div>

              <h1 className="mt-6 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-primary font-display sm:text-4xl md:text-5xl">
                {copy.heroHeadline}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-secondary sm:text-lg">
                {copy.heroSubheadline}
              </p>

              <a
                href="#widget-hero"
                className="mt-8 inline-flex items-center gap-2 rounded-pill bg-accent px-5 py-3 text-sm font-medium text-white shadow-soft transition hover:bg-accent-hover active:scale-[0.98]"
              >
                {copy.primaryCta}
                <span aria-hidden>→</span>
              </a>
            </div>

            {/* In-page widget display — the hero IS the widget */}
            <div
              id="widget-hero"
              className="mx-auto mt-14 w-full max-w-sm sm:max-w-md"
            >
              <div className="relative">
                <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[32px] bg-gradient-to-b from-accent/[0.06] to-transparent blur-2xl" />
                <div className="widget-panel-open">
                  <ChatWindow isEmbedded />
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-secondary">
                This is a live preview. You can also use the floating chat
                button in the corner.
              </p>
            </div>
          </div>
        </section>

        {/* What it answers (common questions) */}
        <section className="border-t border-border/60 bg-surface/50">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold tracking-tight text-primary font-display sm:text-2xl">
                What it can help with
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-secondary sm:text-base">
                Common questions patients and customers ask — answered right
                away, any time of day.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {copy.commonQuestions.map((item) => (
                <div
                  key={item.q}
                  className="rounded-card border border-border bg-surface p-5 shadow-soft"
                >
                  <h3 className="text-sm font-semibold text-primary font-display">
                    {item.q}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How booking works — genuine sequence, so numbered steps are OK */}
        <section className="border-t border-border/60">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold tracking-tight text-primary font-display sm:text-2xl">
                How booking works
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-secondary sm:text-base">
                A simple, low-friction flow that feels like talking to a real
                front desk.
              </p>
            </div>

            <ol className="mt-10 grid gap-6 sm:grid-cols-3">
              {copy.bookingSteps.map((step, i) => (
                <li
                  key={step.label}
                  className="relative rounded-card border border-border bg-surface p-6 shadow-soft"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent font-display">
                    {i + 1}
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-primary font-display">
                    {step.label}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                    {step.detail}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Services + hours */}
        <section className="border-t border-border/60 bg-surface/50">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-card border border-border bg-surface p-6 shadow-soft md:col-span-2">
                <h3 className="text-sm font-semibold text-primary font-display">
                  Services
                </h3>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {services.map((service) => (
                    <li
                      key={service}
                      className="flex items-start gap-2 text-sm text-secondary"
                    >
                      <span
                        className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-accent"
                        aria-hidden
                      />
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-card border border-border bg-surface p-6 shadow-soft">
                <h3 className="text-sm font-semibold text-primary font-display">
                  Hours
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-secondary">
                  {business.hours}
                </p>
                <div className="mt-5 rounded-input bg-elevated p-3.5">
                  <p className="text-xs text-secondary">
                    {copy.trustIndicator}
                  </p>
                  <p className="mt-1 text-xs text-secondary">
                    {copy.followupLine}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ + trust */}
        <section className="border-t border-border/60">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-3">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-primary font-display sm:text-2xl">
                  Frequently asked
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-secondary sm:text-base">
                  A few things people usually want to know before they reach
                  out.
                </p>
                <div className="mt-8 rounded-card border border-border bg-surface p-5 shadow-soft">
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-accent-soft text-accent"
                      aria-hidden
                    >
                      🔒
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-primary font-display">
                        {copy.privacyLine}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-secondary">
                        Contact details are only used to follow up on your
                        request.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 lg:col-span-2">
                {faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="group rounded-card border border-border bg-surface p-5 shadow-soft"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-primary font-display">
                      {faq.question}
                      <span
                        className="flex-none text-lg text-secondary transition group-open:rotate-45"
                        aria-hidden
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-secondary">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/60 bg-surface/70">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs text-secondary">
              © {new Date().getFullYear()} {business.name}. {business.address}.
            </p>
            <p className="text-xs text-secondary">
              Call us at{" "}
              <a
                href={`tel:${business.phone.replace(/\D/g, "")}`}
                className="text-primary underline-offset-2 hover:underline"
              >
                {business.phone}
              </a>
            </p>
          </div>
        </footer>
      </main>

      {/* Floating widget bubble for the real, persistent chat */}
      <ChatWidget />
    </div>
  );
}
