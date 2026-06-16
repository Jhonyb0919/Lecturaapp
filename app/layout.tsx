import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Misión Lectura",
  description: "App educativa gamificada para reforzar comprensión lectora.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
