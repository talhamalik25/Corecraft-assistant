"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import clientConfig from "@/data/clientConfig";

const { login, business } = clientConfig;

/**
 * Minimal password login page for the dashboard.
 * Centered card, one input, one button. No marketing copy.
 */
export default function DashboardLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/dashboard");
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4 font-body">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft">
            <span className="text-accent" aria-hidden>🔐</span>
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-secondary">
            {business.shortName || business.name}
          </p>
        </div>

        <div className="w-full rounded-panel border border-border bg-surface p-7 shadow-soft sm:p-8">
          <h1 className="text-xl font-semibold tracking-tight text-primary font-display">
            {login.title}
          </h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-secondary">
            {login.subtitle}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-[13px] font-medium text-primary font-display"
              >
                {login.passwordLabel}
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1.5 w-full rounded-input bg-elevated px-4 py-3 text-[14px] text-primary placeholder:text-secondary/70 outline-none transition focus:ring-2 focus:ring-accent/20 focus:border-accent/40 border border-transparent"
                required
              />
            </div>

            {error && (
              <p className="text-[13px] text-error bg-error/5 rounded-input px-3 py-2 border border-error/15">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-pill bg-accent px-4 py-3 text-[14px] font-medium text-white transition hover:bg-accent-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? login.submitting : login.submit}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[12px] text-secondary">
          <Link
            href="/"
            className="underline-offset-2 hover:underline transition-colors"
          >
            ← Back to the site
          </Link>
        </p>
      </div>
    </div>
  );
}
