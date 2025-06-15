import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Providers } from "@/app/providers"
import AdminLayoutClient from "@/components/admin/admin-layout-client"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 🔥 CRITICAL: Get the session on the server side
  const session = await getServerSession(authOptions)
  
  return (
    <Providers session={session}>
      <AdminLayoutClient>
        {children}
      </AdminLayoutClient>
    </Providers>
  )
}