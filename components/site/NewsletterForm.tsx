"use client"
import { useState } from "react"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) })
    setStatus(res.ok ? "ok" : "error")
  }

  if (status === "ok") return (
    <p style={{ color: "#a8e6b5", fontWeight: 600 }}>¡Gracias! Ya sos parte de la comunidad Mashu 🐾</p>
  )

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", width: "100%", maxWidth: "440px", flexWrap: "wrap" }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        required
        style={{ flex: 1, minWidth: "200px", padding: "0.75rem 1rem", borderRadius: "var(--radius-btn)", border: "none", fontSize: "0.95rem", outline: "2px solid transparent", background: "rgba(255,255,255,0.1)", color: "#fff" }}
      />
      <button type="submit" className="btn-primary" disabled={status === "loading"} style={{ whiteSpace: "nowrap" }}>
        {status === "loading" ? "..." : "Suscribirme"}
      </button>
      {status === "error" && <p style={{ color: "#ffaaaa", fontSize: "0.82rem", width: "100%" }}>Algo salió mal, intentá de nuevo.</p>}
    </form>
  )
}
