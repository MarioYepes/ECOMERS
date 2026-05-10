"use client"

import { useState } from "react"
import { 
  Bell, 
  Package, 
  ShoppingCart, 
  AlertCircle, 
  CheckCircle2, 
  Truck,
  Tag,
  MessageSquare,
  Settings,
  Check,
  Trash2,
  Filter
} from "lucide-react"

type NotificationType = "pedido" | "entrega" | "promocion" | "sistema" | "mensaje"

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  time: string
  read: boolean
  actionUrl?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "pedido",
    title: "Pedido confirmado",
    message: "Tu pedido #ORD-2024-156 ha sido confirmado por Distribuidora ABC",
    time: "Hace 5 minutos",
    read: false,
    actionUrl: "/tendero/pedidos/ORD-2024-156"
  },
  {
    id: "2",
    type: "entrega",
    title: "Pedido en camino",
    message: "Tu pedido #ORD-2024-155 está en camino. Llegará en aproximadamente 2 horas",
    time: "Hace 1 hora",
    read: false,
    actionUrl: "/tendero/pedidos/ORD-2024-155"
  },
  {
    id: "3",
    type: "promocion",
    title: "Nueva promoción disponible",
    message: "20% de descuento en bebidas de Mayorista XYZ. Válido hasta el 31 de diciembre",
    time: "Hace 3 horas",
    read: false,
    actionUrl: "/tendero/catalogo?promo=bebidas20"
  },
  {
    id: "4",
    type: "sistema",
    title: "Actualización de precios",
    message: "Algunos productos han actualizado sus precios. Revisa tu carrito",
    time: "Hace 5 horas",
    read: true,
    actionUrl: "/tendero/carrito"
  },
  {
    id: "5",
    type: "entrega",
    title: "Pedido entregado",
    message: "Tu pedido #ORD-2024-150 ha sido entregado exitosamente",
    time: "Ayer",
    read: true,
    actionUrl: "/tendero/pedidos/ORD-2024-150"
  },
  {
    id: "6",
    type: "mensaje",
    title: "Mensaje de Proveedor 123",
    message: "Hola, queríamos informarte que el producto que pediste ya está disponible",
    time: "Ayer",
    read: true,
  },
  {
    id: "7",
    type: "promocion",
    title: "Ofertas de fin de semana",
    message: "No te pierdas las ofertas especiales de fin de semana en productos seleccionados",
    time: "Hace 2 días",
    read: true,
  },
  {
    id: "8",
    type: "sistema",
    title: "Bienvenido a TenderMarket",
    message: "Tu cuenta ha sido verificada exitosamente. Ya puedes empezar a comprar",
    time: "Hace 1 semana",
    read: true,
  },
]

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "pedido":
      return { icon: ShoppingCart, color: "bg-blue-100 text-blue-600" }
    case "entrega":
      return { icon: Truck, color: "bg-emerald-100 text-emerald-600" }
    case "promocion":
      return { icon: Tag, color: "bg-amber-100 text-amber-600" }
    case "sistema":
      return { icon: AlertCircle, color: "bg-purple-100 text-purple-600" }
    case "mensaje":
      return { icon: MessageSquare, color: "bg-pink-100 text-pink-600" }
    default:
      return { icon: Bell, color: "bg-gray-100 text-gray-600" }
  }
}

export default function TenderoNotificacionesPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState<"all" | "unread">("all")
  const [typeFilter, setTypeFilter] = useState<NotificationType | "all">("all")

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread" && n.read) return false
    if (typeFilter !== "all" && n.type !== typeFilter) return false
    return true
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notificaciones</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 
              ? `Tienes ${unreadCount} notificaciones sin leer`
              : "Todas las notificaciones están leídas"
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Marcar todas como leídas
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
            Configurar
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              filter === "unread"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Sin leer
            {unreadCount > 0 && (
              <span className={`w-5 h-5 flex items-center justify-center text-xs rounded-full ${
                filter === "unread" ? "bg-white/20" : "bg-primary text-primary-foreground"
              }`}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {(["all", "pedido", "entrega", "promocion", "sistema", "mensaje"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                typeFilter === type
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {type === "all" ? "Todos" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">No hay notificaciones</h3>
            <p className="text-muted-foreground mt-1">
              {filter === "unread" 
                ? "No tienes notificaciones sin leer"
                : "No hay notificaciones que mostrar"
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const { icon: Icon, color } = getNotificationIcon(notification.type)
            return (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 bg-card border rounded-xl transition-all hover:shadow-md ${
                  notification.read ? "border-border" : "border-primary/30 bg-primary/5"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`font-medium ${notification.read ? "text-foreground" : "text-foreground"}`}>
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 w-2 h-2 bg-primary rounded-full inline-block"></span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{notification.time}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    {notification.actionUrl && (
                      <a
                        href={notification.actionUrl}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Ver detalles
                      </a>
                    )}
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Marcar como leída
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
