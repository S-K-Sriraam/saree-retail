import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/ui/LayoutWrapper";

export const metadata: Metadata = {
  title: "Geethvarnam | Luxury Saree & Chudar Boutique",
  description: "Authentic Kanchipuram Silks, Banarasi Brocades, Royal Anarkalis & Designer Chudars with 3D Fabric Drape Simulation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}