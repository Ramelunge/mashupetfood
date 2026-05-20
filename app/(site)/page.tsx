import { createClient } from "@/lib/supabase/server"
import HeroSlider from "@/components/site/HeroSlider"
import StatsCounter from "@/components/site/StatsCounter"
import ProductCard from "@/components/site/ProductCard"
import NewsletterForm from "@/components/site/NewsletterForm"
import RevealSection from "@/components/site/RevealSection"
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

const defaultSlides = [{
  id: "demo",
  titulo: "El alimento que tu mascota se merece",
  subtitulo: "Recetas naturales con ingredientes premium. Sin conservantes artificiales. Sin compromisos.",
  cta_texto: "Ver catálogo",
  cta_url: "/catalogo",
  imagen_url: "/products/Productos.png",
  orden: 0,
  activo: true,
  created_at: "",
}, {
  id: "demo2",
  titulo: "Packs especiales para cada familia",
  subtitulo: "Combos armados con los mejores sabores: Gallinero, Torero, Clásico y más.",
  cta_texto: "Cotizar pack",
  cta_url: "/catalogo",
  imagen_url: "/products/Pack Gallinero Arte.png",
  orden: 1,
  activo: true,
  created_at: "",
}, {
  id: "demo3",
  titulo: "Caldos naturales llenos de sabor",
  subtitulo: "Pollo y Res cocinados lentamente. Hidratación y nutrición en cada sorbo.",
  cta_texto: "Ver caldos",
  cta_url: "/catalogo",
  imagen_url: "/products/Pack Caldos Arte.png",
  orden: 2,
  activo: true,
  created_at: "",
}]

const pilares = [
  {
    icon: "🌿",
    titulo: "Sin conservantes artificiales",
    desc: "Ingredientes naturales seleccionados. Lo que le darías si lo cocinaras vos mismo.",
    color: "#dcfce7",
    colorIcon: "#16a34a",
  },
  {
    icon: "⚡",
    titulo: "Respuesta en menos de 24hs",
    desc: "Te cotizamos rápido. Sin formularios eternos, sin call centers.",
    color: "#fef9c3",
    colorIcon: "#ca8a04",
  },
  {
    icon: "🏆",
    titulo: "Formulado por especialistas",
    desc: "Nutricionistas veterinarios detrás de cada receta. Ciencia al servicio de tu mascota.",
    color: "#ede9fe",
    colorIcon: "#7c3aed",
  },
  {
    icon: "❤️",
    titulo: "Asesoría personalizada",
    desc: "Te ayudamos a elegir según raza, edad y condición. No vendemos paquetes genéricos.",
    color: "#ffe4e6",
    colorIcon: "#e11d48",
  },
]

const pasos = [
  { num: "01", titulo: "Elegí tus productos", desc: "Explorá el catálogo y agregá lo que necesitás a tu lista de cotización." },
  { num: "02", titulo: "Cotizá por WhatsApp", desc: "Con un clic mandamos tu lista. Te respondemos en menos de 24 horas." },
  { num: "03", titulo: "Recibís tu pedido", desc: "Coordinamos la entrega y tu mascota come mejor desde el primer día." },
]

const faqs = [
  { q: "¿Qué hace diferente a Mashu de otras marcas?", a: "Nuestras recetas no tienen conservantes artificiales. Usamos proteínas reales como primer ingrediente, y cada fórmula es supervisada por nutricionistas veterinarios." },
  { q: "¿Cómo hago para cotizar?", a: "Agregás los productos que querés a la lista de cotización (el ícono del carrito), y al presionar 'Cotizar por WhatsApp' te armamos la respuesta en menos de 24 horas." },
  { q: "¿Hacen envíos?", a: "Sí. Coordinamos envíos y también podés retirar en nuestro punto de venta. Consultanos por WhatsApp para los detalles según tu zona." },
  { q: "¿Tienen productos para gatos también?", a: "Contamos con líneas específicas para gatos y para perros. También tenemos packs mixtos para familias con ambas mascotas." },
  { q: "¿Puedo cambiar el alimento de mi mascota bruscamente?", a: "Recomendamos una transición de 7-10 días mezclando el alimento actual con el nuevo. Podés consultarnos y te armamos un plan personalizado." },
]

export default async function HomePage() {
  const { slides, stats, productos, marcas, posts } = await getHomeData()
  const heroSlides = slides.length ? slides : defaultSlides

  return (
    <>
      {/* ── SKIP LINK ── */}
      <a href="#main-content" className="skip-link">Saltar al contenido</a>

      {/* ── 1. HERO ── */}
      <HeroSlider slides={heroSlides} />

      {/* ── 2. SOCIAL PROOF BAR ── */}
      {stats.length > 0 && <StatsCounter stats={stats} />}

      {/* ── 3. PROBLEMA / PAIN ── */}
      <section id="main-content" className="section" style={{ background: "#fff" }}>
        <div className="container-site" style={{ maxWidth: "860px", textAlign: "center", margin: "0 auto" }}>
          <RevealSection>
            <span className="section-label">El problema</span>
            <h2 className="text-headline" style={{ color: "var(--color-secondary)", marginBottom: "1.5rem" }}>
              Tu mascota se merece más que ingredientes que no podés pronunciar
            </h2>
            <p style={{ fontSize: "clamp(1rem, 2vw, 1.175rem)", color: "var(--color-muted)", lineHeight: 1.75, marginBottom: "2.5rem" }}>
              La mayoría de los alimentos masivos usan harinas de baja calidad, conservantes artificiales y muy poca proteína real.
              El resultado: mascotas con problemas digestivos, pelaje opaco y menos energía.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", textAlign: "left" }}>
              {[
                { icon: "❌", text: "Ingredientes irreconocibles en la etiqueta" },
                { icon: "❌", text: "Harinas de carne de origen desconocido" },
                { icon: "❌", text: "Colorantes y conservantes artificiales" },
              ].map((item) => (
                <div key={item.text} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", padding: "1rem", background: "#fff5f5", borderRadius: "var(--radius-md)", border: "1px solid #fecaca" }}>
                  <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>{item.icon}</span>
                  <p style={{ fontSize: "0.9rem", color: "#991b1b", fontWeight: 500, lineHeight: 1.5 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── 4. SOLUCIÓN / PILARES ── */}
      <section className="section" style={{ background: "var(--color-cream)" }}>
        <div className="container-site">
          <RevealSection style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-label">La solución</span>
            <h2 className="text-headline" style={{ color: "var(--color-secondary)" }}>¿Por qué elegir Mashu?</h2>
          </RevealSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {pilares.map((p, i) => (
              <RevealSection key={p.titulo} className={`delay-${i + 1}`}>
                <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", padding: "2rem", boxShadow: "var(--shadow-sm)", height: "100%", border: "1px solid var(--color-cream-dark)" }}>
                  <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>
                    {p.icon}
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color: "var(--color-secondary)", marginBottom: "0.5rem" }}>{p.titulo}</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--color-muted)", lineHeight: 1.65 }}>{p.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. PRODUCTOS DESTACADOS ── */}
      <section className="section" style={{ background: "#fff" }}>
        <div className="container-site">
          <RevealSection style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span className="section-label">Catálogo</span>
              <h2 className="text-headline" style={{ color: "var(--color-secondary)" }}>Productos destacados</h2>
            </div>
            <Link href="/catalogo" className="btn btn-outline btn-sm">Ver todo →</Link>
          </RevealSection>

          {productos.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
              {productos.map((p, i) => (
                <RevealSection key={p.id} className={`delay-${(i % 4) + 1}`}>
                  <ProductCard producto={p} />
                </RevealSection>
              ))}
            </div>
          ) : (
            // Fallback con las imágenes reales que tenemos
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
              {[
                { nombre: "Caldo de Pollo", img: "/products/Caldo Pollo.png", desc: "Hidratación natural con proteína real", precio: null },
                { nombre: "Caldo de Res", img: "/products/Caldo Res.png", desc: "Rico en colágeno y nutrientes esenciales", precio: null },
                { nombre: "Carne Vaquera", img: "/products/Carne Vaquera.png", desc: "Proteína premium de primera calidad", precio: null },
                { nombre: "Pollo Granjero", img: "/products/Pollo Granjero.png", desc: "Pollo de campo con sabor auténtico", precio: null },
                { nombre: "Pollo Ranchero", img: "/products/Pollo Ranchero.png", desc: "Combinación perfecta de sabor y nutrición", precio: null },
                { nombre: "Puré de Hígado", img: "/products/Puré Hígado.png", desc: "Alto en hierro y vitaminas B", precio: null },
                { nombre: "Pack Gallinero", img: "/products/Pack Gallinero.png", desc: "El pack favorito de las familias", precio: null },
                { nombre: "Pack Clásico", img: "/products/Pack Clásico.png", desc: "Variedad perfecta para empezar", precio: null },
              ].map((p, i) => (
                <RevealSection key={p.nombre} className={`delay-${(i % 4) + 1}`}>
                  <article className="card" style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ position: "relative", paddingBottom: "80%", background: "var(--color-cream)" }}>
                      <Image src={p.img} alt={p.nombre} fill style={{ objectFit: "contain", padding: "1rem" }} />
                    </div>
                    <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.975rem", color: "var(--color-secondary)" }}>{p.nombre}</h3>
                      <p style={{ fontSize: "0.82rem", color: "var(--color-muted)", lineHeight: 1.5, flex: 1 }}>{p.desc}</p>
                      <Link href="/contacto" className="btn btn-primary btn-sm" style={{ marginTop: "0.5rem" }}>
                        + Cotizar
                      </Link>
                    </div>
                  </article>
                </RevealSection>
              ))}
            </div>
          )}

          {/* Packs highlight */}
          <RevealSection style={{ marginTop: "3rem" }}>
            <div style={{ borderRadius: "var(--radius-xl)", background: "linear-gradient(135deg, var(--color-secondary) 0%, #5C4033 100%)", padding: "clamp(2rem, 5vw, 3.5rem)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "center" }} className="pack-grid">
              <div>
                <span className="section-label" style={{ color: "var(--color-primary-light)" }}>Novedad</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#fff", lineHeight: 1.2, marginBottom: "1rem" }}>
                  Armá tu pack a medida
                </h3>
                <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: "1.5rem", fontSize: "0.975rem" }}>
                  Gallinero, Torero, Clásico, Trica Mixta — elegí los sabores que más le gustan a tu mascota y armamos el pack ideal.
                </p>
                <Link href="/catalogo" className="btn btn-primary btn-lg">Ver todos los packs →</Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[
                  "/products/Pack Gallinero Arte.png",
                  "/products/Pack Torero Arte.png",
                  "/products/Pack Clásico Arte.png",
                  "/products/Pack Caldos Arte.png",
                ].map((src, i) => (
                  <div key={i} style={{ borderRadius: "var(--radius-md)", overflow: "hidden", background: "rgba(255,255,255,0.08)", aspectRatio: "1", position: "relative" }}>
                    <Image src={src} alt="Pack Mashu" fill style={{ objectFit: "contain", padding: "0.5rem" }} />
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── 6. CÓMO FUNCIONA ── */}
      <section className="section" style={{ background: "var(--color-cream)" }}>
        <div className="container-site">
          <RevealSection style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-label">Proceso</span>
            <h2 className="text-headline" style={{ color: "var(--color-secondary)" }}>Tan fácil como 3 pasos</h2>
          </RevealSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem", position: "relative" }}>
            {pasos.map((p, i) => (
              <RevealSection key={p.num} className={`delay-${i + 1}`} style={{ textAlign: "center" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--color-primary)", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                  {p.num}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "var(--color-secondary)", marginBottom: "0.5rem" }}>{p.titulo}</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--color-muted)", lineHeight: 1.65 }}>{p.desc}</p>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. MARCAS ── */}
      {marcas.length > 0 && (
        <section style={{ padding: "2.5rem 0", background: "#fff", borderTop: "1px solid var(--color-cream-dark)", borderBottom: "1px solid var(--color-cream-dark)" }}>
          <div className="container-site" style={{ textAlign: "center" }}>
            <p className="text-label" style={{ color: "var(--color-muted)", marginBottom: "1.5rem" }}>Trabajamos con las mejores marcas</p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "2.5rem" }}>
              {marcas.map((m) => m.logo_url ? (
                <Image key={m.id} src={m.logo_url} alt={m.nombre} width={100} height={36} style={{ objectFit: "contain", filter: "grayscale(1)", opacity: 0.55 }} />
              ) : (
                <span key={m.id} style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--color-muted)", fontSize: "1.05rem", opacity: 0.7 }}>{m.nombre}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 8. NOVEDADES ── */}
      {posts.length > 0 && (
        <section className="section" style={{ background: "var(--color-cream)" }}>
          <div className="container-site">
            <RevealSection style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <span className="section-label">Blog</span>
                <h2 className="text-headline" style={{ color: "var(--color-secondary)" }}>Novedades</h2>
              </div>
              <Link href="/novedades" className="btn btn-outline btn-sm">Ver todas →</Link>
            </RevealSection>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1.5rem" }}>
              {posts.map((post, i) => (
                <RevealSection key={post.id} className={`delay-${i + 1}`}>
                  <Link href={`/novedades/${post.slug}`} style={{ textDecoration: "none", display: "block" }}>
                    <article className="card">
                      {post.imagen_url && (
                        <div style={{ position: "relative", paddingBottom: "52%", background: "var(--color-cream)" }}>
                          <Image src={post.imagen_url} alt={post.titulo} fill style={{ objectFit: "cover" }} />
                        </div>
                      )}
                      <div style={{ padding: "1.5rem" }}>
                        <p style={{ fontSize: "0.75rem", color: "var(--color-primary)", fontWeight: 700, marginBottom: "0.5rem" }}>
                          {new Date(post.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--color-secondary)", fontSize: "1rem", lineHeight: 1.35, marginBottom: "0.5rem" }}>{post.titulo}</h3>
                        {post.resumen && <p style={{ color: "var(--color-muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>{post.resumen}</p>}
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
      <section className="section" style={{ background: "#fff" }}>
        <div className="container-site" style={{ maxWidth: "760px", margin: "0 auto" }}>
          <RevealSection style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-label">FAQ</span>
            <h2 className="text-headline" style={{ color: "var(--color-secondary)" }}>Preguntas frecuentes</h2>
          </RevealSection>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {faqs.map((faq, i) => (
              <RevealSection key={i} className={`delay-${(i % 3) + 1}`}>
                <FaqItem question={faq.q} answer={faq.a} />
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. NEWSLETTER ── */}
      <section className="section" style={{ background: "var(--color-secondary)" }}>
        <div className="container-site" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <RevealSection>
            <span className="section-label" style={{ color: "var(--color-primary-light)" }}>Newsletter</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#fff", marginBottom: "0.75rem" }}>
              Tips y ofertas exclusivas
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "2rem", fontSize: "0.975rem" }}>
              Suscribite y recibí novedades de Mashu directamente en tu email. Sin spam.
            </p>
            <NewsletterForm />
          </RevealSection>
        </div>
      </section>

      {/* ── 11. FINAL CTA ── */}
      <section className="section" style={{ background: "var(--color-primary)" }}>
        <div className="container-site" style={{ textAlign: "center" }}>
          <RevealSection>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: "#fff", marginBottom: "1rem", lineHeight: 1.2 }}>
              Tu mascota ya espera su primer pedido
            </h2>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.1rem", marginBottom: "2rem" }}>
              Armá tu lista, cotizá por WhatsApp y recibís tu respuesta en menos de 24 horas.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/catalogo" className="btn" style={{ background: "#fff", color: "var(--color-primary)", fontWeight: 700, padding: "0.9rem 2.25rem", borderRadius: "var(--radius-full)", fontSize: "1rem" }}>
                Ver catálogo →
              </Link>
              <Link href="/contacto" className="btn btn-ghost btn-lg">Hablar con nosotros</Link>
            </div>
          </RevealSection>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .pack-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details style={{ background: "var(--color-cream)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-cream-dark)", overflow: "hidden" }}>
      <summary style={{ padding: "1.1rem 1.5rem", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.975rem", color: "var(--color-secondary)", cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center", userSelect: "none" }}>
        {question}
        <span style={{ fontSize: "1.25rem", color: "var(--color-primary)", flexShrink: 0, marginLeft: "1rem", fontWeight: 300 }}>+</span>
      </summary>
      <div style={{ padding: "0 1.5rem 1.1rem", fontSize: "0.9rem", color: "var(--color-muted)", lineHeight: 1.7 }}>
        {answer}
      </div>
    </details>
  )
}
