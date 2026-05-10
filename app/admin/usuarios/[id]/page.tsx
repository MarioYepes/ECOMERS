"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
  Search,
  Filter,
  ArrowLeft,
  UserCheck,
  UserX,
  Mail,
  Building2,
  Store
} from "lucide-react"

type UserStatus = "activo" | "pendiente" | "inactivo"
type UserRole = "tendero" | "proveedor"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  business: string
  city: string
  status: UserStatus
  registeredAt: string
  lastLogin: string
}

const mockUsers: User[] = [
  { id: "1", name: "Juan Carlos Pérez", email: "juan@email.com", role: "tendero", business: "Tienda Don Juan", city: "Bogotá", status: "activo", registeredAt: "15 Nov 2024", lastLogin: "Hoy" },
  { id: "2", name: "María García", email: "maria@distribuidora.com", role: "proveedor", business: "Distribuidora ABC", city: "Medellín", status: "activo", registeredAt: "10 Nov 2024", lastLogin: "Ayer" },
  { id: "3", name: "Carlos López", email: "carlos@email.com", role: "tendero", business: "Minimarket El Sol", city: "Cali", status: "pendiente", registeredAt: "12 Dic 2024", lastLogin: "Nunca" },
  { id: "4", name: "Ana Martínez", email: "ana@mayorista.com", role: "proveedor", business: "Mayorista XYZ", city: "Barranquilla", status: "activo", registeredAt: "5 Oct 2024", lastLogin: "Hace 3 días" },
  { id: "5", name: "Pedro Sánchez", email: "pedro@email.com", role: "tendero", business: "Tienda La Esquina", city: "Bogotá", status: "inactivo", registeredAt: "1 Sep 2024", lastLogin: "Hace 30 días" },
  { id: "6", name: "Laura Torres", email: "laura@proveedor123.com", role: "proveedor", business: "Proveedor 123", city: "Bogotá", status: "pendiente", registeredAt: "14 Dic 2024", lastLogin: "Nunca" },
]

const statusConfig = {
  activo: { label: "Activo", color: "bg-emerald-100 text-emerald-700" },
  pendiente: { label: "Pendiente", color: "bg-amber-100 text-amber-700" },
  inactivo: { label: "Inactivo", color: "bg-gray-100 text-gray-700" },
}

const roleConfig = {
  tendero: { label: "Tendero", icon: Store, color: "text-blue-600" },
  proveedor: { label: "Proveedor", icon: Building2, color: "text-purple-600" },
}

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all")
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all")

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.business.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const stats = {
    total: mockUsers.length,
    tenderos: mockUsers.filter(u => u.role === "tendero").length,
    proveedores: mockUsers.filter(u => u.role === "proveedor").length,
    pending: mockUsers.filter(u => u.status === "pendiente").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/usuarios"
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Detalle de Usuario</h1>
            <p className="text-muted-foreground mt-1">Información completa del usuario</p>
          </div>
        </div>
      </div>

      {/* User Detail Content would go here */}
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-muted-foreground">
          Esta página mostraría el detalle completo del usuario seleccionado
        </p>
      </div>
    </div>
  )
}
