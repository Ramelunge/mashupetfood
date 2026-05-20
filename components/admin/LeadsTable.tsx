"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

const ESTADOS = ["nuevo", "contactado", "convertido", "descartado"]
const ESTADO_COLORS: Record<string, { bg: string; color: string }> = {
  nuevo: { bg: "#dbeafe", color: "#1e40af" },
  contactado: { bg: "#fef9c3", color: "#854d0e" },
  convertido: { bg: "#dcfce7", color: "#166534" },
  descartado: { bg: "#f3f4f6", color: "#6b7280" },
}

interface Lead {
  id: string; nombre: string; email?: string; telefono?: string
  mascota?: string; mensaje?: string; estado: string; fuente?: string; notas?: string; created_at: string
}

export default function LeadsTable({ leads: initial }: { leads: Lead[] }) {
  const [leads, setLeads] = useState(initial)
  const [filtro, setFiltro] = useState("todos")
  const [expandido, setExpandido] = useState<string | null>(null)
  const supabase = createClient()

  const filtrados = filtro === "todos" ? leads : leads.filter((l) => l.estado === filtro)

  async function updateEstado(id: string, estado: string) {
    await supabase.from("leads").update({ estado }).eq("id", id)
    setLeads((ls) => ls.map((l) => l.id === id ? { ...l, estado } : l))
  }

  async function updateNotas(id: string, notas: string) {
    await supabase.from("leads").update({ notas }).eq("id", id)
    setLeads((ls) => ls.map((l) => l.id === id ? { ...l, notas } : l))
  }

  return (
    <div>
      {/* Filtros */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {["todos", ...ESTADOS].map((e) => (
          <button key={e} onClick={() => setFiltro(e)} style={{
            padding: "0.4rem 0.9rem", borderRadius: "20px", border: "1.5px solid",
            borderColor: filtro === e ? "var(--color-primary)" : "var(--color-cream-dark)",
            background: filtro === e ? "var(--color-primary)" : "#fff",
            color: filtro === e ? "#fff" : "var(--color-secondary)",
            fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
          }}>
            {e} {e !== "todos" && `(${leads.filter(l => l.estado === e).length})`}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div style={{ background: "#fff", borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.87rem" }}>
          <thead style={{ background: "var(--color-cream)" }}>
            <tr>
              {["Nombre", "Contacto", "Mascota", "Estado", "Fecha", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "0.75rem 1rem", color: "var(--color-muted)", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", borderBottom: "1px solid var(--color-cream-dark)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--color-muted)" }}>No hay leads con este filtro.</td></tr>
            )}
            {filtrados.map((lead) => {
              const ec = ESTADO_COLORS[lead.estado] ?? ESTADO_COLORS.nuevo
              const open = expandido === lead.id
              return (
                <>
                  <tr key={lead.id} style={{ borderBottom: "1px solid var(--color-cream-dark)", background: open ? "var(--color-cream)" : "transparent" }}>
                    <td style={{ padding: "0.85rem 1rem", fontWeight: 600, color: "var(--color-secondary)" }}>{lead.nombre}</td>
                    <td style={{ padding: "0.85rem 1rem", color: "var(--color-muted)" }}>
                      {lead.email && <div>{lead.email}</div>}
                      {lead.telefono && <div>{lead.telefono}</div>}
                    </td>
                    <td style={{ padding: "0.85rem 1rem" }}>{lead.mascota ?? "—"}</td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <select
                        value={lead.estado}
                        onChange={(e) => updateEstado(lead.id, e.target.value)}
                        style={{ padding: "0.3rem 0.6rem", borderRadius: "4px", border: "none", background: ec.bg, color: ec.color, fontWeight: 600, fontSize: "0.78rem", cursor: "pointer" }}
                      >
                        {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: "0.85rem 1rem", color: "var(--color-muted)", fontSize: "0.8rem" }}>
                      {new Date(lead.created_at).toLocaleDateString("es-AR")}
                    </td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <button onClick={() => setExpandido(open ? null : lead.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)", fontWeight: 600, fontSize: "0.82rem" }}>
                        {open ? "▲ Cerrar" : "▼ Ver más"}
                      </button>
                    </td>
                  </tr>
                  {open && (
                    <tr key={`${lead.id}-detail`} style={{ background: "var(--color-cream)", borderBottom: "1px solid var(--color-cream-dark)" }}>
                      <td colSpan={6} style={{ padding: "1rem 1.25rem" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--color-muted)", marginBottom: "0.25rem" }}>MENSAJE</p>
                            <p style={{ fontSize: "0.88rem", color: "var(--color-secondary)", background: "#fff", padding: "0.75rem", borderRadius: "6px" }}>{lead.mensaje ?? "—"}</p>
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--color-muted)", marginBottom: "0.25rem" }}>NOTAS INTERNAS</p>
                            <textarea
                              defaultValue={lead.notas ?? ""}
                              onBlur={(e) => updateNotas(lead.id, e.target.value)}
                              style={{ width: "100%", minHeight: "80px", padding: "0.6rem", borderRadius: "6px", border: "1px solid var(--color-cream-dark)", fontSize: "0.85rem", resize: "vertical" }}
                              placeholder="Agregar nota..."
                            />
                          </div>
                        </div>
                        {lead.email && (
                          <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.75rem" }}>
                            <a href={`mailto:${lead.email}`} className="btn-outline" style={{ fontSize: "0.82rem", padding: "0.4rem 0.9rem" }}>✉ Email</a>
                            {lead.telefono && (
                              <a href={`https://wa.me/${lead.telefono.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: "0.82rem", padding: "0.4rem 0.9rem" }}>WhatsApp</a>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
