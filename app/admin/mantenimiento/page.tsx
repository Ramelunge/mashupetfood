import { createClient } from "@/lib/supabase/server"
import MaintenanceToggle from "@/components/admin/MaintenanceToggle"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Mantenimiento — Mashu Admin" }

export default async function MantenimientoAdminPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("config").select("key,value")
    .in("key", ["mantenimiento_activo", "mantenimiento_mensaje"])

  const cfg = Object.fromEntries((data ?? []).map((r) => [r.key, r.value ?? ""]))

  return (
    <div style={{ padding: "2rem", maxWidth: "700px" }}>
      <div style={{ marginBottom: "1.75rem" }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#8B7B6F", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Sitio</p>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Modo mantenimiento</h1>
        <p style={{ color: "#8B7B6F", fontSize: "0.85rem", marginTop: "0.25rem" }}>Al activarlo, el sitio público muestra la página de mantenimiento en tiempo real.</p>
      </div>
      <MaintenanceToggle
        initialActive={cfg.mantenimiento_activo === "true"}
        initialMensaje={cfg.mantenimiento_mensaje ?? ""}
      />
    </div>
  )
}
