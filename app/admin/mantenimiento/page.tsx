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
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-secondary)" }}>Modo mantenimiento</h1>
        <p style={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>Al activarlo, el sitio público muestra la página de mantenimiento en tiempo real.</p>
      </div>
      <MaintenanceToggle
        initialActive={cfg.mantenimiento_activo === "true"}
        initialMensaje={cfg.mantenimiento_mensaje ?? ""}
      />
    </div>
  )
}
