"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Package,
  Store,
  FolderTree,
  MapPin,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Shield,
} from "lucide-react"
import { useState } from "react"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/proveedores", label: "Proveedores", icon: Store },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: FolderTree },
  { href: "/admin/ciudades", label: "Ciudades", icon: MapPin },
]

export type AdminShellProps = {
  children: React.ReactNode
  displayName: string
  subtitle: string
  userEmail: string
  initials: string
  sessionActive: boolean
}

export function AdminShell({
  children,
  displayName,
  subtitle,
  userEmail,
  initials,
  sessionActive,
}: AdminShellProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const signOutControl = sessionActive ? (
    <form action="/auth/signout" method="post">
      <button
        type="submit"
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
      >
        <LogOut className="h-4 w-4" />
        Cerrar sesión
      </button>
    </form>
  ) : (
    <Link
      href="/auth/login"
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
    >
      <LogOut className="h-4 w-4" />
      Ir al login
    </Link>
  )

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive">
            <Shield className="h-4 w-4 text-destructive-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">Admin Panel</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <Link
            href="/admin/configuracion"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <Settings className="h-5 w-5" />
            Configuración
          </Link>
        </div>
      </aside>

      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar lg:hidden">
            <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive">
                  <Shield className="h-4 w-4 text-destructive-foreground" />
                </div>
                <span className="text-lg font-bold text-sidebar-foreground">Admin</span>
              </div>
              <button type="button" onClick={() => setSidebarOpen(false)} className="text-sidebar-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </aside>
        </>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="h-6 w-6 text-foreground" />
            </button>
            <div className="hidden lg:block">
              <h1 className="text-lg font-semibold text-foreground">
                {navItems.find((item) => pathname === item.href || pathname.startsWith(item.href + "/"))?.label ||
                  "Dashboard"}
              </h1>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-muted"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-sm font-medium text-destructive">
                {initials}
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-border bg-card shadow-lg">
                  <div className="border-b border-border p-4">
                    <p className="font-medium text-card-foreground">{displayName}</p>
                    <p className="text-sm text-muted-foreground">{userEmail || "—"}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/admin/configuracion"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Settings className="h-4 w-4" />
                      Configuración
                    </Link>
                    <hr className="my-2 border-border" />
                    {signOutControl}
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  )
}
