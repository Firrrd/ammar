import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { ContactProvider } from "@/components/contact/ContactPopup";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";
import { site } from "@/lib/site";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <ContactProvider>
          <TopBar />
          {/* pt-14 keeps content clear of the fixed 56px top bar. */}
          <div className="flex flex-1 flex-col pt-14">{children}</div>
          <Footer />
        </ContactProvider>
      </body>
    </html>
  );
}
