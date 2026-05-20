"use client"
import Image from "next/image"
import { useCartStore } from "@/store/cart"
import { useEffect, useState } from "react"

export default function QuoteCart() {
  const { items, isOpen, close, remove, updateQty, clear, count } = useCartStore()
  const [waNum, setWaNum] = useState("549XXXXXXXXXX")
  const [waMsg, setWaMsg] = useState("Hola Mashu! Quiero cotizar:")

  useEffect(() => {
    fetch("/api/config?keys=whatsapp_numero,whatsapp_mensaje_default")
      .then((r) => r.json())
      .then((d) => {
        if (d.whatsapp_numero) setWaNum(d.whatsapp_numero)
        if (d.whatsapp_mensaje_default) setWaMsg(d.whatsapp_mensaje_default)
      })
      .catch(() => {})
  }, [])

  function handleWhatsApp() {
    const lineas = items.map((i) => `• ${i.nombre}${i.variante ? ` (${i.variante})` : ""} x${i.cantidad}`).join("\n")
    const texto = encodeURIComponent(`${waMsg}\n\n${lineas}`)
    window.open(`https://wa.me/${waNum}?text=${texto}`, "_blank")
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 98, backdropFilter: "blur(2px)" }}
      />

      {/* Panel */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(420px, 95vw)",
          background: "#fff",
          zIndex: 99,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.15)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--color-cream-dark)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--color-secondary)" }}>
              Lista de cotización
            </h2>
            <p style={{ fontSize: "0.82rem", color: "var(--color-muted)" }}>{count()} {count() === 1 ? "producto" : "productos"}</p>
          </div>
          <button onClick={close} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem", color: "var(--color-muted)" }}>×</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-muted)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛒</div>
              <p style={{ fontWeight: 500 }}>Tu lista está vacía</p>
              <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>Explorá el catálogo y agregá productos para cotizar</p>
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
              {items.map((item) => (
                <li key={`${item.id}-${item.variante}`} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  {item.imagen_url && (
                    <div style={{ width: "56px", height: "56px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, background: "var(--color-cream)" }}>
                      <Image src={item.imagen_url} alt={item.nombre} width={56} height={56} style={{ objectFit: "contain" }} />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--color-secondary)", margin: 0 }}>{item.nombre}</p>
                    {item.variante && <p style={{ fontSize: "0.78rem", color: "var(--color-muted)", margin: "0.15rem 0 0" }}>{item.variante}</p>}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                      <button onClick={() => updateQty(item.id, item.variante, item.cantidad - 1)} style={{ width: "24px", height: "24px", borderRadius: "4px", border: "1px solid var(--color-cream-dark)", background: "none", cursor: "pointer", fontWeight: 700 }}>−</button>
                      <span style={{ fontSize: "0.9rem", fontWeight: 600, minWidth: "1.5rem", textAlign: "center" }}>{item.cantidad}</span>
                      <button onClick={() => updateQty(item.id, item.variante, item.cantidad + 1)} style={{ width: "24px", height: "24px", borderRadius: "4px", border: "1px solid var(--color-cream-dark)", background: "none", cursor: "pointer", fontWeight: 700 }}>+</button>
                    </div>
                  </div>
                  <button onClick={() => remove(item.id, item.variante)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-muted)", fontSize: "1.1rem", padding: "0.25rem", flexShrink: 0 }} aria-label="Eliminar">×</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "1.25rem", borderTop: "1px solid var(--color-cream-dark)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {items.length > 0 && (
            <>
              <button onClick={handleWhatsApp} className="btn-primary" style={{ justifyContent: "center", fontSize: "1rem", padding: "0.9rem" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.12 1.535 5.847L.06 23.4l5.703-1.457A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.933 0-3.74-.5-5.312-1.373l-.382-.226-3.96 1.012 1.042-3.85-.248-.396A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                Cotizar por WhatsApp
              </button>
              <button onClick={clear} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-muted)", fontSize: "0.82rem", textDecoration: "underline" }}>
                Vaciar lista
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  )
}
