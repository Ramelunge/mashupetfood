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
        { source: "/inicio", destination: "/previews/style-crumbl.html" },
        { source: "/pedidos", destination: "/previews/page-pedidos.html" },
        { source: "/giftcards", destination: "/previews/page-giftcards.html" },
      ],
    }
  },
}

export default nextConfig
