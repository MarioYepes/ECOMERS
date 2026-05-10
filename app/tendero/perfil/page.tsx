"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  User, 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Edit2, 
  Save,
  Camera,
  Shield,
  Bell,
  CreditCard,
  FileText
} from "lucide-react"

export default function TenderoPerfilPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    nombre: "Juan Carlos Pérez",
    nombreTienda: "Tienda Don Juan",
    email: "juan.perez@email.com",
    telefono: "+57 300 123 4567",
    direccion: "Calle 45 #23-67, Barrio Centro",
    ciudad: "Bogotá",
    nit: "900.123.456-7",
    descripcion: "Tienda de barrio con más de 10 años de experiencia ofreciendo productos de calidad a la comunidad."
  })

  const handleSave = () => {
    setIsEditing(false)
    // Here you would save to backend
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mi Perfil</h1>
          <p className="text-muted-foreground mt-1">
            Administra tu información personal y de tu tienda
          </p>
        </div>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isEditing 
              ? "bg-emerald-600 text-white hover:bg-emerald-700" 
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4" />
              Guardar Cambios
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4" />
              Editar Perfil
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-primary" />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <h2 className="text-xl font-semibold text-foreground mt-4">{profile.nombre}</h2>
            <p className="text-muted-foreground">{profile.nombreTienda}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">
                Tendero Verificado
              </span>
            </div>
            <div className="w-full mt-6 pt-6 border-t border-border">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-foreground">45</p>
                  <p className="text-sm text-muted-foreground">Pedidos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">$12,450</p>
                  <p className="text-sm text-muted-foreground">Total Compras</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Nombre Completo
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.nombre}
                    onChange={(e) => setProfile({ ...profile, nombre: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                ) : (
                  <p className="text-foreground">{profile.nombre}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Correo Electrónico
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                ) : (
                  <p className="text-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {profile.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Teléfono
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.telefono}
                    onChange={(e) => setProfile({ ...profile, telefono: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                ) : (
                  <p className="text-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    {profile.telefono}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  NIT
                </label>
                <p className="text-foreground">{profile.nit}</p>
              </div>
            </div>
          </div>

          {/* Store Info */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              Información de la Tienda
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Nombre de la Tienda
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.nombreTienda}
                    onChange={(e) => setProfile({ ...profile, nombreTienda: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                ) : (
                  <p className="text-foreground">{profile.nombreTienda}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Ciudad
                </label>
                {isEditing ? (
                  <select
                    value={profile.ciudad}
                    onChange={(e) => setProfile({ ...profile, ciudad: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value="Bogotá">Bogotá</option>
                    <option value="Medellín">Medellín</option>
                    <option value="Cali">Cali</option>
                    <option value="Barranquilla">Barranquilla</option>
                  </select>
                ) : (
                  <p className="text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    {profile.ciudad}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Dirección
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.direccion}
                    onChange={(e) => setProfile({ ...profile, direccion: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                ) : (
                  <p className="text-foreground">{profile.direccion}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Descripción
                </label>
                {isEditing ? (
                  <textarea
                    value={profile.descripcion}
                    onChange={(e) => setProfile({ ...profile, descripcion: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                  />
                ) : (
                  <p className="text-muted-foreground">{profile.descripcion}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/tendero/perfil/seguridad"
          className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-foreground">Seguridad</p>
            <p className="text-sm text-muted-foreground">Contraseña y 2FA</p>
          </div>
        </Link>
        <Link
          href="/tendero/notificaciones"
          className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
        >
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-medium text-foreground">Notificaciones</p>
            <p className="text-sm text-muted-foreground">Preferencias de alertas</p>
          </div>
        </Link>
        <Link
          href="/tendero/perfil/pagos"
          className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
        >
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="font-medium text-foreground">Métodos de Pago</p>
            <p className="text-sm text-muted-foreground">Tarjetas y cuentas</p>
          </div>
        </Link>
        <Link
          href="/tendero/perfil/facturas"
          className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
        >
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-foreground">Facturación</p>
            <p className="text-sm text-muted-foreground">Historial de facturas</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
