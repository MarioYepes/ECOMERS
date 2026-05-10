"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Store, Eye, EyeOff, ArrowRight, Mail, Lock, CheckCircle, MapPin } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getSupabasePublicEnv } from "@/lib/supabase/config"
import { dashboardPathForRole } from "@/lib/auth/dashboard-path"

function safeInternalPath(next: string | null, fallback: string): string {
  if (!next?.startsWith("/") || next.startsWith("//")) return fallback
  return next
}

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isConfigured } = getSupabasePublicEnv()
  const urlError = searchParams.get("error")
  const urlMessage = searchParams.get("message")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(
    urlError ? decodeURIComponent(urlError) : null
  )
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)

    const { isConfigured } = getSupabasePublicEnv()

    if (!isConfigured) {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsLoading(false)
      router.push("/tendero/catalogo")
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      })
      if (error) {
        setAuthError(error.message)
        return
      }
      if (!data.user) {
        setAuthError("No se pudo iniciar sesión.")
        return
      }
      let role = data.user.user_metadata?.role as string | undefined
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle()
      if (!profileError && profile?.role) {
        role = profile.role
      }
      const fallback = dashboardPathForRole(role)

      if (!data.user.email_confirmed_at) {
        await supabase.auth.signOut()
        router.push(
          `/auth/verify-email?email=${encodeURIComponent(formData.email.trim())}&next=${encodeURIComponent(fallback)}&reason=login`
        )
        router.refresh()
        return
      }

      router.push(safeInternalPath(searchParams.get("next"), fallback))
      router.refresh()
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Store className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">TenderMarket</span>
            </Link>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Iniciar sesión
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ingresa a tu cuenta para continuar
            </p>
            <p className="mt-3 flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <span>
                TenderMarket está pensado para negocios en Colombia. Elige departamento y municipio al{" "}
                <Link href="/auth/register" className="font-medium text-primary hover:underline">
                  registrarte
                </Link>{" "}
                o actualízalos en <strong className="font-medium text-foreground">Mi perfil</strong>.
              </span>
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {urlMessage === "password_reset_ok" ? (
                <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-800 dark:text-emerald-200">
                  Contraseña actualizada correctamente. Inicia sesión con tu nueva contraseña.
                </div>
              ) : null}
              {authError ? (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {authError}
                </div>
              ) : null}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="juan@ejemplo.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-10 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                  <label htmlFor="rememberMe" className="text-sm text-muted-foreground">
                    Recordarme
                  </label>
                </div>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm font-medium text-primary hover:text-primary/80"
                >
                  {"¿Olvidaste tu contraseña?"}
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    Iniciar sesión
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {!isConfigured ? (
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Demo sin Supabase (.env.local)
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/tendero/catalogo")}
                    className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card p-3 text-xs transition-colors hover:bg-muted"
                  >
                    <Store className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Tendero</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/proveedor/dashboard")}
                    className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card p-3 text-xs transition-colors hover:bg-muted"
                  >
                    <Store className="h-4 w-4 text-accent" />
                    <span className="text-muted-foreground">Proveedor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/admin/dashboard")}
                    className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card p-3 text-xs transition-colors hover:bg-muted"
                  >
                    <Store className="h-4 w-4 text-success" />
                    <span className="text-muted-foreground">Admin</span>
                  </button>
                </div>
              </div>
            ) : null}

            <p className="mt-8 text-center text-sm text-muted-foreground">
              {"¿No tienes cuenta?"}{" "}
              <Link href="/auth/register" className="font-medium text-primary hover:text-primary/80">
                Registrarse
              </Link>
            </p>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              <Link
                href="/auth/verify-email"
                className="font-medium text-primary hover:text-primary/80"
              >
                ¿Debes verificar el correo? Reenviar enlace
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="relative hidden flex-1 lg:block">
        <div className="absolute inset-0 bg-primary">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.15),rgba(255,255,255,0))]" />
          <div className="flex h-full flex-col items-center justify-center p-12">
            <div className="max-w-md text-center text-primary-foreground">
              <div className="mb-6 flex justify-center">
                <Store className="h-16 w-16" />
              </div>
              <h2 className="text-3xl font-bold">
                Bienvenido de vuelta
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Accede a tu cuenta para gestionar tus pedidos, ver productos y hacer crecer tu negocio.
              </p>
              <div className="mt-8 flex flex-col gap-4">
                <div className="flex items-center gap-3 rounded-lg bg-white/10 p-4">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">Acceso seguro y encriptado</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-white/10 p-4">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">Historial de pedidos disponible</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-white/10 p-4">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">Soporte personalizado 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Cargando…
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  )
}
