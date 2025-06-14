"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Home, Users, FolderOpen, Settings, FileText, Mail, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { theme } from "@/lib/theme-config"
import Image from "next/image"
import logo from "@/public/logo.png" // Adjust the path to your logo image

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: Users },
    { href: "/projects", label: "Projects", icon: FolderOpen },
    { href: "/offers", label: "Offers", icon: Gift },
    { href: "/services", label: "Services", icon: Settings },
    { href: "/blog", label: "Blog", icon: FileText },
    { href: "/contact", label: "Contact", icon: Mail },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-primary/80 border-b border-white/10 shadow-lg">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-xl blur-lg group-hover:opacity-60 transition-all duration-300"
                style={{ backgroundColor: `${theme.colors.accent}33` }}
              />
              <Image
                src= {logo}
                alt="DevTeam Logo"
                width={45}
                height={45}
                className="  shadow-lg transition-transform group-hover:scale-110"
              />
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
                  <div 
                    className="p-1.5 rounded-lg group-hover:opacity-80 transition-colors"
                    style={{ 
                      backgroundColor: `${theme.colors.accent}1A`,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${theme.colors.accent}33`}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${theme.colors.accent}1A`}
                  >
                    <item.icon 
                      className="h-4 w-4 group-hover:scale-110 transition-transform" 
                      style={{ color: theme.colors.accent }}
                    />
                  </div>
                  <span 
                    className="transition-colors font-medium"
                    style={{ color: theme.colors.text }}
                    onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.accent}
                    onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.text}
                  >
                    {item.label}
                  </span>
                </div>
                <div 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                  style={{ 
                    background: `linear-gradient(to right, ${theme.colors.accent}, ${theme.colors.accentTeal})` 
                  }}
                />
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link href="/contact">
              <Button 
                className="font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 glow-effect"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentTeal})`,
                  color: theme.colors.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${theme.colors.accent}E6, ${theme.colors.accentTeal}E6)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentTeal})`
                }}
              >
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
              className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
              style={{ color: theme.colors.text }}
              onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.accent}
              onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.text}
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
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-300 group"
                  style={{ color: theme.colors.text }}
                  onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.accent}
                  onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.text}
                  onClick={() => setIsOpen(false)}
                >
                  <div 
                    className="p-2 rounded-lg group-hover:opacity-80 transition-colors"
                    style={{ backgroundColor: `${theme.colors.accent}1A` }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${theme.colors.accent}33`}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${theme.colors.accent}1A`}
                  >
                    <item.icon 
                      className="h-5 w-5 group-hover:scale-110 transition-transform" 
                      style={{ color: theme.colors.accent }}
                    />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              <div className="pt-4 px-4">
                <Link href="/contact" onClick={() => setIsOpen(false)}>
                  <Button 
                    className="w-full font-semibold py-3 rounded-xl shadow-lg glow-effect"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentTeal})`,
                      color: theme.colors.primary,
                    }}
                  >
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
