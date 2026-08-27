"use client";

import { useEffect, useState } from "react";
import ChatWindow from "@/components/ChatWindow";

/**
 * Floating chat widget: a circular bubble (sage-teal accent) with a one-shot
 * gentle pulse on first load, and a smooth scale+fade open/close. On mobile
 * the panel renders as a full-width bottom sheet via globals.css media query.
 */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPulsed, setHasPulsed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHasPulsed(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed widget-mobile-anchor bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat window with a smooth open/close transition */}
      <div
        className={`transition-all duration-[220ms] ease-out ${
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
        className={`flex h-14 w-14 items-center justify-center rounded-pill bg-accent text-white shadow-float transition-all duration-200 ease-out hover:bg-accent-hover hover:scale-105 active:scale-95 ${
          !hasPulsed ? "widget-pulse" : ""
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <span className="text-xl leading-none" aria-hidden>✕</span>
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
