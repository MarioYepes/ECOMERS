"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Store,
  LayoutDashboard,
  Package,
  ClipboardList,
  BarChart3,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Settings,
  TruckIcon,
} from "lucide-react"
import { useState } from "react"

const navItems = [
  { href: "/proveedor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/proveedor/productos", label: "Productos", icon: Package },
  { href: "/proveedor/pedidos", label: "Pedidos", icon: ClipboardList, badge: 5 },
  { href: "/proveedor/estadisticas", label: "Estadísticas", icon: BarChart3 },
]

export type ProveedorShellProps = {
  children: React.ReactNode
  displayName: string
  subtitle: string
  userEmail: string
  initials: string
  sessionActive: boolean
}

export function ProveedorShell({
  children,
  displayName,
  subtitle,
  userEmail,
  initials,
  sessionActive,
}: ProveedorShellProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const notifications = [
    { id: 1, title: "Nuevo pedido #5678", message: "Tienda Don Pepe realizó un pedido", time: "Hace 2 min", unread: true },
    { id: 2, title: "Pedido confirmado", message: "El pedido #5677 fue confirmado", time: "Hace 30 min", unread: true },
    { id: 3, title: "Stock bajo", message: "Aceite Vegetal Premium tiene poco stock", time: "Hace 1 hora", unread: false },
  ]

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
        <Link
          href="/proveedor/dashboard"
          className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border px-6 transition-opacity hover:opacity-90"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <TruckIcon className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">TenderMarket</span>
        </Link>

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
                {item.badge && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary px-1.5 text-xs font-medium text-sidebar-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium text-sidebar-accent-foreground">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{displayName}</p>
              <p className="truncate text-xs text-sidebar-foreground/60">{subtitle}</p>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar lg:hidden">
            <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
              <Link href="/proveedor/dashboard" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                  <TruckIcon className="h-4 w-4 text-sidebar-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-sidebar-foreground">TenderMarket</span>
              </Link>
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
                    {item.badge && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary px-1.5 text-xs font-medium text-sidebar-primary-foreground">
                        {item.badge}
                      </span>
                    )}
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

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen)
                  setUserMenuOpen(false)
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground">
                  2
                </span>
              </button>

              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-border bg-card shadow-lg">
                    <div className="flex items-center justify-between border-b border-border p-4">
                      <h3 className="font-semibold text-card-foreground">Notificaciones</h3>
                      <Link href="/proveedor/notificaciones" className="text-xs text-primary hover:text-primary/80">
                        Ver todas
                      </Link>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`border-b border-border p-4 last:border-0 ${notification.unread ? "bg-primary/5" : ""}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 h-2 w-2 rounded-full ${notification.unread ? "bg-primary" : "bg-transparent"}`} />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-card-foreground">{notification.title}</p>
                              <p className="text-xs text-muted-foreground">{notification.message}</p>
                              <p className="mt-1 text-xs text-muted-foreground">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen)
                  setNotificationsOpen(false)
                }}
                className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-muted"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-medium text-accent">
                  {initials}
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
                        href="/proveedor/perfil"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <User className="h-4 w-4" />
                        Mi Perfil
                      </Link>
                      <Link
                        href="/proveedor/configuracion"
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
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  )
}
