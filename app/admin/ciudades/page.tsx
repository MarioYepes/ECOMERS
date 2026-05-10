"use client"

import { useState } from "react"
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle
} from "lucide-react"

// Sample cities data
const cities = [
  { id: 1, name: "Bogotá", department: "Cundinamarca", users: 4521, suppliers: 156, status: "active", coverage: true },
  { id: 2, name: "Medellín", department: "Antioquia", users: 2834, suppliers: 89, status: "active", coverage: true },
  { id: 3, name: "Cali", department: "Valle del Cauca", users: 1567, suppliers: 67, status: "active", coverage: true },
  { id: 4, name: "Barranquilla", department: "Atlántico", users: 892, suppliers: 45, status: "active", coverage: true },
  { id: 5, name: "Cartagena", department: "Bolívar", users: 654, suppliers: 32, status: "active", coverage: true },
  { id: 6, name: "Bucaramanga", department: "Santander", users: 523, suppliers: 28, status: "active", coverage: true },
  { id: 7, name: "Pereira", department: "Risaralda", users: 412, suppliers: 21, status: "active", coverage: true },
  { id: 8, name: "Santa Marta", department: "Magdalena", users: 234, suppliers: 15, status: "active", coverage: false },
  { id: 9, name: "Cúcuta", department: "Norte de Santander", users: 189, suppliers: 12, status: "pending", coverage: false },
  { id: 10, name: "Ibagué", department: "Tolima", users: 156, suppliers: 8, status: "pending", coverage: false },
]

export default function CiudadesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredCities = cities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.department.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || city.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const activeCities = cities.filter(c => c.status === "active").length
  const totalUsers = cities.reduce((sum, c) => sum + c.users, 0)
  const totalSuppliers = cities.reduce((sum, c) => sum + c.suppliers, 0)

  return (
    <div className="p-4 lg:p-6">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ciudades</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona las ciudades donde opera TenderMarket
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Nueva Ciudad
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{activeCities}</p>
              <p className="text-sm text-muted-foreground">Ciudades activas</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Users className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{totalUsers.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Usuarios totales</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{totalSuppliers}</p>
              <p className="text-sm text-muted-foreground">Proveedores activos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por ciudad o departamento..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setStatusFilter("active")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === "active"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Activas
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === "pending"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Pendientes
          </button>
        </div>
      </div>

      {/* Cities Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCities.map((city) => (
          <div
            key={city.id}
            className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                  city.status === "active" ? "bg-success/10" : "bg-warning/10"
                }`}>
                  <MapPin className={`h-6 w-6 ${
                    city.status === "active" ? "text-success" : "text-warning"
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">{city.name}</h3>
                  <p className="text-sm text-muted-foreground">{city.department}</p>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                city.status === "active" 
                  ? "bg-success/10 text-success" 
                  : "bg-warning/10 text-warning"
              }`}>
                {city.status === "active" ? "Activa" : "Pendiente"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-lg font-semibold text-card-foreground">{city.users.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Usuarios</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-card-foreground">{city.suppliers}</p>
                <p className="text-xs text-muted-foreground">Proveedores</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-2">
                {city.coverage ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-xs text-success">Cobertura completa</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-warning" />
                    <span className="text-xs text-warning">Cobertura parcial</span>
                  </>
                )}
              </div>
              <div className="flex gap-1">
                <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add City Modal */}
      {showAddModal && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/50" 
            onClick={() => setShowAddModal(false)} 
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-card-foreground">Nueva Ciudad</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Agrega una nueva ciudad para expandir la cobertura
            </p>
            
            <form className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Nombre de la ciudad
                </label>
                <input
                  type="text"
                  placeholder="Ej: Villavicencio"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Departamento
                </label>
                <input
                  type="text"
                  placeholder="Ej: Meta"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Estado inicial
                </label>
                <select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="pending">Pendiente (sin cobertura)</option>
                  <option value="active">Activa (con cobertura)</option>
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
                  Agregar ciudad
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
