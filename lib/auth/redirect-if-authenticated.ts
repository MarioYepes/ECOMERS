import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getSupabasePublicEnv } from "@/lib/supabase/config"
import { dashboardPathForRole } from "@/lib/auth/dashboard-path"

export async function redirectIfAuthenticated() {
  const { isConfigured } = getSupabasePublicEnv()
  if (!isConfigured) return

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  const role =
    profile?.role ?? (user.user_metadata?.role as string | undefined)
  redirect(dashboardPathForRole(role))
}
