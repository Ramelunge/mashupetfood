"use client"

const items = [
  "Sin conservantes artificiales",
  "Formulado por nutricionistas veterinarios",
  "Proteína real como primer ingrediente",
  "Respuesta en menos de 24 horas",
  "Para perros y gatos",
  "Recetas naturales premium",
]

export default function Marquee() {
  const text = items.join("  ·  ") + "  ·  "
  return (
    <div style={{ background: "#E07B2B", height: "48px", overflow: "hidden", display: "flex", alignItems: "center" }}>
      <div style={{ display: "flex", animation: "marquee-scroll 28s linear infinite", whiteSpace: "nowrap", willChange: "transform" }}>
        <span style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.04em", paddingRight: "0" }}>{text}</span>
        <span style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.04em" }}>{text}</span>
      </div>
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
