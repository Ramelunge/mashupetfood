"use client"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)
  const router   = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError("Email o contraseña incorrectos.")
      setLoading(false)
    } else {
      router.refresh()
      router.push("/admin/dashboard")
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.85rem 1rem",
    borderRadius: "10px",
    border: "1.5px solid rgba(224,123,43,0.25)",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
    background: "rgba(255,255,255,0.06)",
    color: "#FFF8F0",
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0E0804 0%, #1A1209 50%, #3B2A1A 100%)",
      padding: "1.5rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative glow */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(224,123,43,0.10) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      <div style={{
        background: "rgba(26,18,9,0.70)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRadius: "20px",
        border: "1px solid rgba(224,123,43,0.18)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.05)",
        padding: "2.75rem 2.5rem",
        width: "100%",
        maxWidth: "400px",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Image
            src="/products/Logo Isotipo.png"
            alt="Mashu"
            width={64}
            height={64}
            style={{ objectFit: "contain", marginBottom: "0.75rem" }}
          />
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.4rem", color: "#FFF8F0", margin: 0, letterSpacing: "-0.02em" }}>
            Panel Admin
          </h1>
          <p style={{ color: "var(--color-primary)", fontSize: "0.82rem", marginTop: "0.3rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Mashu Petfood
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,248,240,0.65)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mashu.com"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(224,123,43,0.70)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(224,123,43,0.25)")}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,248,240,0.65)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Contraseña
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: "2.75rem" }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(224,123,43,0.70)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(224,123,43,0.25)")}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,248,240,0.45)", fontSize: "1rem", lineHeight: 1 }}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ padding: "0.65rem 0.85rem", background: "rgba(220,38,38,0.15)", borderRadius: "8px", border: "1px solid rgba(220,38,38,0.30)" }}>
              <p style={{ fontSize: "0.82rem", color: "#fca5a5", margin: 0 }}>⚠️ {error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "0.25rem",
              padding: "0.9rem",
              background: loading ? "rgba(224,123,43,0.40)" : "var(--color-primary)",
              color: "#fff",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.95rem",
              border: "none",
              borderRadius: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s, transform 0.15s",
              boxShadow: loading ? "none" : "0 4px 16px rgba(224,123,43,0.35)",
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "var(--color-primary-dark)" }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "var(--color-primary)" }}
          >
            {loading ? "Iniciando sesión..." : "Ingresar al panel →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.20)", letterSpacing: "0.04em" }}>
          Acceso restringido a administradores
        </p>
      </div>
    </div>
  )
}
