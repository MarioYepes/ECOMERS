"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Store,
  LayoutGrid,
  ShoppingCart,
  Package,
  ClipboardList,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
} from "lucide-react"
import { useState } from "react"

const navItems = [
  { href: "/tendero/catalogo", label: "Catálogo", icon: LayoutGrid },
  { href: "/tendero/carrito", label: "Carrito", icon: ShoppingCart, badge: 3 },
  { href: "/tendero/pedidos", label: "Mis Pedidos", icon: ClipboardList },
  { href: "/tendero/historial", label: "Historial", icon: Package },
]

export type TenderoShellProps = {
  children: React.ReactNode
  displayName: string
  subtitle: string
  userEmail: string
  initials: string
  sessionActive: boolean
}

export function TenderoShell({
  children,
  displayName,
  subtitle,
  userEmail,
  initials,
  sessionActive,
}: TenderoShellProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const notifications = [
    { id: 1, title: "Pedido #1234 enviado", message: "Tu pedido está en camino", time: "Hace 5 min", unread: true },
    { id: 2, title: "Nuevo descuento", message: "20% en productos de limpieza", time: "Hace 1 hora", unread: true },
    { id: 3, title: "Pedido #1233 entregado", message: "Confirma la recepción", time: "Hace 2 horas", unread: false },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>

            <Link href="/tendero/catalogo" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Store className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="hidden text-lg font-bold text-foreground sm:block">TenderMarket</span>
            </Link>
          </div>

          <div className="hidden max-w-xl flex-1 px-8 md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar productos, marcas, categorías..."
                className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/tendero/carrito"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
                3
              </span>
            </Link>

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
                      <Link href="/tendero/notificaciones" className="text-xs text-primary hover:text-primary/80">
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
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
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
                        href="/tendero/perfil"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <User className="h-4 w-4" />
                        Mi Perfil
                      </Link>
                      <Link
                        href="/tendero/notificaciones"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <Bell className="h-4 w-4" />
                        Notificaciones
                      </Link>
                      <hr className="my-2 border-border" />
                      {sessionActive ? (
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
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <nav className="hidden border-t border-border lg:block">
          <div className="flex items-center gap-1 px-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {item.badge && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-medium text-accent-foreground">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="border-t border-border p-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar productos..."
              className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
          <nav className="fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r border-border bg-card lg:hidden">
            <div className="p-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                    {item.badge && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-medium text-accent-foreground">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>
        </>
      )}

      <main className="min-h-[calc(100vh-8rem)]">{children}</main>
    </div>
  )
}
