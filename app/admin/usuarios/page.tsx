"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  UserCheck, 
  UserX, 
  Store, 
  TruckIcon, 
  ChevronDown,
  Download,
  Filter
} from "lucide-react"

// Sample users data
const users = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan@ejemplo.com",
    phone: "+57 300 123 4567",
    role: "tendero",
    business: "Tienda Don Pepe",
    city: "Bogotá",
    status: "active",
    orders: 45,
    totalSpent: 2850000,
    joinDate: "2024-01-05",
  },
  {
    id: 2,
    name: "María García",
    email: "maria@ejemplo.com",
    phone: "+57 301 234 5678",
    role: "tendero",
    business: "Mini Mercado La Esquina",
    city: "Medellín",
    status: "active",
    orders: 32,
    totalSpent: 1920000,
    joinDate: "2024-01-10",
  },
  {
    id: 3,
    name: "Carlos López",
    email: "carlos@distribuidorasol.com",
    phone: "+57 302 345 6789",
    role: "proveedor",
    business: "Distribuidora Sol S.A.",
    city: "Cali",
    status: "verified",
    orders: 156,
    totalSpent: 45600000,
    joinDate: "2023-11-15",
  },
  {
    id: 4,
    name: "Ana Rodríguez",
    email: "ana@ejemplo.com",
    phone: "+57 303 456 7890",
    role: "tendero",
    business: "Droguería Central",
    city: "Barranquilla",
    status: "pending",
    orders: 0,
    totalSpent: 0,
    joinDate: "2024-01-18",
  },
  {
    id: 5,
    name: "Pedro Martínez",
    email: "pedro@lacteosdelvalle.com",
    phone: "+57 304 567 8901",
    role: "proveedor",
    business: "Lácteos del Valle",
    city: "Bogotá",
    status: "inactive",
    orders: 89,
    totalSpent: 28900000,
    joinDate: "2023-08-20",
  },
]

const statusConfig = {
  active: { label: "Activo", color: "bg-success/10 text-success" },
  verified: { label: "Verificado", color: "bg-primary/10 text-primary" },
  pending: { label: "Pendiente", color: "bg-warning/10 text-warning" },
  inactive: { label: "Inactivo", color: "bg-muted text-muted-foreground" },
}

const roleConfig = {
  tendero: { label: "Tendero", icon: Store, color: "bg-primary/10 text-primary" },
  proveedor: { label: "Proveedor", icon: TruckIcon, color: "bg-accent/10 text-accent" },
}

export default function UsuariosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.business.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="p-4 lg:p-6">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona tenderos y proveedores de la plataforma
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            <Download className="h-4 w-4" />
            Exportar
          </button>
          <Link
            href="/admin/usuarios/nuevo"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Nuevo Usuario
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, email o negocio..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 appearance-none rounded-lg border border-border bg-card pl-3 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">Todos los roles</option>
              <option value="tendero">Tenderos</option>
              <option value="proveedor">Proveedores</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 appearance-none rounded-lg border border-border bg-card pl-3 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="verified">Verificados</option>
              <option value="pending">Pendientes</option>
              <option value="inactive">Inactivos</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Usuario</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rol</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Negocio</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ciudad</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actividad</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => {
                const status = statusConfig[user.status as keyof typeof statusConfig]
                const role = roleConfig[user.role as keyof typeof roleConfig]
                const RoleIcon = role.icon
                
                return (
                  <tr key={user.id} className="transition-colors hover:bg-muted/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-medium text-primary">
                          {user.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${role.color}`}>
                        <RoleIcon className="h-3.5 w-3.5" />
                        {role.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-card-foreground">{user.business}</p>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{user.city}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm text-card-foreground">{user.orders} pedidos</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(user.totalSpent)}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="relative">
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        
                        {openMenuId === user.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                            <div className="absolute right-0 top-10 z-50 w-44 rounded-lg border border-border bg-card py-1 shadow-lg">
                              <Link
                                href={`/admin/usuarios/${user.id}`}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              >
                                <Eye className="h-4 w-4" />
                                Ver detalles
                              </Link>
                              <Link
                                href={`/admin/usuarios/${user.id}/editar`}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              >
                                <Edit className="h-4 w-4" />
                                Editar
                              </Link>
                              {user.status === "active" || user.status === "verified" ? (
                                <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-warning transition-colors hover:bg-warning/10">
                                  <UserX className="h-4 w-4" />
                                  Desactivar
                                </button>
                              ) : (
                                <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-success transition-colors hover:bg-success/10">
                                  <UserCheck className="h-4 w-4" />
                                  Activar
                                </button>
                              )}
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

        <div className="flex items-center justify-between border-t border-border p-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredUsers.length} de {users.length} usuarios
          </p>
          <div className="flex gap-2">
            <button className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted">
              Anterior
            </button>
            <button className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
