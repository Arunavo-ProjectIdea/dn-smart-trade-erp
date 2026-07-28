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

  return (
    <AuthGuard role={role}>
      <DashboardShell role={role}>
        <PageTransition>
          {children}
        </PageTransition>
      </DashboardShell>
    </AuthGuard>
  )
}
