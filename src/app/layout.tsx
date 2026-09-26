import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScrolling } from "@/components/smooth-scrolling";

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
  title: "'ilm — Online Dars Platform",
  description: "Traditional Knowledge. Modern Access.",
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
          <SmoothScrolling>
            {children}
          </SmoothScrolling>
        </ThemeProvider>
      </body>
    </html>
  );
}
