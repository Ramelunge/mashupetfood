import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cwbmkxsdttipyoqglktl.supabase.co" },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/previews/inicio.html" },
        { source: "/inicio", destination: "/previews/inicio.html" },
        { source: "/pedidos", destination: "/previews/page-pedidos.html" },
        { source: "/giftcards", destination: "/previews/page-giftcards.html" },
      ],
    }
  },
}

export default nextConfig
