"use client"

import { useState } from "react"
import Link from "next/link"
import {
  User,
  Store,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Save,
  Camera,
  Shield,
  Bell,
  CreditCard,
  FileText,
  AlertCircle,
} from "lucide-react"
import { useDashboardProfile } from "@/hooks/use-dashboard-profile"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/hooks/use-toast"
import { ColombiaLocationSelect } from "@/components/colombia-location-select"

function formatCop(n: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n)
}

function accountBadge(status: string | null) {
  switch (status) {
    case "bloqueado":
      return {
        label: "Cuenta restringida",
        className: "bg-destructive/10 text-destructive",
      }
    case "inactivo":
      return {
        label: "Cuenta inactiva",
        className: "bg-muted text-muted-foreground",
      }
    default:
      return {
        label: "Cuenta activa",
        className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400",
      }
  }
}

export default function TenderoPerfilPage() {
  const {
    isConfigured,
    loading,
    saving,
    error,
    email,
    form,
    setForm,
    accountStatus,
    stats,
    saveProfile,
    refresh,
  } = useDashboardProfile("tendero")

  const [isEditing, setIsEditing] = useState(false)

  const handleSave = async () => {
    const result = await saveProfile()
    if (result.ok) {
      toast({ title: "Perfil actualizado", description: "Los cambios se guardaron correctamente." })
      setIsEditing(false)
    } else {
      toast({
        variant: "destructive",
        title: "No se pudo guardar",
        description: result.message,
      })
    }
  }

  const handleCancelEdit = async () => {
    await refresh()
    setIsEditing(false)
  }

  const badge = accountBadge(accountStatus)

  if (!isConfigured) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-amber-500" />
        <p className="font-medium text-foreground">Supabase no está configurado</p>
        <p className="mt-1 text-sm">
          Añade <code className="rounded bg-muted px-1">NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
          <code className="rounded bg-muted px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en{" "}
          <code className="rounded bg-muted px-1">.env.local</code> para cargar tu perfil real.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-muted-foreground">
        <Spinner className="h-8 w-8" />
        <span>Cargando perfil…</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mi perfil</h1>
          <p className="mt-1 text-muted-foreground">
            Información de tu cuenta y tu tienda (desde la base de datos)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isEditing && (
            <button
              type="button"
              disabled={saving}
              onClick={() => void handleCancelEdit()}
              className="rounded-lg border border-border bg-background px-4 py-2 font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
            >
              Cancelar
            </button>
          )}
          <button
            type="button"
            disabled={saving}
            onClick={() => (isEditing ? void handleSave() : setIsEditing(true))}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors disabled:opacity-60 ${
              isEditing
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {isEditing ? (
              <>
                {saving ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {saving ? "Guardando…" : "Guardar cambios"}
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4" />
                Editar perfil
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <User className="h-12 w-12 text-primary" />
              </div>
              {isEditing && (
                <button
                  type="button"
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                  title="Próximamente: foto de perfil"
                  disabled
                >
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-foreground">
              {form.fullName.trim() || "Sin nombre"}
            </h2>
            <p className="text-muted-foreground">
              {form.businessName.trim() || "Tu tienda"}
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
              <span className={`rounded-full px-3 py-1 text-sm ${badge.className}`}>
                {badge.label}
              </span>
            </div>
            <div className="mt-6 w-full border-t border-border pt-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.kind === "tendero" ? stats.ordersCount : "—"}
                  </p>
                  <p className="text-sm text-muted-foreground">Pedidos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.kind === "tendero" ? formatCop(stats.totalSpent) : "—"}
                  </p>
                  <p className="text-sm text-muted-foreground">Total compras</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Totales según pedidos registrados en el sistema.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <User className="h-5 w-5 text-primary" />
              Información personal
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Nombre completo
                </label>
                <p className="text-foreground">{form.fullName || "—"}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  El nombre legal no se puede cambiar aquí. Contacta soporte si necesitas corregirlo.
                </p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Correo electrónico
                </label>
                <p className="flex items-center gap-2 text-foreground">
                  <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {email || "—"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  El correo se gestiona en la cuenta de acceso; para cambiarlo usa recuperación en el proveedor de autenticación.
                </p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Teléfono
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <p className="flex items-center gap-2 text-foreground">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {form.phone || "—"}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  NIT
                </label>
                <p className="text-foreground">{form.nit || "—"}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  El NIT o documento no se modifica aquí.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Store className="h-5 w-5 text-primary" />
              Tu tienda
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Nombre de la tienda / comercio
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <p className="text-foreground">{form.businessName || "—"}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Giro o tipo de comercio
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={form.businessType}
                    onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                    placeholder="Ej. Tienda de barrio, miscelánea…"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <p className="text-foreground">{form.businessType || "—"}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Ubicación en Colombia
                </label>
                {isEditing ? (
                  <ColombiaLocationSelect
                    department={form.department}
                    city={form.city}
                    onDepartmentChange={(d) => setForm((f) => ({ ...f, department: d }))}
                    onCityChange={(c) => setForm((f) => ({ ...f, city: c }))}
                    idPrefix="tendero-perfil"
                  />
                ) : (
                  <p className="flex items-start gap-2 text-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    {form.department || form.city
                      ? [form.city, form.department].filter(Boolean).join(", ") || "—"
                      : "—"}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Dirección
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <p className="text-foreground">{form.address || "—"}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Descripción
                </label>
                {isEditing ? (
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <p className="text-muted-foreground">{form.bio || "—"}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/tendero/perfil/seguridad"
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/50">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-foreground">Seguridad</p>
            <p className="text-sm text-muted-foreground">Contraseña</p>
          </div>
        </Link>
        <Link
          href="/tendero/notificaciones"
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/50">
            <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="font-medium text-foreground">Notificaciones</p>
            <p className="text-sm text-muted-foreground">Alertas</p>
          </div>
        </Link>
        <Link
          href="/tendero/perfil/pagos"
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/50">
            <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="font-medium text-foreground">Métodos de pago</p>
            <p className="text-sm text-muted-foreground">Tarjetas y cuentas</p>
          </div>
        </Link>
        <Link
          href="/tendero/perfil/facturas"
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950/50">
            <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="font-medium text-foreground">Facturación</p>
            <p className="text-sm text-muted-foreground">Historial</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
