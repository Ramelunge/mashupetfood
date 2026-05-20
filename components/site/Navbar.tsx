"use client"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useCartStore } from "@/store/cart"

const links = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/novedades", label: "Novedades" },
  { href: "/contacto", label: "Contacto" },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { count, toggle } = useCartStore()
  const qty = count()

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,248,240,0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--color-cream-dark)",
      }}
    >
      <div className="container-site" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
          <Image src="/products/Logo.png" alt="Mashu Petfood" width={48} height={48} style={{ objectFit: "contain" }} />
          <span style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--color-primary)", letterSpacing: "-0.02em" }}>
            Mashu
          </span>
        </Link>

        {/* Nav desktop */}
        <nav style={{ display: "flex", gap: "2rem" }} className="nav-desktop">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{ color: "var(--color-secondary)", fontWeight: 500, textDecoration: "none", fontSize: "0.95rem", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-secondary)")}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Carrito */}
          <button
            onClick={toggle}
            aria-label="Abrir carrito de cotización"
            style={{
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              color: "var(--color-secondary)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {qty > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "var(--color-primary)",
                  color: "#fff",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {qty}
              </span>
            )}
          </button>

          {/* Hamburger mobile */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-secondary)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: "var(--color-cream)", borderTop: "1px solid var(--color-cream-dark)", padding: "1rem" }} className="nav-mobile-menu">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "0.75rem 0",
                color: "var(--color-secondary)",
                fontWeight: 500,
                textDecoration: "none",
                borderBottom: "1px solid var(--color-cream-dark)",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .nav-desktop { display: flex; }
        .nav-hamburger { display: none; }
        @media (max-width: 768px) {
          .nav-desktop { display: none; }
          .nav-hamburger { display: block; }
        }
      `}</style>
    </header>
  )
}
