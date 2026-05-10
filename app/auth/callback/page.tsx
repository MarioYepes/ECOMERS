"use client"

/**
 * Intercambio PKCE en el navegador para que el code_verifier (cookie) coincida
 * con el que guardó createBrowserClient al pedir recuperación / registro.
 * Un Route Handler solo con cookies() del servidor suele provocar:
 * "PKCE code verifier not found in storage".
 */

import { Suspense, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Spinner } from "@/components/ui/spinner"

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ranRef = useRef(false)
  const [hint, setHint] = useState("Completando acceso…")

  useEffect(() => {
    if (ranRef.current) return
    ranRef.current = true

    const code = searchParams.get("code")
    const nextRaw = searchParams.get("next") ?? "/"
    const next = nextRaw.startsWith("/") ? nextRaw : `/${nextRaw}`

    const run = async () => {
      if (!code) {
        router.replace(`/auth/login?error=${encodeURIComponent("missing_code")}`)
        return
      }

      const supabase = createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session) {
          router.replace(next)
          router.refresh()
          return
        }
        const msg = error.message ?? ""
        if (
          msg.includes("code verifier") ||
          msg.includes("PKCE") ||
          msg.includes("pkce")
        ) {
          if (next.includes("update-password")) {
            router.replace("/auth/forgot-password?hint=link")
          } else {
            router.replace(
              `/auth/verify-email?reason=browser&next=${encodeURIComponent(next)}`
            )
          }
          return
        }
        router.replace(`/auth/login?error=${encodeURIComponent(error.message)}`)
        return
      }

      router.replace(next)
      router.refresh()
    }

    void run().catch(() => {
      setHint("Algo salió mal. Redirigiendo…")
      router.replace(`/auth/login?error=${encodeURIComponent("callback_error")}`)
    })
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-muted-foreground">
      <Spinner className="h-8 w-8" />
      <p className="text-sm">{hint}</p>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Cargando…
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  )
}
