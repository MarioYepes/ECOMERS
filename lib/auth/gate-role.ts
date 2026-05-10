import { redirect } from "next/navigation"
import { headers } from "next/headers"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { getSupabasePublicEnv } from "@/lib/supabase/config"
import { dashboardPathForRole } from "@/lib/auth/dashboard-path"

export type AppRole = "tendero" | "proveedor" | "admin"

export type ProfileRow = {
  id: string
  full_name: string | null
  role: string
  phone: string | null
  business_name: string | null
  business_type: string | null
  nit: string | null
  city: string | null
  address: string | null
  account_status?: "activo" | "inactivo" | "bloqueado" | null
  city_id?: string | null
}

export type GateOk =
  | {
      configured: true
      user: User
      role: AppRole
      profile: ProfileRow | null
    }
  | {
      configured: false
      user: null
      role: null
      profile: null
    }

function normalizeRole(raw: string | undefined | null): AppRole {
  if (raw === "proveedor" || raw === "admin" || raw === "tendero") return raw
  return "tendero"
}

export async function gateDashboardArea(
  allowedRoles: AppRole[],
  fallbackNextPath: string
): Promise<GateOk> {
  const { isConfigured } = getSupabasePublicEnv()
  if (!isConfigured) {
    return { configured: false, user: null, role: null, profile: null }
  }

  const headerList = await headers()
  const pathname =
    headerList.get("x-pathname") ?? fallbackNextPath

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?next=${encodeURIComponent(pathname)}`)
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, full_name, role, phone, business_name, business_type, nit, city, address, account_status, city_id"
    )
    .eq("id", user.id)
    .maybeSingle()

  const role = normalizeRole(
    profile?.role ?? (user.user_metadata?.role as string | undefined)
  )

  if (!allowedRoles.includes(role)) {
    redirect(dashboardPathForRole(role))
  }

  return {
    configured: true,
    user,
    role,
    profile: profile as ProfileRow | null,
  }
}
