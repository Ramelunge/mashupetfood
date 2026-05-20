"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

const ESTADOS = ["nuevo", "contactado", "convertido", "descartado"]

const ESTADO_BADGE: Record<string, { bg: string; color: string; dot: string }> = {
  nuevo:       { bg: "rgba(99,102,241,0.15)",  color: "#818CF8", dot: "#818CF8" },
  contactado:  { bg: "rgba(245,158,11,0.12)",  color: "#F59E0B", dot: "#F59E0B" },
  convertido:  { bg: "rgba(16,185,129,0.12)",  color: "#34D399", dot: "#34D399" },
  descartado:  { bg: "rgba(255,255,255,0.06)", color: "#8B7B6F", dot: "#8B7B6F" },
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
        {["todos", ...ESTADOS].map((e) => {
          const active = filtro === e
          const badge = ESTADO_BADGE[e]
          return (
            <button key={e} onClick={() => setFiltro(e)} style={{
              padding: "0.35rem 0.9rem", borderRadius: "6px", border: "1px solid",
              borderColor: active ? (badge?.dot ?? "#E07B2B") : "#4D3A2E",
              background: active ? (badge?.bg ?? "rgba(224,123,43,0.15)") : "transparent",
              color: active ? (badge?.color ?? "#E07B2B") : "#8B7B6F",
              fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
              transition: "all 0.15s",
            }}>
              {e} {e !== "todos" && `(${leads.filter(l => l.estado === e).length})`}
            </button>
          )
        })}
      </div>

      {/* Tabla */}
      <div style={{ background: "#2A1F15", border: "1px solid #4D3A2E", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #4D3A2E" }}>
              {["Nombre", "Contacto", "Mascota", "Estado", "Fecha", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "0.85rem 1.25rem", color: "#8B7B6F", fontWeight: 600, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "#8B7B6F" }}>
                  No hay leads con este filtro.
                </td>
              </tr>
            )}
            {filtrados.map((lead, i) => {
              const badge = ESTADO_BADGE[lead.estado] ?? ESTADO_BADGE.nuevo
              const open = expandido === lead.id
              return (
                <>
                  <tr key={lead.id} style={{
                    borderBottom: "1px solid #321E12",
                    background: open ? "#321E12" : i % 2 !== 0 ? "rgba(255,255,255,0.018)" : "transparent",
                    borderLeft: open ? "3px solid #E07B2B" : "3px solid transparent",
                  }}>
                    <td style={{ padding: "1rem 1.25rem", fontWeight: 600, color: "#ffffff" }}>{lead.nombre}</td>
                    <td style={{ padding: "1rem 1.25rem", color: "#B8A8A0", lineHeight: 1.6 }}>
                      {lead.email && <div style={{ fontSize: "0.82rem" }}>{lead.email}</div>}
                      {lead.telefono && <div style={{ fontSize: "0.82rem", color: "#8B7B6F" }}>{lead.telefono}</div>}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", color: "#B8A8A0" }}>{lead.mascota ?? "—"}</td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <select
                        value={lead.estado}
                        onChange={(e) => updateEstado(lead.id, e.target.value)}
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
                    <td style={{ padding: "1rem 1.25rem", color: "#8B7B6F", fontSize: "0.78rem" }}>
                      {new Date(lead.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <button
                        onClick={() => setExpandido(open ? null : lead.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: open ? "#E07B2B" : "#8B7B6F", fontWeight: 600, fontSize: "0.78rem", padding: "0.25rem 0.5rem", borderRadius: "4px", transition: "color 0.15s" }}
                      >
                        {open ? "↑ Cerrar" : "↓ Ver más"}
                      </button>
                    </td>
                  </tr>
                  {open && (
                    <tr key={`${lead.id}-detail`} style={{ borderBottom: "1px solid #321E12", borderLeft: "3px solid #E07B2B", background: "#241710" }}>
                      <td colSpan={6} style={{ padding: "1.25rem 1.5rem" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: "0.68rem", color: "#8B7B6F", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Mensaje</p>
                            <p style={{ fontSize: "0.85rem", color: "#B8A8A0", background: "#2A1F15", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #4D3A2E", lineHeight: 1.6 }}>{lead.mensaje ?? "—"}</p>
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: "0.68rem", color: "#8B7B6F", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Notas internas</p>
                            <textarea
                              defaultValue={lead.notas ?? ""}
                              onBlur={(e) => updateNotas(lead.id, e.target.value)}
                              style={{ width: "100%", minHeight: "80px", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #4D3A2E", background: "#2A1F15", color: "#ffffff", fontSize: "0.85rem", resize: "vertical", fontFamily: "inherit", outline: "none", lineHeight: 1.6 }}
                              placeholder="Agregar nota..."
                            />
                          </div>
                        </div>
                        <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
                          {lead.email && (
                            <a href={`mailto:${lead.email}`} style={{
                              display: "inline-flex", alignItems: "center", gap: "0.4rem",
                              padding: "0.4rem 0.9rem", borderRadius: "6px",
                              border: "1px solid #4D3A2E", background: "#2A1F15",
                              color: "#B8A8A0", fontSize: "0.8rem", fontWeight: 600,
                              textDecoration: "none", transition: "border-color 0.15s",
                            }}>
                              ✉ Email
                            </a>
                          )}
                          {lead.telefono && (
                            <a href={`https://wa.me/${lead.telefono.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" style={{
                              display: "inline-flex", alignItems: "center", gap: "0.4rem",
                              padding: "0.4rem 0.9rem", borderRadius: "6px",
                              background: "#E07B2B", color: "#ffffff",
                              fontSize: "0.8rem", fontWeight: 600,
                              textDecoration: "none",
                            }}>
                              WhatsApp
                            </a>
                          )}
                        </div>
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
