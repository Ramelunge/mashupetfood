"use client"
import { useState } from "react"

export default function ContactForm() {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", mascota: "", mensaje: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    setStatus(res.ok ? "ok" : "error")
  }

  if (status === "ok") return (
    <div style={{ background: "#fff", borderRadius: "var(--radius-card)", padding: "2rem", textAlign: "center", boxShadow: "var(--shadow-card)" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
      <h3 style={{ fontWeight: 700, color: "var(--color-secondary)" }}>¡Mensaje recibido!</h3>
      <p style={{ color: "var(--color-muted)", marginTop: "0.5rem" }}>Te respondemos en menos de 24 horas.</p>
    </div>
  )

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.75rem 1rem",
    borderRadius: "var(--radius-btn)",
    border: "1.5px solid var(--color-cream-dark)",
    fontSize: "0.95rem", background: "#fff", outline: "none",
    transition: "border-color 0.2s",
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: "var(--radius-card)", padding: "2rem", boxShadow: "var(--shadow-card)", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h3 style={{ fontWeight: 700, color: "var(--color-secondary)", marginBottom: "0.25rem" }}>Envianos un mensaje</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-secondary)" }}>Nombre *</label>
          <input style={inputStyle} required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Tu nombre" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-secondary)" }}>Email</label>
          <input style={inputStyle} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tu@email.com" />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-secondary)" }}>Teléfono</label>
          <input style={inputStyle} value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="+54 11..." />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-secondary)" }}>Mascota</label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={form.mascota} onChange={(e) => setForm({ ...form, mascota: e.target.value })}>
            <option value="">Seleccionar...</option>
            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
            <option value="Ambos">Ambos</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-secondary)" }}>Mensaje *</label>
        <textarea
          style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
          required
          value={form.mensaje}
          onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
          placeholder="¿En qué podemos ayudarte?"
        />
      </div>

      <button type="submit" className="btn-primary" disabled={status === "loading"} style={{ justifyContent: "center", padding: "0.9rem" }}>
        {status === "loading" ? "Enviando..." : "Enviar mensaje →"}
      </button>

      {status === "error" && <p style={{ color: "#e53e3e", fontSize: "0.82rem" }}>Algo salió mal. Intentá de nuevo o escribinos por WhatsApp.</p>}
    </form>
  )
}
