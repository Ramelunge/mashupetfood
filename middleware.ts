import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/") {
    return NextResponse.rewrite(new URL("/previews/style-crumbl.html", request.url))
  }
  if (pathname === "/inicio") {
    return NextResponse.rewrite(new URL("/previews/style-crumbl.html", request.url))
  }
  if (pathname === "/pedidos") {
    return NextResponse.rewrite(new URL("/previews/page-pedidos.html", request.url))
  }
  if (pathname === "/giftcards") {
    return NextResponse.rewrite(new URL("/previews/page-giftcards.html", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/inicio", "/pedidos", "/giftcards"],
}
