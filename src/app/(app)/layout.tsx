import { DashboardShell } from "@/components/layout/dashboard-shell"
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
      {children}
    </DashboardShell>
  )
}
