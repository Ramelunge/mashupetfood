"use client"
import { usePathname } from "next/navigation"
import Sidebar from "./Sidebar"

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#1A1209" }}>
      <Sidebar />
      <main style={{ flex: 1, overflowX: "hidden", display: "flex", flexDirection: "column" }}>
        {children}
      </main>
    </div>
  )
}
