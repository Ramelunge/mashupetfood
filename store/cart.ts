"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { type CartItem, buildWhatsAppLink } from "@/lib/whatsapp"

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  add: (item: CartItem) => void
  remove: (id: string, variante?: string) => void
  updateQty: (id: string, variante: string | undefined, qty: number) => void
  clear: () => void
  toggle: () => void
  open: () => void
  close: () => void
  getWhatsAppLink: (numero: string, msg?: string) => string
  total: () => number
  count: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      add: (item) =>
        set((s) => {
          const exists = s.items.find(
            (i) => i.id === item.id && i.variante === item.variante
          )
          if (exists) {
            return {
              items: s.items.map((i) =>
                i.id === item.id && i.variante === item.variante
                  ? { ...i, cantidad: i.cantidad + item.cantidad }
                  : i
              ),
            }
          }
          return { items: [...s.items, item] }
        }),

      remove: (id, variante) =>
        set((s) => ({
          items: s.items.filter((i) => !(i.id === id && i.variante === variante)),
        })),

      updateQty: (id, variante, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => !(i.id === id && i.variante === variante))
              : s.items.map((i) =>
                  i.id === id && i.variante === variante ? { ...i, cantidad: qty } : i
                ),
        })),

      clear: () => set({ items: [] }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),

      getWhatsAppLink: (numero, msg) =>
        buildWhatsAppLink(get().items, numero, msg),

      total: () =>
        get().items.reduce((acc, i) => acc + (i.precio ?? 0) * i.cantidad, 0),

      count: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),
    }),
    { name: "mashu-cart" }
  )
)
