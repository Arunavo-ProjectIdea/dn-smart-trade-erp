import { DashboardShell } from "@/components/layout/dashboard-shell"
import { PageTransition } from "@/components/layout/page-transition"
import { AuthGuard } from "@/components/layout/auth-guard"
import { getUserProfile } from "@/actions/auth.actions"

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profileRes = await getUserProfile()
  const role = profileRes.data?.role || "Employee"
  const forcePasswordChange = profileRes.data?.force_password_change || false

  return (
    <AuthGuard role={role} forcePasswordChange={forcePasswordChange}>
      <DashboardShell role={role}>
        <PageTransition>
          {children}
        </PageTransition>
      </DashboardShell>
    </AuthGuard>
  )
}
