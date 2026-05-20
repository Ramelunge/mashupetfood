import { createClient } from "@/lib/supabase/server"
import HeroSlider from "@/components/site/HeroSlider"
import StatsCounter from "@/components/site/StatsCounter"
import ProductCard from "@/components/site/ProductCard"
import Link from "next/link"
import Image from "next/image"

async function getHomeData() {
  const supabase = await createClient()
  const [slides, stats, productos, marcas, posts] = await Promise.all([
    supabase.from("hero_slides").select("*").eq("activo", true).order("orden"),
    supabase.from("stats").select("*").order("orden"),
    supabase.from("productos").select("*,variantes(*)").eq("activo", true).eq("destacado", true).limit(8),
    supabase.from("marcas").select("*").eq("activo", true).order("orden"),
    supabase.from("posts").select("id,titulo,slug,resumen,imagen_url,created_at").eq("publicado", true).order("created_at", { ascending: false }).limit(3),
  ])
  return {
    slides: slides.data ?? [],
    stats: stats.data ?? [],
    productos: productos.data ?? [],
    marcas: marcas.data ?? [],
    posts: posts.data ?? [],
  }
}

const pilares = [
  { icono: "🌿", titulo: "Ingredientes naturales", desc: "Sin conservantes artificiales. Recetas con proteínas reales y vegetales frescos." },
  { icono: "⚡", titulo: "Respuesta en 24hs", desc: "Te respondemos rápido por WhatsApp o email. Sin vueltas, con atención real." },
  { icono: "🏆", titulo: "Calidad garantizada", desc: "Fórmulas desarrolladas por nutricionistas especializados en alimentación animal." },
  { icono: "❤️", titulo: "Asesoría personalizada", desc: "Te ayudamos a elegir el alimento ideal según la raza, edad y necesidades de tu mascota." },
]

export default async function HomePage() {
  const { slides, stats, productos, marcas, posts } = await getHomeData()

  return (
    <>
      {/* HERO */}
      <HeroSlider slides={slides.length ? slides : [{
        id: "demo",
        titulo: "El alimento que tu mascota se merece",
        subtitulo: "Recetas naturales, ingredientes premium y el cuidado que sólo Mashu puede dar.",
        cta_texto: "Ver catálogo",
        cta_url: "/catalogo",
        imagen_url: undefined,
        orden: 0,
      }]} />

      {/* STATS */}
      {stats.length > 0 && <StatsCounter stats={stats} />}

      {/* PRODUCTOS DESTACADOS */}
      <section style={{ padding: "5rem 0", background: "var(--color-cream)" }}>
        <div className="container-site">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ color: "var(--color-primary)", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
              Lo más elegido
            </p>
            <h2 className="section-title">Productos destacados</h2>
            <p className="section-sub">Fórmulas premium que tus mascotas van a amar</p>
          </div>
          {productos.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
              {productos.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "var(--color-muted)" }}>Próximamente los primeros productos.</p>
          )}
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link href="/catalogo" className="btn-outline">Ver catálogo completo →</Link>
          </div>
        </div>
      </section>

      {/* ¿POR QUÉ MASHU? */}
      <section style={{ padding: "5rem 0", background: "#fff" }}>
        <div className="container-site">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 className="section-title">¿Por qué elegir Mashu?</h2>
            <p className="section-sub">Más de 4 razones para confiar en nosotros</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem" }}>
            {pilares.map((p) => (
              <div key={p.titulo} style={{
                padding: "2rem",
                borderRadius: "var(--radius-card)",
                background: "var(--color-cream)",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                border: "1px solid var(--color-cream-dark)",
                transition: "transform 0.2s",
              }}
              >
                <span style={{ fontSize: "2.5rem" }}>{p.icono}</span>
                <h3 style={{ fontWeight: 700, color: "var(--color-secondary)", fontSize: "1.05rem" }}>{p.titulo}</h3>
                <p style={{ color: "var(--color-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARCAS */}
      {marcas.length > 0 && (
        <section style={{ padding: "3rem 0", background: "var(--color-cream-dark)" }}>
          <div className="container-site" style={{ textAlign: "center" }}>
            <p style={{ color: "var(--color-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.5rem" }}>
              Trabajamos con las mejores marcas
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "2rem" }}>
              {marcas.map((m) => (
                m.logo_url ? (
                  <Image key={m.id} src={m.logo_url} alt={m.nombre} width={100} height={40} style={{ objectFit: "contain", filter: "grayscale(1)", opacity: 0.65 }} />
                ) : (
                  <span key={m.id} style={{ fontWeight: 700, color: "var(--color-muted)", fontSize: "1.1rem" }}>{m.nombre}</span>
                )
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NOVEDADES */}
      {posts.length > 0 && (
        <section style={{ padding: "5rem 0", background: "var(--color-cream)" }}>
          <div className="container-site">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h2 className="section-title">Novedades</h2>
                <p className="section-sub">Tips, recetas y todo sobre el bienestar de tu mascota</p>
              </div>
              <Link href="/novedades" className="btn-outline" style={{ fontSize: "0.9rem" }}>Ver todas →</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {posts.map((post) => (
                <Link key={post.id} href={`/novedades/${post.slug}`} style={{ textDecoration: "none" }}>
                  <article style={{ background: "#fff", borderRadius: "var(--radius-card)", overflow: "hidden", boxShadow: "var(--shadow-card)", transition: "transform 0.2s" }}>
                    {post.imagen_url && (
                      <div style={{ position: "relative", paddingBottom: "56%", background: "var(--color-cream)" }}>
                        <Image src={post.imagen_url} alt={post.titulo} fill style={{ objectFit: "cover" }} />
                      </div>
                    )}
                    <div style={{ padding: "1.25rem" }}>
                      <p style={{ fontSize: "0.78rem", color: "var(--color-primary)", fontWeight: 600, marginBottom: "0.5rem" }}>
                        {new Date(post.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                      <h3 style={{ fontWeight: 700, color: "var(--color-secondary)", fontSize: "1rem", lineHeight: 1.3, marginBottom: "0.5rem" }}>{post.titulo}</h3>
                      {post.resumen && <p style={{ color: "var(--color-muted)", fontSize: "0.85rem", lineHeight: 1.5 }}>{post.resumen}</p>}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEWSLETTER */}
      <NewsletterSection />

      {/* CONTACTO CTA */}
      <section style={{ padding: "5rem 0", background: "var(--color-primary)" }}>
        <div className="container-site" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "#fff", marginBottom: "1rem" }}>
            ¿Tenés una pregunta?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.1rem", marginBottom: "2rem" }}>
            Escribinos y te ayudamos a encontrar el alimento ideal para tu mascota.
          </p>
          <Link href="/contacto" className="btn-outline" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.6)", fontSize: "1rem" }}>
            Contactar ahora →
          </Link>
        </div>
      </section>
    </>
  )
}

function NewsletterSection() {
  return (
    <section style={{ padding: "4rem 0", background: "var(--color-secondary)" }}>
      <div className="container-site" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", textAlign: "center", maxWidth: "560px", margin: "0 auto" }}>
        <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "1.5rem" }}>
          Suscribite a las novedades
        </h2>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem" }}>
          Recibí tips de nutrición, ofertas exclusivas y más. Sin spam, podés darte de baja cuando quieras.
        </p>
        <NewsletterForm />
      </div>
    </section>
  )
}

// Client component inline para el form
import NewsletterForm from "@/components/site/NewsletterForm"
