import { ProveedorShell } from "@/components/proveedor/proveedor-shell"
import { gateDashboardArea } from "@/lib/auth/gate-role"
import { initialsFromUser } from "@/lib/auth/display"

export default async function ProveedorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gate = await gateDashboardArea(["proveedor"], "/proveedor/dashboard")

  if (!gate.configured) {
    return (
      <ProveedorShell
        displayName="Modo sin Supabase"
        subtitle="Añade .env.local para login real"
        userEmail=""
        initials="?"
        sessionActive={false}
      >
        {children}
      </ProveedorShell>
    )
  }

  const email = gate.user.email ?? ""
  const displayName =
    gate.profile?.full_name?.trim() ||
    gate.profile?.business_name?.trim() ||
    email.split("@")[0] ||
    "Proveedor"
  const subtitle =
    gate.profile?.business_name?.trim() || "Proveedor verificado"

  return (
    <ProveedorShell
      displayName={displayName}
      subtitle={subtitle}
      userEmail={email}
      initials={initialsFromUser(gate.profile?.full_name ?? gate.profile?.business_name, email)}
      sessionActive
    >
      {children}
    </ProveedorShell>
  )
}
