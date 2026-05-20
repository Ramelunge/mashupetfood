"use client"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useCartStore } from "@/store/cart"

const links = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/novedades", label: "Novedades" },
  { href: "/contacto", label: "Contacto" },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled]  = useState(false)
  const { count, toggle }        = useCartStore()
  const qty = count()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: scrolled ? "rgba(20,12,4,0.98)" : "rgba(26,18,9,0.90)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      borderBottom: "1px solid rgba(224,123,43,0.15)",
      transition: "background 300ms, box-shadow 300ms",
      boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.30)" : "none",
    }}>
      <div className="container-site" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none", flexShrink: 0 }}>
          <Image src="/products/Logo Isotipo.png" alt="Mashu" width={36} height={36} style={{ objectFit: "contain" }} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.2rem", color: "var(--color-primary)", letterSpacing: "-0.02em" }}>
            Mashu<span style={{ color: "var(--color-primary-light)" }}>.</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav style={{ display: "flex", gap: "0.25rem", alignItems: "center" }} className="nav-desktop">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                padding: "0.45rem 0.9rem",
                borderRadius: "var(--radius-full)",
                color: "rgba(255,248,240,0.78)",
                fontWeight: 500,
                fontSize: "0.9rem",
                textDecoration: "none",
                transition: "background 150ms, color 150ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(224,123,43,0.12)"
                e.currentTarget.style.color = "var(--color-primary-light)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent"
                e.currentTarget.style.color = "rgba(255,248,240,0.78)"
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* Cart */}
          <button
            onClick={toggle}
            aria-label={`Carrito de cotización — ${qty} productos`}
            style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: "0.5rem", color: "rgba(255,248,240,0.78)", borderRadius: "var(--radius-full)", transition: "background 150ms, color 150ms" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(224,123,43,0.12)"
              e.currentTarget.style.color = "var(--color-primary-light)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.color = "rgba(255,248,240,0.78)"
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {qty > 0 && (
              <span style={{ position: "absolute", top: "2px", right: "2px", background: "var(--color-primary)", color: "#fff", fontSize: "0.6rem", fontWeight: 800, minWidth: "17px", height: "17px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
                {qty > 9 ? "9+" : qty}
              </span>
            )}
          </button>

          {/* CTA desktop */}
          <Link href="/contacto" className="btn btn-primary btn-sm nav-cta">
            Cotizar →
          </Link>

          {/* Hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,248,240,0.85)", padding: "0.5rem", borderRadius: "var(--radius-sm)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {menuOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              ) : (
                <><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: "#1A1209", borderTop: "1px solid rgba(224,123,43,0.15)", padding: "1rem 1.25rem 1.5rem" }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "0.8rem 0", color: "rgba(255,248,240,0.85)", fontWeight: 500, textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: "1rem" }}>
              {l.label}
            </Link>
          ))}
          <Link href="/contacto" className="btn btn-primary" onClick={() => setMenuOpen(false)} style={{ marginTop: "1rem", justifyContent: "center", width: "100%" }}>
            Cotizar por WhatsApp
          </Link>
        </div>
      )}

      <style>{`
        .nav-desktop { display: flex; }
        .nav-cta     { display: inline-flex; }
        .nav-hamburger { display: none; }
        @media (max-width: 768px) {
          .nav-desktop, .nav-cta { display: none !important; }
          .nav-hamburger { display: block; }
        }
      `}</style>
    </header>
  )
}
