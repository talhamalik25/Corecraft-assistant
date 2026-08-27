/**
 * Chat message bubble — assistant on the left (elevated surface + charcoal),
 * visitor on the right (accent teal + white). Slide-up fade-in entrance.
 */
export default function MessageBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div
      className={`flex message-enter ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] px-4 py-2.5 text-[14px] leading-relaxed shadow-soft ${
          isUser
            ? "rounded-2xl rounded-br-md bg-accent text-white"
            : "rounded-2xl rounded-bl-md bg-elevated text-primary"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
