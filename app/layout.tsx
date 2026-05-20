import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Mashu Petfood — Alimento premium para tu mascota",
  description: "Descubrí la línea de alimentos naturales Mashu. Recetas pensadas con amor para perros y gatos.",
  openGraph: {
    title: "Mashu Petfood",
    description: "Alimento premium para tu mascota",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {children}
      </body>
    </html>
  )
}
