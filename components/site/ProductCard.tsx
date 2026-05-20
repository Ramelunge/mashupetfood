"use client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useCartStore } from "@/store/cart"
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card"

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

  return (
    <CardContainer containerClassName="py-0 w-full" className="w-full">
      <CardBody className="w-full h-auto bg-white rounded-2xl border border-[#EDE0D0] shadow-[0_2px_12px_rgba(58,42,26,0.08)] flex flex-col overflow-visible">

        {/* Imagen — flota más */}
        <CardItem translateZ={70} className="w-full">
          <Link href={`/catalogo/${producto.slug}`} style={{ display: "block", position: "relative", paddingBottom: "75%", background: "#ffffff", borderRadius: "16px 16px 0 0", overflow: "hidden" }}>
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
        </CardItem>

        {/* Info */}
        <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>

          {/* Nombre — flota medio */}
          <CardItem translateZ={40} className="w-full">
            <Link href={`/catalogo/${producto.slug}`} style={{ textDecoration: "none" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--color-secondary)", lineHeight: 1.3 }}>
                {producto.nombre}
              </h3>
            </Link>
          </CardItem>

          {/* Descripción */}
          {producto.descripcion && (
            <CardItem translateZ={20} className="w-full">
              <p style={{ fontSize: "0.85rem", color: "var(--color-muted)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {producto.descripcion}
              </p>
            </CardItem>
          )}

          {/* Variantes */}
          {producto.variantes && producto.variantes.length > 1 && (
            <CardItem translateZ={25} className="w-full">
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
                      borderColor: selectedVariante?.id === v.id ? "var(--color-primary)" : "#EDE0D0",
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
            </CardItem>
          )}

          {/* Precio + CTA — flota más para llamar la atención */}
          <CardItem translateZ={50} className="w-full mt-auto">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
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
          </CardItem>

        </div>
      </CardBody>
    </CardContainer>
  )
}
