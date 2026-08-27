import { DM_Sans, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";
import { clientConfig } from "@/data/clientConfig";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata = {
  title: `${clientConfig.business.name} — Ask us anything`,
  description: clientConfig.copy.heroSubheadline,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-base text-primary font-body">
        {children}
      </body>
    </html>
  );
}
