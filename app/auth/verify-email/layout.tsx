import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getSupabasePublicEnv } from "@/lib/supabase/config"
import { dashboardPathForRole } from "@/lib/auth/dashboard-path"

/** Si el correo ya está confirmado, va directo al panel. */
export default async function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isConfigured } = getSupabasePublicEnv()
  if (!isConfigured) return children

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user?.email_confirmed_at) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()
    const role = profile?.role ?? (user.user_metadata?.role as string | undefined)
    redirect(dashboardPathForRole(role))
  }

  return children
}
