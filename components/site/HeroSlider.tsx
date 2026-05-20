"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

interface Slide {
  id: string
  titulo: string
  subtitulo?: string
  cta_texto?: string
  cta_url?: string
  imagen_url?: string
  orden: number
}

interface Props { slides: Slide[] }

export default function HeroSlider({ slides }: Props) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  if (!slides.length) return null
  const slide = slides[current]

  return (
    <section
      style={{
        position: "relative",
        minHeight: "clamp(420px, 70vh, 680px)",
        overflow: "hidden",
        background: "var(--color-secondary)",
      }}
    >
      {/* Imagen de fondo */}
      {slide.imagen_url && (
        <Image
          src={slide.imagen_url}
          alt={slide.titulo}
          fill
          priority
          style={{ objectFit: "cover", opacity: 0.35 }}
        />
      )}

      {/* Overlay gradiente */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(58,42,26,0.92) 0%, rgba(224,123,43,0.55) 100%)",
        }}
      />

      {/* Contenido */}
      <div
        className="container-site"
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "clamp(420px, 70vh, 680px)",
          paddingTop: "3rem",
          paddingBottom: "3rem",
          gap: "1.5rem",
          maxWidth: "640px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: "40px", height: "3px", background: "var(--color-primary)", borderRadius: "2px" }} />
          <span style={{ color: "var(--color-primary-light)", fontWeight: 600, fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Mashu Petfood
          </span>
        </div>

        <h1
          key={slide.id}
          className="animate-fade-up"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.25rem)",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          {slide.titulo}
        </h1>

        {slide.subtitulo && (
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.82)", lineHeight: 1.6 }}>
            {slide.subtitulo}
          </p>
        )}

        {slide.cta_texto && slide.cta_url && (
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href={slide.cta_url} className="btn-primary">
              {slide.cta_texto} →
            </Link>
            <Link href="/contacto" className="btn-outline" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.5)" }}>
              Contactanos
            </Link>
          </div>
        )}
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "1.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "0.5rem",
            zIndex: 3,
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === current ? "28px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: i === current ? "var(--color-primary)" : "rgba(255,255,255,0.4)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </section>
  )
}
