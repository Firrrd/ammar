import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { ContactProvider } from "@/components/contact/ContactPopup";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";
import { site } from "@/lib/site";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Lets the addresses below be written as paths; this is put in front of them.
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  // What link previews show. The picture comes from opengraph-image.tsx.
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
};

// Colours the browser's own bars on phones to match the page.
export const viewport: Viewport = {
  themeColor: "#0a1628",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} h-full antialiased`}
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
