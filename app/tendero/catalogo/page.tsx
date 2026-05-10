"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  ShoppingCart, 
  Heart, 
  Star, 
  ChevronDown, 
  Plus,
  Minus,
  X,
  SlidersHorizontal,
  Check
} from "lucide-react"

// Sample product data
const products = [
  {
    id: 1,
    name: "Aceite Vegetal Premium 1L",
    brand: "Oleica",
    category: "Alimentos",
    price: 8500,
    originalPrice: 9500,
    unit: "unidad",
    minOrder: 6,
    stock: 150,
    rating: 4.5,
    reviews: 128,
    image: "/products/oil.jpg",
    discount: 10,
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 2,
    name: "Arroz Premium Grano Largo 5kg",
    brand: "Arrocera Nacional",
    category: "Alimentos",
    price: 22000,
    originalPrice: null,
    unit: "bulto",
    minOrder: 4,
    stock: 85,
    rating: 4.8,
    reviews: 256,
    image: "/products/rice.jpg",
    discount: null,
    isNew: true,
    isBestSeller: false,
  },
  {
    id: 3,
    name: "Detergente Líquido 3L",
    brand: "LimpiMax",
    category: "Limpieza",
    price: 15000,
    originalPrice: 18000,
    unit: "galón",
    minOrder: 3,
    stock: 200,
    rating: 4.3,
    reviews: 89,
    image: "/products/detergent.jpg",
    discount: 17,
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 4,
    name: "Azúcar Refinada 2.5kg",
    brand: "Dulce Colombia",
    category: "Alimentos",
    price: 9800,
    originalPrice: null,
    unit: "paquete",
    minOrder: 8,
    stock: 320,
    rating: 4.6,
    reviews: 175,
    image: "/products/sugar.jpg",
    discount: null,
    isNew: false,
    isBestSeller: false,
  },
  {
    id: 5,
    name: "Jabón de Tocador Pack x12",
    brand: "Suave Care",
    category: "Cuidado Personal",
    price: 24000,
    originalPrice: 28000,
    unit: "pack",
    minOrder: 2,
    stock: 75,
    rating: 4.4,
    reviews: 62,
    image: "/products/soap.jpg",
    discount: 14,
    isNew: true,
    isBestSeller: false,
  },
  {
    id: 6,
    name: "Leche Entera UHT 1L x6",
    brand: "Lácteos del Valle",
    category: "Lácteos",
    price: 18500,
    originalPrice: null,
    unit: "six-pack",
    minOrder: 4,
    stock: 180,
    rating: 4.7,
    reviews: 203,
    image: "/products/milk.jpg",
    discount: null,
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 7,
    name: "Papel Higiénico x24 Rollos",
    brand: "SuaveMax",
    category: "Limpieza",
    price: 32000,
    originalPrice: 36000,
    unit: "paquete",
    minOrder: 2,
    stock: 95,
    rating: 4.5,
    reviews: 147,
    image: "/products/paper.jpg",
    discount: 11,
    isNew: false,
    isBestSeller: false,
  },
  {
    id: 8,
    name: "Café Molido Premium 500g",
    brand: "Montaña Dorada",
    category: "Bebidas",
    price: 28000,
    originalPrice: null,
    unit: "bolsa",
    minOrder: 6,
    stock: 120,
    rating: 4.9,
    reviews: 312,
    image: "/products/coffee.jpg",
    discount: null,
    isNew: false,
    isBestSeller: true,
  },
]

const categories = [
  { id: "all", name: "Todos", count: 150 },
  { id: "alimentos", name: "Alimentos", count: 45 },
  { id: "bebidas", name: "Bebidas", count: 28 },
  { id: "lacteos", name: "Lácteos", count: 18 },
  { id: "limpieza", name: "Limpieza", count: 32 },
  { id: "cuidado-personal", name: "Cuidado Personal", count: 27 },
]

const sortOptions = [
  { value: "popular", label: "Más populares" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "newest", label: "Más recientes" },
  { value: "rating", label: "Mejor calificados" },
]

export default function CatalogoPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [showFilters, setShowFilters] = useState(false)
  const [cart, setCart] = useState<{ [key: number]: number }>({})
  const [favorites, setFavorites] = useState<number[]>([])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const addToCart = (productId: number, minOrder: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + minOrder
    }))
  }

  const updateCartQuantity = (productId: number, delta: number) => {
    setCart(prev => {
      const newQty = (prev[productId] || 0) + delta
      if (newQty <= 0) {
        const { [productId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [productId]: newQty }
    })
  }

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Catálogo de Productos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Encuentra los mejores productos mayoristas para tu negocio
        </p>
      </div>

      {/* Filters Bar */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Categories - Desktop */}
        <div className="hidden flex-wrap gap-2 lg:flex">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {category.name}
              <span className="ml-1.5 text-xs opacity-70">({category.count})</span>
            </button>
          ))}
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros y categorías
        </button>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 appearance-none rounded-lg border border-border bg-card pl-3 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          {/* View Mode */}
          <div className="hidden items-center rounded-lg border border-border bg-card p-1 sm:flex">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-md p-2 ${
                viewMode === "grid" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-md p-2 ${
                viewMode === "list" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className={`grid gap-4 ${
        viewMode === "grid" 
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "grid-cols-1"
      }`}>
        {products.map((product) => (
          <div
            key={product.id}
            className={`group relative rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-md ${
              viewMode === "list" ? "flex gap-4 p-4" : "flex flex-col"
            }`}
          >
            {/* Badges */}
            <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
              {product.discount && (
                <span className="rounded-md bg-destructive px-2 py-0.5 text-xs font-medium text-destructive-foreground">
                  -{product.discount}%
                </span>
              )}
              {product.isNew && (
                <span className="rounded-md bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                  Nuevo
                </span>
              )}
              {product.isBestSeller && (
                <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                  Top ventas
                </span>
              )}
            </div>

            {/* Favorite Button */}
            <button
              onClick={() => toggleFavorite(product.id)}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 text-muted-foreground backdrop-blur transition-colors hover:bg-card hover:text-destructive"
            >
              <Heart className={`h-4 w-4 ${favorites.includes(product.id) ? "fill-destructive text-destructive" : ""}`} />
            </button>

            {/* Image */}
            <div className={`relative overflow-hidden bg-muted ${
              viewMode === "list" ? "h-32 w-32 flex-shrink-0 rounded-lg" : "aspect-square rounded-t-xl"
            }`}>
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <ShoppingCart className="h-12 w-12 opacity-20" />
              </div>
            </div>

            {/* Content */}
            <div className={`flex flex-1 flex-col ${viewMode === "list" ? "" : "p-4"}`}>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{product.brand}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{product.category}</span>
              </div>
              
              <Link 
                href={`/tendero/catalogo/${product.id}`}
                className="text-sm font-medium text-card-foreground transition-colors hover:text-primary"
              >
                {product.name}
              </Link>

              {/* Rating */}
              <div className="mt-2 flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                <span className="text-xs font-medium text-foreground">{product.rating}</span>
                <span className="text-xs text-muted-foreground">({product.reviews})</span>
              </div>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">por {product.unit}</span>

              {/* Min Order & Stock */}
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Mín: {product.minOrder} {product.unit}s</span>
                <span className={product.stock < 50 ? "text-warning" : "text-success"}>
                  Stock: {product.stock}
                </span>
              </div>

              {/* Add to Cart */}
              <div className="mt-4">
                {cart[product.id] ? (
                  <div className="flex items-center gap-2">
                    <div className="flex flex-1 items-center justify-between rounded-lg border border-border bg-muted p-1">
                      <button
                        onClick={() => updateCartQuantity(product.id, -1)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium text-foreground">{cart[product.id]}</span>
                      <button
                        onClick={() => updateCartQuantity(product.id, 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success text-success-foreground">
                      <Check className="h-5 w-5" />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(product.id, product.minOrder)}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Agregar al carrito
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/50 lg:hidden" 
            onClick={() => setShowFilters(false)} 
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-card p-6 lg:hidden">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-card-foreground">Filtros</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-medium text-foreground">Categorías</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFilters(false)}
              className="mt-6 w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground"
            >
              Aplicar filtros
            </button>
          </div>
        </>
      )}
    </div>
  )
}
