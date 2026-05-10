"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { getSupabasePublicEnv } from "@/lib/supabase/config"

/** PostgREST / PG cuando faltan columnas o el caché aún no las ve. */
function missingColumnOrSchemaCacheError(message: string): boolean {
  const m = message.toLowerCase()
  return (
    m.includes("schema cache") ||
    (m.includes("could not find") && m.includes("column")) ||
    (m.includes("does not exist") && m.includes("column")) ||
    m.includes("42703") ||
    m.includes("pgrst204")
  )
}

function normalizeRole(r: string | undefined | null): "tendero" | "proveedor" | "admin" {
  if (r === "proveedor" || r === "admin" || r === "tendero") return r
  return "tendero"
}

export type DashboardRole = "tendero" | "proveedor"

export type ProfileForm = {
  fullName: string
  businessName: string
  phone: string
  nit: string
  department: string
  city: string
  address: string
  businessType: string
  bio: string
  websiteUrl: string
  businessHours: string
}

const emptyForm: ProfileForm = {
  fullName: "",
  businessName: "",
  phone: "",
  nit: "",
  department: "",
  city: "",
  address: "",
  businessType: "",
  bio: "",
  websiteUrl: "",
  businessHours: "",
}

export type TenderoProfileStats = {
  kind: "tendero"
  ordersCount: number
  totalSpent: number
}

export type ProveedorProfileStats = {
  kind: "proveedor"
  productsCount: number
  customersCount: number
  monthlySales: number
  ordersCount: number
}

function mapProfileToForm(row: Record<string, unknown> | null): ProfileForm {
  if (!row) return { ...emptyForm }
  return {
    fullName: String(row.full_name ?? ""),
    businessName: String(row.business_name ?? ""),
    phone: String(row.phone ?? ""),
    nit: String(row.nit ?? ""),
    department: String(row.department ?? ""),
    city: String(row.city ?? ""),
    address: String(row.address ?? ""),
    businessType: String(row.business_type ?? ""),
    bio: String(row.bio ?? ""),
    websiteUrl: String(row.website_url ?? ""),
    businessHours: String(row.business_hours ?? ""),
  }
}

export function useDashboardProfile(role: DashboardRole) {
  const { isConfigured } = getSupabasePublicEnv()
  const [loading, setLoading] = useState(Boolean(isConfigured))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [form, setForm] = useState<ProfileForm>(emptyForm)
  const [accountStatus, setAccountStatus] = useState<string | null>(null)
  const [stats, setStats] = useState<TenderoProfileStats | ProveedorProfileStats | null>(
    null
  )

  const load = useCallback(async () => {
    if (!getSupabasePublicEnv().isConfigured) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setError("No hay sesión activa.")
        setLoading(false)
        return
      }
      setEmail(user.email ?? "")
      setUserId(user.id)

      const { data: profile, error: pErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()

      if (pErr) {
        setError(pErr.message)
        setLoading(false)
        return
      }

      setForm(mapProfileToForm(profile as Record<string, unknown>))
      setAccountStatus(
        (profile?.account_status as string | undefined) ?? "activo"
      )

      if (role === "tendero") {
        const { count, data, error: oErr } = await supabase
          .from("pedidos")
          .select("total, estado", { count: "exact" })
          .eq("tendero_id", user.id)

        let ordersCount = 0
        let totalSpent = 0
        if (!oErr && data) {
          ordersCount = count ?? data.length
          totalSpent = data
            .filter((r) => r.estado !== "cancelado")
            .reduce((s, r) => s + Number(r.total ?? 0), 0)
        }
        setStats({ kind: "tendero", ordersCount, totalSpent })
      } else {
        const { count: productsCount, error: prErr } = await supabase
          .from("productos")
          .select("*", { count: "exact", head: true })
          .eq("proveedor_id", user.id)

        const { data: pedidosRows, error: peErr } = await supabase
          .from("pedidos")
          .select("tendero_id, total, estado, fecha")
          .eq("proveedor_id", user.id)

        let customersCount = 0
        let ordersCount = 0
        let monthlySales = 0
        const products = prErr ? 0 : (productsCount ?? 0)

        if (!peErr && pedidosRows) {
          ordersCount = pedidosRows.length
          customersCount = new Set(pedidosRows.map((r) => r.tendero_id)).size
          const start = new Date()
          start.setDate(1)
          start.setHours(0, 0, 0, 0)
          monthlySales = pedidosRows
            .filter(
              (r) =>
                r.estado !== "cancelado" &&
                r.fecha &&
                new Date(r.fecha as string) >= start
            )
            .reduce((s, r) => s + Number(r.total ?? 0), 0)
        }

        setStats({
          kind: "proveedor",
          productsCount: products,
          customersCount,
          monthlySales,
          ordersCount,
        })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar el perfil.")
    } finally {
      setLoading(false)
    }
  }, [role])

  useEffect(() => {
    void load()
  }, [load])

  const saveProfile = useCallback(async (): Promise<{ ok: true } | { ok: false; message: string }> => {
    if (!userId || !isConfigured) return { ok: false, message: "Sin sesión o Supabase no configurado." }
    setSaving(true)
    setError(null)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user || user.id !== userId) {
        const msg = "Sesión no válida. Vuelve a iniciar sesión."
        setError(msg)
        return { ok: false, message: msg }
      }

      const core = {
        phone: form.phone.trim() || null,
        business_name: form.businessName.trim() || null,
        business_type: form.businessType.trim() || null,
        city: form.city.trim() || null,
        address: form.address.trim() || null,
      }

      const withDepartment = {
        ...core,
        department: form.department.trim() || null,
      }

      const extended = {
        ...withDepartment,
        bio: form.bio.trim() || null,
        website_url: form.websiteUrl.trim() || null,
        business_hours: form.businessHours.trim() || null,
      }

      const payloads = [extended, withDepartment, core] as const

      let lastError: { message: string } | null = null
      let saved = false

      for (const p of payloads) {
        const { data, error } = await supabase
          .from("profiles")
          .update(p)
          .eq("id", userId)
          .select("id")

        if (error) {
          if (missingColumnOrSchemaCacheError(error.message)) {
            lastError = error
            continue
          }
          setError(error.message)
          return { ok: false, message: error.message }
        }

        lastError = null
        if (data && data.length > 0) {
          saved = true
          break
        }
      }

      if (!saved) {
        const { data: existing } = await supabase
          .from("profiles")
          .select("role, full_name")
          .eq("id", userId)
          .maybeSingle()

        const role = normalizeRole(
          (existing?.role as string) || (user.user_metadata?.role as string)
        )
        const full_name =
          (existing?.full_name as string) ||
          (user.user_metadata?.full_name as string) ||
          form.fullName.trim() ||
          null

        for (const p of payloads) {
          const { data, error } = await supabase
            .from("profiles")
            .upsert(
              {
                id: userId,
                role,
                full_name: full_name || null,
                ...(p as Record<string, unknown>),
              },
              { onConflict: "id" }
            )
            .select("id")

          if (error) {
            if (missingColumnOrSchemaCacheError(error.message)) {
              lastError = error
              continue
            }
            setError(error.message)
            return { ok: false, message: error.message }
          }

          lastError = null
          if (data && data.length > 0) {
            saved = true
            break
          }
        }
      }

      if (!saved) {
        const hint =
          lastError?.message ??
          "No se actualizó ninguna fila en profiles (falta la fila o permisos RLS)."
        setError(hint)
        return { ok: false, message: hint }
      }

      await load()
      return { ok: true }
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudo guardar."
      setError(message)
      return { ok: false, message }
    } finally {
      setSaving(false)
    }
  }, [userId, form, isConfigured, load])

  return {
    isConfigured,
    loading,
    saving,
    error,
    email,
    userId,
    form,
    setForm,
    accountStatus,
    stats,
    refresh: load,
    saveProfile,
  }
}
