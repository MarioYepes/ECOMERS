"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Package,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowLeft
} from "lucide-react"

type ProductStatus = "activo" | "pendiente" | "rechazado"

interface Product {
  id: string
  name: string
  supplier: string
  category: string
  price: number
  stock: number
  status: ProductStatus
  createdAt: string
}

const mockProducts: Product[] = [
  { id: "1", name: "Coca-Cola 2L x6", supplier: "Distribuidora ABC", category: "Bebidas", price: 12.99, stock: 150, status: "activo", createdAt: "15 Nov 2024" },
  { id: "2", name: "Arroz Premium 5kg", supplier: "Mayorista XYZ", category: "Alimentos", price: 8.50, stock: 80, status: "activo", createdAt: "10 Nov 2024" },
  { id: "3", name: "Aceite Vegetal 1L x12", supplier: "Proveedor 123", category: "Alimentos", price: 24.00, stock: 45, status: "pendiente", createdAt: "12 Dic 2024" },
  { id: "4", name: "Jabón Líquido 500ml", supplier: "Distribuidora ABC", category: "Limpieza", price: 3.50, stock: 200, status: "activo", createdAt: "5 Oct 2024" },
  { id: "5", name: "Leche Entera 1L x12", supplier: "Mayorista XYZ", category: "Lácteos", price: 15.00, stock: 0, status: "rechazado", createdAt: "1 Sep 2024" },
]

const statusConfig = {
  activo: { label: "Activo", color: "bg-emerald-100 text-emerald-700" },
  pendiente: { label: "Pendiente", color: "bg-amber-100 text-amber-700" },
  rechazado: { label: "Rechazado", color: "bg-red-100 text-red-700" },
}

export default function AdminProductosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all")
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: mockProducts.length,
    activos: mockProducts.filter(p => p.status === "activo").length,
    pendientes: mockProducts.filter(p => p.status === "pendiente").length,
    rechazados: mockProducts.filter(p => p.status === "rechazado").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gestión de Productos</h1>
        <p className="text-muted-foreground mt-1">
          Administra y modera los productos de los proveedores
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Total Productos</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Activos</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.activos}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Pendientes</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pendientes}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Rechazados</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.rechazados}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProductStatus | "all")}
            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="pendiente">Pendientes</option>
            <option value="rechazado">Rechazados</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Producto</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Proveedor</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Categoría</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Precio</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Stock</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => {
                const status = statusConfig[product.status]
                return (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <span className="font-medium text-foreground">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{product.supplier}</td>
                    <td className="py-3 px-4 text-muted-foreground">{product.category}</td>
                    <td className="py-3 px-4 text-right font-medium text-foreground">${product.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={product.stock > 0 ? "text-foreground" : "text-red-600"}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Ver">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        {product.status === "pendiente" && (
                          <>
                            <button className="p-2 hover:bg-emerald-100 rounded-lg transition-colors" title="Aprobar">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            </button>
                            <button className="p-2 hover:bg-red-100 rounded-lg transition-colors" title="Rechazar">
                              <XCircle className="w-4 h-4 text-red-600" />
                            </button>
                          </>
                        )}
                        <button className="p-2 hover:bg-red-100 rounded-lg transition-colors" title="Eliminar">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">No se encontraron productos</h3>
            <p className="text-muted-foreground mt-1">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  )
}
