import { createClient } from "@/lib/supabase/server"
import Image from "next/image"

export default async function MantenimientoPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("config").select("key,value").eq("key", "mantenimiento_mensaje").single()
  const mensaje = data?.value ?? "Estamos actualizando el sitio. ¡Volvemos pronto!"

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--color-cream)", padding: "2rem", textAlign: "center" }}>
      <Image src="/products/Logo.png" alt="Mashu Petfood" width={80} height={80} style={{ objectFit: "contain", marginBottom: "1.5rem" }} />
      <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-secondary)", marginBottom: "1rem" }}>
        Sitio en mantenimiento
      </h1>
      <p style={{ fontSize: "1.1rem", color: "var(--color-muted)", maxWidth: "480px", lineHeight: 1.6 }}>
        {mensaje}
      </p>
      <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: "var(--color-muted)" }}>
        Mientras tanto podés escribirnos por WhatsApp 🐾
      </p>
    </div>
  )
}
