import { DashboardShell } from "@/components/layout/dashboard-shell"
import { PageTransition } from "@/components/layout/page-transition"
import { AuthGuard } from "@/components/layout/auth-guard"
import { getCurrentUser } from "@/lib/auth-server"
import { AuthProvider } from "@/components/auth-provider"

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser()
  const role = user?.role || "Admin" // SSR default

  return (
    <AuthProvider user={user}>
      <AuthGuard userRole={role}>
        <DashboardShell role={role} user={user}>
          <PageTransition>
            {children}
          </PageTransition>
        </DashboardShell>
      </AuthGuard>
    </AuthProvider>
  )
}
