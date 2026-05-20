import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: "Email requerido" }, { status: 400 })

  const supabase = await createAdminClient()
  const { error } = await supabase.from("suscriptores").upsert({ email }, { onConflict: "email" })

  if (error) return NextResponse.json({ error: "Error al suscribir" }, { status: 500 })
  return NextResponse.json({ ok: true })
}
