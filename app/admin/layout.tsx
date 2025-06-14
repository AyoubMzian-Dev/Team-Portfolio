import { Providers } from "@/app/providers"
import AdminLayoutClient from "@/components/admin/admin-layout-client"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers session={null}>
      <AdminLayoutClient>
        {children}
      </AdminLayoutClient>
    </Providers>
  )
}