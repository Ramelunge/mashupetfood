"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function MaintenanceToggle({ initialActive, initialMensaje }: { initialActive: boolean; initialMensaje: string }) {
  const [active,  setActive]  = useState(initialActive)
  const [mensaje, setMensaje] = useState(initialMensaje)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const supabase = createClient()

  async function handleToggle(v: boolean) {
    setActive(v)
    await supabase.from("config").upsert({ key: "mantenimiento_activo", value: String(v) }, { onConflict: "key" })
  }

  async function handleSaveMensaje() {
    setSaving(true)
    await supabase.from("config").upsert({ key: "mantenimiento_mensaje", value: mensaje }, { onConflict: "key" })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ maxWidth: "560px", display: "flex", flexDirection: "column", gap: "1rem" }}>

      {/* Toggle card */}
      <div style={{ background: "#2A1F15", border: `1px solid ${active ? "rgba(239,68,68,0.3)" : "#4D3A2E"}`, borderRadius: "12px", padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <div>
            <h3 style={{ fontWeight: 600, color: "#ffffff", fontSize: "0.95rem", letterSpacing: "-0.01em" }}>Modo mantenimiento</h3>
            <p style={{ fontSize: "0.82rem", color: active ? "#F87171" : "#34D399", marginTop: "0.25rem", fontWeight: 600 }}>
              {active ? "Sitio EN MANTENIMIENTO" : "Sitio ONLINE"}
            </p>
          </div>
          <button
            onClick={() => handleToggle(!active)}
            style={{
              width: "52px", height: "28px", borderRadius: "14px", border: "none", cursor: "pointer",
              background: active ? "#E07B2B" : "#4D3A2E",
              position: "relative", transition: "background 0.2s", flexShrink: 0,
            }}
          >
            <span style={{
              position: "absolute", top: "3px",
              left: active ? "26px" : "3px",
              width: "22px", height: "22px", borderRadius: "50%",
              background: "#fff", transition: "left 0.2s",
              boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }} />
          </button>
        </div>

        {active && (
          <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "rgba(239,68,68,0.08)", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.2)" }}>
            <p style={{ fontSize: "0.82rem", color: "#F87171", fontWeight: 500 }}>
              El sitio público está bloqueado. Solo /admin está accesible.
            </p>
          </div>
        )}
      </div>

      {/* Mensaje card */}
      <div style={{ background: "#2A1F15", border: "1px solid #4D3A2E", borderRadius: "12px", padding: "1.5rem" }}>
        <label style={{ display: "block", fontWeight: 600, fontSize: "0.75rem", color: "#8B7B6F", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>
          Mensaje de mantenimiento
        </label>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          style={{ width: "100%", minHeight: "100px", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #4D3A2E", fontSize: "0.875rem", resize: "vertical", outline: "none", marginBottom: "0.75rem", background: "#1A1209", color: "#ffffff", fontFamily: "inherit" }}
          placeholder="Estamos actualizando el sitio. ¡Volvemos pronto!"
        />
        <button onClick={handleSaveMensaje} disabled={saving} style={{
          padding: "0.6rem 1.25rem", borderRadius: "8px", border: "none", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem",
          background: saved ? "#6BAF3C" : "#E07B2B", color: "#ffffff",
        }}>
          {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar mensaje"}
        </button>
      </div>
    </div>
  )
}
