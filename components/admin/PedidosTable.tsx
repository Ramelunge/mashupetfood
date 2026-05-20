"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

const ESTADOS = ["pendiente", "confirmado", "entregado", "cancelado"]
const COLORES: Record<string, { bg: string; color: string }> = {
  pendiente: { bg: "#fef9c3", color: "#854d0e" },
  confirmado: { bg: "#dbeafe", color: "#1e40af" },
  entregado: { bg: "#dcfce7", color: "#166534" },
  cancelado: { bg: "#fee2e2", color: "#991b1b" },
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
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {["todos", ...ESTADOS].map((e) => {
          const count = e === "todos" ? pedidos.length : pedidos.filter(p => p.estado === e).length
          return (
            <button key={e} onClick={() => setFiltro(e)} style={{
              padding: "0.4rem 0.9rem", borderRadius: "20px", border: "1.5px solid",
              borderColor: filtro === e ? "var(--color-primary)" : "var(--color-cream-dark)",
              background: filtro === e ? "var(--color-primary)" : "#fff",
              color: filtro === e ? "#fff" : "var(--color-secondary)",
              fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
            }}>
              {e} ({count})
            </button>
          )
        })}
      </div>

      <div style={{ background: "#fff", borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.87rem" }}>
          <thead style={{ background: "var(--color-cream)" }}>
            <tr>
              {["Cliente", "Productos", "Canal", "Estado", "Total", "Fecha"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "0.75rem 1rem", color: "var(--color-muted)", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", borderBottom: "1px solid var(--color-cream-dark)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--color-muted)" }}>No hay pedidos con este filtro.</td></tr>
            )}
            {filtrados.map((p) => {
              const ec = COLORES[p.estado] ?? COLORES.pendiente
              const productos = Array.isArray(p.productos_json) ? p.productos_json : []
              return (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--color-cream-dark)" }}>
                  <td style={{ padding: "0.85rem 1rem", fontWeight: 600, color: "var(--color-secondary)" }}>{p.cliente_nombre ?? "Sin nombre"}</td>
                  <td style={{ padding: "0.85rem 1rem", color: "var(--color-muted)", maxWidth: "200px" }}>
                    {productos.length > 0
                      ? <span style={{ fontSize: "0.8rem" }}>{productos.length} producto{productos.length !== 1 ? "s" : ""}</span>
                      : "—"}
                  </td>
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <span style={{ fontSize: "0.78rem", padding: "0.2rem 0.5rem", borderRadius: "4px", background: "var(--color-cream)", textTransform: "capitalize" }}>{p.canal ?? "—"}</span>
                  </td>
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <select value={p.estado} onChange={(e) => updateEstado(p.id, e.target.value)} style={{ padding: "0.3rem 0.6rem", borderRadius: "4px", border: "none", background: ec.bg, color: ec.color, fontWeight: 600, fontSize: "0.78rem", cursor: "pointer" }}>
                      {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>{p.total ? `$${Number(p.total).toFixed(2)}` : "—"}</td>
                  <td style={{ padding: "0.85rem 1rem", color: "var(--color-muted)", fontSize: "0.8rem" }}>{new Date(p.created_at).toLocaleDateString("es-AR")}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
