import { createClient } from "@/lib/supabase/server"
import ProductCard from "@/components/site/ProductCard"
import CatalogoSortSelect from "@/components/site/CatalogoSortSelect"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Catálogo — Mashu Petfood" }

interface Props { searchParams: Promise<{ cat?: string; q?: string; orden?: string }> }

export default async function CatalogoPage({ searchParams }: Props) {
  const { cat, q, orden } = await searchParams
  const supabase = await createClient()

  const [catRes, prodRes] = await Promise.all([
    supabase.from("categorias").select("*").order("orden"),
    supabase.from("productos").select("*,variantes(*),categorias(nombre,slug)").eq("activo", true),
  ])

  let productos = prodRes.data ?? []
  const categorias = catRes.data ?? []

  if (cat) productos = productos.filter((p) => p.categorias?.slug === cat)
  if (q) {
    const query = q.toLowerCase()
    productos = productos.filter((p) =>
      p.nombre.toLowerCase().includes(query) || p.descripcion?.toLowerCase().includes(query)
    )
  }
  if (orden === "precio_asc") productos.sort((a, b) => (a.precio ?? 0) - (b.precio ?? 0))
  if (orden === "precio_desc") productos.sort((a, b) => (b.precio ?? 0) - (a.precio ?? 0))
  if (orden === "nombre_asc") productos.sort((a, b) => a.nombre.localeCompare(b.nombre))

  return (
    <div style={{ padding: "3rem 0 5rem", background: "#F0E6D4", minHeight: "70vh" }}>
      <div className="container-site">
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "var(--color-secondary)", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
            Catálogo de productos
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "0.95rem" }}>
            {productos.length} producto{productos.length !== 1 ? "s" : ""} encontrado{productos.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "2rem", alignItems: "start" }} className="catalogo-grid">
          {/* Sidebar filtros */}
          <aside>
            <div style={{ background: "#ffffff", borderRadius: "var(--radius-lg)", padding: "1.5rem", border: "1px solid #EDE0D0", boxShadow: "0 1px 6px rgba(58,42,26,0.06)" }}>
              <h3 style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--color-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
                Categorías
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <li>
                  <Link href="/catalogo" style={{
                    display: "block", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-sm)",
                    background: !cat ? "var(--color-primary)" : "transparent",
                    color: !cat ? "#fff" : "var(--color-secondary)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500,
                  }}>Todos</Link>
                </li>
                {categorias.map((c) => (
                  <li key={c.id}>
                    <Link href={`/catalogo?cat=${c.slug}`} style={{
                      display: "block", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-sm)",
                      background: cat === c.slug ? "var(--color-primary)" : "transparent",
                      color: cat === c.slug ? "#fff" : "var(--color-secondary)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500,
                    }}>{c.nombre}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Productos */}
          <div>
            {/* Buscador + orden */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              <form style={{ flex: 1, minWidth: "200px" }}>
                {cat && <input type="hidden" name="cat" value={cat} />}
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Buscar productos..."
                  style={{ width: "100%", padding: "0.65rem 1rem", borderRadius: "var(--radius-md)", border: "1.5px solid #EDE0D0", fontSize: "0.9rem", background: "#fff", outline: "none", color: "#3B2A1A" }}
                />
              </form>
              <CatalogoSortSelect defaultValue={orden} cat={cat} />
            </div>

            {productos.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem" }}>
                {productos.map((p) => <ProductCard key={p.id} producto={p} />)}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--color-muted)" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
                <p style={{ fontWeight: 500 }}>No encontramos productos con esos filtros.</p>
                <Link href="/catalogo" style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>Ver todos los productos →</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .catalogo-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
