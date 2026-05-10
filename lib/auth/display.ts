export function initialsFromUser(fullName: string | null | undefined, email: string) {
  const name = fullName?.trim() ?? ""
  if (name.length >= 2) {
    const parts = name.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      const a = parts[0]?.[0]
      const b = parts[parts.length - 1]?.[0]
      if (a && b) return (a + b).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }
  const local = email.split("@")[0] ?? "?"
  return local.slice(0, 2).toUpperCase()
}
