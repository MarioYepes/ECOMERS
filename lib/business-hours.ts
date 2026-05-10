export type DayId = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"

export const DAY_ORDER: DayId[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

export const DAY_LABELS: Record<DayId, string> = {
  mon: "Lunes",
  tue: "Martes",
  wed: "Miércoles",
  thu: "Jueves",
  fri: "Viernes",
  sat: "Sábado",
  sun: "Domingo",
}

export type DaySchedule = {
  enabled: boolean
  open: string
  close: string
}

export type HoursPreset = "lun_vie" | "lun_sab" | "all" | "custom"

export type BusinessHoursV2 = {
  v: 2
  open24h: boolean
  /** Último modo elegido en el formulario (lun_vie, lun_sab, all, custom). */
  uiPreset?: HoursPreset
  days: Record<DayId, DaySchedule>
}

function validUiPreset(p: unknown): p is HoursPreset {
  return p === "lun_vie" || p === "lun_sab" || p === "all" || p === "custom"
}

function emptyDay(): DaySchedule {
  return { enabled: false, open: "08:00", close: "18:00" }
}

export function defaultBusinessHours(): BusinessHoursV2 {
  return {
    v: 2,
    open24h: false,
    uiPreset: "lun_vie",
    days: {
      mon: { enabled: true, open: "08:00", close: "18:00" },
      tue: { enabled: true, open: "08:00", close: "18:00" },
      wed: { enabled: true, open: "08:00", close: "18:00" },
      thu: { enabled: true, open: "08:00", close: "18:00" },
      fri: { enabled: true, open: "08:00", close: "18:00" },
      sat: emptyDay(),
      sun: emptyDay(),
    },
  }
}

export function parseBusinessHours(raw: string | null | undefined): BusinessHoursV2 | null {
  if (!raw?.trim()) return null
  try {
    const o = JSON.parse(raw) as Partial<BusinessHoursV2>
    if (o?.v !== 2 || !o.days || typeof o.days !== "object") return null
    const days = {} as Record<DayId, DaySchedule>
    for (const id of DAY_ORDER) {
      const d = o.days[id]
      if (d && typeof d === "object") {
        days[id] = {
          enabled: Boolean(d.enabled),
          open: typeof d.open === "string" ? d.open : "08:00",
          close: typeof d.close === "string" ? d.close : "18:00",
        }
      } else {
        days[id] = emptyDay()
      }
    }
    return {
      v: 2,
      open24h: Boolean(o.open24h),
      ...(validUiPreset(o.uiPreset) ? { uiPreset: o.uiPreset } : {}),
      days,
    }
  } catch {
    return null
  }
}

export function getBusinessHoursState(raw: string | null | undefined): BusinessHoursV2 {
  return parseBusinessHours(raw) ?? defaultBusinessHours()
}

export function serializeBusinessHours(h: BusinessHoursV2): string {
  return JSON.stringify(h)
}

export function inferUiPreset(h: BusinessHoursV2): HoursPreset {
  if (h.open24h) return "lun_vie"
  const { days } = h
  const on = (id: DayId) => days[id].enabled
  const slot = (id: DayId) => `${days[id].open}\n${days[id].close}`
  const same = (ids: DayId[]) => ids.length > 0 && ids.every((id) => on(id) && slot(id) === slot(ids[0]!))
  const off = (ids: DayId[]) => ids.every((id) => !on(id))

  const wk = ["mon", "tue", "wed", "thu", "fri"] as DayId[]
  const wkSat = [...wk, "sat"] as DayId[]

  if (same(wk) && off(["sat", "sun"])) return "lun_vie"
  if (same(wkSat) && off(["sun"])) return "lun_sab"
  if (same([...DAY_ORDER]) && DAY_ORDER.every(on)) return "all"
  return "custom"
}

export function applyPreset(
  base: BusinessHoursV2,
  preset: Exclude<HoursPreset, "custom">,
  open: string,
  close: string
): BusinessHoursV2 {
  const days = { ...base.days }
  const off = (): DaySchedule => ({ enabled: false, open, close })
  const on = (): DaySchedule => ({ enabled: true, open, close })
  for (const id of DAY_ORDER) {
    days[id] = off()
  }
  if (preset === "lun_vie") {
    ;(["mon", "tue", "wed", "thu", "fri"] as DayId[]).forEach((id) => {
      days[id] = on()
    })
  } else if (preset === "lun_sab") {
    ;(["mon", "tue", "wed", "thu", "fri", "sat"] as DayId[]).forEach((id) => {
      days[id] = on()
    })
  } else if (preset === "all") {
    DAY_ORDER.forEach((id) => {
      days[id] = on()
    })
  }
  return { ...base, open24h: false, uiPreset: preset, days }
}

export function setOpen24h(): BusinessHoursV2 {
  const d = defaultBusinessHours()
  const days = {} as Record<DayId, DaySchedule>
  for (const id of DAY_ORDER) {
    days[id] = { enabled: true, open: "00:00", close: "23:59" }
  }
  const next: BusinessHoursV2 = { v: 2, open24h: true, days }
  delete next.uiPreset
  return next
}

export function formatBusinessHoursSpanish(raw: string | null | undefined): string {
  const legacy = raw?.trim()
  if (!legacy) return "—"
  const h = parseBusinessHours(legacy)
  if (!h) {
    return legacy
  }
  if (h.open24h) {
    return "Abierto 24 horas, todos los días"
  }
  const lines: string[] = []
  for (const id of DAY_ORDER) {
    const d = h.days[id]
    if (!d?.enabled) continue
    lines.push(`${DAY_LABELS[id]}: ${d.open} – ${d.close}`)
  }
  if (lines.length === 0) return "Sin horario definido"
  return lines.join("\n")
}
