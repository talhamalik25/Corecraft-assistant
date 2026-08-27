"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LeadTable from "@/components/LeadTable";
import clientConfig from "@/data/clientConfig";

const { business, dashboard } = clientConfig;

/**
 * Protected dashboard page — fetches and displays all captured messages/bookings.
 * Redirects to /dashboard/login if the visitor is not authenticated.
 */
export default function DashboardPage() {
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const authResponse = await fetch("/api/auth");
        const authData = await authResponse.json();

        if (!authData.authenticated) {
          router.replace("/dashboard/login");
          return;
        }

        const leadsResponse = await fetch("/api/leads");
        const leadsData = await leadsResponse.json();

        if (!leadsResponse.ok) {
          throw new Error(leadsData.error || "Failed to load messages");
        }

        setLeads(leadsData.leads || []);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/dashboard/login");
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base text-secondary font-body">
        <div className="flex items-center gap-2">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="ml-2 text-sm">Loading messages…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base text-primary font-body">
      <header className="border-b border-border/60 bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft">
              <span className="text-accent" aria-hidden>💬</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-primary font-display tracking-tight sm:text-xl">
                {dashboard.title}
              </h1>
              <p className="text-[13px] text-secondary leading-tight mt-0.5">
                {business.shortName || business.name} ·{" "}
                {dashboard.subtitle(leads.length)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden text-[13px] text-secondary transition hover:text-primary sm:inline"
            >
              Back to site ←
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-pill border border-border bg-surface px-3.5 py-1.5 text-[13px] text-secondary transition hover:bg-elevated hover:text-primary"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        {error ? (
          <div className="rounded-card border border-error/20 bg-error/5 p-5 text-sm text-error">
            {error}
          </div>
        ) : (
          <LeadTable leads={leads} />
        )}
      </main>
    </div>
  );
}
