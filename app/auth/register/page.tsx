"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Store, TruckIcon, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle, Building2, MapPin, User, Mail, Lock, Phone } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getSupabasePublicEnv } from "@/lib/supabase/config"
import { dashboardPathForRole } from "@/lib/auth/dashboard-path"

type UserRole = "tendero" | "proveedor"
type Step = 1 | 2 | 3

function RegisterPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRole = searchParams.get("role") as UserRole | null
  
  const [role, setRole] = useState<UserRole | null>(initialRole)
  const [step, setStep] = useState<Step>(initialRole ? 2 : 1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authInfo, setAuthInfo] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    // Step 2 - Personal
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // Step 3 - Business
    businessName: "",
    businessType: "",
    nit: "",
    city: "",
    address: "",
    acceptTerms: false,
  })

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole)
    setAuthError(null)
    setAuthInfo(null)
    setStep(2)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 2) {
      setAuthError(null)
      setAuthInfo(null)
      setStep(3)
      return
    }

    setAuthError(null)
    setAuthInfo(null)

    const { isConfigured } = getSupabasePublicEnv()

    if (!isConfigured) {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsLoading(false)
      router.push(role === "tendero" ? "/tendero/catalogo" : "/proveedor/dashboard")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setAuthError("Las contraseñas no coinciden")
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      const nextPath = dashboardPathForRole(role ?? undefined)
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`.trim(),
            role: role ?? "tendero",
            phone: formData.phone,
            business_name: formData.businessName,
            business_type: formData.businessType,
            nit: formData.nit,
            city: formData.city,
            address: formData.address,
          },
        },
      })
      if (error) {
        setAuthError(error.message)
        return
      }
      if (data.session) {
        router.push(nextPath)
      } else {
        setAuthInfo(
          "Revisa tu correo para confirmar la cuenta. En desarrollo puedes desactivar «Confirm email» en Supabase (Authentication → Providers → Email)."
        )
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Error al crear la cuenta")
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

          {/* Progress Steps */}
          <div className="mt-8 flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  s < step ? "bg-primary text-primary-foreground" :
                  s === step ? "bg-primary text-primary-foreground" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {s < step ? <CheckCircle className="h-5 w-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`mx-2 h-0.5 w-8 transition-colors ${s < step ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Crear cuenta
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {"Selecciona tu tipo de cuenta para comenzar"}
              </p>

              <div className="mt-8 space-y-4">
                <button
                  type="button"
                  onClick={() => handleRoleSelect("tendero")}
                  className="group flex w-full items-center gap-4 rounded-xl border-2 border-border bg-card p-4 text-left transition-all hover:border-primary hover:bg-primary/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <Store className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-card-foreground">Soy Tendero</div>
                    <div className="text-sm text-muted-foreground">
                      Quiero comprar productos al por mayor
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect("proveedor")}
                  className="group flex w-full items-center gap-4 rounded-xl border-2 border-border bg-card p-4 text-left transition-all hover:border-accent hover:bg-accent/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 transition-colors group-hover:bg-accent/20">
                    <TruckIcon className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-card-foreground">Soy Proveedor</div>
                    <div className="text-sm text-muted-foreground">
                      Quiero vender mis productos a tenderos
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-accent" />
                </button>
              </div>

              <p className="mt-8 text-center text-sm text-muted-foreground">
                {"¿Ya tienes cuenta?"}{" "}
                <Link href="/auth/login" className="font-medium text-primary hover:text-primary/80">
                  Iniciar sesión
                </Link>
              </p>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <div className="mt-8">
              <button
                type="button"
                onClick={() => {
                  setAuthError(null)
                  setAuthInfo(null)
                  setStep(1)
                }}
                className="mb-4 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </button>
              
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Información personal
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {role === "tendero" ? "Cuéntanos sobre ti" : "Datos del contacto principal"}
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-foreground">
                      Nombre
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Juan"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-foreground">
                      Apellido
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Pérez"
                    />
                  </div>
                </div>

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
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="+57 300 123 4567"
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
                      minLength={8}
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

                <div>
                  <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-foreground">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-10 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Continuar
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {"¿Ya tienes cuenta?"}{" "}
                <Link href="/auth/login" className="font-medium text-primary hover:text-primary/80">
                  Iniciar sesión
                </Link>
              </p>
            </div>
          )}

          {/* Step 3: Business Information */}
          {step === 3 && (
            <div className="mt-8">
              <button
                type="button"
                onClick={() => {
                  setAuthError(null)
                  setAuthInfo(null)
                  setStep(2)
                }}
                className="mb-4 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </button>
              
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {role === "tendero" ? "Datos de tu tienda" : "Datos de tu empresa"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {role === "tendero" ? "Información de tu negocio" : "Información de tu compañía"}
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                {authError ? (
                  <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {authError}
                  </div>
                ) : null}
                {authInfo ? (
                  <div className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-foreground">
                    {authInfo}
                  </div>
                ) : null}
                <div>
                  <label htmlFor="businessName" className="mb-1.5 block text-sm font-medium text-foreground">
                    {role === "tendero" ? "Nombre de la tienda" : "Razón social"}
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      required
                      className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder={role === "tendero" ? "Tienda Don Pepe" : "Distribuidora XYZ S.A.S"}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="businessType" className="mb-1.5 block text-sm font-medium text-foreground">
                    {role === "tendero" ? "Tipo de tienda" : "Tipo de empresa"}
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    required
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Seleccionar...</option>
                    {role === "tendero" ? (
                      <>
                        <option value="tienda">Tienda de barrio</option>
                        <option value="minimercado">Mini mercado</option>
                        <option value="supermercado">Supermercado</option>
                        <option value="drogueria">Droguería</option>
                        <option value="restaurante">Restaurante</option>
                        <option value="cafeteria">Cafetería</option>
                        <option value="otro">Otro</option>
                      </>
                    ) : (
                      <>
                        <option value="fabricante">Fabricante</option>
                        <option value="distribuidor">Distribuidor</option>
                        <option value="importador">Importador</option>
                        <option value="mayorista">Mayorista</option>
                        <option value="otro">Otro</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="nit" className="mb-1.5 block text-sm font-medium text-foreground">
                    NIT / Cédula
                  </label>
                  <input
                    type="text"
                    id="nit"
                    name="nit"
                    value={formData.nit}
                    onChange={handleInputChange}
                    required
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="900.123.456-7"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-foreground">
                    Ciudad
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Seleccionar ciudad...</option>
                      <option value="bogota">Bogotá</option>
                      <option value="medellin">Medellín</option>
                      <option value="cali">Cali</option>
                      <option value="barranquilla">Barranquilla</option>
                      <option value="cartagena">Cartagena</option>
                      <option value="bucaramanga">Bucaramanga</option>
                      <option value="pereira">Pereira</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-foreground">
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Calle 123 # 45-67, Barrio Centro"
                  />
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    required
                    className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-muted-foreground">
                    Acepto los{" "}
                    <Link href="#" className="text-primary hover:text-primary/80">términos y condiciones</Link>
                    {" "}y la{" "}
                    <Link href="#" className="text-primary hover:text-primary/80">política de privacidad</Link>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      Crear cuenta
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="relative hidden flex-1 lg:block">
        <div className="absolute inset-0 bg-primary">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.15),rgba(255,255,255,0))]" />
          <div className="flex h-full flex-col items-center justify-center p-12">
            <div className="max-w-md text-center text-primary-foreground">
              <div className="mb-6 flex justify-center">
                {role === "proveedor" ? (
                  <TruckIcon className="h-16 w-16" />
                ) : (
                  <Store className="h-16 w-16" />
                )}
              </div>
              <h2 className="text-3xl font-bold">
                {role === "proveedor" 
                  ? "Llega a miles de tiendas"
                  : "Los mejores productos mayoristas"
                }
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                {role === "proveedor"
                  ? "Conecta con tenderos en todo el país y haz crecer tu negocio de distribución."
                  : "Accede a precios mayoristas, entregas rápidas y las mejores marcas para tu tienda."
                }
              </p>
              <div className="mt-8 flex flex-col gap-4">
                <div className="flex items-center gap-3 rounded-lg bg-white/10 p-4">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">Registro 100% gratuito</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-white/10 p-4">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">
                    {role === "proveedor" ? "Panel de gestión completo" : "Miles de productos disponibles"}
                  </span>
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

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Cargando…
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  )
}
