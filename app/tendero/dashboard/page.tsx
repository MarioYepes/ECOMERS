"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ShoppingBag, 
  TrendingUp, 
  Package, 
  Clock, 
  ArrowRight,
  Star,
  Percent,
  ChevronRight
} from "lucide-react"

// Mock data
const stats = [
  { label: "Pedidos este mes", value: "12", change: "+3", icon: ShoppingBag, color: "bg-emerald-500" },
  { label: "Total gastado", value: "$2,450", change: "+15%", icon: TrendingUp, color: "bg-blue-500" },
  { label: "Productos favoritos", value: "28", change: "+5", icon: Star, color: "bg-amber-500" },
  { label: "Pedidos pendientes", value: "2", change: "", icon: Clock, color: "bg-orange-500" },
]

const recentOrders = [
  { id: "ORD-2024-001", supplier: "Distribuidora ABC", total: "$345.00", status: "Entregado", date: "Hoy" },
  { id: "ORD-2024-002", supplier: "Mayorista XYZ", total: "$128.50", status: "En camino", date: "Ayer" },
  { id: "ORD-2024-003", supplier: "Proveedor 123", total: "$567.00", status: "Procesando", date: "Hace 2 días" },
]

const promotions = [
  { title: "20% OFF en Bebidas", supplier: "Distribuidora ABC", validUntil: "31 Dic", image: "🥤" },
  { title: "Compra 3 paga 2", supplier: "Mayorista XYZ", validUntil: "15 Ene", image: "📦" },
  { title: "Envío gratis +$500", supplier: "Proveedor 123", validUntil: "20 Ene", image: "🚚" },
]

const popularProducts = [
  { name: "Coca-Cola 2L x6", price: "$12.99", supplier: "Distribuidora ABC", stock: "En stock" },
  { name: "Arroz Premium 5kg", price: "$8.50", supplier: "Mayorista XYZ", stock: "En stock" },
  { name: "Aceite Vegetal 1L x12", price: "$24.00", supplier: "Proveedor 123", stock: "Pocas unidades" },
  { name: "Azúcar Refinada 2kg", price: "$4.25", supplier: "Distribuidora ABC", stock: "En stock" },
]

export default function TenderoDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bienvenido, Juan</h1>
        <p className="text-muted-foreground mt-1">
          Aquí tienes un resumen de tu actividad en TenderMarket
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                {stat.change && (
                  <p className="text-sm text-emerald-600 mt-1">{stat.change}</p>
                )}
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-foreground">Pedidos Recientes</h2>
            <Link 
              href="/tendero/pedidos" 
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.supplier}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{order.total}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === "Entregado" 
                      ? "bg-emerald-100 text-emerald-700" 
                      : order.status === "En camino"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Promotions */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-foreground">Promociones</h2>
            <Percent className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-3">
            {promotions.map((promo, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{promo.image}</span>
                  <div>
                    <p className="font-medium text-foreground">{promo.title}</p>
                    <p className="text-sm text-muted-foreground">{promo.supplier}</p>
                    <p className="text-xs text-primary mt-1">Válido hasta {promo.validUntil}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Products */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-foreground">Productos Populares</h2>
          <Link 
            href="/tendero/catalogo" 
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            Ver catálogo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularProducts.map((product, index) => (
            <div
              key={index}
              className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer group"
            >
              <div className="w-full h-24 bg-background rounded-lg mb-3 flex items-center justify-center text-4xl">
                📦
              </div>
              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground">{product.supplier}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="font-bold text-primary">{product.price}</p>
                <span className={`text-xs ${
                  product.stock === "En stock" ? "text-emerald-600" : "text-amber-600"
                }`}>
                  {product.stock}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/tendero/catalogo"
          className="flex items-center gap-4 p-5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
        >
          <ShoppingBag className="w-8 h-8" />
          <div>
            <p className="font-semibold">Explorar Catálogo</p>
            <p className="text-sm opacity-90">Encuentra los mejores productos</p>
          </div>
        </Link>
        <Link
          href="/tendero/pedidos"
          className="flex items-center gap-4 p-5 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
        >
          <Package className="w-8 h-8 text-primary" />
          <div>
            <p className="font-semibold text-foreground">Mis Pedidos</p>
            <p className="text-sm text-muted-foreground">Revisa el estado de tus pedidos</p>
          </div>
        </Link>
        <Link
          href="/tendero/carrito"
          className="flex items-center gap-4 p-5 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
        >
          <ShoppingBag className="w-8 h-8 text-primary" />
          <div>
            <p className="font-semibold text-foreground">Mi Carrito</p>
            <p className="text-sm text-muted-foreground">3 productos pendientes</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
