import { createClient } from "@/lib/supabase/server"
import ConfigForm from "@/components/admin/ConfigForm"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Configuración — Mashu Admin" }

export default async function ConfigPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("config").select("*")
  const cfg = Object.fromEntries((data ?? []).map((r) => [r.key, r.value ?? ""]))

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-secondary)" }}>Configuración del sitio</h1>
        <p style={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>Todo lo que configurés acá se aplica en tiempo real al sitio</p>
      </div>
      <ConfigForm initialConfig={cfg} />
    </div>
  )
}
