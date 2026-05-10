import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSupabasePublicEnv } from "@/lib/supabase/config"

async function signOutAndRedirect(req: Request) {
  const { isConfigured } = getSupabasePublicEnv()
  if (isConfigured) {
    const supabase = await createClient()
    await supabase.auth.signOut()
  }
  const origin = new URL(req.url).origin
  return NextResponse.redirect(new URL("/auth/login", origin))
}

export async function POST(req: Request) {
  return signOutAndRedirect(req)
}

export async function GET(req: Request) {
  return signOutAndRedirect(req)
}
