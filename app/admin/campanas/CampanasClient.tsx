"use client"
import { useState, useTransition } from "react"
import { crearCampana, generarVideoHiggsfield, checkEstadoVideo, actualizarEstadoCampana, eliminarCampana } from "./actions"

interface Campana {
  id: string; nombre: string; descripcion?: string; tipo: string; estado: string
  plataformas: string[]; prompt?: string; aspecto: string; duracion_seg: number
  hf_job_id?: string; hf_video_url?: string; hf_thumbnail_url?: string; hf_error?: string
  notas?: string; fecha_inicio?: string; fecha_fin?: string; created_at: string
}

const ESTADOS: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  borrador:  { label: "Borrador",  bg: "rgba(255,255,255,0.06)", color: "#8B7B6F", dot: "#8B7B6F" },
  generando: { label: "Generando", bg: "rgba(245,158,11,0.12)",  color: "#F59E0B", dot: "#F59E0B" },
  listo:     { label: "Listo",     bg: "rgba(16,185,129,0.12)",  color: "#34D399", dot: "#34D399" },
  publicado: { label: "Publicado", bg: "rgba(99,102,241,0.12)",  color: "#818CF8", dot: "#818CF8" },
  error:     { label: "Error",     bg: "rgba(239,68,68,0.12)",   color: "#F87171", dot: "#F87171" },
}

export default function CampanasClient({ campanas: init, hasApiKey }: { campanas: Campana[]; hasApiKey: boolean }) {
  const [campanas, setCampanas]   = useState<Campana[]>(init)
  const [showForm, setShowForm]   = useState(false)
  const [selected, setSelected]   = useState<Campana | null>(null)
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback]   = useState("")

  function msg(text: string) {
    setFeedback(text)
    setTimeout(() => setFeedback(""), 3500)
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        const nueva = await crearCampana(fd) as Campana
        setCampanas(prev => [nueva, ...prev])
        setShowForm(false)
        msg("Campaña creada")
      } catch (err: unknown) {
        msg(err instanceof Error ? err.message : "Error")
      }
    })
  }

  async function handleGenerar(id: string) {
    startTransition(async () => {
      try {
        await generarVideoHiggsfield(id)
        setCampanas(prev => prev.map(c => c.id === id ? { ...c, estado: "generando" } : c))
        msg("Video enviado a Higgsfield")
      } catch (err: unknown) {
        msg(err instanceof Error ? err.message : "Error")
      }
    })
  }

  async function handleCheck(id: string) {
    startTransition(async () => {
      try {
        await checkEstadoVideo(id)
        msg("Estado actualizado")
        window.location.reload()
      } catch (err: unknown) {
        msg(err instanceof Error ? err.message : "Error")
      }
    })
  }

  async function handleEliminar(id: string) {
    if (!confirm("¿Eliminar esta campaña?")) return
    startTransition(async () => {
      await eliminarCampana(id)
      setCampanas(prev => prev.filter(c => c.id !== id))
      if (selected?.id === id) setSelected(null)
      msg("Eliminada")
    })
  }

  async function handlePublicar(id: string) {
    startTransition(async () => {
      await actualizarEstadoCampana(id, "publicado")
      setCampanas(prev => prev.map(c => c.id === id ? { ...c, estado: "publicado" } : c))
      msg("Marcada como publicada")
    })
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.65rem 0.875rem", borderRadius: "8px",
    border: "1px solid #4D3A2E", fontSize: "0.875rem",
    background: "#1A1209", color: "#ffffff", outline: "none",
    fontFamily: "inherit",
  }
  const labelStyle: React.CSSProperties = {
    fontSize: "0.68rem", fontWeight: 700, color: "#8B7B6F",
    textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.35rem",
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#8B7B6F", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Marketing</p>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Campañas</h1>
          <p style={{ color: "#8B7B6F", fontSize: "0.85rem", marginTop: "0.25rem" }}>Gestión de campañas + generación de video IA con Higgsfield</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ background: "#E07B2B", color: "#fff", border: "none", borderRadius: "8px", padding: "0.65rem 1.25rem", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}
        >
          + Nueva campaña
        </button>
      </div>

      {/* API Key warning */}
      {!hasApiKey && (
        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "10px", padding: "0.875rem 1.25rem", marginBottom: "1.5rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <span style={{ fontSize: "1rem" }}>⚠</span>
          <p style={{ fontSize: "0.85rem", color: "#F59E0B" }}>
            <strong>API Key de Higgsfield no configurada.</strong>{" "}
            <a href="/admin/contenido/config" style={{ color: "#E07B2B", fontWeight: 600 }}>Ir a Configuración →</a>
          </p>
        </div>
      )}

      {/* Feedback toast */}
      {feedback && (
        <div style={{ background: "#2A1F15", border: "1px solid #4D3A2E", color: "#B8A8A0", borderRadius: "8px", padding: "0.75rem 1.25rem", marginBottom: "1.25rem", fontSize: "0.85rem", fontWeight: 600 }}>
          {feedback}
        </div>
      )}

      {/* Nueva campaña form */}
      {showForm && (
        <div style={{ background: "#2A1F15", border: "1px solid #4D3A2E", borderRadius: "12px", padding: "2rem", marginBottom: "1.75rem" }}>
          <h2 style={{ fontWeight: 700, color: "#ffffff", marginBottom: "1.5rem", fontSize: "1rem", letterSpacing: "-0.01em" }}>
            Nueva campaña
          </h2>
          <form onSubmit={handleCreate} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelStyle}>Nombre *</label>
              <input name="nombre" required style={inputStyle} placeholder="Ej: Promo Mayo — Pack Gallinero" />
            </div>
            <div>
              <label style={labelStyle}>Tipo</label>
              <select name="tipo" style={inputStyle}>
                <option value="video">Video (Higgsfield)</option>
                <option value="imagen">Imagen</option>
                <option value="texto">Solo texto</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Plataformas (separadas por coma)</label>
              <input name="plataformas" style={inputStyle} placeholder="Instagram, Facebook, TikTok" />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelStyle}>Prompt para Higgsfield</label>
              <textarea name="prompt" rows={3} style={{ ...inputStyle, resize: "vertical" }}
                placeholder="Describe el video: escena, animales, ambiente, estilo..." />
            </div>
            <div>
              <label style={labelStyle}>Aspecto</label>
              <select name="aspecto" style={inputStyle}>
                <option value="9:16">9:16 — Vertical (Stories/Reels)</option>
                <option value="16:9">16:9 — Horizontal (YouTube)</option>
                <option value="1:1">1:1 — Cuadrado</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Duración</label>
              <select name="duracion_seg" style={inputStyle}>
                <option value="5">5 seg</option>
                <option value="10">10 seg</option>
                <option value="15">15 seg</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Fecha inicio</label>
              <input type="date" name="fecha_inicio" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Fecha fin</label>
              <input type="date" name="fecha_fin" style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelStyle}>Notas internas</label>
              <textarea name="notas" rows={2} style={{ ...inputStyle, resize: "vertical" }} placeholder="Objetivo, audiencia, presupuesto..." />
            </div>
            <div style={{ gridColumn: "1/-1", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setShowForm(false)}
                style={{ background: "transparent", border: "1px solid #4D3A2E", borderRadius: "8px", padding: "0.6rem 1.25rem", fontWeight: 600, cursor: "pointer", color: "#B8A8A0", fontFamily: "inherit" }}>
                Cancelar
              </button>
              <button type="submit" disabled={isPending}
                style={{ background: "#E07B2B", color: "#fff", border: "none", borderRadius: "8px", padding: "0.6rem 1.5rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                {isPending ? "Creando..." : "Crear campaña"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista + detalle */}
      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 400px" : "1fr", gap: "1.25rem", alignItems: "start" }}>

        {/* Lista */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {campanas.length === 0 ? (
            <div style={{ background: "#2A1F15", border: "1px solid #4D3A2E", borderRadius: "12px", padding: "4rem 2rem", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem", opacity: 0.4 }}>◉</div>
              <p style={{ fontWeight: 600, color: "#ffffff", marginBottom: "0.4rem" }}>No hay campañas aún</p>
              <p style={{ color: "#8B7B6F", fontSize: "0.85rem" }}>Creá tu primera campaña y generá videos con Higgsfield IA</p>
            </div>
          ) : campanas.map((c) => {
            const est = ESTADOS[c.estado] ?? ESTADOS.borrador
            const isSelected = selected?.id === c.id
            return (
              <div key={c.id}
                onClick={() => setSelected(isSelected ? null : c)}
                style={{
                  background: "#2A1F15",
                  border: `1px solid ${isSelected ? "#E07B2B" : "#4D3A2E"}`,
                  borderLeft: isSelected ? "3px solid #E07B2B" : "3px solid transparent",
                  borderRadius: "12px", cursor: "pointer", transition: "border-color 0.15s", overflow: "hidden",
                }}
              >
                <div style={{ padding: "1.25rem 1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{ width: "72px", height: "48px", borderRadius: "6px", background: c.hf_thumbnail_url ? "transparent" : "#1A1209", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {c.hf_thumbnail_url
                      ? <img src={c.hf_thumbnail_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ fontSize: "1.25rem", opacity: 0.4 }}>▶</span>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem", flexWrap: "wrap" }}>
                      <h3 style={{ fontWeight: 600, fontSize: "0.9rem", color: "#ffffff", margin: 0 }}>{c.nombre}</h3>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.15rem 0.6rem", borderRadius: "20px", fontSize: "0.7rem", fontWeight: 600, background: est.bg, color: est.color }}>
                        <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: est.dot }} />
                        {est.label}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {c.plataformas?.map(p => (
                        <span key={p} style={{ fontSize: "0.7rem", color: "#8B7B6F", background: "rgba(255,255,255,0.05)", padding: "0.1rem 0.45rem", borderRadius: "4px" }}>{p}</span>
                      ))}
                    </div>
                    {c.notas && <p style={{ fontSize: "0.78rem", color: "#8B7B6F", marginTop: "0.3rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "400px" }}>{c.notas}</p>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                    {c.estado === "borrador" && c.prompt && hasApiKey && (
                      <button onClick={() => handleGenerar(c.id)} disabled={isPending}
                        style={{ background: "#E07B2B", color: "#fff", border: "none", borderRadius: "6px", padding: "0.4rem 0.8rem", fontSize: "0.73rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>
                        Generar
                      </button>
                    )}
                    {c.estado === "generando" && (
                      <button onClick={() => handleCheck(c.id)} disabled={isPending}
                        style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "6px", padding: "0.4rem 0.8rem", fontSize: "0.73rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                        Revisar
                      </button>
                    )}
                    {c.estado === "listo" && (
                      <button onClick={() => handlePublicar(c.id)}
                        style={{ background: "rgba(99,102,241,0.15)", color: "#818CF8", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "6px", padding: "0.4rem 0.8rem", fontSize: "0.73rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                        Publicar
                      </button>
                    )}
                    <button onClick={() => handleEliminar(c.id)}
                      style={{ background: "none", border: "1px solid rgba(239,68,68,0.25)", color: "#F87171", borderRadius: "6px", padding: "0.35rem 0.8rem", fontSize: "0.7rem", cursor: "pointer", fontFamily: "inherit" }}>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Panel detalle */}
        {selected && (
          <div style={{ background: "#2A1F15", border: "1px solid #4D3A2E", borderRadius: "12px", padding: "1.5rem", position: "sticky", top: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontWeight: 600, color: "#ffffff", fontSize: "0.9rem" }}>Detalle</h3>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: "1rem", cursor: "pointer", color: "#8B7B6F", lineHeight: 1 }}>✕</button>
            </div>

            {selected.hf_video_url ? (
              <div style={{ marginBottom: "1.25rem" }}>
                <video controls style={{ width: "100%", borderRadius: "8px", background: "#000" }}>
                  <source src={selected.hf_video_url} type="video/mp4" />
                </video>
                <a href={selected.hf_video_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: "block", textAlign: "center", marginTop: "0.75rem", color: "#E07B2B", fontWeight: 600, fontSize: "0.82rem" }}>
                  Descargar video →
                </a>
              </div>
            ) : selected.estado === "generando" ? (
              <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "10px", padding: "1.5rem", textAlign: "center", marginBottom: "1.25rem" }}>
                <p style={{ fontWeight: 600, color: "#F59E0B", fontSize: "0.875rem" }}>Generando en Higgsfield...</p>
                <p style={{ color: "#8B7B6F", fontSize: "0.78rem", marginTop: "0.25rem" }}>Suele tardar 30–120 segundos</p>
                <button onClick={() => handleCheck(selected.id)} disabled={isPending}
                  style={{ marginTop: "1rem", background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "6px", padding: "0.5rem 1.25rem", fontWeight: 600, cursor: "pointer", fontSize: "0.82rem", fontFamily: "inherit" }}>
                  Verificar estado
                </button>
              </div>
            ) : selected.estado === "error" ? (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "1.25rem", marginBottom: "1.25rem" }}>
                <p style={{ fontWeight: 700, color: "#F87171", marginBottom: "0.5rem", fontSize: "0.85rem" }}>Error en generación</p>
                <p style={{ color: "#F87171", fontSize: "0.78rem", wordBreak: "break-all", opacity: 0.8 }}>{selected.hf_error}</p>
              </div>
            ) : (
              <div style={{ background: "#1A1209", borderRadius: "10px", padding: "1.5rem", textAlign: "center", marginBottom: "1.25rem" }}>
                <span style={{ fontSize: "2rem", opacity: 0.2, display: "block", marginBottom: "0.5rem" }}>▶</span>
                <p style={{ color: "#8B7B6F", fontSize: "0.85rem" }}>Sin video aún</p>
                {selected.prompt && hasApiKey && selected.estado === "borrador" && (
                  <button onClick={() => handleGenerar(selected.id)} disabled={isPending}
                    style={{ marginTop: "1rem", background: "#E07B2B", color: "#fff", border: "none", borderRadius: "6px", padding: "0.6rem 1.5rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    Generar con Higgsfield
                  </button>
                )}
              </div>
            )}

            {/* Info rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0", fontSize: "0.82rem" }}>
              {[
                { k: "Estado",      v: ESTADOS[selected.estado]?.label ?? selected.estado },
                { k: "Tipo",        v: selected.tipo },
                { k: "Aspecto",     v: selected.aspecto },
                { k: "Duración",    v: `${selected.duracion_seg} seg` },
                { k: "Plataformas", v: selected.plataformas?.join(", ") || "—" },
                { k: "Inicio",      v: selected.fecha_inicio ?? "—" },
                { k: "Fin",         v: selected.fecha_fin ?? "—" },
              ].map(({ k, v }) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0", borderBottom: "1px solid #321E12" }}>
                  <span style={{ color: "#8B7B6F", fontWeight: 600 }}>{k}</span>
                  <span style={{ color: "#B8A8A0", textAlign: "right", maxWidth: "60%" }}>{v}</span>
                </div>
              ))}
            </div>

            {selected.prompt && (
              <div style={{ marginTop: "1.25rem" }}>
                <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#8B7B6F", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Prompt</p>
                <div style={{ background: "#1A1209", borderRadius: "8px", padding: "0.875rem", fontSize: "0.8rem", color: "#B8A8A0", lineHeight: 1.6, border: "1px solid #321E12" }}>
                  {selected.prompt}
                </div>
              </div>
            )}

            {selected.hf_job_id && (
              <p style={{ marginTop: "1rem", fontSize: "0.68rem", color: "#8B7B6F", wordBreak: "break-all" }}>
                Job ID: {selected.hf_job_id}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
