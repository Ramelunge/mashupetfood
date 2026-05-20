"use client"
import Link from "next/link"
import Image from "next/image"

interface Props {
  instagram?: string
  facebook?: string
  email?: string
  horario?: string
  whatsapp?: string
}

export default function Footer({ instagram, facebook, email, horario, whatsapp }: Props) {
  return (
    <footer style={{ background: "#1A1209", color: "rgba(255,248,240,0.75)", marginTop: "auto" }}>
      <div className="container-site" style={{ padding: "3.5rem 0 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2.5rem", marginBottom: "2.5rem" }}>

          {/* Marca */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
              <Image
                src="/products/Logo Isotipo.png"
                alt="Mashu Petfood"
                width={40}
                height={40}
                style={{ objectFit: "contain" }}
              />
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "var(--color-primary)", letterSpacing: "-0.02em" }}>
                Mashu<span style={{ color: "var(--color-primary-light)" }}>.</span>
              </span>
            </Link>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "rgba(255,248,240,0.55)", maxWidth: "260px" }}>
              Alimento premium para tu mascota. Hecho con ingredientes naturales y el amor que se merecen.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,248,240,0.75)", textDecoration: "none", transition: "background 0.2s, color 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--color-primary)"; e.currentTarget.style.color = "#fff" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,248,240,0.75)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              )}
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,248,240,0.75)", textDecoration: "none", transition: "background 0.2s, color 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--color-primary)"; e.currentTarget.style.color = "#fff" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,248,240,0.75)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ color: "var(--color-primary)", fontWeight: 700, marginBottom: "1rem", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.10em" }}>Sitio</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[["Inicio", "/"], ["Catálogo", "/catalogo"], ["Novedades", "/novedades"], ["Contacto", "/contacto"]].map(([label, href]) => (
                <li key={href}>
                  <Link href={href}
                    style={{ color: "rgba(255,248,240,0.55)", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--color-primary-light)"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,248,240,0.55)"}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 style={{ color: "var(--color-primary)", fontWeight: 700, marginBottom: "1rem", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.10em" }}>Contacto</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
              {email && (
                <li style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <span style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "1px" }}>✉</span>
                  <span style={{ color: "rgba(255,248,240,0.60)", wordBreak: "break-all" }}>{email}</span>
                </li>
              )}
              {whatsapp && (
                <li style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <span style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "1px" }}>📱</span>
                  <span style={{ color: "rgba(255,248,240,0.60)" }}>+{whatsapp}</span>
                </li>
              )}
              {horario && (
                <li style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <span style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "1px" }}>🕐</span>
                  <span style={{ color: "rgba(255,248,240,0.60)", whiteSpace: "pre-line" }}>{horario}</span>
                </li>
              )}
              {!email && !whatsapp && !horario && (
                <li style={{ color: "rgba(255,248,240,0.35)", fontSize: "0.82rem" }}>Próximamente</li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <p style={{ fontSize: "0.8rem", color: "rgba(255,248,240,0.30)" }}>
            © {new Date().getFullYear()} Mashu Petfood. Todos los derechos reservados.
          </p>
          <Link
            href="/admin/login"
            style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.15)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.15)"}
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
