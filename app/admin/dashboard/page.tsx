import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Dashboard — Mashu Admin" }

function IconTarget() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#E07B2B" strokeWidth="1.5"/><circle cx="8" cy="8" r="3" stroke="#E07B2B" strokeWidth="1.5"/><circle cx="8" cy="8" r="1" fill="#E07B2B"/></svg>
}
function IconClipboard() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2.5" y="3.5" width="11" height="11" rx="1.5" stroke="#B8A8A0" strokeWidth="1.5"/><path d="M5 3.5V3a3 3 0 016 0v.5" stroke="#B8A8A0" strokeWidth="1.5"/></svg>
}
function IconClock() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#F59E0B" strokeWidth="1.5"/><path d="M8 5v3.5L10.5 10" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/></svg>
}
function IconUsers() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="2.5" stroke="#6BAF3C" strokeWidth="1.5"/><path d="M1.5 13c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" stroke="#6BAF3C" strokeWidth="1.5" strokeLinecap="round"/><circle cx="11.5" cy="5" r="2" stroke="#B8A8A0" strokeWidth="1.5"/><path d="M13.5 13c0-1.933-1.119-3.5-2.5-3.5" stroke="#B8A8A0" strokeWidth="1.5" strokeLinecap="round"/></svg>
}
function IconMail() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="#0EA5E9" strokeWidth="1.5"/><path d="M1.5 5l6.5 4 6.5-4" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round"/></svg>
}
function IconDollar() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5v13M5 4.5c0-1.105 1.343-2 3-2s3 .895 3 2-1.343 2-3 2-3 .895-3 2 1.343 2 3 2 3-.895 3-2" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round"/></svg>
}

async function getDashboardData() {
  const supabase = await createClient()
  const hoy = new Date().toISOString().slice(0, 10)
  const semanaAtras = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)

  const [leadsHoy, leadsTotales, leadsEstaSemana, pedidosPendientes, pedidosTotales, clientes, suscriptores] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact" }).gte("created_at", hoy),
    supabase.from("leads").select("id", { count: "exact" }),
    supabase.from("leads").select("id", { count: "exact" }).gte("created_at", semanaAtras),
    supabase.from("pedidos").select("id", { count: "exact" }).eq("estado", "pendiente"),
    supabase.from("pedidos").select("id,total,created_at,estado"),
    supabase.from("clientes").select("id", { count: "exact" }),
    supabase.from("suscriptores").select("id", { count: "exact" }).eq("activo", true),
  ])

  const pedidos = pedidosTotales.data ?? []
  const totalVentas = pedidos
    .filter((p) => p.estado === "entregado")
    .reduce((acc, p) => acc + (p.total ?? 0), 0)

  return {
    leadsHoy: leadsHoy.count ?? 0,
    leadsTotales: leadsTotales.count ?? 0,
    leadsEstaSemana: leadsEstaSemana.count ?? 0,
    pedidosPendientes: pedidosPendientes.count ?? 0,
    clientes: clientes.count ?? 0,
    suscriptores: suscriptores.count ?? 0,
    totalVentas,
    ultimosPedidos: pedidos.slice(-6).reverse(),
  }
}

const ESTADO_BADGE: Record<string, { bg: string; color: string; dot: string }> = {
  pendiente:  { bg: "rgba(245,158,11,0.12)",  color: "#F59E0B", dot: "#F59E0B" },
  confirmado: { bg: "rgba(99,102,241,0.12)",   color: "#818CF8", dot: "#818CF8" },
  entregado:  { bg: "rgba(16,185,129,0.12)",   color: "#34D399", dot: "#34D399" },
  cancelado:  { bg: "rgba(239,68,68,0.12)",    color: "#F87171", dot: "#F87171" },
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  const raw = new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })
  const fecha = raw.charAt(0).toUpperCase() + raw.slice(1)

  return (
    <div style={{ padding: "2rem", maxWidth: "1100px" }}>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#8B7B6F", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.25rem" }}>{fecha}</p>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Dashboard</h1>
      </div>

      {/* KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>

        {/* Leads hoy — primary card */}
        <Link href="/admin/crm/leads" style={{ textDecoration: "none" }}>
          <div style={{ background: "#2A1F15", border: "1px solid #4D3A2E", borderRadius: "12px", padding: "1.5rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, #E07B2B 0%, #F5A05A 100%)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#8B7B6F", letterSpacing: "0.1em", textTransform: "uppercase" }}>Leads hoy</span>
              <IconTarget />
            </div>
            <p style={{ fontSize: "3rem", fontWeight: 700, color: "#ffffff", lineHeight: 1, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", marginBottom: "0.5rem" }}>{data.leadsHoy}</p>
            <p style={{ fontSize: "0.75rem", color: "#E07B2B", fontWeight: 600 }}>+{data.leadsEstaSemana} esta semana</p>
          </div>
        </Link>

        {/* Leads totales */}
        <Link href="/admin/crm/leads" style={{ textDecoration: "none" }}>
          <div style={{ background: "#2A1F15", border: "1px solid #4D3A2E", borderRadius: "12px", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#8B7B6F", letterSpacing: "0.1em", textTransform: "uppercase" }}>Leads totales</span>
              <IconClipboard />
            </div>
            <p style={{ fontSize: "3rem", fontWeight: 700, color: "#ffffff", lineHeight: 1, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", marginBottom: "0.5rem" }}>{data.leadsTotales}</p>
            <p style={{ fontSize: "0.75rem", color: "#8B7B6F" }}>todos los tiempos</p>
          </div>
        </Link>

        {/* Pedidos pendientes */}
        <Link href="/admin/crm/pedidos" style={{ textDecoration: "none" }}>
          <div style={{ background: "#2A1F15", border: "1px solid #4D3A2E", borderRadius: "12px", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#8B7B6F", letterSpacing: "0.1em", textTransform: "uppercase" }}>Pedidos pendientes</span>
              <IconClock />
            </div>
            <p style={{ fontSize: "3rem", fontWeight: 700, color: data.pedidosPendientes > 0 ? "#F59E0B" : "#ffffff", lineHeight: 1, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", marginBottom: "0.5rem" }}>{data.pedidosPendientes}</p>
            <p style={{ fontSize: "0.75rem", color: "#8B7B6F" }}>requieren acción</p>
          </div>
        </Link>

        {/* Clientes */}
        <Link href="/admin/crm/clientes" style={{ textDecoration: "none" }}>
          <div style={{ background: "#2A1F15", border: "1px solid #4D3A2E", borderRadius: "12px", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#8B7B6F", letterSpacing: "0.1em", textTransform: "uppercase" }}>Clientes</span>
              <IconUsers />
            </div>
            <p style={{ fontSize: "3rem", fontWeight: 700, color: "#ffffff", lineHeight: 1, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", marginBottom: "0.5rem" }}>{data.clientes}</p>
            <p style={{ fontSize: "0.75rem", color: "#8B7B6F" }}>registrados</p>
          </div>
        </Link>

        {/* Suscriptores */}
        <div style={{ background: "#2A1F15", border: "1px solid #4D3A2E", borderRadius: "12px", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#8B7B6F", letterSpacing: "0.1em", textTransform: "uppercase" }}>Suscriptores</span>
            <IconMail />
          </div>
          <p style={{ fontSize: "3rem", fontWeight: 700, color: "#ffffff", lineHeight: 1, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", marginBottom: "0.5rem" }}>{data.suscriptores}</p>
          <p style={{ fontSize: "0.75rem", color: "#8B7B6F" }}>newsletter activos</p>
        </div>

        {/* Ventas */}
        <Link href="/admin/ventas" style={{ textDecoration: "none" }}>
          <div style={{ background: "#2A1F15", border: "1px solid #4D3A2E", borderRadius: "12px", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#8B7B6F", letterSpacing: "0.1em", textTransform: "uppercase" }}>Ventas entregadas</span>
              <IconDollar />
            </div>
            <p style={{ fontSize: "2.25rem", fontWeight: 700, color: "#34D399", lineHeight: 1, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", marginBottom: "0.5rem" }}>
              ${data.totalVentas.toLocaleString("es-AR", { minimumFractionDigits: 0 })}
            </p>
            <p style={{ fontSize: "0.75rem", color: "#8B7B6F" }}>acumulado total</p>
          </div>
        </Link>
      </div>

      {/* Últimos pedidos */}
      <div style={{ background: "#2A1F15", border: "1px solid #4D3A2E", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #4D3A2E", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontWeight: 600, color: "#ffffff", fontSize: "0.9rem", letterSpacing: "-0.01em" }}>Últimos pedidos</h2>
          <Link href="/admin/crm/pedidos" style={{ fontSize: "0.75rem", color: "#E07B2B", textDecoration: "none", fontWeight: 600 }}>Ver todos →</Link>
        </div>

        {data.ultimosPedidos.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#8B7B6F", fontSize: "0.9rem" }}>No hay pedidos aún.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #4D3A2E" }}>
                {["Fecha", "Estado", "Total"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "0.75rem 1.5rem", color: "#8B7B6F", fontWeight: 600, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.ultimosPedidos.map((p, i) => {
                const badge = ESTADO_BADGE[p.estado] ?? ESTADO_BADGE.pendiente
                return (
                  <tr key={p.id} style={{ borderBottom: i < data.ultimosPedidos.length - 1 ? "1px solid #321E12" : "none", background: i % 2 !== 0 ? "rgba(255,255,255,0.018)" : "transparent" }}>
                    <td style={{ padding: "1rem 1.5rem", color: "#B8A8A0", fontSize: "0.84rem" }}>
                      {new Date(p.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.25rem 0.7rem", borderRadius: "20px", background: badge.bg, fontSize: "0.73rem", fontWeight: 600, color: badge.color }}>
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: badge.dot, flexShrink: 0 }} />
                        {p.estado}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.5rem", color: "#ffffff", fontWeight: 600, fontSize: "0.88rem", fontVariantNumeric: "tabular-nums", fontFamily: "monospace" }}>
                      {p.total ? `$${Number(p.total).toLocaleString("es-AR", { minimumFractionDigits: 2 })}` : "—"}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
