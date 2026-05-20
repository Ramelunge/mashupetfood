import { createClient } from "./supabase/server"

export type SiteConfig = Record<string, string>

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("config").select("key,value")
    if (!data) return {}
    return Object.fromEntries(data.map((r) => [r.key, r.value ?? ""]))
  } catch {
    return {}
  }
}

export async function isMaintenanceMode(): Promise<boolean> {
  const cfg = await getSiteConfig()
  return cfg["mantenimiento_activo"] === "true"
}
