import colombiaRaw from "./colombia-municipios.json"

export type ColombiaDeptRow = {
  id: number
  departamento: string
  ciudades: string[]
}

const rows = colombiaRaw as ColombiaDeptRow[]

const byDept = new Map<string, string[]>()
for (const row of rows) {
  byDept.set(row.departamento, [...row.ciudades].sort((a, b) => a.localeCompare(b, "es")))
}

/** Lista ordenada de departamentos (32 + distritos especiales). */
export const COLOMBIA_DEPARTMENTS: string[] = [...byDept.keys()].sort((a, b) =>
  a.localeCompare(b, "es")
)

export function getCitiesForDepartment(department: string): string[] {
  return byDept.get(department) ?? []
}

export function isValidColombiaLocation(department: string, city: string): boolean {
  const cities = byDept.get(department)
  if (!cities) return false
  return cities.includes(city)
}
