import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FerreArt",
  description: "Tu ferretería de confianza",
};

import { AuthProvider } from "@/context/auth-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
