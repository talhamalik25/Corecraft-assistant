"use client";

import { useEffect, useState } from "react";
import ChatWindow from "@/components/ChatWindow";

/**
 * Embeddable variant of ChatWidget, meant to be rendered on its own page
 * (see app/widget/page.js) which is then loaded inside an <iframe> on
 * another site (e.g. the CoreCraft portfolio).
 *
 * Differences from ChatWidget.jsx:
 * - Uses `absolute` positioning anchored to the iframe's own box instead of
 *   `fixed` positioning anchored to the page viewport (the host page is
 *   responsible for positioning the <iframe> itself on screen).
 * - Reports open/close state to the parent window via postMessage so the
 *   host page can resize the iframe (small bubble vs. full chat window).
 */
export default function EmbedWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPulsed, setHasPulsed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHasPulsed(true), 1800);
    return () => clearTimeout(t);
  }, []);

  // Tell the parent page whenever open state changes, so it can resize us.
  useEffect(() => {
    window.parent?.postMessage(
      { source: "corecraft-widget", type: "resize", isOpen },
      "*"
    );
  }, [isOpen]);

  return (
    <div className="fixed inset-0">
      {/* Chat window, anchored above the toggle button */}
      <div
        className={`absolute bottom-[76px] right-2 transition-all duration-[220ms] ease-out ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0 translate-y-2"
        }`}
      >
        {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
      </div>

      {/* Floating toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`absolute bottom-2 right-2 flex h-14 w-14 items-center justify-center rounded-pill bg-accent text-white shadow-float transition-all duration-200 ease-out hover:bg-accent-hover hover:scale-105 active:scale-95 ${
          !hasPulsed ? "widget-pulse" : ""
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <span className="text-xl leading-none" aria-hidden>
            ✕
          </span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
