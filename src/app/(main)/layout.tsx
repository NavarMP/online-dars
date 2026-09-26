import { NavigationDock } from "@/components/navigation-dock";
import { Footer } from "@/components/layout/footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavigationDock />
      {children}
      <Footer />
    </>
  );
}
