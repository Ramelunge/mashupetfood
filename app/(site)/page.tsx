import { redirect } from "next/navigation"

// La home ahora vive en /previews/style-crumbl.html vía middleware
export default function Home() {
  redirect("/previews/style-crumbl.html")
}
