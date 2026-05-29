import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Nueva home y rutas del rediseño
  if (pathname === "/" || pathname === "/inicio") {
    return NextResponse.rewrite(new URL("/previews/style-crumbl.html", request.url))
  }
  if (pathname === "/pedidos") {
    return NextResponse.rewrite(new URL("/previews/page-pedidos.html", request.url))
  }
  if (pathname === "/giftcards") {
    return NextResponse.rewrite(new URL("/previews/page-giftcards.html", request.url))
  }

  // Proteger rutas /admin (excepto /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Modo mantenimiento — solo para rutas públicas
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api") && pathname !== "/mantenimiento") {
    try {
      const { data } = await supabase
        .from("config")
        .select("value")
        .eq("key", "mantenimiento_activo")
        .single()
      if (data?.value === "true") {
        return NextResponse.redirect(new URL("/mantenimiento", request.url))
      }
    } catch {}
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)"],
}
