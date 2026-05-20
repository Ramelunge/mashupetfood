"use client"
import { useEffect, useRef, useState } from "react"

interface Stat { id: string; etiqueta: string; valor: number; sufijo: string; orden: number }
interface Props { stats: Stat[] }

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1500
          const steps = 60
          const step = target / steps
          let current = 0
          const timer = setInterval(() => {
            current = Math.min(current + step, target)
            setCount(Math.round(current))
            if (current >= target) clearInterval(timer)
          }, duration / steps)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref} style={{ fontWeight: 800, fontSize: "clamp(2.5rem, 5vw, 3.5rem)", color: "var(--color-primary)", lineHeight: 1 }}>
      {count}{suffix}
    </span>
  )
}

export default function StatsCounter({ stats }: Props) {
  const sorted = [...stats].sort((a, b) => a.orden - b.orden)

  return (
    <section style={{ background: "var(--color-secondary)", padding: "4rem 0" }}>
      <div
        className="container-site"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "2rem",
          textAlign: "center",
        }}
      >
        {sorted.map((s) => (
          <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
            <Counter target={s.valor} suffix={s.sufijo} />
            <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.95rem", fontWeight: 500 }}>
              {s.etiqueta}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
