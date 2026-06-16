import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Mulish, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const body = Mulish({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const script = Tiro_Devanagari_Hindi({
  variable: "--font-script",
  subsets: ["latin", "devanagari"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stuti-weds-rushil.example.com"),
  title: "Stuti with Rushil · 27–28 February 2027",
  description:
    "With joyful hearts, save the dates for the wedding of Stuti Suri and Rushil Kaul, 27 to 28 February 2027. Two valleys, one vow. Kindly RSVP.",
  openGraph: {
    title: "Stuti with Rushil · 27–28 February 2027",
    description: "Two valleys, one vow. Punjab meets Kashmir. Save the dates and RSVP.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FBF4E6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${script.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream text-ink">{children}</body>
    </html>
  );
}
