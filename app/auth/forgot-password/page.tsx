"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Store,
  Mail,
  ArrowLeft,
  ArrowRight,
  KeyRound,
  CheckCircle,
  Loader2,
  Pencil,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getAuthLoginRedirectUrl, getSupabasePublicEnv } from "@/lib/supabase/config"

function formatRecoveryEmailError(message: string, redirectTo: string): string {
  const lower = message.toLowerCase()
  if (lower.includes("rate limit")) {
    return `${message} — Espera unos minutos o sube el límite en Supabase (Authentication → Rate limits).`
  }
  if (lower.includes("redirect") || lower.includes("url")) {
    return `${message} — En Supabase, Authentication → URL configuration: añade exactamente esta URL en «Redirect URLs»: ${redirectTo} (y la misma raíz en Site URL si aplica).`
  }
  if (
    lower.includes("error sending recovery email") ||
    lower.includes("sending recovery")
  ) {
    return `${message}

Revisa en este orden:
1) SMTP: usuario = correo completo; contraseña = contraseña de aplicación de Google (no la clave normal). Prueba puerto 587 con TLS si 465 falla.
2) Redirect URLs: debe incluir ${redirectTo}
3) Logs en Supabase (Auth) para el detalle SMTP.
4) Prueba desactivar SMTP personalizado un momento: si así funciona, el fallo es solo Gmail.
5) Para producción suele ir mejor Resend / SendGrid / SES que Gmail personal.`
  }
  return message
}

/**
 * Recuperación solo con código OTP (verifyOtp type recovery).
 * El enlace del correo va a /auth/login para no usar PKCE en /auth/callback.
 */

function ForgotPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hintFromQuery = searchParams.get("hint")
  const { isConfigured } = getSupabasePublicEnv()
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [busy, setBusy] = useState<"send" | "verify" | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!isConfigured) {
      setError("Configura Supabase (.env.local) para recuperar la contraseña.")
      return
    }

    const trimmed = email.trim().toLowerCase()
    if (!trimmed) {
      setError("Indica tu correo electrónico.")
      return
    }

    setBusy("send")
    const redirectTo = getAuthLoginRedirectUrl()
    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo,
      })
      if (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("[resetPasswordForEmail]", err)
        }
        setError(formatRecoveryEmailError(err.message, redirectTo))
        return
      }
      setStep(2)
      setMessage(
        "Revisa tu bandeja y spam. Introduce el código de verificación del correo (no hace falta abrir el enlace)."
      )
      setCode("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar el correo.")
    } finally {
      setBusy(null)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!isConfigured) {
      setError("Configura Supabase (.env.local) para continuar.")
      return
    }

    const trimmedEmail = email.trim().toLowerCase()
    const token = code.replace(/\s/g, "")
    if (!trimmedEmail || !token) {
      setError("Introduce el código que recibiste por correo.")
      return
    }

    setBusy("verify")
    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.verifyOtp({
        email: trimmedEmail,
        token,
        type: "recovery",
      })
      if (err) {
        setError(
          err.message.includes("expired") || err.message.includes("invalid")
            ? "Código incorrecto o caducado. Puedes solicitar uno nuevo en el paso anterior."
            : err.message
        )
        return
      }
      router.push("/auth/update-password")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo verificar el código.")
    } finally {
      setBusy(null)
    }
  }

  const handleResend = async () => {
    setError(null)
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !isConfigured) return
    setBusy("send")
    const redirectTo = getAuthLoginRedirectUrl()
    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo,
      })
      if (err) setError(formatRecoveryEmailError(err.message, redirectTo))
      else setMessage("Te enviamos otro correo con un código nuevo.")
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">TenderMarket</span>
          </Link>

          <div className="mt-8">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio de sesión
            </Link>

            <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
              Recuperar contraseña
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {step === 1
                ? "Te enviaremos un código de verificación al correo."
                : "Introduce el código del mensaje para crear una nueva contraseña."}
            </p>

            {!isConfigured ? (
              <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-200">
                Añade <code className="rounded bg-muted px-1">NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
                <code className="rounded bg-muted px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
              </div>
            ) : null}

            {hintFromQuery === "link" ? (
              <div className="mt-4 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground">
                Si el enlace del correo no funcionó, usa el{" "}
                <strong>código numérico</strong> del mismo mensaje aquí (flujo recomendado).
              </div>
            ) : null}

            <div className="mt-4 rounded-lg border border-dashed border-border bg-card/50 px-3 py-2 text-xs text-muted-foreground">
              <strong className="text-foreground">.env.local:</strong>{" "}
              <code className="rounded bg-muted px-1">NEXT_PUBLIC_SITE_URL=http://localhost:3000</code>{" "}
              debe coincidir con la <strong>Site URL</strong> de Supabase (misma host; no mezclar con
              127.0.0.1).
              <br />
              <strong className="text-foreground">Plantilla:</strong> Authentication → Emails → «Reset
              password» → incluye <code className="rounded bg-muted px-1">{`{{ .Token }}`}</code>.
            </div>

            {error ? (
              <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            ) : null}
            {message ? (
              <div className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-800 dark:text-emerald-200">
                {message}
              </div>
            ) : null}

            {step === 1 ? (
              <form onSubmit={handleSendEmail} className="mt-8 space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  Paso 1 — Tu correo
                </h3>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={busy !== null}
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                    placeholder="tu@correo.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy !== null || !isConfigured}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy === "send" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando…
                    </>
                  ) : (
                    <>
                      Enviar código al correo
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="mt-8 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <KeyRound className="h-4 w-4 text-primary" />
                    Paso 2 — Código
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1)
                      setMessage(null)
                      setError(null)
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <Pencil className="h-3 w-3" />
                    Cambiar correo
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Correo: <strong className="text-foreground">{email}</strong>
                </p>
                <div>
                  <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-foreground">
                    Código de verificación
                  </label>
                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\s/g, ""))}
                    disabled={busy !== null}
                    className="h-12 w-full rounded-lg border border-input bg-background px-3 text-center font-mono text-2xl tracking-[0.4em] placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                    placeholder="••••••"
                    maxLength={12}
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy !== null || !isConfigured}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy === "verify" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verificando…
                    </>
                  ) : (
                    <>
                      Continuar a nueva contraseña
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => void handleResend()}
                  disabled={busy !== null || !isConfigured}
                  className="w-full text-center text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline disabled:opacity-50"
                >
                  Reenviar código
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="relative hidden flex-1 lg:block">
        <div className="absolute inset-0 bg-primary">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.15),rgba(255,255,255,0))]" />
          <div className="flex h-full flex-col items-center justify-center p-12">
            <div className="max-w-md text-center text-primary-foreground">
              <h2 className="text-2xl font-bold">Código por correo</h2>
              <p className="mt-4 text-primary-foreground/85">
                No necesitas abrir el enlace del mensaje: con el código basta para seguir de forma
                segura.
              </p>
              <ul className="mt-8 space-y-3 text-left text-sm">
                <li className="flex items-start gap-2 rounded-lg bg-white/10 p-3">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  Mismo navegador o distinto: el código siempre funciona.
                </li>
                <li className="flex items-start gap-2 rounded-lg bg-white/10 p-3">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  Tras verificar, eliges la nueva contraseña y vuelves al inicio de sesión.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Cargando…
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  )
}
