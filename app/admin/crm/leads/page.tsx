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
    <div style={{ padding: "2rem", maxWidth: "1100px" }}>
      <div style={{ marginBottom: "1.75rem" }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#8B7B6F", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.25rem" }}>CRM</p>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Leads</h1>
        <p style={{ color: "#8B7B6F", fontSize: "0.85rem", marginTop: "0.25rem" }}>Contactos recibidos desde el formulario web</p>
      </div>
      <LeadsTable leads={leads ?? []} />
    </div>
  )
}
