import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ConditionalNavbar from "@/components/conditional-navbar"
import ConditionalFooter from "@/components/conditional-footer"
import { Toaster } from "@/components/ui/toaster"
import { GlobalPerformanceMonitor } from "@/components/admin/global-performance-monitor"
import AutoPerformanceTracker from "@/components/admin/auto-performance-tracker"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DevTeam - Modern Web Development",
  description:
    "A passionate team of developers creating modern, scalable, and beautiful web applications using cutting-edge technologies.",
  keywords: ["web development", "react", "nextjs", "tailwind", "mongodb", "vercel"],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ConditionalNavbar />
        <main>{children}</main>
        <ConditionalFooter />
        <Toaster />
        <AutoPerformanceTracker />
        <GlobalPerformanceMonitor />
      </body>
    </html>
  )
}
