import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"
import CampanasClient from "./CampanasClient"

export const metadata: Metadata = { title: "Campañas — Mashu Admin" }

export default async function CampanasPage() {
  const supabase = await createClient()

  const [{ data: campanas }, { data: cfgRows }] = await Promise.all([
    supabase.from("campanas").select("*").order("created_at", { ascending: false }),
    supabase.from("config").select("key,value").in("key", ["higgsfield_api_key"]),
  ])

  const cfg = Object.fromEntries((cfgRows ?? []).map(r => [r.key, r.value]))
  const hasApiKey = !!cfg.higgsfield_api_key

  return <CampanasClient campanas={campanas ?? []} hasApiKey={hasApiKey} />
}
