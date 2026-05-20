"use client"
import { useState, useEffect, useCallback } from "react"
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
  activo: boolean
  created_at: string
}

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent]   = useState(0)
  const [paused, setPaused]     = useState(false)
  const [entering, setEntering] = useState(false)

  const goTo = useCallback((idx: number) => {
    setEntering(true)
    setTimeout(() => {
      setCurrent(idx)
      setEntering(false)
    }, 80)
  }, [])

  useEffect(() => {
    if (slides.length <= 1 || paused) return
    const t = setInterval(() => goTo((current + 1) % slides.length), 5500)
    return () => clearInterval(t)
  }, [slides.length, paused, current, goTo])

  if (!slides.length) return null
  const slide = slides[current]

  return (
    <section
      aria-label="Banner principal"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: "relative",
        minHeight: "clamp(520px, 78vh, 760px)",
        overflow: "hidden",
        background: "#1A1209",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Background image */}
      {slide.imagen_url && (
        <div style={{ position: "absolute", inset: 0, transition: "opacity 700ms var(--ease-out)", opacity: entering ? 0 : 1 }}>
          <Image
            src={slide.imagen_url}
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center right" }}
          />
        </div>
      )}

      {/* Warm brown gradient overlay — left heavy for text, orange glow at bottom */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(108deg, rgba(20,12,4,0.96) 0%, rgba(59,32,10,0.82) 38%, rgba(59,32,10,0.35) 68%, rgba(59,32,10,0.08) 100%)",
      }} />
      {/* Bottom warm glow */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "35%",
        background: "linear-gradient(to top, rgba(224,123,43,0.14) 0%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* Decorative circle — brand accent */}
      <div style={{
        position: "absolute",
        top: "-80px",
        right: "-80px",
        width: "420px",
        height: "420px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(224,123,43,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div
        className="container-site"
        style={{
          position: "relative",
          zIndex: 2,
          paddingTop: "4rem",
          paddingBottom: "5rem",
          maxWidth: "680px",
        }}
      >
        <div
          key={slide.id}
          style={{
            opacity: entering ? 0 : 1,
            transform: entering ? "translateY(16px)" : "translateY(0)",
            transition: "opacity 500ms var(--ease-out), transform 500ms var(--ease-out)",
          }}
        >
          {/* Brand label */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
            <span style={{ width: "36px", height: "3px", background: "var(--color-primary)", borderRadius: "2px", display: "block" }} />
            <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.72rem", color: "var(--color-primary)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Mashu Petfood — Alimento Premium
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.1rem, 5.5vw, 3.75rem)",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            marginBottom: "1.25rem",
          }}>
            {slide.titulo}
          </h1>

          {slide.subtitulo && (
            <p style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.125rem)", color: "rgba(255,240,220,0.80)", lineHeight: 1.75, marginBottom: "2.25rem", maxWidth: "500px" }}>
              {slide.subtitulo}
            </p>
          )}

          <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
            {slide.cta_texto && slide.cta_url && (
              <Link href={slide.cta_url} className="btn btn-primary btn-lg">
                {slide.cta_texto} →
              </Link>
            )}
            <Link href="/contacto" className="btn btn-ghost btn-lg">
              Hablar con nosotros
            </Link>
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", gap: "1.5rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
            {[
              { icon: "🌿", text: "Sin conservantes" },
              { icon: "🏆", text: "Formulado por vets" },
              { icon: "⚡", text: "Respuesta en 24hs" },
            ].map((b) => (
              <div key={b.text} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ fontSize: "0.9rem" }}>{b.icon}</span>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,240,220,0.65)", fontWeight: 500 }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "0.5rem", zIndex: 3 }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === current ? "32px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: i === current ? "var(--color-primary)" : "rgba(255,255,255,0.30)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 350ms var(--ease-out), background 350ms",
              }}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {slides.length > 1 && !paused && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: "rgba(255,255,255,0.08)", zIndex: 3 }}>
          <div
            key={`progress-${current}`}
            style={{
              height: "100%",
              background: "linear-gradient(to right, var(--color-primary), var(--color-primary-light))",
              animation: "heroProgress 5.5s linear forwards",
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes heroProgress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  )
}
