"use client";

import { useEffect } from "react";

/**
 * The root layout gives <html>/<body> a solid --color-base background so the
 * standalone widget site looks right on its own. When this page is loaded
 * inside an <iframe> (embedded on another site, e.g. the CoreCraft
 * portfolio), we want that background to be transparent instead, so only
 * the floating bubble/chat window are visible and the iframe blends into
 * the host page. This component toggles that on mount and restores the
 * original value on unmount.
 */
export default function TransparentBody() {
  useEffect(() => {
    const originalHtmlBg = document.documentElement.style.background;
    const originalBodyBg = document.body.style.background;

    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";

    return () => {
      document.documentElement.style.background = originalHtmlBg;
      document.body.style.background = originalBodyBg;
    };
  }, []);

  return null;
}
