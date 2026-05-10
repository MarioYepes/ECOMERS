"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowRight, 
  Truck, 
  CreditCard, 
  ShieldCheck,
  Tag,
  X,
  AlertCircle
} from "lucide-react"

// Sample cart data
const initialCartItems = [
  {
    id: 1,
    name: "Aceite Vegetal Premium 1L",
    brand: "Oleica",
    price: 8500,
    originalPrice: 9500,
    quantity: 12,
    unit: "unidad",
    minOrder: 6,
    stock: 150,
    image: "/products/oil.jpg",
  },
  {
    id: 2,
    name: "Arroz Premium Grano Largo 5kg",
    brand: "Arrocera Nacional",
    price: 22000,
    originalPrice: null,
    quantity: 8,
    unit: "bulto",
    minOrder: 4,
    stock: 85,
    image: "/products/rice.jpg",
  },
  {
    id: 3,
    name: "Detergente Líquido 3L",
    brand: "LimpiMax",
    price: 15000,
    originalPrice: 18000,
    quantity: 6,
    unit: "galón",
    minOrder: 3,
    stock: 200,
    image: "/products/detergent.jpg",
  },
]

export default function CarritoPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState(0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(item.minOrder, item.quantity + delta)
        return { ...item, quantity: Math.min(newQty, item.stock) }
      }
      return item
    }))
  }

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "TENDER20") {
      setAppliedCoupon("TENDER20")
      setCouponDiscount(20)
      setCouponCode("")
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponDiscount(0)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const savings = cartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price) * item.quantity
    }
    return sum
  }, 0)
  const couponSavings = (subtotal * couponDiscount) / 100
  const shipping = subtotal > 200000 ? 0 : 15000
  const total = subtotal - couponSavings + shipping

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <ShoppingCart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-foreground">Tu carrito está vacío</h2>
          <p className="mt-2 text-muted-foreground">
            Explora nuestro catálogo y agrega productos a tu carrito
          </p>
          <Link
            href="/tendero/catalogo"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Explorar catálogo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Carrito de Compras</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {cartItems.length} {cartItems.length === 1 ? "producto" : "productos"} en tu carrito
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card">
            {cartItems.map((item, index) => (
              <div
                key={item.id}
                className={`flex gap-4 p-4 ${index !== cartItems.length - 1 ? "border-b border-border" : ""}`}
              >
                {/* Image */}
                <div className="h-24 w-24 flex-shrink-0 rounded-lg bg-muted">
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <ShoppingCart className="h-8 w-8 opacity-20" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{item.brand}</p>
                      <Link 
                        href={`/tendero/catalogo/${item.id}`}
                        className="font-medium text-card-foreground hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity <= item.minOrder}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center text-sm font-medium text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        disabled={item.quantity >= item.stock}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      {item.originalPrice && (
                        <p className="text-xs text-muted-foreground line-through">
                          {formatPrice(item.originalPrice * item.quantity)}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.price)} / {item.unit}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping */}
          <Link
            href="/tendero/catalogo"
            className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Continuar comprando
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-4">
            {/* Coupon */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-medium text-card-foreground">Cupón de descuento</h3>
              {appliedCoupon ? (
                <div className="mt-3 flex items-center justify-between rounded-lg bg-success/10 p-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-success">{appliedCoupon}</span>
                    <span className="text-xs text-muted-foreground">(-{couponDiscount}%)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Código de cupón"
                    className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={!couponCode}
                    className="rounded-lg bg-muted px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Aplicar
                  </button>
                </div>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                Prueba: TENDER20 para 20% de descuento
              </p>
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-medium text-card-foreground">Resumen del pedido</h3>
              
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                
                {savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-success">Ahorro en productos</span>
                    <span className="text-success">-{formatPrice(savings)}</span>
                  </div>
                )}

                {couponSavings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-success">Descuento cupón</span>
                    <span className="text-success">-{formatPrice(couponSavings)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  {shipping === 0 ? (
                    <span className="text-success">Gratis</span>
                  ) : (
                    <span className="text-foreground">{formatPrice(shipping)}</span>
                  )}
                </div>

                {shipping > 0 && (
                  <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-3 text-xs">
                    <Truck className="h-4 w-4 flex-shrink-0 text-primary" />
                    <span className="text-muted-foreground">
                      Agrega {formatPrice(200000 - subtotal)} más para envío gratis
                    </span>
                  </div>
                )}

                <hr className="border-border" />

                <div className="flex justify-between">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/tendero/checkout"
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Proceder al pago
                <ArrowRight className="h-4 w-4" />
              </Link>

              {/* Trust Badges */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 rounded-lg bg-muted p-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-success" />
                  Pago seguro
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted p-2 text-xs text-muted-foreground">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Múltiples métodos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
