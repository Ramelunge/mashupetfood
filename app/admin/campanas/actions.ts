"use server"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function getHiggsfieldKey() {
  const supabase = await createClient()
  const { data } = await supabase.from("config").select("value").eq("key", "higgsfield_api_key").single()
  return data?.value ?? ""
}

export async function crearCampana(formData: FormData) {
  const supabase = await createClient()
  const payload = {
    nombre:      formData.get("nombre") as string,
    descripcion: formData.get("descripcion") as string,
    tipo:        formData.get("tipo") as string,
    prompt:      formData.get("prompt") as string,
    aspecto:     formData.get("aspecto") as string,
    duracion_seg: Number(formData.get("duracion_seg") ?? 5),
    plataformas:  (formData.get("plataformas") as string ?? "").split(",").map(s => s.trim()).filter(Boolean),
    notas:       formData.get("notas") as string,
    fecha_inicio: formData.get("fecha_inicio") as string || null,
    fecha_fin:    formData.get("fecha_fin") as string || null,
    estado:      "borrador",
  }
  const { data, error } = await supabase.from("campanas").insert(payload).select().single()
  if (error) throw new Error(error.message)
  revalidatePath("/admin/campanas")
  return data
}

export async function generarVideoHiggsfield(campanaId: string) {
  const supabase = await createClient()
  const apiKey = await getHiggsfieldKey()
  if (!apiKey) throw new Error("Configurá la API key de Higgsfield en Configuración del panel.")

  const { data: campana } = await supabase.from("campanas").select("*").eq("id", campanaId).single()
  if (!campana) throw new Error("Campaña no encontrada")

  await supabase.from("campanas").update({ estado: "generando" }).eq("id", campanaId)

  const res = await fetch("https://api.higgsfield.ai/v1/generation", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt:        campana.prompt,
      aspect_ratio:  campana.aspecto,
      duration:      campana.duracion_seg,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    await supabase.from("campanas").update({ estado: "error", hf_error: err }).eq("id", campanaId)
    throw new Error(`Higgsfield error: ${err}`)
  }

  const job = await res.json()
  await supabase.from("campanas").update({ hf_job_id: job.id ?? job.job_id, estado: "generando" }).eq("id", campanaId)
  revalidatePath("/admin/campanas")
  return job
}

export async function checkEstadoVideo(campanaId: string) {
  const supabase = await createClient()
  const apiKey = await getHiggsfieldKey()

  const { data: campana } = await supabase.from("campanas").select("hf_job_id").eq("id", campanaId).single()
  if (!campana?.hf_job_id) throw new Error("Sin job_id")

  const res = await fetch(`https://api.higgsfield.ai/v1/generation/${campana.hf_job_id}`, {
    headers: { "Authorization": `Bearer ${apiKey}` },
  })
  const job = await res.json()

  if (job.status === "completed" || job.state === "completed") {
    await supabase.from("campanas").update({
      estado: "listo",
      hf_video_url: job.video_url ?? job.output?.video_url,
      hf_thumbnail_url: job.thumbnail_url ?? job.output?.thumbnail_url,
    }).eq("id", campanaId)
  } else if (job.status === "failed" || job.state === "failed") {
    await supabase.from("campanas").update({ estado: "error", hf_error: job.error ?? "Error desconocido" }).eq("id", campanaId)
  }

  revalidatePath("/admin/campanas")
  return job
}

export async function actualizarEstadoCampana(campanaId: string, estado: string) {
  const supabase = await createClient()
  await supabase.from("campanas").update({ estado, updated_at: new Date().toISOString() }).eq("id", campanaId)
  revalidatePath("/admin/campanas")
}

export async function eliminarCampana(campanaId: string) {
  const supabase = await createClient()
  await supabase.from("campanas").delete().eq("id", campanaId)
  revalidatePath("/admin/campanas")
}
