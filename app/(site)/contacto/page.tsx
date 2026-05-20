import type { Metadata } from "next"
import ContactForm from "@/components/site/ContactForm"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Contacto — Mashu Petfood" }

export default async function ContactoPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("config").select("key,value").in("key", ["whatsapp_numero", "email_contacto", "horario"])
  const cfg = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]))

  return (
    <div style={{ padding: "4rem 0 6rem", background: "#F0E6D4" }}>
      <div className="container-site" style={{ maxWidth: "960px" }}>

        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="section-label">Contacto</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "var(--color-secondary)", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
            Hablemos
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "1rem", lineHeight: 1.7 }}>
            Respondemos en menos de 24 horas. Por WhatsApp incluso más rápido.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "start" }} className="contact-grid">
          {/* Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ background: "#ffffff", borderRadius: "var(--radius-lg)", padding: "2rem", border: "1px solid #EDE0D0", boxShadow: "0 1px 8px rgba(58,42,26,0.07)" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "1.5rem", fontSize: "1.1rem" }}>
                Información de contacto
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {cfg.email_contacto && (
                  <div style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "var(--color-primary-surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>✉️</div>
                    <div>
                      <p style={{ fontWeight: 600, color: "var(--color-secondary)", fontSize: "0.85rem", marginBottom: "0.2rem" }}>Email</p>
                      <a href={`mailto:${cfg.email_contacto}`} style={{ color: "var(--color-primary)", textDecoration: "none", fontSize: "0.9rem" }}>{cfg.email_contacto}</a>
                    </div>
                  </div>
                )}
                {cfg.whatsapp_numero && (
                  <div style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "var(--color-primary-surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>📱</div>
                    <div>
                      <p style={{ fontWeight: 600, color: "var(--color-secondary)", fontSize: "0.85rem", marginBottom: "0.2rem" }}>WhatsApp</p>
                      <a href={`https://wa.me/${cfg.whatsapp_numero}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", textDecoration: "none", fontSize: "0.9rem" }}>+{cfg.whatsapp_numero}</a>
                    </div>
                  </div>
                )}
                {cfg.horario && (
                  <div style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "var(--color-primary-surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>🕐</div>
                    <div>
                      <p style={{ fontWeight: 600, color: "var(--color-secondary)", fontSize: "0.85rem", marginBottom: "0.2rem" }}>Horario</p>
                      <p style={{ color: "var(--color-muted)", fontSize: "0.9rem", whiteSpace: "pre-line" }}>{cfg.horario}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {cfg.whatsapp_numero && (
              <a
                href={`https://wa.me/${cfg.whatsapp_numero}?text=Hola+Mashu!+Quiero+consultar+sobre+sus+productos.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ justifyContent: "center", padding: "1rem 1.5rem", fontSize: "1rem", gap: "0.625rem" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.12 1.535 5.847L.06 23.4l5.703-1.457A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.933 0-3.74-.5-5.312-1.373l-.382-.226-3.96 1.012 1.042-3.85-.248-.396A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                Escribir por WhatsApp
              </a>
            )}
          </div>

          {/* Formulario */}
          <ContactForm />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
