import { createClient } from "@/lib/supabase/server"
import ProductCard from "@/components/site/ProductCard"
import NewsletterForm from "@/components/site/NewsletterForm"
import RevealSection from "@/components/site/RevealSection"
import Marquee from "@/components/site/Marquee"
import Link from "next/link"
import Image from "next/image"

async function getHomeData() {
  const supabase = await createClient()
  const [stats, productos, posts] = await Promise.all([
    supabase.from("stats").select("*").order("orden"),
    supabase.from("productos").select("*,variantes(*)").eq("activo", true).eq("destacado", true).limit(8),
    supabase.from("posts").select("id,titulo,slug,resumen,imagen_url,created_at").eq("publicado", true).order("created_at", { ascending: false }).limit(3),
  ])
  return { stats: stats.data ?? [], productos: productos.data ?? [], posts: posts.data ?? [] }
}

const fallbackProductos = [
  { nombre: "Caldo de Pollo", img: "/products/Caldo Pollo.png", desc: "Hidratación natural con proteína real" },
  { nombre: "Caldo de Res", img: "/products/Caldo Res.png", desc: "Rico en colágeno y nutrientes esenciales" },
  { nombre: "Carne Vaquera", img: "/products/Carne Vaquera.png", desc: "Proteína premium de primera calidad" },
  { nombre: "Pollo Granjero", img: "/products/Pollo Granjero.png", desc: "Pollo de campo con sabor auténtico" },
  { nombre: "Pollo Ranchero", img: "/products/Pollo Ranchero.png", desc: "Combinación perfecta de sabor y nutrición" },
  { nombre: "Puré de Hígado", img: "/products/Puré Hígado.png", desc: "Alto en hierro y vitaminas B" },
  { nombre: "Pack Gallinero", img: "/products/Pack Gallinero.png", desc: "El pack favorito de las familias" },
  { nombre: "Pack Clásico", img: "/products/Pack Clásico.png", desc: "Variedad perfecta para empezar" },
]

const faqs = [
  { q: "¿Qué hace diferente a Mashu?", a: "Nuestras recetas no tienen conservantes artificiales. Usamos proteínas reales como primer ingrediente, supervisadas por nutricionistas veterinarios." },
  { q: "¿Cómo cotizo?", a: "Agregás productos a tu lista (ícono carrito) y con un clic mandamos todo por WhatsApp. Respondemos en menos de 24 horas." },
  { q: "¿Hacen envíos?", a: "Sí. Coordinamos envíos y también podés retirar en punto de venta. Consultanos por WhatsApp para detalles según tu zona." },
  { q: "¿Tienen productos para gatos?", a: "Contamos con líneas específicas para gatos y perros, y packs mixtos para familias con ambas mascotas." },
  { q: "¿Puedo cambiar el alimento bruscamente?", a: "Recomendamos transición de 7-10 días. Consultanos y te armamos un plan personalizado." },
]

export default async function HomePage() {
  const { productos, posts } = await getHomeData()
  const items = productos.length ? productos : null

  return (
    <>
      <a href="#main-content" className="skip-link">Saltar al contenido</a>

      {/* ── 1. HERO — Full viewport, editorial, dark ── */}
      <section style={{
        minHeight: "100svh",
        background: "#1A1209",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        paddingBottom: "8vh",
      }}>
        {/* Background image — faded, right side */}
        <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ position: "relative", width: "60%", height: "100%" }}>
            <Image
              src="/products/Productos.png"
              alt=""
              fill
              style={{ objectFit: "contain", objectPosition: "center right", opacity: 0.18 }}
              priority
            />
          </div>
        </div>

        {/* Gradient overlays */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #1A1209 45%, transparent 85%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #1A1209 0%, transparent 50%)" }} />

        {/* Orange top-left glow */}
        <div style={{ position: "absolute", top: "-10%", left: "-5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(224,123,43,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Content */}
        <div className="container-site" style={{ position: "relative", zIndex: 2, maxWidth: "1100px" }}>

          {/* Tag line */}
          <p className="anim-hero-1" style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E07B2B", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ display: "inline-block", width: "28px", height: "2px", background: "#E07B2B", borderRadius: "1px" }} />
            Nutrición natural para mascotas
          </p>

          {/* Main headline — split, very large */}
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.03em", marginBottom: "2rem" }}>
            <span className="anim-hero-2" style={{ display: "block", fontSize: "clamp(3.2rem, 8.5vw, 7.5rem)", color: "#FFFFFF" }}>El alimento</span>
            <span className="anim-hero-2" style={{ display: "block", fontSize: "clamp(3.2rem, 8.5vw, 7.5rem)", color: "#E07B2B" }}>que tu mascota</span>
            <span className="anim-hero-3" style={{ display: "block", fontSize: "clamp(3.2rem, 8.5vw, 7.5rem)", color: "#FFFFFF" }}>se merece.</span>
          </h1>

          {/* Sub */}
          <p className="anim-hero-3" style={{ fontSize: "clamp(1rem, 2.2vw, 1.2rem)", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: "480px", marginBottom: "2.5rem" }}>
            Recetas naturales. Sin conservantes artificiales.<br />Formulado por nutricionistas veterinarios.
          </p>

          {/* CTAs */}
          <div className="anim-hero-4" style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
            <Link href="/catalogo" className="hero-cta-primary" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "#E07B2B", color: "#fff", fontWeight: 700, fontSize: "0.95rem",
              padding: "0.875rem 2rem", borderRadius: "8px", textDecoration: "none",
              transition: "background 150ms, transform 150ms",
            }}>
              Ver catálogo →
            </Link>
            <Link href="/contacto" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(255,255,255,0.08)", color: "#fff", fontWeight: 600, fontSize: "0.95rem",
              padding: "0.875rem 2rem", borderRadius: "8px", textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.18)",
              transition: "background 150ms",
            }}>
              Cotizar por WhatsApp
            </Link>
          </div>

          {/* Trust pills */}
          <div className="anim-hero-4" style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "3rem" }}>
            {["🌿 Sin conservantes", "🏆 Formulado por vets", "⚡ Respuesta en 24hs"].map((item) => (
              <span key={item} style={{
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.7)", fontSize: "0.78rem", fontWeight: 500,
                padding: "0.35rem 0.875rem", borderRadius: "999px",
              }}>{item}</span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: "2rem", right: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", opacity: 0.4 }}>
          <span style={{ fontSize: "0.65rem", color: "#fff", letterSpacing: "0.12em", textTransform: "uppercase", writingMode: "vertical-rl" }}>Scroll</span>
          <div style={{ width: "1px", height: "48px", background: "rgba(255,255,255,0.3)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%", background: "#fff", animation: "scroll-line 2s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* ── 2. MARQUEE ── */}
      <Marquee />

      {/* ── 3. EDITORIAL STATEMENT ── */}
      <section id="main-content" style={{ background: "#FFF8F0", padding: "clamp(5rem, 10vw, 9rem) 0" }}>
        <div className="container-site">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem, 6vw, 6rem)", alignItems: "center" }} className="statement-grid">
            <RevealSection>
              <h2 style={{
                fontFamily: "var(--font-display)", fontWeight: 800,
                fontSize: "clamp(2.4rem, 5.5vw, 5rem)", lineHeight: 1.0,
                letterSpacing: "-0.03em", color: "#1A1209",
              }}>
                No todos los<br />
                <span style={{ color: "#E07B2B" }}>alimentos</span><br />
                son iguales.
              </h2>
            </RevealSection>
            <RevealSection className="delay-2">
              <p style={{ fontSize: "clamp(1rem, 1.8vw, 1.15rem)", color: "#6B5A4A", lineHeight: 1.75, marginBottom: "2rem" }}>
                La mayoría de los alimentos masivos usan harinas de baja calidad, conservantes artificiales y muy poca proteína real. El resultado: mascotas con problemas digestivos, pelaje opaco y menos energía.
              </p>
              <p style={{ fontSize: "clamp(1rem, 1.8vw, 1.15rem)", color: "#1A1209", fontWeight: 600, lineHeight: 1.75, marginBottom: "2rem" }}>
                Mashu usa ingredientes que podés pronunciar. Cada fórmula empieza con proteína real.
              </p>
              <Link href="/catalogo" style={{ color: "#E07B2B", fontWeight: 700, fontSize: "1rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", borderBottom: "2px solid #E07B2B", paddingBottom: "2px" }}>
                Ver todos los productos →
              </Link>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ── 4. PRODUCTOS — Asimétrico ── */}
      <section style={{ background: "#F0E6D4", padding: "clamp(4rem, 8vw, 7rem) 0" }}>
        <div className="container-site">
          <RevealSection style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#E07B2B", marginBottom: "0.5rem" }}>Catálogo</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: "#1A1209", letterSpacing: "-0.02em" }}>
                Lo que comés importa.<br />Lo que le das también.
              </h2>
            </div>
            <Link href="/catalogo" style={{ color: "#E07B2B", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", border: "1.5px solid #E07B2B", padding: "0.6rem 1.25rem", borderRadius: "8px", whiteSpace: "nowrap" }}>
              Ver todo el catálogo →
            </Link>
          </RevealSection>

          {items ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.25rem" }}>
              {items.map((p, i) => (
                <RevealSection key={p.id} className={`delay-${(i % 4) + 1}`}>
                  <ProductCard producto={p} />
                </RevealSection>
              ))}
            </div>
          ) : (
            <>
              {/* Asymmetric layout: 1 featured large + grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }} className="products-asymmetric">
                {/* Featured */}
                <RevealSection style={{ gridRow: "span 2" }}>
                  <article style={{
                    background: "#fff", borderRadius: "16px", border: "1px solid #EDE0D0",
                    overflow: "hidden", height: "100%", display: "flex", flexDirection: "column",
                    boxShadow: "0 2px 16px rgba(58,42,26,0.08)",
                  }}>
                    <div style={{ position: "relative", paddingBottom: "70%", background: "#fff", flexShrink: 0 }}>
                      <Image src={fallbackProductos[6].img} alt={fallbackProductos[6].nombre} fill style={{ objectFit: "contain", padding: "1.5rem" }} />
                      <span style={{ position: "absolute", top: "1rem", left: "1rem", background: "#E07B2B", color: "#fff", fontSize: "0.7rem", fontWeight: 700, padding: "0.3rem 0.75rem", borderRadius: "4px", letterSpacing: "0.05em" }}>DESTACADO</span>
                    </div>
                    <div style={{ padding: "1.5rem", flex: 1 }}>
                      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: "#1A1209", marginBottom: "0.5rem" }}>{fallbackProductos[6].nombre}</h3>
                      <p style={{ fontSize: "0.9rem", color: "#6B5A4A", lineHeight: 1.6, marginBottom: "1.25rem" }}>{fallbackProductos[6].desc}</p>
                      <Link href="/contacto" style={{ display: "inline-flex", alignItems: "center", background: "#E07B2B", color: "#fff", fontWeight: 700, padding: "0.75rem 1.5rem", borderRadius: "8px", fontSize: "0.9rem", textDecoration: "none" }}>
                        + Cotizar
                      </Link>
                    </div>
                  </article>
                </RevealSection>

                {/* 4 smaller cards in 2x2 */}
                {fallbackProductos.slice(0, 4).map((p, i) => (
                  <RevealSection key={p.nombre} className={`delay-${i + 1}`}>
                    <article style={{ background: "#fff", borderRadius: "12px", border: "1px solid #EDE0D0", overflow: "hidden", boxShadow: "0 1px 6px rgba(58,42,26,0.06)" }}>
                      <div style={{ position: "relative", paddingBottom: "65%", background: "#fff" }}>
                        <Image src={p.img} alt={p.nombre} fill style={{ objectFit: "contain", padding: "1rem" }} />
                      </div>
                      <div style={{ padding: "1rem" }}>
                        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", color: "#1A1209", marginBottom: "0.25rem" }}>{p.nombre}</h3>
                        <p style={{ fontSize: "0.78rem", color: "#9D8C7C", lineHeight: 1.4 }}>{p.desc}</p>
                      </div>
                    </article>
                  </RevealSection>
                ))}
              </div>

              {/* Remaining 3 in a row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }} className="products-row">
                {fallbackProductos.slice(4, 7).map((p, i) => (
                  <RevealSection key={p.nombre} className={`delay-${i + 1}`}>
                    <article style={{ background: "#fff", borderRadius: "12px", border: "1px solid #EDE0D0", overflow: "hidden", display: "flex", gap: "0.875rem", padding: "0.875rem", alignItems: "center", boxShadow: "0 1px 6px rgba(58,42,26,0.06)" }}>
                      <div style={{ position: "relative", width: "64px", height: "64px", flexShrink: 0, background: "#FFF8F0", borderRadius: "10px", overflow: "hidden" }}>
                        <Image src={p.img} alt={p.nombre} fill style={{ objectFit: "contain", padding: "0.5rem" }} />
                      </div>
                      <div>
                        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.88rem", color: "#1A1209", marginBottom: "0.2rem" }}>{p.nombre}</h3>
                        <p style={{ fontSize: "0.75rem", color: "#9D8C7C", lineHeight: 1.4 }}>{p.desc}</p>
                      </div>
                    </article>
                  </RevealSection>
                ))}
              </div>
            </>
          )}

          {/* Packs banner */}
          <RevealSection style={{ marginTop: "2.5rem" }}>
            <div style={{
              borderRadius: "20px", overflow: "hidden",
              background: "linear-gradient(130deg, #3B2A1A 0%, #5C4033 50%, #3B2A1A 100%)",
              display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center",
              padding: "clamp(1.75rem, 4vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)",
              gap: "2rem",
            }} className="packs-banner">
              <div>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#E07B2B", marginBottom: "0.75rem" }}>Packs a medida</p>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", color: "#fff", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "1rem" }}>
                  Gallinero · Torero<br />Clásico · Caldos
                </h3>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", lineHeight: 1.65, maxWidth: "380px", marginBottom: "1.5rem" }}>
                  Elegí los sabores que más le gustan a tu mascota. Armamos el pack ideal para cada familia.
                </p>
                <Link href="/catalogo" style={{ display: "inline-flex", alignItems: "center", background: "#E07B2B", color: "#fff", fontWeight: 700, padding: "0.8rem 1.75rem", borderRadius: "8px", fontSize: "0.9rem", textDecoration: "none" }}>
                  Ver todos los packs →
                </Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", flexShrink: 0 }} className="packs-imgs">
                {["/products/Pack Gallinero Arte.png", "/products/Pack Torero Arte.png", "/products/Pack Clásico Arte.png", "/products/Pack Caldos Arte.png"].map((src, i) => (
                  <div key={i} style={{ width: "90px", height: "90px", borderRadius: "12px", background: "rgba(255,255,255,0.08)", position: "relative", overflow: "hidden" }}>
                    <Image src={src} alt="Pack" fill style={{ objectFit: "contain", padding: "0.375rem" }} />
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── 5. PROMISE — Full-bleed split ── */}
      <section style={{ background: "#1A1209" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "520px" }} className="promise-split">
          {/* Image side */}
          <div style={{ position: "relative", minHeight: "380px", background: "#2A1F15" }}>
            <Image
              src="/products/Pollo Granjero.png"
              alt="Ingredientes Mashu"
              fill
              style={{ objectFit: "contain", padding: "3rem", opacity: 0.9 }}
            />
          </div>
          {/* Text side */}
          <div style={{ padding: "clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <RevealSection>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E07B2B", marginBottom: "1.25rem" }}>Nuestra promesa</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.25rem)", color: "#fff", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "2rem" }}>
                Ingredientes que<br />
                <span style={{ color: "#E07B2B" }}>podés pronunciar.</span>
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2.5rem" }}>
                {[
                  { icon: "✓", text: "Proteína real como primer ingrediente en cada fórmula" },
                  { icon: "✓", text: "Sin colorantes, saborizantes ni conservantes artificiales" },
                  { icon: "✓", text: "Supervisado por nutricionistas veterinarios especializados" },
                ].map((item) => (
                  <div key={item.text} style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
                    <span style={{ color: "#E07B2B", fontWeight: 800, fontSize: "1.1rem", flexShrink: 0, marginTop: "1px" }}>{item.icon}</span>
                    <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.95rem", lineHeight: 1.6 }}>{item.text}</p>
                  </div>
                ))}
              </div>
              <Link href="/contacto" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#fff", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none", borderBottom: "2px solid rgba(255,255,255,0.3)", paddingBottom: "3px", width: "fit-content" }}>
                Hablar con un especialista →
              </Link>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ── 6. STATS — Dark, números enormes ── */}
      <section style={{ background: "#1A1209", borderTop: "1px solid #2A1F15", padding: "clamp(4rem, 8vw, 6rem) 0" }}>
        <div className="container-site">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", textAlign: "center" }} className="stats-grid">
            {[
              { num: "2,400+", label: "Mascotas alimentadas" },
              { num: "97%", label: "Clientes satisfechos" },
              { num: "24hs", label: "Tiempo de respuesta" },
              { num: "★ 4.9", label: "Calificación promedio" },
            ].map((s, i) => (
              <RevealSection key={s.label} className={`delay-${i + 1}`} style={{ padding: "1.5rem 1rem" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#E07B2B", lineHeight: 1, marginBottom: "0.625rem", letterSpacing: "-0.02em" }}>{s.num}</div>
                <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", fontWeight: 500, letterSpacing: "0.04em" }}>{s.label}</div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CÓMO FUNCIONA — Horizontal timeline ── */}
      <section style={{ background: "#FFF8F0", padding: "clamp(5rem, 9vw, 7rem) 0" }}>
        <div className="container-site">
          <RevealSection style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#E07B2B", marginBottom: "0.75rem" }}>Proceso</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: "#1A1209", letterSpacing: "-0.02em" }}>Tan fácil como 3 pasos</h2>
          </RevealSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0", position: "relative" }} className="steps-grid">
            {[
              { num: "01", titulo: "Elegí tus productos", desc: "Explorá el catálogo y agregá lo que necesitás a tu lista de cotización.", icon: "📦" },
              { num: "02", titulo: "Cotizá por WhatsApp", desc: "Con un clic mandamos tu lista. Te respondemos en menos de 24 horas.", icon: "💬" },
              { num: "03", titulo: "Recibís tu pedido", desc: "Coordinamos la entrega y tu mascota come mejor desde el primer día.", icon: "🏠" },
            ].map((paso, i) => (
              <RevealSection key={paso.num} className={`delay-${i + 1}`}>
                <div style={{
                  padding: "2.5rem 2rem",
                  borderLeft: i > 0 ? "1px solid #E8D9C8" : "none",
                  height: "100%",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.25rem" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "3rem", color: "#E8D9C8", lineHeight: 1, letterSpacing: "-0.04em" }}>{paso.num}</span>
                    <span style={{ fontSize: "1.5rem" }}>{paso.icon}</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "#1A1209", marginBottom: "0.625rem" }}>{paso.titulo}</h3>
                  <p style={{ fontSize: "0.9rem", color: "#6B5A4A", lineHeight: 1.65 }}>{paso.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. NOVEDADES ── */}
      {posts.length > 0 && (
        <section style={{ background: "#F0E6D4", padding: "clamp(4rem, 8vw, 6rem) 0" }}>
          <div className="container-site">
            <RevealSection style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#E07B2B", marginBottom: "0.5rem" }}>Blog</p>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", color: "#1A1209", letterSpacing: "-0.02em" }}>Novedades</h2>
              </div>
              <Link href="/novedades" style={{ color: "#E07B2B", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none", border: "1.5px solid #E07B2B", padding: "0.5rem 1.125rem", borderRadius: "8px" }}>
                Ver todas →
              </Link>
            </RevealSection>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1.25rem" }}>
              {posts.map((post, i) => (
                <RevealSection key={post.id} className={`delay-${i + 1}`}>
                  <Link href={`/novedades/${post.slug}`} style={{ textDecoration: "none", display: "block" }}>
                    <article style={{ background: "#fff", borderRadius: "16px", border: "1px solid #EDE0D0", overflow: "hidden", transition: "transform 200ms" }}>
                      {post.imagen_url && (
                        <div style={{ position: "relative", paddingBottom: "52%", background: "#FFF8F0" }}>
                          <Image src={post.imagen_url} alt={post.titulo} fill style={{ objectFit: "cover" }} />
                        </div>
                      )}
                      <div style={{ padding: "1.25rem" }}>
                        <p style={{ fontSize: "0.72rem", color: "#E07B2B", fontWeight: 700, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                          {new Date(post.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#1A1209", fontSize: "1rem", lineHeight: 1.35, marginBottom: "0.375rem" }}>{post.titulo}</h3>
                        {post.resumen && <p style={{ color: "#6B5A4A", fontSize: "0.85rem", lineHeight: 1.6 }}>{post.resumen}</p>}
                      </div>
                    </article>
                  </Link>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 9. FAQ ── */}
      <section style={{ background: "#FFF8F0", padding: "clamp(4rem, 8vw, 6rem) 0" }}>
        <div className="container-site" style={{ maxWidth: "800px" }}>
          <RevealSection style={{ marginBottom: "3rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#E07B2B", marginBottom: "0.75rem" }}>FAQ</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: "#1A1209", letterSpacing: "-0.02em" }}>Preguntas frecuentes</h2>
          </RevealSection>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {faqs.map((faq, i) => (
              <RevealSection key={i} className={`delay-${(i % 3) + 1}`}>
                <FaqItem question={faq.q} answer={faq.a} />
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. NEWSLETTER ── */}
      <section style={{ background: "#3B2A1A", padding: "clamp(4rem, 8vw, 6rem) 0" }}>
        <div className="container-site" style={{ maxWidth: "560px", textAlign: "center" }}>
          <RevealSection>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E07B2B", marginBottom: "1rem" }}>Newsletter</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#fff", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
              Tips y ofertas exclusivas
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: "2rem", fontSize: "0.95rem", lineHeight: 1.7 }}>
              Novedades, recetas y consejos de nutrición directo a tu email. Sin spam.
            </p>
            <NewsletterForm />
          </RevealSection>
        </div>
      </section>

      {/* ── 11. FINAL CTA — Dark, editorial ── */}
      <section style={{ background: "#1A1209", padding: "clamp(5rem, 10vw, 9rem) 0", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Decorative glow */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "600px", height: "300px", background: "radial-gradient(ellipse, rgba(224,123,43,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="container-site" style={{ position: "relative" }}>
          <RevealSection>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E07B2B", marginBottom: "1.5rem" }}>Empezá hoy</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.5rem, 7vw, 6rem)", color: "#fff", lineHeight: 1.0, letterSpacing: "-0.03em", marginBottom: "2rem" }}>
              Tu mascota ya<br />
              <span style={{ color: "#E07B2B" }}>espera su pedido.</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.05rem", marginBottom: "2.5rem", lineHeight: 1.7 }}>
              Armá tu lista, cotizá por WhatsApp y recibís respuesta en menos de 24 horas.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/catalogo" style={{ display: "inline-flex", alignItems: "center", background: "#E07B2B", color: "#fff", fontWeight: 700, padding: "1rem 2.25rem", borderRadius: "8px", fontSize: "1rem", textDecoration: "none" }}>
                Ver catálogo →
              </Link>
              <Link href="/contacto" style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.8)", fontWeight: 600, padding: "1rem 2.25rem", borderRadius: "8px", fontSize: "1rem", textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)" }}>
                Hablar con nosotros
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      <style>{`
        .hero-cta-primary:hover { background: #D46A1A !important; transform: translateY(-1px); }
        @keyframes scroll-line {
          0%   { transform: translateY(-100%); opacity: 1; }
          100% { transform: translateY(200%); opacity: 0; }
        }
        @media (max-width: 768px) {
          .statement-grid { grid-template-columns: 1fr !important; }
          .promise-split  { grid-template-columns: 1fr !important; }
          .steps-grid     { grid-template-columns: 1fr !important; }
          .stats-grid     { grid-template-columns: repeat(2, 1fr) !important; }
          .products-asymmetric { grid-template-columns: 1fr 1fr !important; }
          .products-row   { grid-template-columns: 1fr !important; }
          .packs-banner   { grid-template-columns: 1fr !important; }
          .packs-imgs     { display: none !important; }
        }
        @media (max-width: 480px) {
          .stats-grid     { grid-template-columns: repeat(2, 1fr) !important; }
          .products-asymmetric { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details style={{ background: "#fff", borderRadius: "12px", border: "1px solid #EDE0D0", overflow: "hidden" }}>
      <summary style={{
        padding: "1.125rem 1.5rem", fontFamily: "var(--font-display)", fontWeight: 600,
        fontSize: "0.975rem", color: "#1A1209", cursor: "pointer", listStyle: "none",
        display: "flex", justifyContent: "space-between", alignItems: "center", userSelect: "none",
      }}>
        {question}
        <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#F0E6D4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: "1rem", color: "#E07B2B", fontSize: "1rem", fontWeight: 400, lineHeight: 1 }}>+</span>
      </summary>
      <div style={{ padding: "0 1.5rem 1.125rem", fontSize: "0.9rem", color: "#6B5A4A", lineHeight: 1.7, borderTop: "1px solid #F5EDE0" }}>
        {answer}
      </div>
    </details>
  )
}
