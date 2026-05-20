import { createClient } from "@/lib/supabase/server"
import PedidosTable from "@/components/admin/PedidosTable"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Pedidos — Mashu Admin" }

export default async function PedidosPage() {
  const supabase = await createClient()
  const { data: pedidos } = await supabase
    .from("pedidos")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-secondary)" }}>Pedidos</h1>
        <p style={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>Pipeline de cotizaciones y pedidos</p>
      </div>
      <PedidosTable pedidos={pedidos ?? []} />
    </div>
  )
}
