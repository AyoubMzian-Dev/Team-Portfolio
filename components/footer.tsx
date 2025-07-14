'use client'

import Link from "next/link"
import { Github, Linkedin, Twitter, Mail, Code2 } from "lucide-react"
import { useRenderTracker } from "@/hooks/use-render-tracker"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  // Track renders for performance monitoring
  useRenderTracker('Footer', { currentYear })

  const socialLinks = [
    { icon: Github, href: "https://github.com/AyoubMzian-Dev", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/company/ayoub-developer-711040305", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com/Ayoub_Mzian", label: "Twitter" },
    { icon: Mail, href: "ayoubmziandeveloper@gmail.com", label: "Email" },
  ]

  return (
    <footer className="glass-card border-t bg-black border-white/10 slef-end">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
        <Link href="/" className="flex items-center space-x-2 mb-4">
          <Code2 className="h-8 w-8 text-accent" />
          <span className="text-xl font-bold text-gradient">DevTeam</span>
        </Link>
        <p className="text-muted-foreground max-w-md">
          We're a passionate team of web developers creating modern, scalable, and beautiful web applications using
          cutting-edge technologies.
        </p>
        </div>

        {/* Quick Links */}
        <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Links</h3>
        <ul className="space-y-2">
          {["About", "Projects", "Services", "Blog", "Contact"].map((item) => (
          <li key={item}>
            <Link
            href={`/${item.toLowerCase()}`}
            className="text-muted-foreground hover:text-accent transition-colors"
            >
            {item}
            </Link>
          </li>
          ))}
        </ul>
        </div>

        {/* Social Links */}
        <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Connect</h3>
        <div className="flex space-x-4">
          {socialLinks.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-accent transition-colors p-2 rounded-lg hover:bg-white/5"
            aria-label={social.label}
          >
            <social.icon className="h-5 w-5" />
          </a>
          ))}
        </div>
        </div>
      </div>

      <div className="border-t border-white/10 mt-8 pt-8 text-center">
        <p className="text-muted-foreground">
        © {currentYear} DevTeam. All rights reserved. Built with Next.js, Tailwind CSS, and Vercel.
        </p>
      </div>
      </div>
    </footer>
  )
}
