import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScrolling } from "@/components/smooth-scrolling";
import { CursorProvider } from "@/components/animations/custom-cursor";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const vexa = localFont({
  src: [
    {
      path: "../../public/fonts/VEXA .ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/VEXA ITALIC.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/VEXA light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/VEXA light italic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/VEXA thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/VEXA thin italic.ttf",
      weight: "100",
      style: "italic",
    },
  ],
  variable: "--font-vexa",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alathurpadidars.in/"),
  title: {
    template: "%s | Suffa Online Dars",
    default: "Suffa | Authentic Islamic Sciences",
  },
  description: "Traditional Knowledge. Modern Access. Study authentic Islamic sciences with verified Isnad from esteemed scholars.",
  keywords: ["dars", "islamic courses", "isnad", "fiqh", "aqidah", "arabic", "traditional scholarship"],
  authors: [{ name: "Alathurpadi Dars" }],
  openGraph: {
    title: "Suffa | Authentic Islamic Sciences",
    description: "Traditional Knowledge. Modern Access. Study authentic Islamic sciences with verified Isnad.",
    url: "https://alathurpadidars.in/",
    siteName: "Suffa Online Dars",
    images: [
      {
        url: "/og-image.jpg", // We would add an actual OG image
        width: 1200,
        height: 630,
        alt: "Suffa Online Dars",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Suffa Online Dars | Authentic Islamic Sciences",
    description: "Traditional Knowledge. Modern Access. Study authentic Islamic sciences with verified Isnad.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${vexa.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <SmoothScrolling>
              <CursorProvider>
                {children}
              </CursorProvider>
            </SmoothScrolling>
            <Toaster position="bottom-right" richColors theme="system" />
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
