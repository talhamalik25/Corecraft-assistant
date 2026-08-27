"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "@/components/MessageBubble";
import clientConfig from "@/data/clientConfig";

const LEAD_READY_MARKER = "[LEAD_READY]";
const USER_MESSAGE_THRESHOLD = 3;

const { business, chat, copy } = clientConfig;

function useVisualViewport() {
  const [viewport, setViewport] = useState({ height: 0, offsetTop: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateViewport = () => {
      const visualViewport = window.visualViewport;

      setViewport({
        height: visualViewport ? visualViewport.height : window.innerHeight,
        offsetTop: visualViewport ? visualViewport.offsetTop : 0,
      });
    };

    updateViewport();

    const visualViewport = window.visualViewport;

    visualViewport?.addEventListener("resize", updateViewport);
    visualViewport?.addEventListener("scroll", updateViewport);
    window.addEventListener("resize", updateViewport);
    window.addEventListener("orientationchange", updateViewport);

    return () => {
      visualViewport?.removeEventListener("resize", updateViewport);
      visualViewport?.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
    };
  }, []);

  return viewport;
}

/**
 * Builds a plain-text summary of the conversation for saving with the lead.
 */
function buildConversationSummary(messages) {
  return messages
    .map((message) => {
      const label = message.role === "user" ? "Visitor" : "Assistant";
      return `${label}: ${message.content}`;
    })
    .join("\n");
}

/**
 * Removes the hidden lead-capture marker from AI replies before showing them.
 */
function stripLeadMarker(text) {
  return text.replace(LEAD_READY_MARKER, "").trim();
}

function TypingIndicator() {
  return (
    <div className="flex justify-start message-enter">
      <div className="rounded-2xl rounded-bl-md bg-elevated px-4 py-2.5 shadow-soft">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}

/**
 * The main chat panel: message list, input box, and inline lead capture form.
 * When `isEmbedded` the header has no close button (used on the landing hero).
 */
export default function ChatWindow({ onClose, isEmbedded = false }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: chat.greeting,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadContact, setLeadContact] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [error, setError] = useState("");
  const viewport = useVisualViewport();

  const messagesEndRef = useRef(null);

  const mobileViewportStyle =
    typeof window !== "undefined" && window.innerWidth < 640
      ? {
          "--mobile-viewport-height": `${viewport.height}px`,
          "--mobile-viewport-offset-top": `${viewport.offsetTop}px`,
        }
      : undefined;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showLeadForm, isLoading]);

  async function handleSendMessage(event) {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setError("");
    setInput("");

    const nextUserCount = userMessageCount + 1;
    const history = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setUserMessageCount(nextUserCount);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get a response");
      }

      const rawReply = data.reply || "";
      const cleanedReply = stripLeadMarker(rawReply);
      const leadIntentDetected = rawReply.includes(LEAD_READY_MARKER);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: cleanedReply },
      ]);

      if (
        !leadSubmitted &&
        (nextUserCount >= USER_MESSAGE_THRESHOLD || leadIntentDetected)
      ) {
        setShowLeadForm(true);
      }
    } catch (sendError) {
      setError(sendError.message);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: chat.errorRetry(business.phone),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLeadSubmit(event) {
    event.preventDefault();

    if (!leadName.trim() || !leadContact.trim() || isSubmittingLead) return;

    setIsSubmittingLead(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName.trim(),
          contact: leadContact.trim(),
          conversationSummary: buildConversationSummary(messages),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save your details");
      }

      setLeadSubmitted(true);
      setShowLeadForm(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: chat.leadSuccess(leadName.trim()),
        },
      ]);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmittingLead(false);
    }
  }

  return (
    <div
      className={`widget-mobile-sheet flex h-[520px] w-full max-w-[360px] sm:max-w-[380px] flex-col overflow-hidden rounded-panel border border-border bg-surface shadow-widget ${
        isEmbedded ? "" : ""
      }`}
      style={mobileViewportStyle}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-9 w-9 rounded-full bg-accent-soft flex items-center justify-center">
              <span className="text-accent text-sm">👋</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-online ring-2 ring-surface" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-primary font-display leading-tight">
              {business.shortName || business.name}
            </p>
            <p className="text-[11px] text-secondary leading-tight mt-0.5">
              {copy.trustIndicator}
            </p>
          </div>
        </div>
        {!isEmbedded && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-pill p-1.5 text-secondary transition hover:bg-elevated hover:text-primary"
            aria-label="Close chat"
          >
            <span className="text-sm leading-none">✕</span>
          </button>
        )}
      </div>

      {/* Scrollable message list */}
      <div className="chat-scroll flex-1 min-h-0 space-y-3 overflow-y-auto overscroll-contain px-4 py-4 bg-base">
        {messages.map((message, index) => (
          <MessageBubble
            key={`${message.role}-${index}`}
            role={message.role}
            content={message.content}
          />
        ))}

        {isLoading && <TypingIndicator />}

        {/* Inline lead capture form — reads like a natural next message */}
        {showLeadForm && !leadSubmitted && (
          <div className="message-enter">
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-elevated px-4 py-3 shadow-soft">
                <p className="mb-3 text-[14px] leading-relaxed text-primary font-body">
                  {chat.leadFormPrompt}
                </p>
                <form onSubmit={handleLeadSubmit} className="space-y-2.5">
                  <input
                    type="text"
                    placeholder={chat.leadFormNamePlaceholder}
                    value={leadName}
                    onChange={(event) => setLeadName(event.target.value)}
                    className="w-full rounded-input border border-border bg-surface px-3.5 py-2.5 text-[14px] text-primary placeholder:text-secondary/80 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                    required
                  />
                  <input
                    type="text"
                    placeholder={chat.leadFormContactPlaceholder}
                    value={leadContact}
                    onChange={(event) => setLeadContact(event.target.value)}
                    className="w-full rounded-input border border-border bg-surface px-3.5 py-2.5 text-[14px] text-primary placeholder:text-secondary/80 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingLead}
                    className="w-full rounded-pill bg-accent px-4 py-2.5 text-[14px] font-medium text-white transition hover:bg-accent-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmittingLead ? "Sending..." : chat.leadFormSubmit}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <p className="px-4 pb-2 text-xs text-error bg-base">{error}</p>
      )}

      {/* Message input */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-border bg-surface p-3"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-input bg-elevated px-4 py-2.5 text-[14px] text-primary placeholder:text-secondary/70 outline-none transition focus:ring-2 focus:ring-accent/15"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-pill bg-accent px-4 py-2.5 text-[14px] font-medium text-white transition hover:bg-accent-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
