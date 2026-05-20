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
    <div style={{ padding: "2rem", maxWidth: "1100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.75rem" }}>
        <div>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#8B7B6F", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Sitio</p>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Catálogo</h1>
          <p style={{ color: "#8B7B6F", fontSize: "0.85rem", marginTop: "0.25rem" }}>{productos?.length ?? 0} productos</p>
        </div>
        <Link href="/admin/catalogo/nuevo" style={{
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          padding: "0.6rem 1.25rem", borderRadius: "8px",
          background: "#E07B2B", color: "#ffffff",
          fontSize: "0.85rem", fontWeight: 600, textDecoration: "none",
        }}>
          + Nuevo producto
        </Link>
      </div>

      <div style={{ background: "#2A1F15", border: "1px solid #4D3A2E", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #4D3A2E" }}>
              {["", "Nombre", "Categoría", "Precio", "Variantes", "Estado", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "0.85rem 1.25rem", color: "#8B7B6F", fontWeight: 600, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(!productos || productos.length === 0) && (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "#8B7B6F" }}>
                No hay productos. <Link href="/admin/catalogo/nuevo" style={{ color: "#E07B2B", fontWeight: 600 }}>Crear el primero →</Link>
              </td></tr>
            )}
            {productos?.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #321E12", background: i % 2 !== 0 ? "rgba(255,255,255,0.018)" : "transparent" }}>
                <td style={{ padding: "0.85rem 1.25rem", width: "56px" }}>
                  {p.imagen_url ? (
                    <div style={{ width: "40px", height: "40px", borderRadius: "6px", overflow: "hidden", background: "#1A1209" }}>
                      <Image src={p.imagen_url} alt={p.nombre} width={40} height={40} style={{ objectFit: "contain" }} />
                    </div>
                  ) : (
                    <div style={{ width: "40px", height: "40px", borderRadius: "6px", background: "#1A1209", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>🐾</div>
                  )}
                </td>
                <td style={{ padding: "0.85rem 1.25rem" }}>
                  <p style={{ fontWeight: 600, color: "#ffffff" }}>{p.nombre}</p>
                  {p.destacado && <span style={{ fontSize: "0.68rem", background: "rgba(245,158,11,0.12)", color: "#F59E0B", padding: "0.1rem 0.5rem", borderRadius: "4px", fontWeight: 600 }}>★ Destacado</span>}
                </td>
                <td style={{ padding: "0.85rem 1.25rem", color: "#B8A8A0" }}>{p.categorias?.nombre ?? "—"}</td>
                <td style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#ffffff", fontVariantNumeric: "tabular-nums" }}>{p.precio ? `$${Number(p.precio).toLocaleString("es-AR", { minimumFractionDigits: 2 })}` : "—"}</td>
                <td style={{ padding: "0.85rem 1.25rem", color: "#8B7B6F" }}>{p.variantes?.length ?? 0}</td>
                <td style={{ padding: "0.85rem 1.25rem" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "0.35rem",
                    padding: "0.25rem 0.65rem", borderRadius: "20px", fontSize: "0.73rem", fontWeight: 600,
                    background: p.activo ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.06)",
                    color: p.activo ? "#34D399" : "#8B7B6F",
                  }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: p.activo ? "#34D399" : "#8B7B6F" }} />
                    {p.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td style={{ padding: "0.85rem 1.25rem" }}>
                  <Link href={`/admin/catalogo/${p.id}`} style={{ color: "#E07B2B", fontWeight: 600, fontSize: "0.8rem", textDecoration: "none" }}>Editar →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
