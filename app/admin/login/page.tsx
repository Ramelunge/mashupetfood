"use client"
import Image from "next/image"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle")
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin/dashboard` },
    })
    setStatus(error ? "error" : "sent")
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-cream)", padding: "1.5rem" }}>
      <div style={{ background: "#fff", borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)", padding: "2.5rem", width: "100%", maxWidth: "400px", textAlign: "center" }}>
        <Image src="/products/Logo.png" alt="Mashu" width={56} height={56} style={{ objectFit: "contain", marginBottom: "1rem" }} />
        <h1 style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--color-secondary)", marginBottom: "0.5rem" }}>
          Panel Admin
        </h1>
        <p style={{ color: "var(--color-muted)", fontSize: "0.9rem", marginBottom: "1.75rem" }}>
          Ingresá tu email y te enviamos el link de acceso.
        </p>

        {status === "sent" ? (
          <div style={{ padding: "1.5rem", background: "var(--color-cream)", borderRadius: "8px" }}>
            <p style={{ fontWeight: 600, color: "var(--color-accent-dark)" }}>✅ Link enviado</p>
            <p style={{ fontSize: "0.85rem", color: "var(--color-muted)", marginTop: "0.5rem" }}>Revisá tu email ({email}) para acceder.</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mashu.com"
              style={{ padding: "0.85rem 1rem", borderRadius: "var(--radius-btn)", border: "1.5px solid var(--color-cream-dark)", fontSize: "0.95rem", outline: "none" }}
            />
            <button type="submit" className="btn-primary" disabled={status === "loading"} style={{ justifyContent: "center", padding: "0.9rem" }}>
              {status === "loading" ? "Enviando..." : "Enviar link de acceso"}
            </button>
            {status === "error" && <p style={{ fontSize: "0.82rem", color: "#e53e3e" }}>Error al enviar. Verificá el email.</p>}
          </form>
        )}
      </div>
    </div>
  )
}
