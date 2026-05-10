"use client"

import Link from "next/link"
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

// Sample dashboard data
const stats = [
  {
    title: "Ventas del Mes",
    value: "$12,450,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "primary",
  },
  {
    title: "Pedidos Nuevos",
    value: "48",
    change: "+8 vs ayer",
    trend: "up",
    icon: ShoppingCart,
    color: "accent",
  },
  {
    title: "Productos Activos",
    value: "156",
    change: "3 con bajo stock",
    trend: "warning",
    icon: Package,
    color: "success",
  },
  {
    title: "Clientes Activos",
    value: "324",
    change: "+15 nuevos",
    trend: "up",
    icon: Users,
    color: "primary",
  },
]

const recentOrders = [
  {
    id: "ORD-5678",
    customer: "Tienda Don Pepe",
    items: 5,
    total: 185000,
    status: "pending",
    time: "Hace 5 min",
  },
  {
    id: "ORD-5677",
    customer: "Mini Mercado La Esquina",
    items: 8,
    total: 342000,
    status: "processing",
    time: "Hace 30 min",
  },
  {
    id: "ORD-5676",
    customer: "Droguería Central",
    items: 3,
    total: 89000,
    status: "shipped",
    time: "Hace 1 hora",
  },
  {
    id: "ORD-5675",
    customer: "Supermercado Express",
    items: 12,
    total: 567000,
    status: "delivered",
    time: "Hace 2 horas",
  },
]

const lowStockProducts = [
  { id: 1, name: "Aceite Vegetal Premium 1L", stock: 15, minStock: 50 },
  { id: 2, name: "Detergente Líquido 3L", stock: 8, minStock: 30 },
  { id: 3, name: "Arroz Premium 5kg", stock: 22, minStock: 40 },
]

const topProducts = [
  { id: 1, name: "Café Molido Premium 500g", sales: 245, revenue: 6860000 },
  { id: 2, name: "Aceite Vegetal Premium 1L", sales: 198, revenue: 1683000 },
  { id: 3, name: "Arroz Premium Grano Largo 5kg", sales: 156, revenue: 3432000 },
  { id: 4, name: "Azúcar Refinada 2.5kg", sales: 134, revenue: 1313200 },
  { id: 5, name: "Leche Entera UHT 1L x6", sales: 121, revenue: 2238500 },
]

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-warning/10 text-warning", icon: Clock },
  processing: { label: "Procesando", color: "bg-primary/10 text-primary", icon: Package },
  shipped: { label: "Enviado", color: "bg-accent/10 text-accent", icon: ShoppingCart },
  delivered: { label: "Entregado", color: "bg-success/10 text-success", icon: CheckCircle },
}

export default function ProveedorDashboard() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${stat.color}/10`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}`} />
              </div>
              {stat.trend === "up" && (
                <span className="flex items-center gap-1 text-xs font-medium text-success">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </span>
              )}
              {stat.trend === "down" && (
                <span className="flex items-center gap-1 text-xs font-medium text-destructive">
                  <TrendingDown className="h-3 w-3" />
                  {stat.change}
                </span>
              )}
              {stat.trend === "warning" && (
                <span className="flex items-center gap-1 text-xs font-medium text-warning">
                  <AlertTriangle className="h-3 w-3" />
                  {stat.change}
                </span>
              )}
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
        {/* Recent Orders */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-semibold text-card-foreground">Pedidos Recientes</h2>
            <Link 
              href="/proveedor/pedidos" 
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
            >
              Ver todos
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentOrders.map((order) => {
              const status = statusConfig[order.status as keyof typeof statusConfig]
              const StatusIcon = status.icon
              return (
                <div key={order.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${status.color}`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-card-foreground">{order.id}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.customer} • {order.items} productos
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-card-foreground">{formatPrice(order.total)}</p>
                    <p className="text-xs text-muted-foreground">{order.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Low Stock Alert */}
          <div className="rounded-xl border border-warning/30 bg-warning/5">
            <div className="flex items-center gap-2 border-b border-warning/20 p-4">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <h2 className="font-semibold text-card-foreground">Stock Bajo</h2>
            </div>
            <div className="divide-y divide-warning/20">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">Mín: {product.minStock} unidades</p>
                  </div>
                  <span className="rounded-full bg-warning/20 px-2.5 py-1 text-xs font-semibold text-warning">
                    {product.stock} uds
                  </span>
                </div>
              ))}
            </div>
            <div className="p-4">
              <Link
                href="/proveedor/productos?filter=low-stock"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-warning/30 py-2 text-sm font-medium text-warning transition-colors hover:bg-warning/10"
              >
                Gestionar inventario
              </Link>
            </div>
          </div>

          {/* Top Products */}
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="font-semibold text-card-foreground">Top Productos</h2>
              <span className="text-xs text-muted-foreground">Este mes</span>
            </div>
            <div className="divide-y divide-border">
              {topProducts.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex items-center gap-3 p-4">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-card-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sales} vendidos</p>
                  </div>
                  <span className="text-sm font-semibold text-success">
                    {formatPrice(product.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
