"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { theme } from "@/lib/theme-config"
import { Eye, EyeOff } from "lucide-react"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      
      if (result?.ok) {
        router.push("/admin/dashboard")
        router.refresh()
      } else {
        setError("Invalid email or password. Please try again.")
      }
    } catch (error) {
      console.error("Sign in error:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const demoCredentials = [
    { role: "Admin", email: "admin@devteam.com", password: "admin123" },
    { role: "Member", email: "member@devteam.com", password: "member123" },
    { role: "Viewer", email: "viewer@devteam.com", password: "viewer123" },
  ]

  const fillDemo = (email: string, password: string) => {
    setEmail(email)
    setPassword(password)
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
    >
      <div className="w-full max-w-md space-y-6">
        <Card className="glass-card">
          <CardHeader className="text-center">
            <CardTitle style={{ color: theme.colors.text }}>
              Admin Portal
            </CardTitle>
            <p style={{ color: theme.colors.textMuted }} className="text-sm">
              Sign in to access the content management system
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4" variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentTeal})`,
                  color: theme.colors.primary,
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-sm" style={{ color: theme.colors.text }}>
              Demo Credentials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoCredentials.map((demo, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                onClick={() => fillDemo(demo.email, demo.password)}
              >
                <div>
                  <p style={{ color: theme.colors.text }} className="text-sm font-medium">
                    {demo.role}
                  </p>
                  <p style={{ color: theme.colors.textMuted }} className="text-xs">
                    {demo.email}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    fillDemo(demo.email, demo.password)
                  }}
                >
                  Use
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
