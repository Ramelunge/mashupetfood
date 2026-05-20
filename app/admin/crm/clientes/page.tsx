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
    <div style={{ padding: "2rem", maxWidth: "1100px" }}>
      <div style={{ marginBottom: "1.75rem" }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#8B7B6F", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.25rem" }}>CRM</p>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Clientes</h1>
        <p style={{ color: "#8B7B6F", fontSize: "0.85rem", marginTop: "0.25rem" }}>{clientes?.length ?? 0} clientes registrados</p>
      </div>

      <div style={{ background: "#2A1F15", border: "1px solid #4D3A2E", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #4D3A2E" }}>
              {["Nombre", "Email", "Teléfono", "Mascota", "Notas", "Desde"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "0.85rem 1.25rem", color: "#8B7B6F", fontWeight: 600, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(!clientes || clientes.length === 0) && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "#8B7B6F" }}>No hay clientes aún. Se crean al convertir un lead.</td></tr>
            )}
            {clientes?.map((c, i) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #321E12", background: i % 2 !== 0 ? "rgba(255,255,255,0.018)" : "transparent" }}>
                <td style={{ padding: "1rem 1.25rem", fontWeight: 600, color: "#ffffff" }}>{c.nombre}</td>
                <td style={{ padding: "1rem 1.25rem", color: "#B8A8A0" }}>{c.email ?? "—"}</td>
                <td style={{ padding: "1rem 1.25rem", color: "#B8A8A0" }}>{c.telefono ?? "—"}</td>
                <td style={{ padding: "1rem 1.25rem", color: "#B8A8A0" }}>{c.mascota ?? "—"}</td>
                <td style={{ padding: "1rem 1.25rem", color: "#8B7B6F", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.notas ?? "—"}</td>
                <td style={{ padding: "1rem 1.25rem", color: "#8B7B6F", fontSize: "0.78rem" }}>{new Date(c.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
