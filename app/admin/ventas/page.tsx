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
    { label: "Total vendido", valor: `$${totalVentas.toFixed(0)}`, sub: "pedidos entregados", color: "#10b981" },
    { label: "Pedidos totales", valor: todos.length, sub: "todos los estados", color: "var(--color-primary)" },
    { label: "Entregados", valor: entregados.length, sub: "completados", color: "#6366f1" },
    { label: "Ticket promedio", valor: entregados.length ? `$${(totalVentas / entregados.length).toFixed(0)}` : "—", sub: "por pedido", color: "#f59e0b" },
  ]

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-secondary)" }}>Ventas</h1>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: "var(--radius-card)", padding: "1.5rem", boxShadow: "var(--shadow-card)", borderLeft: `4px solid ${s.color}` }}>
            <p style={{ fontSize: "2rem", fontWeight: 800, color: s.color }}>{s.valor}</p>
            <p style={{ fontWeight: 600, color: "var(--color-secondary)", fontSize: "0.88rem" }}>{s.label}</p>
            <p style={{ fontSize: "0.78rem", color: "var(--color-muted)" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Por canal */}
        <div style={{ background: "#fff", borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)", padding: "1.5rem" }}>
          <h2 style={{ fontWeight: 700, color: "var(--color-secondary)", marginBottom: "1rem", fontSize: "1rem" }}>Pedidos por canal</h2>
          {Object.entries(porCanal).length === 0
            ? <p style={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>Sin datos aún.</p>
            : Object.entries(porCanal).map(([canal, count]) => (
              <div key={canal} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: "1px solid var(--color-cream-dark)" }}>
                <span style={{ textTransform: "capitalize", fontSize: "0.9rem" }}>{canal}</span>
                <span style={{ fontWeight: 700, color: "var(--color-primary)" }}>{count}</span>
              </div>
            ))
          }
        </div>

        {/* Últimas ventas */}
        <div style={{ background: "#fff", borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)", padding: "1.5rem" }}>
          <h2 style={{ fontWeight: 700, color: "var(--color-secondary)", marginBottom: "1rem", fontSize: "1rem" }}>Últimas ventas entregadas</h2>
          {entregados.length === 0
            ? <p style={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>Sin ventas entregadas aún.</p>
            : entregados.slice(0, 8).map((p) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: "1px solid var(--color-cream-dark)" }}>
                <div>
                  <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--color-secondary)" }}>{p.cliente_nombre ?? "Sin nombre"}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>{new Date(p.created_at).toLocaleDateString("es-AR")}</p>
                </div>
                <span style={{ fontWeight: 700, color: "#10b981" }}>{p.total ? `$${Number(p.total).toFixed(0)}` : "—"}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
