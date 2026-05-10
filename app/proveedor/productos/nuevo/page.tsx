"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Package,
  Upload,
  Image as ImageIcon
} from "lucide-react"

const categories = [
  "Bebidas",
  "Alimentos",
  "Lácteos",
  "Snacks",
  "Limpieza",
  "Cuidado Personal"
]

export default function NewProductPage() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    sku: "",
    category: "",
    price: "",
    minOrder: "1",
    stock: "",
    unit: "unidad"
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Product data:", product)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/proveedor/productos"
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nuevo Producto</h1>
          <p className="text-muted-foreground mt-1">Agrega un nuevo producto a tu catálogo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Información Básica</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  placeholder="Ej: Coca-Cola 2L x6"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Descripción
                </label>
                <textarea
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  placeholder="Describe tu producto..."
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    SKU / Código *
                  </label>
                  <input
                    type="text"
                    value={product.sku}
                    onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                    placeholder="Ej: SKU-001"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Categoría *
                  </label>
                  <select
                    value={product.category}
                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Precio e Inventario</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Precio Mayorista *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Pedido Mínimo
                </label>
                <input
                  type="number"
                  min="1"
                  value={product.minOrder}
                  onChange={(e) => setProduct({ ...product, minOrder: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Stock Disponible *
                </label>
                <input
                  type="number"
                  min="0"
                  value={product.stock}
                  onChange={(e) => setProduct({ ...product, stock: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Unidad de Medida
                </label>
                <select
                  value={product.unit}
                  onChange={(e) => setProduct({ ...product, unit: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option value="unidad">Unidad</option>
                  <option value="paquete">Paquete</option>
                  <option value="caja">Caja</option>
                  <option value="kg">Kilogramo</option>
                  <option value="litro">Litro</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Image */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Imagen del Producto</h2>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-foreground font-medium">Arrastra una imagen aquí</p>
              <p className="text-xs text-muted-foreground mt-1">o haz clic para seleccionar</p>
              <p className="text-xs text-muted-foreground mt-2">PNG, JPG hasta 5MB</p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Publicación</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estado</span>
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">Borrador</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Visibilidad</span>
                <span className="text-sm text-foreground">Público</span>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Save className="w-4 h-4" />
                Guardar Producto
              </button>
              <Link
                href="/proveedor/productos"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
