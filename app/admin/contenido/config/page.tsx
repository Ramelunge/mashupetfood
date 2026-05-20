import { createClient } from "@/lib/supabase/server"
import ConfigForm from "@/components/admin/ConfigForm"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Configuración — Mashu Admin" }

export default async function ConfigPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("config").select("*")
  const cfg = Object.fromEntries((data ?? []).map((r) => [r.key, r.value ?? ""]))

  return (
    <div style={{ padding: "2rem", maxWidth: "800px" }}>
      <div style={{ marginBottom: "1.75rem" }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#8B7B6F", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Sitio</p>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Configuración</h1>
        <p style={{ color: "#8B7B6F", fontSize: "0.85rem", marginTop: "0.25rem" }}>Todo lo que configurés acá se aplica en tiempo real al sitio</p>
      </div>
      <ConfigForm initialConfig={cfg} />
    </div>
  )
}
