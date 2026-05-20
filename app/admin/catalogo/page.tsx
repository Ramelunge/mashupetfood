import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Catálogo — Mashu Admin" }

export default async function AdminCatalogoPage() {
  const supabase = await createClient()
  const { data: productos } = await supabase
    .from("productos")
    .select("*,categorias(nombre),variantes(id)")
    .order("created_at", { ascending: false })

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-secondary)" }}>Catálogo</h1>
          <p style={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>{productos?.length ?? 0} productos</p>
        </div>
        <Link href="/admin/catalogo/nuevo" className="btn-primary" style={{ fontSize: "0.9rem" }}>
          + Nuevo producto
        </Link>
      </div>

      <div style={{ background: "#fff", borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.87rem" }}>
          <thead style={{ background: "var(--color-cream)" }}>
            <tr>
              {["", "Nombre", "Categoría", "Precio", "Variantes", "Estado", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "0.75rem 1rem", color: "var(--color-muted)", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", borderBottom: "1px solid var(--color-cream-dark)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(!productos || productos.length === 0) && (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--color-muted)" }}>
                No hay productos. <Link href="/admin/catalogo/nuevo" style={{ color: "var(--color-primary)", fontWeight: 600 }}>Crear el primero →</Link>
              </td></tr>
            )}
            {productos?.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid var(--color-cream-dark)" }}>
                <td style={{ padding: "0.75rem 1rem", width: "56px" }}>
                  {p.imagen_url ? (
                    <div style={{ width: "40px", height: "40px", borderRadius: "6px", overflow: "hidden", background: "var(--color-cream)" }}>
                      <Image src={p.imagen_url} alt={p.nombre} width={40} height={40} style={{ objectFit: "contain" }} />
                    </div>
                  ) : <div style={{ width: "40px", height: "40px", borderRadius: "6px", background: "var(--color-cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>🐾</div>}
                </td>
                <td style={{ padding: "0.85rem 1rem" }}>
                  <p style={{ fontWeight: 600, color: "var(--color-secondary)" }}>{p.nombre}</p>
                  {p.destacado && <span style={{ fontSize: "0.7rem", background: "#fef9c3", color: "#854d0e", padding: "0.1rem 0.4rem", borderRadius: "3px", fontWeight: 600 }}>★ Destacado</span>}
                </td>
                <td style={{ padding: "0.85rem 1rem", color: "var(--color-muted)" }}>{p.categorias?.nombre ?? "—"}</td>
                <td style={{ padding: "0.85rem 1rem", fontWeight: 600 }}>{p.precio ? `$${Number(p.precio).toFixed(2)}` : "—"}</td>
                <td style={{ padding: "0.85rem 1rem", color: "var(--color-muted)" }}>{p.variantes?.length ?? 0}</td>
                <td style={{ padding: "0.85rem 1rem" }}>
                  <span style={{ padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.78rem", fontWeight: 600, background: p.activo ? "#dcfce7" : "#f3f4f6", color: p.activo ? "#166534" : "#6b7280" }}>
                    {p.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td style={{ padding: "0.85rem 1rem" }}>
                  <Link href={`/admin/catalogo/${p.id}`} style={{ color: "var(--color-primary)", fontWeight: 600, fontSize: "0.82rem", textDecoration: "none" }}>Editar →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
