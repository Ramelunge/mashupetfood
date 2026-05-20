"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const nav = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
  { section: "Sitio" },
  { label: "Hero / Slider", href: "/admin/contenido/hero", icon: "🖼️" },
  { label: "Configuración", href: "/admin/contenido/config", icon: "⚙️" },
  { label: "Catálogo", href: "/admin/catalogo", icon: "📦" },
  { label: "Novedades", href: "/admin/novedades", icon: "📝" },
  { label: "Mantenimiento", href: "/admin/mantenimiento", icon: "🔧" },
  { section: "CRM" },
  { label: "Leads", href: "/admin/crm/leads", icon: "🎯" },
  { label: "Clientes", href: "/admin/crm/clientes", icon: "👥" },
  { label: "Pedidos", href: "/admin/crm/pedidos", icon: "🛒" },
  { label: "Ventas", href: "/admin/ventas", icon: "💰" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  return (
    <aside style={{ width: "240px", background: "var(--color-secondary)", minHeight: "100vh", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Image src="/products/Logo.png" alt="Mashu" width={36} height={36} style={{ objectFit: "contain" }} />
        <div>
          <p style={{ fontWeight: 800, color: "#fff", fontSize: "1rem", lineHeight: 1 }}>Mashu</p>
          <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)" }}>Panel Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "1rem 0.75rem", overflowY: "auto" }}>
        {nav.map((item, i) => {
          if ("section" in item) return (
            <p key={i} style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", padding: "1rem 0.5rem 0.4rem" }}>{item.section}</p>
          )
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link key={item.href} href={item.href!} style={{
              display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.6rem 0.75rem",
              borderRadius: "8px", marginBottom: "2px", textDecoration: "none",
              background: active ? "rgba(224,123,43,0.2)" : "transparent",
              color: active ? "var(--color-primary-light)" : "rgba(255,255,255,0.7)",
              fontWeight: active ? 600 : 400, fontSize: "0.88rem",
              transition: "all 0.15s",
            }}>
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "1rem 0.75rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.6rem 0.75rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "0.82rem", borderRadius: "8px" }}>
          🌐 Ver sitio
        </Link>
        <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.6rem 0.75rem", color: "rgba(255,255,255,0.5)", background: "none", border: "none", cursor: "pointer", fontSize: "0.82rem", width: "100%", borderRadius: "8px" }}>
          🚪 Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
