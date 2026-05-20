"use client"

interface Props {
  defaultValue?: string
  cat?: string
}

export default function CatalogoSortSelect({ defaultValue, cat }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const url = new URL(window.location.href)
    if (e.target.value) {
      url.searchParams.set("orden", e.target.value)
    } else {
      url.searchParams.delete("orden")
    }
    window.location.href = url.toString()
  }

  return (
    <select
      onChange={handleChange}
      defaultValue={defaultValue ?? ""}
      style={{
        padding: "0.65rem 1rem",
        borderRadius: "var(--radius-md)",
        border: "1.5px solid var(--color-cream-dark)",
        fontSize: "0.9rem",
        background: "#fff",
        cursor: "pointer",
        color: "var(--color-secondary)",
      }}
    >
      <option value="">Ordenar por</option>
      <option value="nombre_asc">Nombre A-Z</option>
      <option value="precio_asc">Precio: menor a mayor</option>
      <option value="precio_desc">Precio: mayor a menor</option>
    </select>
  )
}
