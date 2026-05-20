import Navbar from "@/components/site/Navbar"
import Footer from "@/components/site/Footer"
import QuoteCart from "@/components/site/QuoteCart"
import WhatsAppButton from "@/components/site/WhatsAppButton"
import { createClient } from "@/lib/supabase/server"

async function getSiteFooterData() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("config")
      .select("key,value")
      .in("key", ["instagram", "facebook", "email_contacto", "horario", "whatsapp_numero"])
    return Object.fromEntries((data ?? []).map((r) => [r.key, r.value]))
  } catch {
    return {}
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const cfg = await getSiteFooterData()

  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer
        instagram={cfg.instagram}
        facebook={cfg.facebook}
        email={cfg.email_contacto}
        horario={cfg.horario}
        whatsapp={cfg.whatsapp_numero}
      />
      <QuoteCart />
      <WhatsAppButton />
    </>
  )
}
