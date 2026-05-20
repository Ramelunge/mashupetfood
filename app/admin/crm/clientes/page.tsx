import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Clientes — Mashu Admin" }

export default async function ClientesPage() {
  const supabase = await createClient()
  const { data: clientes } = await supabase
    .from("clientes")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-secondary)" }}>Clientes</h1>
          <p style={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>{clientes?.length ?? 0} clientes registrados</p>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.87rem" }}>
          <thead style={{ background: "var(--color-cream)" }}>
            <tr>
              {["Nombre", "Email", "Teléfono", "Mascota", "Notas", "Desde"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "0.75rem 1rem", color: "var(--color-muted)", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", borderBottom: "1px solid var(--color-cream-dark)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(!clientes || clientes.length === 0) && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "var(--color-muted)" }}>No hay clientes aún. Se crean al convertir un lead.</td></tr>
            )}
            {clientes?.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid var(--color-cream-dark)" }}>
                <td style={{ padding: "0.85rem 1rem", fontWeight: 600, color: "var(--color-secondary)" }}>{c.nombre}</td>
                <td style={{ padding: "0.85rem 1rem", color: "var(--color-muted)" }}>{c.email ?? "—"}</td>
                <td style={{ padding: "0.85rem 1rem", color: "var(--color-muted)" }}>{c.telefono ?? "—"}</td>
                <td style={{ padding: "0.85rem 1rem" }}>{c.mascota ?? "—"}</td>
                <td style={{ padding: "0.85rem 1rem", color: "var(--color-muted)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.notas ?? "—"}</td>
                <td style={{ padding: "0.85rem 1rem", color: "var(--color-muted)", fontSize: "0.8rem" }}>{new Date(c.created_at).toLocaleDateString("es-AR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
