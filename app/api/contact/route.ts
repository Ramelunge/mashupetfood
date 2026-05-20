import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { nombre, email, telefono, mascota, mensaje } = body

  if (!nombre || !mensaje) {
    return NextResponse.json({ error: "Nombre y mensaje son requeridos" }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const { error } = await supabase.from("leads").insert({
    nombre, email, telefono, mascota, mensaje, fuente: "web",
  })

  if (error) return NextResponse.json({ error: "Error al guardar" }, { status: 500 })
  return NextResponse.json({ ok: true })
}
