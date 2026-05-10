"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle, 
  ChevronRight, 
  Search,
  Filter,
  Eye,
  RotateCcw,
  MapPin
} from "lucide-react"

// Sample orders data
const orders = [
  {
    id: "ORD-2024-1234",
    date: "2024-01-15",
    status: "delivered",
    items: 5,
    total: 185000,
    deliveryDate: "2024-01-17",
    supplier: "Distribuidora El Sol",
    products: [
      { name: "Aceite Vegetal Premium 1L", quantity: 12 },
      { name: "Arroz Premium Grano Largo 5kg", quantity: 4 },
    ],
  },
  {
    id: "ORD-2024-1235",
    date: "2024-01-18",
    status: "in-transit",
    items: 3,
    total: 92000,
    deliveryDate: "2024-01-20",
    supplier: "Mayorista Central",
    products: [
      { name: "Detergente Líquido 3L", quantity: 6 },
      { name: "Jabón de Tocador Pack x12", quantity: 2 },
    ],
  },
  {
    id: "ORD-2024-1236",
    date: "2024-01-19",
    status: "processing",
    items: 8,
    total: 245000,
    deliveryDate: "2024-01-22",
    supplier: "Alimentos del Valle",
    products: [
      { name: "Café Molido Premium 500g", quantity: 10 },
      { name: "Azúcar Refinada 2.5kg", quantity: 8 },
    ],
  },
  {
    id: "ORD-2024-1237",
    date: "2024-01-10",
    status: "cancelled",
    items: 2,
    total: 45000,
    deliveryDate: null,
    supplier: "Lácteos Premium",
    products: [
      { name: "Leche Entera UHT 1L x6", quantity: 4 },
    ],
  },
]

const statusConfig = {
  pending: {
    label: "Pendiente",
    color: "bg-warning/10 text-warning",
    icon: Clock,
  },
  processing: {
    label: "Procesando",
    color: "bg-primary/10 text-primary",
    icon: Package,
  },
  "in-transit": {
    label: "En camino",
    color: "bg-accent/10 text-accent",
    icon: Truck,
  },
  delivered: {
    label: "Entregado",
    color: "bg-success/10 text-success",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelado",
    color: "bg-destructive/10 text-destructive",
    icon: XCircle,
  },
}

type OrderStatus = keyof typeof statusConfig

export default function PedidosPage() {
  const [filter, setFilter] = useState<OrderStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === "all" || order.status === filter
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const activeOrders = orders.filter(o => ["processing", "in-transit"].includes(o.status))

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Mis Pedidos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestiona y da seguimiento a tus pedidos
        </p>
      </div>

      {/* Active Orders Summary */}
      {activeOrders.length > 0 && (
        <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">
              Tienes {activeOrders.length} {activeOrders.length === 1 ? "pedido activo" : "pedidos activos"}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            {activeOrders.map(order => {
              const StatusIcon = statusConfig[order.status as OrderStatus].icon
              return (
                <Link
                  key={order.id}
                  href={`/tendero/pedidos/${order.id}`}
                  className="flex items-center gap-2 rounded-lg bg-card px-3 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <StatusIcon className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">{order.id}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{statusConfig[order.status as OrderStatus].label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por # de pedido..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Todos
          </button>
          {(Object.keys(statusConfig) as OrderStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {statusConfig[status].label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-foreground">No se encontraron pedidos</h2>
          <p className="mt-2 text-muted-foreground">
            {filter !== "all" 
              ? "No tienes pedidos con este estado" 
              : "Aún no has realizado ningún pedido"}
          </p>
          <Link
            href="/tendero/catalogo"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status = statusConfig[order.status as OrderStatus]
            const StatusIcon = status.icon
            
            return (
              <div
                key={order.id}
                className="rounded-xl border border-border bg-card transition-colors hover:border-primary/30"
              >
                {/* Order Header */}
                <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${status.color}`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-card-foreground">{order.id}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.supplier} • {formatDate(order.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{formatPrice(order.total)}</p>
                      <p className="text-xs text-muted-foreground">{order.items} productos</p>
                    </div>
                    <Link
                      href={`/tendero/pedidos/${order.id}`}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-4">
                  {/* Products Preview */}
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Productos</p>
                    <div className="flex flex-wrap gap-2">
                      {order.products.map((product, index) => (
                        <span
                          key={index}
                          className="rounded-lg bg-muted px-3 py-1.5 text-sm text-muted-foreground"
                        >
                          {product.name} x{product.quantity}
                        </span>
                      ))}
                      {order.items > order.products.length && (
                        <span className="rounded-lg bg-muted px-3 py-1.5 text-sm text-muted-foreground">
                          +{order.items - order.products.length} más
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Order Actions & Info */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Delivery Info */}
                    {order.deliveryDate && order.status !== "cancelled" && (
                      <div className="flex items-center gap-2 text-sm">
                        {order.status === "delivered" ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-success" />
                            <span className="text-muted-foreground">
                              Entregado el {formatDate(order.deliveryDate)}
                            </span>
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="text-muted-foreground">
                              Entrega estimada: {formatDate(order.deliveryDate)}
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/tendero/pedidos/${order.id}`}
                        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        <Eye className="h-4 w-4" />
                        Ver detalles
                      </Link>
                      {order.status === "delivered" && (
                        <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                          <RotateCcw className="h-4 w-4" />
                          Repetir pedido
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
