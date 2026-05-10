"use client"

import Link from "next/link"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Store, 
  Package, 
  ShoppingCart, 
  DollarSign,
  ArrowUpRight,
  UserPlus,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react"

// Sample dashboard data
const stats = [
  {
    title: "Ingresos Totales",
    value: "$458,230,000",
    change: "+18.2%",
    trend: "up",
    icon: DollarSign,
    color: "bg-success/10 text-success",
  },
  {
    title: "Tenderos Activos",
    value: "10,234",
    change: "+324 este mes",
    trend: "up",
    icon: Users,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Proveedores",
    value: "512",
    change: "+28 verificados",
    trend: "up",
    icon: Store,
    color: "bg-accent/10 text-accent",
  },
  {
    title: "Pedidos Hoy",
    value: "1,847",
    change: "+12% vs ayer",
    trend: "up",
    icon: ShoppingCart,
    color: "bg-warning/10 text-warning",
  },
]

const recentActivity = [
  { type: "user", action: "Nuevo tendero registrado", name: "Tienda La Esperanza", time: "Hace 2 min" },
  { type: "order", action: "Pedido completado", name: "ORD-8923", time: "Hace 5 min" },
  { type: "supplier", action: "Proveedor verificado", name: "Distribuidora ABC", time: "Hace 15 min" },
  { type: "alert", action: "Reporte de problema", name: "Pedido ORD-8901", time: "Hace 30 min" },
  { type: "user", action: "Nuevo tendero registrado", name: "Mini Mercado Central", time: "Hace 45 min" },
]

const pendingApprovals = [
  { id: 1, type: "supplier", name: "Importadora del Norte S.A.", date: "2024-01-20", docs: 5 },
  { id: 2, type: "supplier", name: "Lácteos Premium Ltda", date: "2024-01-19", docs: 3 },
  { id: 3, type: "supplier", name: "Distribuidora Oriente", date: "2024-01-18", docs: 4 },
]

const topCities = [
  { name: "Bogotá", users: 4521, orders: 12450, revenue: 185000000 },
  { name: "Medellín", users: 2834, orders: 7823, revenue: 98500000 },
  { name: "Cali", users: 1567, orders: 4234, revenue: 52300000 },
  { name: "Barranquilla", users: 892, orders: 2156, revenue: 28900000 },
  { name: "Cartagena", users: 654, orders: 1678, revenue: 21400000 },
]

export default function AdminDashboard() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      notation: "compact",
    }).format(price)
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.title} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-success">
                <TrendingUp className="h-3 w-3" />
                {stat.change}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Activity Feed */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-semibold text-card-foreground">Actividad Reciente</h2>
            <Link href="/admin/actividad" className="flex items-center gap-1 text-sm text-primary hover:text-primary/80">
              Ver todo
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  activity.type === "user" ? "bg-primary/10 text-primary" :
                  activity.type === "order" ? "bg-success/10 text-success" :
                  activity.type === "supplier" ? "bg-accent/10 text-accent" :
                  "bg-warning/10 text-warning"
                }`}>
                  {activity.type === "user" && <UserPlus className="h-5 w-5" />}
                  {activity.type === "order" && <CheckCircle className="h-5 w-5" />}
                  {activity.type === "supplier" && <Store className="h-5 w-5" />}
                  {activity.type === "alert" && <AlertTriangle className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.name}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-semibold text-card-foreground">Aprobaciones Pendientes</h2>
            <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
              {pendingApprovals.length}
            </span>
          </div>
          <div className="divide-y divide-border">
            {pendingApprovals.map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <Store className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-card-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.docs} documentos</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                    Aprobar
                  </button>
                  <button className="flex-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted">
                    Revisar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Cities */}
      <div className="mt-6 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-semibold text-card-foreground">Top Ciudades</h2>
          <Link href="/admin/ciudades" className="flex items-center gap-1 text-sm text-primary hover:text-primary/80">
            Ver todas
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ciudad</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Usuarios</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pedidos</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ingresos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topCities.map((city, index) => (
                <tr key={city.name} className="transition-colors hover:bg-muted/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                      <span className="font-medium text-card-foreground">{city.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{city.users.toLocaleString()}</td>
                  <td className="p-4 text-sm text-muted-foreground">{city.orders.toLocaleString()}</td>
                  <td className="p-4 text-sm font-semibold text-success">{formatPrice(city.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
