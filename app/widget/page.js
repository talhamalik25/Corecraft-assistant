import EmbedWidget from "@/components/EmbedWidget";
import TransparentBody from "@/components/TransparentBody";

export const metadata = {
  title: "CoreCraft Assistant",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Bare page meant to be loaded inside an <iframe> on another site.
 * Renders nothing but the floating chat bubble/window — no header, hero,
 * or footer — with a transparent background so it blends into the host
 * page. See /components/ChatWidgetEmbed.jsx in the portfolio repo for the
 * host-side <iframe> that consumes this page.
 */
export default function WidgetPage() {
  return (
    <>
      <TransparentBody />
      <EmbedWidget />
    </>
  );
}
