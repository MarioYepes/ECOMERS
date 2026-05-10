"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Eye,
  Package,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ArrowLeft,
  Phone,
  MapPin,
  FileText,
  Download
} from "lucide-react"

// Mock order detail
const orderData = {
  id: "ORD-2024-156",
  status: "en_camino",
  date: "15 Dic 2024, 10:30 AM",
  estimatedDelivery: "15 Dic 2024, 2:00 PM - 4:00 PM",
  supplier: {
    name: "Distribuidora ABC",
    phone: "+57 300 123 4567",
    address: "Zona Industrial Km 5, Bodega 23"
  },
  deliveryAddress: "Calle 45 #23-67, Barrio Centro, Bogotá",
  items: [
    { name: "Coca-Cola 2L x6", quantity: 10, price: 12.99, total: 129.90 },
    { name: "Arroz Premium 5kg", quantity: 5, price: 8.50, total: 42.50 },
    { name: "Aceite Vegetal 1L x12", quantity: 2, price: 24.00, total: 48.00 },
    { name: "Azúcar Refinada 2kg", quantity: 8, price: 4.25, total: 34.00 },
  ],
  subtotal: 254.40,
  shipping: 15.00,
  tax: 25.44,
  total: 294.84,
  timeline: [
    { status: "Pedido realizado", date: "15 Dic 2024, 10:30 AM", completed: true },
    { status: "Pedido confirmado", date: "15 Dic 2024, 10:45 AM", completed: true },
    { status: "En preparación", date: "15 Dic 2024, 11:00 AM", completed: true },
    { status: "En camino", date: "15 Dic 2024, 12:30 PM", completed: true, current: true },
    { status: "Entregado", date: "Pendiente", completed: false },
  ]
}

const statusConfig = {
  pendiente: { label: "Pendiente", color: "bg-amber-100 text-amber-700", icon: Clock },
  confirmado: { label: "Confirmado", color: "bg-blue-100 text-blue-700", icon: CheckCircle2 },
  en_preparacion: { label: "En Preparación", color: "bg-purple-100 text-purple-700", icon: Package },
  en_camino: { label: "En Camino", color: "bg-cyan-100 text-cyan-700", icon: Truck },
  entregado: { label: "Entregado", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-700", icon: XCircle },
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const status = statusConfig[orderData.status as keyof typeof statusConfig]
  const StatusIcon = status.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/tendero/pedidos"
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pedido #{orderData.id}</h1>
            <p className="text-muted-foreground mt-1">Realizado el {orderData.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${status.color}`}>
            <StatusIcon className="w-4 h-4" />
            {status.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Timeline */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Estado del Pedido</h2>
            <div className="relative">
              {orderData.timeline.map((step, index) => (
                <div key={index} className="flex items-start gap-4 pb-6 last:pb-0">
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? step.current 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-emerald-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {step.completed && !step.current ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </div>
                    {index < orderData.timeline.length - 1 && (
                      <div className={`absolute left-1/2 top-8 w-0.5 h-full -translate-x-1/2 ${
                        step.completed ? "bg-emerald-500" : "bg-muted"
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className={`font-medium ${step.current ? "text-primary" : "text-foreground"}`}>
                      {step.status}
                    </p>
                    <p className="text-sm text-muted-foreground">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-foreground">
                <span className="font-medium">Entrega estimada:</span> {orderData.estimatedDelivery}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Productos del Pedido</h2>
            <div className="divide-y divide-border">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-foreground">${item.total.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border space-y-2">
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
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span className="text-foreground">Total</span>
                <span className="text-primary">${orderData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Supplier Info */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Información del Proveedor</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-foreground">{orderData.supplier.name}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4" />
                  {orderData.supplier.phone}
                </p>
                <p className="text-sm text-muted-foreground flex items-start gap-2 mt-1">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {orderData.supplier.address}
                </p>
              </div>
              <button className="w-full py-2 px-4 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
                Contactar Proveedor
              </button>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Dirección de Entrega</h2>
            <p className="text-muted-foreground flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
              {orderData.deliveryAddress}
            </p>
          </div>

          {/* Actions */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Acciones</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                <FileText className="w-4 h-4" />
                Ver Factura
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
                <Download className="w-4 h-4" />
                Descargar PDF
              </button>
              {orderData.status !== "entregado" && orderData.status !== "cancelado" && (
                <button className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                  <XCircle className="w-4 h-4" />
                  Cancelar Pedido
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
