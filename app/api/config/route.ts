import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  const keys = req.nextUrl.searchParams.get("keys")?.split(",") ?? []
  if (!keys.length) return NextResponse.json({})

  const supabase = await createClient()
  const { data } = await supabase.from("config").select("key,value").in("key", keys)
  const result = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]))
  return NextResponse.json(result)
}
