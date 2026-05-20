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
  const router  = useRouter()
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
      router.push("/admin/dashboard")
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.85rem 1rem",
    borderRadius: "8px",
    border: "1.5px solid #e5e7eb",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
    background: "#fafafa",
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #1A1209 0%, #3B2A1A 100%)",
      padding: "1.5rem",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        padding: "2.75rem 2.5rem",
        width: "100%",
        maxWidth: "400px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Image src="/products/Logo.png" alt="Mashu" width={64} height={64} style={{ objectFit: "contain", marginBottom: "0.75rem" }} />
          <h1 style={{ fontWeight: 800, fontSize: "1.4rem", color: "#1A1209", margin: 0 }}>Panel Admin</h1>
          <p style={{ color: "#8B7355", fontSize: "0.85rem", marginTop: "0.25rem" }}>Mashu Petfood</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#3B2A1A" }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mashu.com"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#E07B2B")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#3B2A1A" }}>Contraseña</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: "2.75rem" }}
                onFocus={(e) => (e.target.style.borderColor = "#E07B2B")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8B7355", fontSize: "1rem" }}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ padding: "0.65rem 0.85rem", background: "#fef2f2", borderRadius: "8px", border: "1px solid #fecaca" }}>
              <p style={{ fontSize: "0.82rem", color: "#dc2626", margin: 0 }}>⚠️ {error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "0.25rem",
              padding: "0.9rem",
              background: loading ? "#ccc" : "#E07B2B",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.95rem",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Iniciando sesión..." : "Ingresar al panel"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.75rem", color: "#ccc" }}>
          Acceso restringido a administradores
        </p>
      </div>
    </div>
  )
}
