"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Code2, Home, Users, FolderOpen, Settings, FileText, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: Users },
    { href: "/projects", label: "Projects", icon: FolderOpen },
    { href: "/services", label: "Services", icon: Settings },
    { href: "/blog", label: "Blog", icon: FileText },
    { href: "/contact", label: "Contact", icon: Mail },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-primary/80 border-b border-white/10 shadow-lg">
      <div className="mx-4, mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 rounded-xl blur-lg group-hover:bg-accent/40 transition-all duration-300" />
              <div className="relative bg-gradient-to-br from-accent to-accent-green p-3 rounded-xl shadow-lg">
                <Code2 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gradient">DevTeam</span>
              <span className="text-xs text-muted-foreground -mt-1">Web Development</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/5"
              >
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <item.icon className="h-4 w-4 text-accent group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-foreground group-hover:text-accent transition-colors font-medium">
                    {item.label}
                  </span>
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-accent to-accent-green group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link href="/contact">
              <Button className="bg-gradient-to-r from-accent to-accent-green hover:from-accent/90 hover:to-accent-green/90 text-primary font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 text-foreground hover:text-accent transition-all duration-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-6 space-y-2 border-t border-white/10 bg-gradient-to-b from-transparent to-white/5 rounded-b-2xl">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-foreground hover:text-accent hover:bg-white/5 transition-all duration-300 group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <item.icon className="h-5 w-5 text-accent group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              <div className="pt-4 px-4">
                <Link href="/contact" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-accent to-accent-green hover:from-accent/90 hover:to-accent-green/90 text-primary font-semibold py-3 rounded-xl shadow-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
