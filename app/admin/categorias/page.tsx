"use client"

import { useState } from "react"
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  FolderTree,
  ChevronRight,
  ChevronDown,
  Package
} from "lucide-react"

// Sample categories data
const categories = [
  {
    id: 1,
    name: "Alimentos",
    slug: "alimentos",
    products: 245,
    subcategories: [
      { id: 11, name: "Granos y Cereales", products: 45 },
      { id: 12, name: "Aceites y Grasas", products: 32 },
      { id: 13, name: "Azúcar y Endulzantes", products: 18 },
      { id: 14, name: "Enlatados", products: 56 },
    ],
    status: "active",
  },
  {
    id: 2,
    name: "Bebidas",
    slug: "bebidas",
    products: 128,
    subcategories: [
      { id: 21, name: "Gaseosas", products: 28 },
      { id: 22, name: "Jugos", products: 35 },
      { id: 23, name: "Agua", products: 15 },
      { id: 24, name: "Café y Té", products: 50 },
    ],
    status: "active",
  },
  {
    id: 3,
    name: "Lácteos",
    slug: "lacteos",
    products: 89,
    subcategories: [
      { id: 31, name: "Leches", products: 25 },
      { id: 32, name: "Quesos", products: 34 },
      { id: 33, name: "Yogurt", products: 30 },
    ],
    status: "active",
  },
  {
    id: 4,
    name: "Limpieza",
    slug: "limpieza",
    products: 156,
    subcategories: [
      { id: 41, name: "Detergentes", products: 42 },
      { id: 42, name: "Desinfectantes", products: 38 },
      { id: 43, name: "Papel y Desechables", products: 56 },
    ],
    status: "active",
  },
  {
    id: 5,
    name: "Cuidado Personal",
    slug: "cuidado-personal",
    products: 112,
    subcategories: [
      { id: 51, name: "Jabones", products: 28 },
      { id: 52, name: "Shampoo", products: 32 },
      { id: 53, name: "Cremas", products: 25 },
      { id: 54, name: "Higiene Oral", products: 27 },
    ],
    status: "active",
  },
]

export default function CategoriasPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<number[]>([])
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const toggleCategory = (id: number) => {
    setExpandedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-4 lg:p-6">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categorías</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Organiza los productos por categorías y subcategorías
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Nueva Categoría
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar categorías..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Categories List */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border bg-muted/50 p-4">
          <div className="grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <div className="col-span-5">Categoría</div>
            <div className="col-span-2">Productos</div>
            <div className="col-span-3">Subcategorías</div>
            <div className="col-span-2">Acciones</div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {filteredCategories.map((category) => (
            <div key={category.id}>
              {/* Main Category */}
              <div className="grid grid-cols-12 items-center gap-4 p-4 transition-colors hover:bg-muted/30">
                <div className="col-span-5 flex items-center gap-3">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
                  >
                    {expandedCategories.includes(category.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FolderTree className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">{category.name}</p>
                    <p className="text-xs text-muted-foreground">/{category.slug}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="rounded-lg bg-muted px-2.5 py-1 text-sm font-medium text-muted-foreground">
                    {category.products}
                  </span>
                </div>
                <div className="col-span-3">
                  <span className="text-sm text-muted-foreground">
                    {category.subcategories.length} subcategorías
                  </span>
                </div>
                <div className="col-span-2 flex gap-2">
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Subcategories */}
              {expandedCategories.includes(category.id) && (
                <div className="bg-muted/20">
                  {category.subcategories.map((sub) => (
                    <div 
                      key={sub.id} 
                      className="grid grid-cols-12 items-center gap-4 border-t border-border/50 py-3 pl-20 pr-4"
                    >
                      <div className="col-span-5 flex items-center gap-3">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-card-foreground">{sub.name}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-sm text-muted-foreground">{sub.products}</span>
                      </div>
                      <div className="col-span-3"></div>
                      <div className="col-span-2 flex gap-2">
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-border/50 py-3 pl-20 pr-4">
                    <button className="flex items-center gap-2 text-sm text-primary hover:text-primary/80">
                      <Plus className="h-4 w-4" />
                      Agregar subcategoría
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/50" 
            onClick={() => setShowAddModal(false)} 
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-card-foreground">Nueva Categoría</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Agrega una nueva categoría para organizar productos
            </p>
            
            <form className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Nombre de la categoría
                </label>
                <input
                  type="text"
                  placeholder="Ej: Snacks y Confitería"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  placeholder="snacks-confiteria"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Categoría padre (opcional)
                </label>
                <select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="">Ninguna (categoría principal)</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Crear categoría
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
