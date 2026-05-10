export type AppRole = "tendero" | "proveedor" | "admin"

export function dashboardPathForRole(role: string | undefined): string {
  switch (role) {
    case "proveedor":
      return "/proveedor/dashboard"
    case "admin":
      return "/admin/dashboard"
    case "tendero":
    default:
      return "/tendero/catalogo"
  }
}
