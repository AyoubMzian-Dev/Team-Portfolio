import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any custom logic here
    console.log("🔐 Middleware executing for:", req.nextUrl.pathname)
    console.log("🔐 User role:", req.nextauth.token?.role)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages without token
        if (req.nextUrl.pathname.startsWith("/admin/auth")) {
          return true
        }
        
        // Require token for other admin pages
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*"]
}


