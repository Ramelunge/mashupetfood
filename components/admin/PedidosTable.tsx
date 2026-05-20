"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

const ESTADOS = ["pendiente", "confirmado", "entregado", "cancelado"]

const ESTADO_BADGE: Record<string, { bg: string; color: string; dot: string }> = {
  pendiente:  { bg: "rgba(245,158,11,0.12)",  color: "#F59E0B", dot: "#F59E0B" },
  confirmado: { bg: "rgba(99,102,241,0.12)",   color: "#818CF8", dot: "#818CF8" },
  entregado:  { bg: "rgba(16,185,129,0.12)",   color: "#34D399", dot: "#34D399" },
  cancelado:  { bg: "rgba(239,68,68,0.12)",    color: "#F87171", dot: "#F87171" },
}

interface Pedido {
  id: string; cliente_nombre?: string; productos_json?: Record<string, unknown>
  estado: string; total?: number; canal?: string; notas?: string; created_at: string
}

export default function PedidosTable({ pedidos: initial }: { pedidos: Pedido[] }) {
  const [pedidos, setPedidos] = useState(initial)
  const [filtro, setFiltro] = useState("todos")
  const supabase = createClient()

  const filtrados = filtro === "todos" ? pedidos : pedidos.filter((p) => p.estado === filtro)

  async function updateEstado(id: string, estado: string) {
    await supabase.from("pedidos").update({ estado }).eq("id", id)
    setPedidos((ps) => ps.map((p) => p.id === id ? { ...p, estado } : p))
  }

  return (
    <div>
      {/* Filtros */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {["todos", ...ESTADOS].map((e) => {
          const active = filtro === e
          const badge = ESTADO_BADGE[e]
          const count = e === "todos" ? pedidos.length : pedidos.filter(p => p.estado === e).length
          return (
            <button key={e} onClick={() => setFiltro(e)} style={{
              padding: "0.35rem 0.9rem", borderRadius: "6px", border: "1px solid",
              borderColor: active ? (badge?.dot ?? "#E07B2B") : "#4D3A2E",
              background: active ? (badge?.bg ?? "rgba(224,123,43,0.15)") : "transparent",
              color: active ? (badge?.color ?? "#E07B2B") : "#8B7B6F",
              fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
              transition: "all 0.15s",
            }}>
              {e} ({count})
            </button>
          )
        })}
      </div>

      <div style={{ background: "#2A1F15", border: "1px solid #4D3A2E", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #4D3A2E" }}>
              {["Cliente", "Productos", "Canal", "Estado", "Total", "Fecha"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "0.85rem 1.25rem", color: "#8B7B6F", fontWeight: 600, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "#8B7B6F" }}>No hay pedidos con este filtro.</td></tr>
            )}
            {filtrados.map((p, i) => {
              const badge = ESTADO_BADGE[p.estado] ?? ESTADO_BADGE.pendiente
              const productos = Array.isArray(p.productos_json) ? p.productos_json : []
              return (
                <tr key={p.id} style={{ borderBottom: "1px solid #321E12", background: i % 2 !== 0 ? "rgba(255,255,255,0.018)" : "transparent" }}>
                  <td style={{ padding: "1rem 1.25rem", fontWeight: 600, color: "#ffffff" }}>{p.cliente_nombre ?? "Sin nombre"}</td>
                  <td style={{ padding: "1rem 1.25rem", color: "#8B7B6F" }}>
                    {productos.length > 0
                      ? <span style={{ fontSize: "0.8rem" }}>{productos.length} producto{productos.length !== 1 ? "s" : ""}</span>
                      : "—"}
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.55rem", borderRadius: "4px", background: "rgba(255,255,255,0.06)", color: "#B8A8A0", textTransform: "capitalize" }}>{p.canal ?? "—"}</span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <select
                      value={p.estado}
                      onChange={(e) => updateEstado(p.id, e.target.value)}
                      style={{
                        padding: "0.3rem 0.6rem", borderRadius: "6px",
                        border: `1px solid ${badge.dot}33`,
                        background: badge.bg, color: badge.color,
                        fontWeight: 600, fontSize: "0.75rem", cursor: "pointer",
                        appearance: "none", WebkitAppearance: "none",
                      }}
                    >
                      {ESTADOS.map((s) => <option key={s} value={s} style={{ background: "#2A1F15", color: "#fff" }}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "1rem 1.25rem", fontWeight: 700, color: "#34D399", fontVariantNumeric: "tabular-nums", fontFamily: "monospace" }}>{p.total ? `$${Number(p.total).toLocaleString("es-AR", { minimumFractionDigits: 2 })}` : "—"}</td>
                  <td style={{ padding: "1rem 1.25rem", color: "#8B7B6F", fontSize: "0.78rem" }}>{new Date(p.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
