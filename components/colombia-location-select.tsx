"use client"

import { useEffect, useMemo, useState } from "react"
import { COLOMBIA_DEPARTMENTS, getCitiesForDepartment } from "@/lib/data/colombia"

export type ColombiaLocationSelectProps = {
  department: string
  city: string
  onDepartmentChange: (department: string) => void
  onCityChange: (city: string) => void
  disabled?: boolean
  idPrefix?: string
}

export function ColombiaLocationSelect({
  department,
  city,
  onDepartmentChange,
  onCityChange,
  disabled = false,
  idPrefix = "co-loc",
}: ColombiaLocationSelectProps) {
  const cities = useMemo(() => getCitiesForDepartment(department), [department])

  useEffect(() => {
    if (!department) {
      if (city) onCityChange("")
      return
    }
    if (!city) return
    if (!cities.includes(city)) {
      onCityChange("")
    }
  }, [department, city, cities, onCityChange])

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label htmlFor={`${idPrefix}-dept`} className="mb-1 block text-sm font-medium text-muted-foreground">
          Departamento (Colombia)
        </label>
        <select
          id={`${idPrefix}-dept`}
          value={department}
          disabled={disabled}
          onChange={(e) => {
            const d = e.target.value
            onDepartmentChange(d)
            onCityChange("")
          }}
          className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">Seleccionar departamento…</option>
          {COLOMBIA_DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`${idPrefix}-city`} className="mb-1 block text-sm font-medium text-muted-foreground">
          Ciudad / municipio
        </label>
        <select
          id={`${idPrefix}-city`}
          value={city}
          disabled={disabled || !department}
          onChange={(e) => onCityChange(e.target.value)}
          className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">{department ? "Seleccionar ciudad…" : "Primero el departamento"}</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
