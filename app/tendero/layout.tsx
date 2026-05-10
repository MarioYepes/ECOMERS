import { TenderoShell } from "@/components/tendero/tendero-shell"
import { gateDashboardArea } from "@/lib/auth/gate-role"
import { initialsFromUser } from "@/lib/auth/display"

export default async function TenderoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gate = await gateDashboardArea(["tendero"], "/tendero/catalogo")

  if (!gate.configured) {
    return (
      <TenderoShell
        displayName="Modo sin Supabase"
        subtitle="Añade .env.local para login real"
        userEmail=""
        initials="?"
        sessionActive={false}
      >
        {children}
      </TenderoShell>
    )
  }

  const email = gate.user.email ?? ""
  const displayName =
    gate.profile?.full_name?.trim() || email.split("@")[0] || "Usuario"
  const subtitle =
    gate.profile?.business_name?.trim() || "Tendero"

  return (
    <TenderoShell
      displayName={displayName}
      subtitle={subtitle}
      userEmail={email}
      initials={initialsFromUser(gate.profile?.full_name, email)}
      sessionActive
    >
      {children}
    </TenderoShell>
  )
}
