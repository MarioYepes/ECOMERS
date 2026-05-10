"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Store, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getSupabasePublicEnv } from "@/lib/supabase/config"

const MIN_LEN = 8

function UpdatePasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isConfigured } = getSupabasePublicEnv()
  const [checking, setChecking] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(
    searchParams.get("error") ? decodeURIComponent(searchParams.get("error")!) : null
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!isConfigured) {
        setChecking(false)
        setHasSession(false)
        return
      }
      try {
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!cancelled) {
          setHasSession(Boolean(session))
        }
      } catch {
        if (!cancelled) setHasSession(false)
      } finally {
        if (!cancelled) setChecking(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [isConfigured])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < MIN_LEN) {
      setError(`La contraseña debe tener al menos ${MIN_LEN} caracteres.`)
      return
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.")
      return
    }

    setBusy(true)
    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.updateUser({ password })
      if (err) {
        setError(err.message)
        return
      }
      await supabase.auth.signOut()
      router.push("/auth/login?message=password_reset_ok")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar la contraseña.")
    } finally {
      setBusy(false)
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        Comprobando sesión…
      </div>
    )
  }

  if (!isConfigured) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <p className="text-muted-foreground">Supabase no está configurado.</p>
        <Link href="/auth/login" className="mt-4 text-primary hover:underline">
          Volver al inicio de sesión
        </Link>
      </div>
    )
  }

  if (!hasSession) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="text-lg font-semibold text-foreground">Sesión no válida o caducada</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Solicita de nuevo el correo de recuperación o abre el enlace más reciente que te enviamos.
        </p>
        <Link
          href="/auth/forgot-password"
          className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Solicitar nuevo enlace
        </Link>
        <Link href="/auth/login" className="mt-4 text-sm text-muted-foreground hover:text-primary">
          Ir al inicio de sesión
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">TenderMarket</span>
          </Link>

          <h2 className="mt-8 text-2xl font-bold text-foreground">Nueva contraseña</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Elige una contraseña segura. Después podrás iniciar sesión de nuevo.
          </p>

          {error ? (
            <div className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                Nueva contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={MIN_LEN}
                  disabled={busy}
                  className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                  placeholder={`Mínimo ${MIN_LEN} caracteres`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium text-foreground">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={MIN_LEN}
                  disabled={busy}
                  className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                  placeholder="Repite la contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando…
                </>
              ) : (
                <>
                  Guardar nueva contraseña
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="relative hidden flex-1 lg:block">
        <div className="absolute inset-0 bg-primary">
          <div className="flex h-full flex-col items-center justify-center p-12 text-primary-foreground">
            <CheckCircle className="mb-6 h-14 w-14 opacity-90" />
            <h2 className="max-w-sm text-center text-2xl font-bold">Último paso</h2>
            <p className="mt-4 max-w-sm text-center text-primary-foreground/85">
              Tras guardar, cerraremos esta sesión temporal para que entres de nuevo con tu nueva
              contraseña.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UpdatePasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Cargando…
        </div>
      }
    >
      <UpdatePasswordContent />
    </Suspense>
  )
}
