"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft,
  Package,
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  MessageSquare,
  Printer,
  ChevronDown
} from "lucide-react"

// Mock order detail for supplier view
const orderData = {
  id: "ORD-2024-156",
  status: "confirmado",
  date: "15 Dic 2024, 10:30 AM",
  customer: {
    name: "Tienda Don Juan",
    contact: "Juan Carlos Pérez",
    phone: "+57 300 123 4567",
    address: "Calle 45 #23-67, Barrio Centro, Bogotá",
    nit: "900.123.456-7"
  },
  items: [
    { name: "Coca-Cola 2L x6", sku: "SKU-001", quantity: 10, price: 12.99, total: 129.90, stock: 150 },
    { name: "Arroz Premium 5kg", sku: "SKU-002", quantity: 5, price: 8.50, total: 42.50, stock: 80 },
    { name: "Aceite Vegetal 1L x12", sku: "SKU-003", quantity: 2, price: 24.00, total: 48.00, stock: 45 },
    { name: "Azúcar Refinada 2kg", sku: "SKU-004", quantity: 8, price: 4.25, total: 34.00, stock: 200 },
  ],
  subtotal: 254.40,
  shipping: 15.00,
  tax: 25.44,
  total: 294.84,
  notes: "Por favor entregar antes del mediodía si es posible.",
  paymentMethod: "Transferencia bancaria"
}

const statusOptions = [
  { value: "pendiente", label: "Pendiente", color: "bg-amber-100 text-amber-700" },
  { value: "confirmado", label: "Confirmado", color: "bg-blue-100 text-blue-700" },
  { value: "en_preparacion", label: "En Preparación", color: "bg-purple-100 text-purple-700" },
  { value: "en_camino", label: "En Camino", color: "bg-cyan-100 text-cyan-700" },
  { value: "entregado", label: "Entregado", color: "bg-emerald-100 text-emerald-700" },
  { value: "cancelado", label: "Cancelado", color: "bg-red-100 text-red-700" },
]

export default function ProveedorOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [status, setStatus] = useState(orderData.status)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  
  const currentStatus = statusOptions.find(s => s.value === status) || statusOptions[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/proveedor/pedidos"
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pedido #{orderData.id}</h1>
            <p className="text-muted-foreground mt-1">Recibido el {orderData.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${currentStatus.color}`}
            >
              {currentStatus.label}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showStatusDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setStatus(option.value)
                      setShowStatusDropdown(false)
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      status === option.value ? "bg-muted font-medium" : ""
                    }`}
                  >
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${option.color.replace("text-", "bg-").split(" ")[0]}`}></span>
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Información del Cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tienda</p>
                <p className="font-medium text-foreground">{orderData.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contacto</p>
                <p className="font-medium text-foreground">{orderData.customer.contact}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-medium text-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {orderData.customer.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">NIT</p>
                <p className="font-medium text-foreground">{orderData.customer.nit}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Dirección de Entrega</p>
                <p className="font-medium text-foreground flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  {orderData.customer.address}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <button className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                <MessageSquare className="w-4 h-4" />
                Enviar mensaje al cliente
              </button>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Productos del Pedido</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Producto</th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">SKU</th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Cant.</th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Stock</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Precio</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.items.map((item, index) => (
                    <tr key={index} className="border-b border-border last:border-0">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <span className="font-medium text-foreground">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center text-sm text-muted-foreground">{item.sku}</td>
                      <td className="py-3 px-2 text-center font-medium text-foreground">{item.quantity}</td>
                      <td className="py-3 px-2 text-center">
                        <span className={`text-sm ${item.stock > item.quantity ? "text-emerald-600" : "text-amber-600"}`}>
                          {item.stock}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right text-foreground">${item.price.toFixed(2)}</td>
                      <td className="py-3 px-2 text-right font-semibold text-foreground">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          {orderData.notes && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">Notas del Cliente</h2>
              <p className="text-muted-foreground">{orderData.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Resumen del Pedido</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${orderData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span className="text-foreground">${orderData.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IVA (10%)</span>
                <span className="text-foreground">${orderData.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
                <span className="text-foreground">Total</span>
                <span className="text-primary">${orderData.total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">Método de pago</p>
              <p className="font-medium text-foreground">{orderData.paymentMethod}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Acciones Rápidas</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                <CheckCircle2 className="w-4 h-4" />
                Confirmar Pedido
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors">
                <Truck className="w-4 h-4" />
                Marcar como Enviado
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
                <Clock className="w-4 h-4" />
                Programar Entrega
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                <XCircle className="w-4 h-4" />
                Rechazar Pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
