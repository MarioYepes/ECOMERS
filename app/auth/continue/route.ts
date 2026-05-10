import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSupabasePublicEnv } from "@/lib/supabase/config"
import { dashboardPathForRole } from "@/lib/auth/dashboard-path"

function safeRelativePath(next: string | null): string | null {
  if (!next?.startsWith("/") || next.startsWith("//")) return null
  return next
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const nextParam = safeRelativePath(url.searchParams.get("next"))

  const { isConfigured } = getSupabasePublicEnv()
  if (!isConfigured) {
    const login = new URL("/auth/login", url.origin)
    if (nextParam) login.searchParams.set("next", nextParam)
    return NextResponse.redirect(login)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const login = new URL("/auth/login", url.origin)
    if (nextParam) login.searchParams.set("next", nextParam)
    return NextResponse.redirect(login)
  }

  if (!user.email_confirmed_at) {
    const verify = new URL("/auth/verify-email", url.origin)
    if (user.email) verify.searchParams.set("email", user.email)
    if (nextParam) verify.searchParams.set("next", nextParam)
    verify.searchParams.set("reason", "login")
    return NextResponse.redirect(verify)
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  const role = profile?.role ?? (user.user_metadata?.role as string | undefined)
  const target = dashboardPathForRole(role)
  return NextResponse.redirect(new URL(target, url.origin))
}
