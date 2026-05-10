"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Search, 
  Filter, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Eye, 
  ChevronDown,
  MoreVertical,
  Phone,
  MapPin,
  Calendar
} from "lucide-react"

// Sample orders data
const orders = [
  {
    id: "ORD-5678",
    customer: "Tienda Don Pepe",
    customerPhone: "+57 300 123 4567",
    address: "Calle 123 #45-67, Bogotá",
    items: 5,
    total: 185000,
    status: "pending",
    date: "2024-01-20",
    time: "Hace 5 min",
    products: [
      { name: "Aceite Vegetal Premium 1L", quantity: 12, price: 8500 },
      { name: "Arroz Premium 5kg", quantity: 4, price: 22000 },
    ],
  },
  {
    id: "ORD-5677",
    customer: "Mini Mercado La Esquina",
    customerPhone: "+57 301 234 5678",
    address: "Carrera 50 #30-20, Medellín",
    items: 8,
    total: 342000,
    status: "processing",
    date: "2024-01-20",
    time: "Hace 30 min",
    products: [
      { name: "Café Molido Premium 500g", quantity: 10, price: 28000 },
    ],
  },
  {
    id: "ORD-5676",
    customer: "Droguería Central",
    customerPhone: "+57 302 345 6789",
    address: "Av. Principal #10-15, Cali",
    items: 3,
    total: 89000,
    status: "shipped",
    date: "2024-01-19",
    time: "Hace 1 hora",
    products: [
      { name: "Jabón de Tocador Pack x12", quantity: 3, price: 24000 },
    ],
  },
  {
    id: "ORD-5675",
    customer: "Supermercado Express",
    customerPhone: "+57 303 456 7890",
    address: "Zona Industrial, Barranquilla",
    items: 12,
    total: 567000,
    status: "delivered",
    date: "2024-01-18",
    time: "Hace 2 horas",
    products: [
      { name: "Detergente Líquido 3L", quantity: 20, price: 15000 },
    ],
  },
  {
    id: "ORD-5674",
    customer: "Tienda María",
    customerPhone: "+57 304 567 8901",
    address: "Barrio Centro, Bucaramanga",
    items: 2,
    total: 45000,
    status: "cancelled",
    date: "2024-01-17",
    time: "Hace 1 día",
    products: [],
  },
]

const statusConfig = {
  pending: { 
    label: "Pendiente", 
    color: "bg-warning/10 text-warning border-warning/30", 
    icon: Clock,
    actions: ["Confirmar", "Rechazar"]
  },
  processing: { 
    label: "Procesando", 
    color: "bg-primary/10 text-primary border-primary/30", 
    icon: Package,
    actions: ["Marcar enviado"]
  },
  shipped: { 
    label: "Enviado", 
    color: "bg-accent/10 text-accent border-accent/30", 
    icon: Truck,
    actions: ["Marcar entregado"]
  },
  delivered: { 
    label: "Entregado", 
    color: "bg-success/10 text-success border-success/30", 
    icon: CheckCircle,
    actions: []
  },
  cancelled: { 
    label: "Cancelado", 
    color: "bg-destructive/10 text-destructive border-destructive/30", 
    icon: XCircle,
    actions: []
  },
}

type OrderStatus = keyof typeof statusConfig

export default function PedidosProveedorPage() {
  const [filter, setFilter] = useState<OrderStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

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
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const pendingCount = orders.filter(o => o.status === "pending").length

  return (
    <div className="p-4 lg:p-6">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pedidos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona los pedidos de tus clientes
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 px-4 py-2">
            <Clock className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium text-warning">
              {pendingCount} pedido(s) pendiente(s)
            </span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por # de pedido o cliente..."
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
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const status = statusConfig[order.status as OrderStatus]
          const StatusIcon = status.icon
          const isExpanded = selectedOrder === order.id
          
          return (
            <div
              key={order.id}
              className={`rounded-xl border bg-card transition-all ${
                order.status === "pending" 
                  ? "border-warning/30" 
                  : "border-border hover:border-primary/30"
              }`}
            >
              {/* Order Header */}
              <div 
                className="flex cursor-pointer flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
                onClick={() => setSelectedOrder(isExpanded ? null : order.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg border ${status.color}`}>
                    <StatusIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-card-foreground">{order.id}</span>
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.customer} • {order.items} productos
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{formatPrice(order.total)}</p>
                    <p className="text-xs text-muted-foreground">{order.time}</p>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-border p-4">
                  <div className="grid gap-6 lg:grid-cols-3">
                    {/* Customer Info */}
                    <div>
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Información del Cliente
                      </h4>
                      <div className="space-y-2">
                        <p className="font-medium text-card-foreground">{order.customer}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {order.customerPhone}
                        </div>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          {order.address}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(order.date)}
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <div>
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Productos
                      </h4>
                      {order.products.length > 0 ? (
                        <div className="space-y-2">
                          {order.products.map((product, idx) => (
                            <div key={idx} className="flex items-center justify-between rounded-lg bg-muted p-2">
                              <div>
                                <p className="text-sm font-medium text-card-foreground">{product.name}</p>
                                <p className="text-xs text-muted-foreground">x{product.quantity}</p>
                              </div>
                              <span className="text-sm font-medium text-card-foreground">
                                {formatPrice(product.price * product.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No hay detalles disponibles</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div>
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Acciones
                      </h4>
                      <div className="space-y-2">
                        {status.actions.map((action, idx) => (
                          <button
                            key={idx}
                            className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                              action === "Rechazar"
                                ? "border border-destructive/30 text-destructive hover:bg-destructive/10"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                            }`}
                          >
                            {action}
                          </button>
                        ))}
                        <Link
                          href={`/proveedor/pedidos/${order.id}`}
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          <Eye className="h-4 w-4" />
                          Ver detalles completos
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-foreground">No se encontraron pedidos</h2>
          <p className="mt-2 text-muted-foreground">
            No hay pedidos que coincidan con los filtros seleccionados
          </p>
        </div>
      )}
    </div>
  )
}
