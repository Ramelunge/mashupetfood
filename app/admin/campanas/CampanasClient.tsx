"use client"
import { useState, useTransition } from "react"
import { crearCampana, generarVideoHiggsfield, checkEstadoVideo, actualizarEstadoCampana, eliminarCampana } from "./actions"

interface Campana {
  id: string; nombre: string; descripcion?: string; tipo: string; estado: string
  plataformas: string[]; prompt?: string; aspecto: string; duracion_seg: number
  hf_job_id?: string; hf_video_url?: string; hf_thumbnail_url?: string; hf_error?: string
  notas?: string; fecha_inicio?: string; fecha_fin?: string; created_at: string
}

const ESTADOS: Record<string, { label: string; bg: string; color: string }> = {
  borrador:   { label: "Borrador",   bg: "#f3f4f6", color: "#6b7280" },
  generando:  { label: "Generando",  bg: "#fef9c3", color: "#854d0e" },
  listo:      { label: "Listo",      bg: "#dcfce7", color: "#166534" },
  publicado:  { label: "Publicado",  bg: "#dbeafe", color: "#1e40af" },
  error:      { label: "Error",      bg: "#fee2e2", color: "#991b1b" },
}

const PLATAFORMAS = ["Instagram", "Facebook", "TikTok", "WhatsApp", "YouTube"]

export default function CampanasClient({ campanas: init, hasApiKey }: { campanas: Campana[]; hasApiKey: boolean }) {
  const [campanas, setCampanas]   = useState<Campana[]>(init)
  const [showForm, setShowForm]   = useState(false)
  const [selected, setSelected]   = useState<Campana | null>(null)
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback]   = useState("")

  const cardStyle: React.CSSProperties = {
    background: "#fff", borderRadius: "var(--radius-card)",
    boxShadow: "var(--shadow-card)", overflow: "hidden",
  }

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
        msg("✅ Campaña creada")
      } catch (err: unknown) {
        msg(`❌ ${err instanceof Error ? err.message : "Error"}`)
      }
    })
  }

  async function handleGenerar(id: string) {
    startTransition(async () => {
      try {
        await generarVideoHiggsfield(id)
        setCampanas(prev => prev.map(c => c.id === id ? { ...c, estado: "generando" } : c))
        msg("🎬 Video enviado a Higgsfield — revisá el estado en unos segundos")
      } catch (err: unknown) {
        msg(`❌ ${err instanceof Error ? err.message : "Error"}`)
      }
    })
  }

  async function handleCheck(id: string) {
    startTransition(async () => {
      try {
        await checkEstadoVideo(id)
        msg("🔄 Estado actualizado")
        // refetch simple: reload
        window.location.reload()
      } catch (err: unknown) {
        msg(`❌ ${err instanceof Error ? err.message : "Error"}`)
      }
    })
  }

  async function handleEliminar(id: string) {
    if (!confirm("¿Eliminar esta campaña?")) return
    startTransition(async () => {
      await eliminarCampana(id)
      setCampanas(prev => prev.filter(c => c.id !== id))
      if (selected?.id === id) setSelected(null)
      msg("🗑️ Eliminada")
    })
  }

  async function handlePublicar(id: string) {
    startTransition(async () => {
      await actualizarEstadoCampana(id, "publicado")
      setCampanas(prev => prev.map(c => c.id === id ? { ...c, estado: "publicado" } : c))
      msg("🚀 Marcada como publicada")
    })
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.65rem 0.875rem", borderRadius: "8px",
    border: "1.5px solid var(--color-cream-dark)", fontSize: "0.9rem",
    background: "#fff", color: "var(--color-secondary)", outline: "none",
  }
  const labelStyle: React.CSSProperties = {
    fontSize: "0.75rem", fontWeight: 700, color: "var(--color-muted)",
    textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "0.35rem",
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-secondary)", marginBottom: "0.25rem" }}>
            🎬 Campañas
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "0.875rem" }}>
            Gestión de campañas + generación de video IA con Higgsfield
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ background: "var(--color-primary)", color: "#fff", border: "none", borderRadius: "var(--radius-full)", padding: "0.65rem 1.5rem", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}
        >
          + Nueva campaña
        </button>
      </div>

      {/* API Key warning */}
      {!hasApiKey && (
        <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: "var(--radius-md)", padding: "0.875rem 1.25rem", marginBottom: "1.5rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <span style={{ fontSize: "1.2rem" }}>⚠️</span>
          <p style={{ fontSize: "0.875rem", color: "#92400e" }}>
            <strong>API Key de Higgsfield no configurada.</strong> Andá a{" "}
            <a href="/admin/contenido/config" style={{ color: "var(--color-primary)", fontWeight: 600 }}>Configuración</a>{" "}
            y agregá tu clave para poder generar videos.
          </p>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div style={{ background: "var(--color-secondary)", color: "#fff", borderRadius: "var(--radius-md)", padding: "0.75rem 1.25rem", marginBottom: "1.25rem", fontSize: "0.875rem", fontWeight: 600 }}>
          {feedback}
        </div>
      )}

      {/* Formulario nueva campaña */}
      {showForm && (
        <div style={{ ...cardStyle, marginBottom: "2rem", padding: "2rem" }}>
          <h2 style={{ fontWeight: 800, color: "var(--color-secondary)", marginBottom: "1.5rem", fontSize: "1.1rem" }}>
            Nueva campaña
          </h2>
          <form onSubmit={handleCreate} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelStyle}>Nombre de la campaña *</label>
              <input name="nombre" required style={inputStyle} placeholder="Ej: Promo Mayo — Pack Gallinero" />
            </div>
            <div>
              <label style={labelStyle}>Tipo</label>
              <select name="tipo" style={inputStyle}>
                <option value="video">🎬 Video (Higgsfield)</option>
                <option value="imagen">🖼️ Imagen</option>
                <option value="texto">📝 Solo texto</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Plataformas (separadas por coma)</label>
              <input name="plataformas" style={inputStyle} placeholder="Instagram, Facebook, TikTok" />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelStyle}>Prompt para Higgsfield IA</label>
              <textarea name="prompt" rows={3} style={{ ...inputStyle, resize: "vertical" }}
                placeholder="Describe el video que quieras generar: escena, animales, ambiente, estilo cinematográfico..." />
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
              <label style={labelStyle}>Duración (segundos)</label>
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
              <label style={labelStyle}>Descripción / Notas internas</label>
              <textarea name="notas" rows={2} style={{ ...inputStyle, resize: "vertical" }} placeholder="Objetivo, audiencia, presupuesto..." />
            </div>
            <div style={{ gridColumn: "1/-1", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setShowForm(false)}
                style={{ background: "var(--color-cream-dark)", border: "none", borderRadius: "var(--radius-full)", padding: "0.65rem 1.25rem", fontWeight: 600, cursor: "pointer", color: "var(--color-secondary)" }}>
                Cancelar
              </button>
              <button type="submit" disabled={isPending}
                style={{ background: "var(--color-primary)", color: "#fff", border: "none", borderRadius: "var(--radius-full)", padding: "0.65rem 1.5rem", fontWeight: 700, cursor: "pointer" }}>
                {isPending ? "Creando..." : "Crear campaña"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Layout: lista + detalle */}
      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 420px" : "1fr", gap: "1.5rem", alignItems: "start" }}>

        {/* Lista */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {campanas.length === 0 ? (
            <div style={{ ...cardStyle, padding: "4rem 2rem", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎬</div>
              <p style={{ fontWeight: 600, color: "var(--color-secondary)", marginBottom: "0.5rem" }}>No hay campañas aún</p>
              <p style={{ color: "var(--color-muted)", fontSize: "0.875rem" }}>Creá tu primera campaña y generá videos con Higgsfield IA</p>
            </div>
          ) : campanas.map((c) => {
            const est = ESTADOS[c.estado] ?? ESTADOS.borrador
            const isSelected = selected?.id === c.id
            return (
              <div key={c.id}
                onClick={() => setSelected(isSelected ? null : c)}
                style={{
                  ...cardStyle,
                  border: isSelected ? "2px solid var(--color-primary)" : "2px solid transparent",
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                }}
              >
                <div style={{ padding: "1.25rem 1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  {/* Thumbnail o placeholder */}
                  <div style={{ width: "80px", height: "56px", borderRadius: "8px", background: c.hf_thumbnail_url ? "transparent" : "linear-gradient(135deg, #1A1209, #3B2A1A)", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {c.hf_thumbnail_url ? (
                      <img src={c.hf_thumbnail_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: "1.5rem" }}>🎬</span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem", flexWrap: "wrap" }}>
                      <h3 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-secondary)", margin: 0 }}>{c.nombre}</h3>
                      <span style={{ padding: "0.15rem 0.6rem", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 700, background: est.bg, color: est.color }}>
                        {est.label}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                      {c.plataformas?.map(p => (
                        <span key={p} style={{ fontSize: "0.72rem", color: "var(--color-muted)", background: "var(--color-cream)", padding: "0.1rem 0.5rem", borderRadius: "4px" }}>{p}</span>
                      ))}
                    </div>
                    {c.notas && <p style={{ fontSize: "0.8rem", color: "var(--color-muted)", marginTop: "0.35rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.notas}</p>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", flexShrink: 0 }}>
                    {c.estado === "borrador" && c.prompt && hasApiKey && (
                      <button onClick={(e) => { e.stopPropagation(); handleGenerar(c.id) }}
                        disabled={isPending}
                        style={{ background: "var(--color-primary)", color: "#fff", border: "none", borderRadius: "6px", padding: "0.4rem 0.75rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                        ▶ Generar
                      </button>
                    )}
                    {c.estado === "generando" && (
                      <button onClick={(e) => { e.stopPropagation(); handleCheck(c.id) }}
                        disabled={isPending}
                        style={{ background: "#f59e0b", color: "#fff", border: "none", borderRadius: "6px", padding: "0.4rem 0.75rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>
                        🔄 Revisar
                      </button>
                    )}
                    {c.estado === "listo" && (
                      <button onClick={(e) => { e.stopPropagation(); handlePublicar(c.id) }}
                        style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", padding: "0.4rem 0.75rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>
                        🚀 Publicar
                      </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); handleEliminar(c.id) }}
                      style={{ background: "none", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "6px", padding: "0.35rem 0.75rem", fontSize: "0.72rem", cursor: "pointer" }}>
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
          <div style={{ ...cardStyle, padding: "1.75rem", position: "sticky", top: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontWeight: 800, color: "var(--color-secondary)", fontSize: "1rem" }}>Detalle</h3>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--color-muted)" }}>✕</button>
            </div>

            {selected.hf_video_url ? (
              <div style={{ marginBottom: "1.25rem" }}>
                <video controls style={{ width: "100%", borderRadius: "10px", background: "#000" }}>
                  <source src={selected.hf_video_url} type="video/mp4" />
                </video>
                <a href={selected.hf_video_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: "block", textAlign: "center", marginTop: "0.75rem", color: "var(--color-primary)", fontWeight: 600, fontSize: "0.85rem" }}>
                  ⬇ Descargar video
                </a>
              </div>
            ) : selected.estado === "generando" ? (
              <div style={{ background: "#fef9c3", borderRadius: "10px", padding: "1.5rem", textAlign: "center", marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⏳</div>
                <p style={{ fontWeight: 600, color: "#854d0e", fontSize: "0.875rem" }}>Generando en Higgsfield...</p>
                <p style={{ color: "#92400e", fontSize: "0.8rem", marginTop: "0.25rem" }}>Suele tardar 30-120 segundos</p>
                <button onClick={() => handleCheck(selected.id)} disabled={isPending}
                  style={{ marginTop: "1rem", background: "#f59e0b", color: "#fff", border: "none", borderRadius: "6px", padding: "0.5rem 1.25rem", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}>
                  🔄 Verificar estado
                </button>
              </div>
            ) : selected.estado === "error" ? (
              <div style={{ background: "#fee2e2", borderRadius: "10px", padding: "1.25rem", marginBottom: "1.25rem" }}>
                <p style={{ fontWeight: 700, color: "#991b1b", marginBottom: "0.5rem" }}>❌ Error en generación</p>
                <p style={{ color: "#dc2626", fontSize: "0.8rem", wordBreak: "break-all" }}>{selected.hf_error}</p>
              </div>
            ) : (
              <div style={{ background: "var(--color-cream)", borderRadius: "10px", padding: "1.5rem", textAlign: "center", marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎬</div>
                <p style={{ color: "var(--color-muted)", fontSize: "0.875rem" }}>Sin video aún</p>
                {selected.prompt && hasApiKey && selected.estado === "borrador" && (
                  <button onClick={() => handleGenerar(selected.id)} disabled={isPending}
                    style={{ marginTop: "1rem", background: "var(--color-primary)", color: "#fff", border: "none", borderRadius: "6px", padding: "0.6rem 1.5rem", fontWeight: 700, cursor: "pointer" }}>
                    ▶ Generar con Higgsfield
                  </button>
                )}
              </div>
            )}

            {/* Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem" }}>
              {[
                { k: "Estado", v: ESTADOS[selected.estado]?.label ?? selected.estado },
                { k: "Tipo", v: selected.tipo },
                { k: "Aspecto", v: selected.aspecto },
                { k: "Duración", v: `${selected.duracion_seg} seg` },
                { k: "Plataformas", v: selected.plataformas?.join(", ") || "—" },
                { k: "Fecha inicio", v: selected.fecha_inicio ?? "—" },
                { k: "Fecha fin", v: selected.fecha_fin ?? "—" },
              ].map(({ k, v }) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--color-cream-dark)", paddingBottom: "0.5rem" }}>
                  <span style={{ color: "var(--color-muted)", fontWeight: 600 }}>{k}</span>
                  <span style={{ color: "var(--color-secondary)", fontWeight: 500, textAlign: "right" }}>{v}</span>
                </div>
              ))}
            </div>

            {selected.prompt && (
              <div style={{ marginTop: "1.25rem" }}>
                <p style={{ ...labelStyle, marginBottom: "0.5rem" }}>Prompt Higgsfield</p>
                <div style={{ background: "var(--color-cream)", borderRadius: "8px", padding: "0.875rem", fontSize: "0.82rem", color: "var(--color-secondary)", lineHeight: 1.6 }}>
                  {selected.prompt}
                </div>
              </div>
            )}

            {selected.hf_job_id && (
              <p style={{ marginTop: "1rem", fontSize: "0.72rem", color: "var(--color-muted)", wordBreak: "break-all" }}>
                Job ID: {selected.hf_job_id}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
