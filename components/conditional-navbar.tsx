"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/navbar"

export default function ConditionalNavbar() {
  const pathname = usePathname()
  
  // Don't show navbar on admin routes
  if (pathname?.startsWith('/admin')) {
    return null
  }
  
  return <Navbar />
}
