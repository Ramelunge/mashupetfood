export interface CartItem {
  id: string
  nombre: string
  variante?: string
  cantidad: number
  precio?: number
  imagen_url?: string
}

export function buildWhatsAppLink(
  items: CartItem[],
  numero: string,
  mensajeDefault = "Hola Mashu! Quiero cotizar:"
): string {
  const lineas = items
    .map((i) => `• ${i.nombre}${i.variante ? ` (${i.variante})` : ""} x${i.cantidad}`)
    .join("\n")
  const texto = encodeURIComponent(`${mensajeDefault}\n\n${lineas}`)
  return `https://wa.me/${numero}?text=${texto}`
}
