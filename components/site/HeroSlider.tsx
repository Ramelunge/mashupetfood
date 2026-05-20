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
        minHeight: "clamp(500px, 75vh, 720px)",
        overflow: "hidden",
        background: "var(--color-secondary)",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Background image */}
      {slide.imagen_url && (
        <div style={{ position: "absolute", inset: 0, transition: "opacity 600ms", opacity: entering ? 0 : 1 }}>
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

      {/* Gradient overlay — left heavy for text legibility */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(100deg, rgba(26,18,9,0.94) 0%, rgba(26,18,9,0.78) 45%, rgba(26,18,9,0.25) 75%, transparent 100%)",
      }} />

      {/* Content */}
      <div
        className="container-site"
        style={{
          position: "relative",
          zIndex: 2,
          paddingTop: "4rem",
          paddingBottom: "4rem",
          maxWidth: "640px",
        }}
      >
        <div
          key={slide.id}
          style={{
            opacity: entering ? 0 : 1,
            transform: entering ? "translateY(12px)" : "translateY(0)",
            transition: "opacity 500ms var(--ease-out), transform 500ms var(--ease-out)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
            <span style={{ width: "32px", height: "3px", background: "var(--color-primary)", borderRadius: "2px", display: "block" }} />
            <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.75rem", color: "var(--color-primary-light)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Mashu Petfood
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5.5vw, 3.5rem)",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.12,
            letterSpacing: "-0.025em",
            marginBottom: "1.1rem",
          }}>
            {slide.titulo}
          </h1>

          {slide.subtitulo && (
            <p style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)", color: "rgba(255,255,255,0.80)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "480px" }}>
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
                background: i === current ? "var(--color-primary)" : "rgba(255,255,255,0.35)",
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
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: "rgba(255,255,255,0.12)", zIndex: 3 }}>
          <div
            key={`progress-${current}`}
            style={{
              height: "100%",
              background: "var(--color-primary)",
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
