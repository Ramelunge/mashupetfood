"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function MaintenanceToggle({ initialActive, initialMensaje }: { initialActive: boolean; initialMensaje: string }) {
  const [active, setActive] = useState(initialActive)
  const [mensaje, setMensaje] = useState(initialMensaje)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
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
    <div style={{ maxWidth: "560px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Toggle */}
      <div style={{ background: "#fff", borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)", padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <div>
            <h3 style={{ fontWeight: 700, color: "var(--color-secondary)" }}>Modo mantenimiento</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--color-muted)", marginTop: "0.25rem" }}>
              {active ? "🔴 El sitio está EN MANTENIMIENTO" : "🟢 El sitio está ONLINE"}
            </p>
          </div>
          <button
            onClick={() => handleToggle(!active)}
            style={{
              width: "52px", height: "28px", borderRadius: "14px", border: "none", cursor: "pointer",
              background: active ? "var(--color-primary)" : "var(--color-cream-dark)",
              position: "relative", transition: "background 0.2s", flexShrink: 0,
            }}
          >
            <span style={{
              position: "absolute", top: "3px",
              left: active ? "26px" : "3px",
              width: "22px", height: "22px", borderRadius: "50%",
              background: "#fff", transition: "left 0.2s",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            }} />
          </button>
        </div>

        {active && (
          <div style={{ marginTop: "1rem", padding: "0.75rem", background: "#fff4e5", borderRadius: "8px", border: "1px solid #f6c87a" }}>
            <p style={{ fontSize: "0.82rem", color: "#854d0e", fontWeight: 500 }}>
              ⚠️ El sitio público está bloqueado. Solo /admin está accesible.
            </p>
          </div>
        )}
      </div>

      {/* Mensaje */}
      <div style={{ background: "#fff", borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)", padding: "1.5rem" }}>
        <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "var(--color-secondary)", marginBottom: "0.5rem" }}>
          Mensaje de mantenimiento
        </label>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          style={{ width: "100%", minHeight: "100px", padding: "0.75rem", borderRadius: "var(--radius-btn)", border: "1.5px solid var(--color-cream-dark)", fontSize: "0.9rem", resize: "vertical", outline: "none", marginBottom: "0.75rem" }}
          placeholder="Estamos actualizando el sitio. ¡Volvemos pronto!"
        />
        <button onClick={handleSaveMensaje} disabled={saving} className="btn-primary" style={{ padding: "0.6rem 1.25rem", background: saved ? "var(--color-accent)" : undefined }}>
          {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar mensaje"}
        </button>
      </div>
    </div>
  )
}
