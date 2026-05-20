"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useRef } from "react"
import { useCartStore } from "@/store/cart"

interface Variante { id: string; nombre: string; stock: number; precio_extra: number }
interface Producto {
  id: string
  nombre: string
  slug: string
  descripcion?: string
  precio?: number
  precio_anterior?: number
  imagen_url?: string
  variantes?: Variante[]
}

export default function ProductCard({ producto }: { producto: Producto }) {
  const { add, open } = useCartStore()
  const [selectedVariante, setSelectedVariante] = useState<Variante | undefined>(producto.variantes?.[0])
  const [added, setAdded] = useState(false)
  const cardRef = useRef<HTMLElement>(null)

  const precio = (producto.precio ?? 0) + (selectedVariante?.precio_extra ?? 0)

  function handleAdd() {
    add({
      id: producto.id,
      nombre: producto.nombre,
      variante: selectedVariante?.nombre,
      cantidad: 1,
      precio,
      imagen_url: producto.imagen_url,
    })
    setAdded(true)
    open()
    setTimeout(() => setAdded(false), 2000)
  }

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rx = ((y - cy) / cy) * -6
    const ry = ((x - cx) / cx) * 6
    el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px) scale(1.015)`
    el.style.boxShadow = `0 16px 48px rgba(58,42,26,0.18), 0 0 0 1px rgba(224,123,43,0.12)`
  }

  function handleMouseLeave() {
    const el = cardRef.current
    if (!el) return
    el.style.transform = "perspective(700px) rotateX(0) rotateY(0) translateY(0) scale(1)"
    el.style.boxShadow = "var(--shadow-card)"
  }

  return (
    <article
      ref={cardRef}
      style={{
        background: "#fff",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-card)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 300ms var(--ease-out), box-shadow 300ms var(--ease-out)",
        willChange: "transform",
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Imagen */}
      <Link href={`/catalogo/${producto.slug}`} style={{ display: "block", position: "relative", paddingBottom: "75%", background: "var(--color-cream)" }}>
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            style={{ objectFit: "contain", padding: "1rem" }}
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>
            🐾
          </div>
        )}
        {producto.precio_anterior && (
          <span style={{
            position: "absolute", top: "0.75rem", left: "0.75rem",
            background: "var(--color-accent)", color: "#fff",
            padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700,
          }}>
            OFERTA
          </span>
        )}
      </Link>

      {/* Info */}
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
        <Link href={`/catalogo/${producto.slug}`} style={{ textDecoration: "none" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--color-secondary)", lineHeight: 1.3 }}>
            {producto.nombre}
          </h3>
        </Link>

        {producto.descripcion && (
          <p style={{ fontSize: "0.85rem", color: "var(--color-muted)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {producto.descripcion}
          </p>
        )}

        {/* Variantes */}
        {producto.variantes && producto.variantes.length > 1 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {producto.variantes.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariante(v)}
                disabled={v.stock === 0}
                style={{
                  padding: "0.3rem 0.7rem",
                  borderRadius: "4px",
                  border: "1.5px solid",
                  borderColor: selectedVariante?.id === v.id ? "var(--color-primary)" : "var(--color-cream-dark)",
                  background: selectedVariante?.id === v.id ? "var(--color-primary-surface)" : "transparent",
                  color: selectedVariante?.id === v.id ? "var(--color-primary-dark)" : "var(--color-muted)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: v.stock === 0 ? "not-allowed" : "pointer",
                  opacity: v.stock === 0 ? 0.45 : 1,
                  transition: "all 0.15s ease",
                }}
              >
                {v.nombre}
              </button>
            ))}
          </div>
        )}

        {/* Precio + CTA */}
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
          <div>
            {precio > 0 && (
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.15rem", color: "var(--color-primary)" }}>
                ${precio.toFixed(2)}
              </span>
            )}
            {producto.precio_anterior && (
              <span style={{ fontSize: "0.8rem", color: "var(--color-muted)", textDecoration: "line-through", marginLeft: "0.5rem" }}>
                ${producto.precio_anterior.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className="btn btn-primary btn-sm"
            style={{ background: added ? "var(--color-accent)" : undefined }}
          >
            {added ? "✓ Listo" : "+ Cotizar"}
          </button>
        </div>
      </div>
    </article>
  )
}
