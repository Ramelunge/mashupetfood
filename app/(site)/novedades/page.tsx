import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Novedades — Mashu Petfood" }

export default async function NovedadesPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from("posts")
    .select("id,titulo,slug,resumen,imagen_url,created_at")
    .eq("publicado", true)
    .order("created_at", { ascending: false })

  return (
    <div style={{ padding: "4rem 0 6rem", background: "var(--color-cream)" }}>
      <div className="container-site">
        <div style={{ marginBottom: "3rem" }}>
          <h1 className="section-title">Novedades</h1>
          <p className="section-sub">Tips de nutrición, recetas y todo sobre el bienestar animal</p>
        </div>

        {(!posts || posts.length === 0) ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--color-muted)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📝</div>
            <p style={{ fontWeight: 500 }}>Próximamente el primer artículo.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {posts.map((post) => (
              <Link key={post.id} href={`/novedades/${post.slug}`} style={{ textDecoration: "none" }}>
                <article style={{ background: "#fff", borderRadius: "var(--radius-card)", overflow: "hidden", boxShadow: "var(--shadow-card)", transition: "transform 0.2s", height: "100%", display: "flex", flexDirection: "column" }}>
                  {post.imagen_url && (
                    <div style={{ position: "relative", paddingBottom: "56%", background: "var(--color-cream)" }}>
                      <Image src={post.imagen_url} alt={post.titulo} fill style={{ objectFit: "cover" }} />
                    </div>
                  )}
                  <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <p style={{ fontSize: "0.78rem", color: "var(--color-primary)", fontWeight: 600 }}>
                      {new Date(post.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <h2 style={{ fontWeight: 700, color: "var(--color-secondary)", fontSize: "1.1rem", lineHeight: 1.3 }}>{post.titulo}</h2>
                    {post.resumen && <p style={{ color: "var(--color-muted)", fontSize: "0.9rem", lineHeight: 1.6, flex: 1 }}>{post.resumen}</p>}
                    <span style={{ color: "var(--color-primary)", fontWeight: 600, fontSize: "0.85rem", marginTop: "0.5rem" }}>Leer más →</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
