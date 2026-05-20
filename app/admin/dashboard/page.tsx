import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Dashboard — Mashu Admin" }

async function getDashboardData() {
  const supabase = await createClient()
  const hoy = new Date().toISOString().slice(0, 10)

  const [leadsHoy, leadsTotales, pedidosPendientes, pedidosTotales, clientes, suscriptores] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact" }).gte("created_at", hoy),
    supabase.from("leads").select("id", { count: "exact" }),
    supabase.from("pedidos").select("id", { count: "exact" }).eq("estado", "pendiente"),
    supabase.from("pedidos").select("id,total,created_at,estado"),
    supabase.from("clientes").select("id", { count: "exact" }),
    supabase.from("suscriptores").select("id", { count: "exact" }).eq("activo", true),
  ])

  const pedidos = pedidosTotales.data ?? []
  const totalVentas = pedidos.filter((p) => p.estado === "entregado").reduce((acc, p) => acc + (p.total ?? 0), 0)

  return {
    leadsHoy: leadsHoy.count ?? 0,
    leadsTotales: leadsTotales.count ?? 0,
    pedidosPendientes: pedidosPendientes.count ?? 0,
    clientes: clientes.count ?? 0,
    suscriptores: suscriptores.count ?? 0,
    totalVentas,
    ultimosPedidos: pedidos.slice(-5).reverse(),
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  const cards = [
    { label: "Leads hoy", valor: data.leadsHoy, icono: "🎯", color: "var(--color-primary)", href: "/admin/crm/leads" },
    { label: "Leads totales", valor: data.leadsTotales, icono: "📋", color: "#6366f1", href: "/admin/crm/leads" },
    { label: "Pedidos pendientes", valor: data.pedidosPendientes, icono: "🕐", color: "#f59e0b", href: "/admin/crm/pedidos" },
    { label: "Clientes", valor: data.clientes, icono: "👥", color: "var(--color-accent)", href: "/admin/crm/clientes" },
    { label: "Suscriptores", valor: data.suscriptores, icono: "✉️", color: "#0ea5e9", href: "#" },
    { label: "Ventas entregadas", valor: `$${data.totalVentas.toFixed(0)}`, icono: "💰", color: "#10b981", href: "/admin/ventas" },
  ]

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-secondary)" }}>Dashboard</h1>
        <p style={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>
          {new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        {cards.map((c) => (
          <a key={c.label} href={c.href} style={{ textDecoration: "none" }}>
            <div style={{ background: "#fff", borderRadius: "var(--radius-card)", padding: "1.5rem", boxShadow: "var(--shadow-card)", display: "flex", flexDirection: "column", gap: "0.5rem", borderLeft: `4px solid ${c.color}`, transition: "transform 0.15s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.5rem" }}>{c.icono}</span>
                <span style={{ fontSize: "1.8rem", fontWeight: 800, color: c.color }}>{c.valor}</span>
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--color-muted)", fontWeight: 500 }}>{c.label}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Últimos pedidos */}
      <div style={{ background: "#fff", borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)", padding: "1.5rem" }}>
        <h2 style={{ fontWeight: 700, color: "var(--color-secondary)", marginBottom: "1rem", fontSize: "1rem" }}>Últimos pedidos</h2>
        {data.ultimosPedidos.length === 0 ? (
          <p style={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>No hay pedidos aún.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-cream-dark)" }}>
                {["Fecha", "Estado", "Total"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "var(--color-muted)", fontWeight: 600, fontSize: "0.78rem", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.ultimosPedidos.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--color-cream-dark)" }}>
                  <td style={{ padding: "0.75rem" }}>{new Date(p.created_at).toLocaleDateString("es-AR")}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <span style={{
                      padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.78rem", fontWeight: 600,
                      background: p.estado === "entregado" ? "#dcfce7" : p.estado === "confirmado" ? "#dbeafe" : p.estado === "cancelado" ? "#fee2e2" : "#fef9c3",
                      color: p.estado === "entregado" ? "#166534" : p.estado === "confirmado" ? "#1e40af" : p.estado === "cancelado" ? "#991b1b" : "#854d0e",
                    }}>{p.estado}</span>
                  </td>
                  <td style={{ padding: "0.75rem", fontWeight: 600 }}>{p.total ? `$${Number(p.total).toFixed(2)}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
