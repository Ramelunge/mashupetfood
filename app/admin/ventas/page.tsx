import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Ventas — Mashu Admin" }

export default async function VentasPage() {
  const supabase = await createClient()
  const { data: pedidos } = await supabase
    .from("pedidos")
    .select("*")
    .order("created_at", { ascending: false })

  const todos = pedidos ?? []
  const entregados = todos.filter((p) => p.estado === "entregado")
  const totalVentas = entregados.reduce((acc, p) => acc + (Number(p.total) || 0), 0)

  const porCanal = todos.reduce((acc: Record<string, number>, p) => {
    const c = p.canal ?? "desconocido"
    acc[c] = (acc[c] ?? 0) + 1
    return acc
  }, {})

  const stats = [
    { label: "Total vendido",   valor: `$${totalVentas.toLocaleString("es-AR", { minimumFractionDigits: 0 })}`, sub: "pedidos entregados", color: "#34D399" },
    { label: "Pedidos totales", valor: todos.length,       sub: "todos los estados",   color: "#E07B2B" },
    { label: "Entregados",      valor: entregados.length,  sub: "completados",          color: "#818CF8" },
    { label: "Ticket promedio", valor: entregados.length ? `$${Math.round(totalVentas / entregados.length).toLocaleString("es-AR")}` : "—", sub: "por pedido", color: "#F59E0B" },
  ]

  return (
    <div style={{ padding: "2rem", maxWidth: "1100px" }}>
      <div style={{ marginBottom: "1.75rem" }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#8B7B6F", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Reportes</p>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Ventas</h1>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.75rem" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "#2A1F15", border: "1px solid #4D3A2E", borderRadius: "12px", padding: "1.25rem" }}>
            <p style={{ fontSize: "2rem", fontWeight: 700, color: s.color, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", lineHeight: 1, marginBottom: "0.4rem" }}>{s.valor}</p>
            <p style={{ fontWeight: 600, color: "#B8A8A0", fontSize: "0.82rem" }}>{s.label}</p>
            <p style={{ fontSize: "0.72rem", color: "#8B7B6F", marginTop: "0.1rem" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        {/* Por canal */}
        <div style={{ background: "#2A1F15", border: "1px solid #4D3A2E", borderRadius: "12px", padding: "1.5rem" }}>
          <h2 style={{ fontWeight: 600, color: "#ffffff", marginBottom: "1rem", fontSize: "0.9rem" }}>Pedidos por canal</h2>
          {Object.entries(porCanal).length === 0
            ? <p style={{ color: "#8B7B6F", fontSize: "0.85rem" }}>Sin datos aún.</p>
            : Object.entries(porCanal).map(([canal, count]) => (
              <div key={canal} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.65rem 0", borderBottom: "1px solid #321E12" }}>
                <span style={{ textTransform: "capitalize", fontSize: "0.88rem", color: "#B8A8A0" }}>{canal}</span>
                <span style={{ fontWeight: 700, color: "#E07B2B", fontVariantNumeric: "tabular-nums" }}>{count}</span>
              </div>
            ))
          }
        </div>

        {/* Últimas ventas */}
        <div style={{ background: "#2A1F15", border: "1px solid #4D3A2E", borderRadius: "12px", padding: "1.5rem" }}>
          <h2 style={{ fontWeight: 600, color: "#ffffff", marginBottom: "1rem", fontSize: "0.9rem" }}>Últimas ventas entregadas</h2>
          {entregados.length === 0
            ? <p style={{ color: "#8B7B6F", fontSize: "0.85rem" }}>Sin ventas entregadas aún.</p>
            : entregados.slice(0, 8).map((p) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.65rem 0", borderBottom: "1px solid #321E12" }}>
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ffffff" }}>{p.cliente_nombre ?? "Sin nombre"}</p>
                  <p style={{ fontSize: "0.73rem", color: "#8B7B6F" }}>{new Date(p.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}</p>
                </div>
                <span style={{ fontWeight: 700, color: "#34D399", fontVariantNumeric: "tabular-nums" }}>{p.total ? `$${Number(p.total).toLocaleString("es-AR", { minimumFractionDigits: 0 })}` : "—"}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
