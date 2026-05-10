export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return {
    url,
    anonKey,
    isConfigured: Boolean(url?.trim() && anonKey?.trim()),
  }
}

/**
 * Origen público de la app (sin barra final). Debe coincidir con Authentication → URL Configuration
 * → Site URL en Supabase. Si no está definido, en el cliente se usa window.location.origin.
 * Útil para no mezclar http://127.0.0.1:3000 con http://localhost:3000.
 */
export function getPublicSiteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, "")
  if (typeof window !== "undefined") return window.location.origin
  return ""
}

export function getAuthLoginRedirectUrl(): string {
  return `${getPublicSiteOrigin()}/auth/login`
}

/** Para confirmación de email en registro (PKCE en /auth/callback). */
export function getAuthCallbackRedirectUrl(nextPath: string): string {
  const origin = getPublicSiteOrigin()
  const path = nextPath.startsWith("/") ? nextPath : `/${nextPath}`
  return `${origin}/auth/callback?next=${encodeURIComponent(path)}`
}
