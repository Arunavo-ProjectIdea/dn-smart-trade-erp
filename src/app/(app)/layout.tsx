import { DashboardShell } from "@/components/layout/dashboard-shell"
import { PageTransition } from "@/components/layout/page-transition"
import { AuthService } from "@/lib/auth"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = AuthService.getCurrentUser()
  const role = user?.role || "Admin"

  return (
    <DashboardShell role={role}>
      <PageTransition>
        {children}
      </PageTransition>
    </DashboardShell>
  )
}
