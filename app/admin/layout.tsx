import { AdminShell } from "@/components/admin/admin-shell"
import { gateDashboardArea } from "@/lib/auth/gate-role"
import { initialsFromUser } from "@/lib/auth/display"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gate = await gateDashboardArea(["admin"], "/admin/dashboard")

  if (!gate.configured) {
    return (
      <AdminShell
        displayName="Modo sin Supabase"
        subtitle="Añade .env.local para login real"
        userEmail=""
        initials="?"
        sessionActive={false}
      >
        {children}
      </AdminShell>
    )
  }

  const email = gate.user.email ?? ""
  const displayName =
    gate.profile?.full_name?.trim() || email.split("@")[0] || "Administrador"
  const subtitle = "Administrador"

  return (
    <AdminShell
      displayName={displayName}
      subtitle={subtitle}
      userEmail={email}
      initials={initialsFromUser(gate.profile?.full_name, email)}
      sessionActive
    >
      {children}
    </AdminShell>
  )
}
