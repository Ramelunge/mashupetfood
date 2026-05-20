"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

const CAMPOS = [
  { key: "whatsapp_numero",           label: "WhatsApp (sin + ni espacios)",   placeholder: "5491112345678",               tipo: "text"     },
  { key: "whatsapp_mensaje_default",  label: "Mensaje default del carrito",    placeholder: "Hola Mashu! Quiero cotizar:", tipo: "text"     },
  { key: "email_contacto",            label: "Email de contacto",              placeholder: "hola@mashu.com.ar",           tipo: "email"    },
  { key: "horario",                   label: "Horario de atención",            placeholder: "Lun-Vie 9:00-18:00",          tipo: "textarea" },
  { key: "instagram",                 label: "Instagram URL",                  placeholder: "https://instagram.com/mashu", tipo: "url"      },
  { key: "facebook",                  label: "Facebook URL",                   placeholder: "https://facebook.com/mashu",  tipo: "url"      },
  { key: "higgsfield_api_key",        label: "API Key — Higgsfield IA",        placeholder: "hf_...",                      tipo: "password" },
]

export default function ConfigForm({ initialConfig }: { initialConfig: Record<string, string> }) {
  const [values, setValues]   = useState(initialConfig)
  const [saving, setSaving]   = useState<string | null>(null)
  const [saved,  setSaved]    = useState<string | null>(null)
  const supabase = createClient()

  async function saveField(key: string) {
    setSaving(key)
    await supabase.from("config").upsert({ key, value: values[key] ?? "" }, { onConflict: "key" })
    setSaving(null)
    setSaved(key)
    setTimeout(() => setSaved(null), 2000)
  }

  const inputStyle: React.CSSProperties = {
    flex: 1, padding: "0.65rem 1rem", borderRadius: "8px",
    border: "1px solid #4D3A2E", fontSize: "0.875rem", outline: "none",
    background: "#1A1209", color: "#ffffff", fontFamily: "inherit",
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "640px" }}>
      {CAMPOS.map((campo) => (
        <div key={campo.key} style={{ background: "#2A1F15", border: "1px solid #4D3A2E", borderRadius: "10px", padding: "1.25rem" }}>
          <label style={{ display: "block", fontWeight: 600, fontSize: "0.78rem", color: "#8B7B6F", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>
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
              style={{
                padding: "0.65rem 1.1rem", fontSize: "0.82rem", whiteSpace: "nowrap",
                borderRadius: "8px", border: "none", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                background: saved === campo.key ? "#6BAF3C" : "#E07B2B",
                color: "#ffffff",
              }}
            >
              {saving === campo.key ? "..." : saved === campo.key ? "✓ Guardado" : "Guardar"}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
