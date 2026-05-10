"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Store, Mail, Loader2, RefreshCw, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getAuthCallbackRedirectUrl, getSupabasePublicEnv } from "@/lib/supabase/config"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const emailParam = searchParams.get("email") ?? ""
  const nextParam = searchParams.get("next") ?? "/tendero/catalogo"
  const reason = searchParams.get("reason")

  const { isConfigured } = getSupabasePublicEnv()
  const [email, setEmail] = useState(emailParam)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const nextPath =
    nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/tendero/catalogo"

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) {
      setError("Indica el correo con el que te registraste.")
      return
    }
    if (!isConfigured) {
      setError("Supabase no está configurado.")
      return
    }
    setBusy(true)
    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.resend({
        type: "signup",
        email: trimmed,
        options: {
          emailRedirectTo: getAuthCallbackRedirectUrl(nextPath),
        },
      })
      if (err) {
        setError(err.message)
        return
      }
      setMessage(
        "Te enviamos otro correo. Ábrelo en este mismo navegador y dispositivo donde diste de alta."
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo reenviar.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Store className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">TenderMarket</span>
        </Link>

        <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">Verifica tu correo</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Para entrar a tu cuenta necesitamos confirmar tu correo. Te enviamos un enlace:
            al abrirlo en{" "}
            <strong className="text-foreground">este mismo navegador</strong> iniciarás sesión
            automáticamente.
          </p>

          {reason === "login" ? (
            <div className="mt-4 rounded-lg border border-border bg-muted/50 p-3 text-sm text-foreground">
              No puedes iniciar sesión hasta verificar el correo. Cuando lo confirmes desde el
              enlace, vuelve a{" "}
              <Link href="/auth/continue" className="font-medium text-primary underline">
                iniciar sesión
              </Link>
              .
            </div>
          ) : null}

          {reason === "browser" ? (
            <div className="mt-4 flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-900 dark:text-amber-100">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                El enlace debe abrirse en el mismo navegador donde te registraste. Si lo abriste en
                otro sitio, solicita un correo nuevo aquí y ábrelo desde este equipo.
              </span>
            </div>
          ) : null}

          {!isConfigured ? (
            <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              Configura <code className="rounded bg-muted px-1">.env.local</code> con Supabase.
            </div>
          ) : null}

          {error ? (
            <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}
          {message ? (
            <div className="mt-4 flex gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-800 dark:text-emerald-200">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{message}</span>
            </div>
          ) : null}

          <form onSubmit={handleResend} className="mt-6 space-y-4">
            <div>
              <label htmlFor="vemail" className="mb-1.5 block text-sm font-medium text-foreground">
                Tu correo
              </label>
              <input
                id="vemail"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={busy}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm disabled:opacity-60"
                placeholder="tu@correo.com"
              />
            </div>
            <button
              type="submit"
              disabled={busy || !isConfigured}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando…
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Reenviar correo de verificación
                </>
              )}
            </button>
          </form>

          <ul className="mt-6 space-y-2 text-xs text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">1.</span>
              Revisa spam o promociones.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">2.</span>
              <code className="rounded bg-muted px-1">NEXT_PUBLIC_SITE_URL</code> y Site URL en
              Supabase deben coincidir (ej. <code className="rounded bg-muted px-1">http://localhost:3000</code>
              ).
            </li>
            <li className="flex gap-2">
              <span className="text-primary">3.</span>
              Redirect URLs debe incluir <code className="rounded bg-muted px-1">/auth/callback</code>.
            </li>
          </ul>

          <Link
            href="/auth/continue"
            className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Cargando…
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
