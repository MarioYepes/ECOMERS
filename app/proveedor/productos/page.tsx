"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Package, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  Upload,
  Download
} from "lucide-react"

// Sample products data
const products = [
  {
    id: 1,
    name: "Aceite Vegetal Premium 1L",
    sku: "ACE-001",
    category: "Alimentos",
    price: 8500,
    cost: 6800,
    stock: 15,
    minStock: 50,
    status: "low-stock",
    sales: 198,
    image: "/products/oil.jpg",
  },
  {
    id: 2,
    name: "Arroz Premium Grano Largo 5kg",
    sku: "ARR-002",
    category: "Alimentos",
    price: 22000,
    cost: 18500,
    stock: 85,
    minStock: 40,
    status: "active",
    sales: 156,
    image: "/products/rice.jpg",
  },
  {
    id: 3,
    name: "Detergente Líquido 3L",
    sku: "DET-003",
    category: "Limpieza",
    price: 15000,
    cost: 11500,
    stock: 8,
    minStock: 30,
    status: "low-stock",
    sales: 89,
    image: "/products/detergent.jpg",
  },
  {
    id: 4,
    name: "Azúcar Refinada 2.5kg",
    sku: "AZU-004",
    category: "Alimentos",
    price: 9800,
    cost: 7600,
    stock: 120,
    minStock: 60,
    status: "active",
    sales: 134,
    image: "/products/sugar.jpg",
  },
  {
    id: 5,
    name: "Jabón de Tocador Pack x12",
    sku: "JAB-005",
    category: "Cuidado Personal",
    price: 24000,
    cost: 19200,
    stock: 0,
    minStock: 25,
    status: "out-of-stock",
    sales: 62,
    image: "/products/soap.jpg",
  },
  {
    id: 6,
    name: "Café Molido Premium 500g",
    sku: "CAF-006",
    category: "Bebidas",
    price: 28000,
    cost: 22000,
    stock: 95,
    minStock: 30,
    status: "active",
    sales: 245,
    image: "/products/coffee.jpg",
  },
]

const categories = ["Todos", "Alimentos", "Bebidas", "Limpieza", "Cuidado Personal", "Lácteos"]

const statusConfig = {
  active: { label: "Activo", color: "bg-success/10 text-success", icon: CheckCircle },
  "low-stock": { label: "Stock Bajo", color: "bg-warning/10 text-warning", icon: AlertTriangle },
  "out-of-stock": { label: "Sin Stock", color: "bg-destructive/10 text-destructive", icon: XCircle },
  inactive: { label: "Inactivo", color: "bg-muted text-muted-foreground", icon: Package },
}

export default function ProductosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || product.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id))
    }
  }

  const toggleSelectProduct = (id: number) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Productos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona tu catálogo de productos e inventario
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            <Upload className="h-4 w-4" />
            Importar
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            <Download className="h-4 w-4" />
            Exportar
          </button>
          <Link
            href="/proveedor/productos/nuevo"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Link>
        </div>
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
            placeholder="Buscar por nombre o SKU..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {/* Category */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 appearance-none rounded-lg border border-border bg-card pl-3 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-10 appearance-none rounded-lg border border-border bg-card pl-3 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="low-stock">Stock Bajo</option>
              <option value="out-of-stock">Sin Stock</option>
              <option value="inactive">Inactivo</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="mb-4 flex items-center gap-4 rounded-lg border border-primary/30 bg-primary/5 p-3">
          <span className="text-sm font-medium text-foreground">
            {selectedProducts.length} producto(s) seleccionado(s)
          </span>
          <button className="text-sm text-primary hover:text-primary/80">
            Editar en masa
          </button>
          <button className="text-sm text-destructive hover:text-destructive/80">
            Eliminar
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Producto
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  SKU
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Categoría
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Precio
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Stock
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Estado
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Ventas
                </th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => {
                const status = statusConfig[product.status as keyof typeof statusConfig]
                const StatusIcon = status.icon
                const margin = ((product.price - product.cost) / product.price * 100).toFixed(1)
                
                return (
                  <tr key={product.id} className="transition-colors hover:bg-muted/30">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleSelectProduct(product.id)}
                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground opacity-50" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground">Margen: {margin}%</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                        {product.sku}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{product.category}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-card-foreground">{formatPrice(product.price)}</p>
                        <p className="text-xs text-muted-foreground">Costo: {formatPrice(product.cost)}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className={`font-medium ${product.stock <= product.minStock ? "text-warning" : "text-card-foreground"}`}>
                          {product.stock} uds
                        </p>
                        <p className="text-xs text-muted-foreground">Mín: {product.minStock}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {status.label}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {product.sales} vendidos
                    </td>
                    <td className="p-4">
                      <div className="relative">
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        
                        {openMenuId === product.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-40" 
                              onClick={() => setOpenMenuId(null)} 
                            />
                            <div className="absolute right-0 top-10 z-50 w-40 rounded-lg border border-border bg-card py-1 shadow-lg">
                              <Link
                                href={`/proveedor/productos/${product.id}`}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              >
                                <Eye className="h-4 w-4" />
                                Ver detalles
                              </Link>
                              <Link
                                href={`/proveedor/productos/${product.id}/editar`}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              >
                                <Edit className="h-4 w-4" />
                                Editar
                              </Link>
                              <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4" />
                                Eliminar
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border p-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredProducts.length} de {products.length} productos
          </p>
          <div className="flex gap-2">
            <button className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50">
              Anterior
            </button>
            <button className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
