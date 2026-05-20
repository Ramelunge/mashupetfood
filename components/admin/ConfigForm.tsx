"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

const CAMPOS = [
  { key: "whatsapp_numero", label: "WhatsApp (sin + ni espacios)", placeholder: "5491112345678", tipo: "text" },
  { key: "whatsapp_mensaje_default", label: "Mensaje default del carrito", placeholder: "Hola Mashu! Quiero cotizar:", tipo: "text" },
  { key: "email_contacto", label: "Email de contacto", placeholder: "hola@mashu.com.ar", tipo: "email" },
  { key: "horario", label: "Horario de atención", placeholder: "Lun-Vie 9:00-18:00\nSáb 9:00-13:00", tipo: "textarea" },
  { key: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/mashu", tipo: "url" },
  { key: "facebook", label: "Facebook URL", placeholder: "https://facebook.com/mashu", tipo: "url" },
]

export default function ConfigForm({ initialConfig }: { initialConfig: Record<string, string> }) {
  const [values, setValues] = useState(initialConfig)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const supabase = createClient()

  async function saveField(key: string) {
    setSaving(key)
    await supabase.from("config").upsert({ key, value: values[key] ?? "" }, { onConflict: "key" })
    setSaving(null)
    setSaved(key)
    setTimeout(() => setSaved(null), 2000)
  }

  const inputStyle: React.CSSProperties = {
    flex: 1, padding: "0.65rem 1rem", borderRadius: "var(--radius-btn)",
    border: "1.5px solid var(--color-cream-dark)", fontSize: "0.9rem", outline: "none",
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "640px" }}>
      {CAMPOS.map((campo) => (
        <div key={campo.key} style={{ background: "#fff", borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)", padding: "1.25rem" }}>
          <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "var(--color-secondary)", marginBottom: "0.5rem" }}>
            {campo.label}
          </label>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            {campo.tipo === "textarea" ? (
              <textarea
                style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                value={values[campo.key] ?? ""}
                onChange={(e) => setValues({ ...values, [campo.key]: e.target.value })}
                placeholder={campo.placeholder}
              />
            ) : (
              <input
                type={campo.tipo}
                style={inputStyle}
                value={values[campo.key] ?? ""}
                onChange={(e) => setValues({ ...values, [campo.key]: e.target.value })}
                placeholder={campo.placeholder}
              />
            )}
            <button
              onClick={() => saveField(campo.key)}
              disabled={saving === campo.key}
              className="btn-primary"
              style={{ padding: "0.65rem 1.1rem", fontSize: "0.85rem", whiteSpace: "nowrap", background: saved === campo.key ? "var(--color-accent)" : undefined }}
            >
              {saving === campo.key ? "..." : saved === campo.key ? "✓ Guardado" : "Guardar"}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
