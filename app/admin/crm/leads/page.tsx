import { createClient } from "@/lib/supabase/server"
import LeadsTable from "@/components/admin/LeadsTable"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Leads — Mashu Admin" }

export default async function LeadsPage() {
  const supabase = await createClient()
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-secondary)" }}>Leads</h1>
        <p style={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>Contactos recibidos desde el formulario web</p>
      </div>
      <LeadsTable leads={leads ?? []} />
    </div>
  )
}
