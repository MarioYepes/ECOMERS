-- TenderMarket / Sistema POS — modelo de dominio alineado con diagramas de componentes,
-- diagrama de clases (SistemaPOS) y casos de uso (tendero, proveedor, admin).
-- Ejecutar después de 001_profiles.sql en Supabase → SQL Editor.

-- ---------------------------------------------------------------------------
-- Tipos de enumeración (EstadoPedido, EstadoUsuario, EstadoProducto, movimiento)
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'estado_pedido') then
    create type public.estado_pedido as enum (
      'pendiente',
      'confirmado',
      'en_proceso',
      'enviado',
      'entregado',
      'cancelado'
    );
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'estado_cuenta') then
    create type public.estado_cuenta as enum (
      'activo',
      'inactivo',
      'bloqueado'
    );
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'estado_producto') then
    create type public.estado_producto as enum (
      'activo',
      'agotado',
      'inactivo'
    );
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'tipo_movimiento_inventario') then
    create type public.tipo_movimiento_inventario as enum (
      'entrada',
      'salida',
      'ajuste'
    );
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Ciudades y categorías (admin: CRUD en casos de uso)
-- ---------------------------------------------------------------------------
create table if not exists public.ciudades (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  created_at timestamptz not null default now(),
  unique (nombre)
);

create table if not exists public.categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null,
  parent_id uuid references public.categorias (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (slug)
);

create index if not exists categorias_parent_id_idx on public.categorias (parent_id);

-- ---------------------------------------------------------------------------
-- Perfiles: estado de cuenta y vínculo opcional a ciudad formal
-- (auth/contraseña permanece en auth.users; roles en profiles.role)
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists account_status public.estado_cuenta not null default 'activo';

alter table public.profiles
  add column if not exists city_id uuid references public.ciudades (id) on delete set null;

create index if not exists profiles_city_id_idx on public.profiles (city_id);

-- ---------------------------------------------------------------------------
-- Productos (proveedor), inventario y movimientos
-- ---------------------------------------------------------------------------
create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  proveedor_id uuid not null references public.profiles (id) on delete cascade,
  categoria_id uuid references public.categorias (id) on delete set null,
  nombre text not null,
  descripcion text,
  imagen_url text,
  codigo_barras text,
  unidad_medida text,
  precio_mayorista numeric(14, 2) not null default 0,
  precio_minorista numeric(14, 2) not null default 0,
  stock integer not null default 0 check (stock >= 0),
  estado public.estado_producto not null default 'activo',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists productos_proveedor_id_idx on public.productos (proveedor_id);
create index if not exists productos_categoria_id_idx on public.productos (categoria_id);
create index if not exists productos_published_idx on public.productos (is_published)
  where is_published = true;

create table if not exists public.movimientos_inventario (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references public.productos (id) on delete cascade,
  tipo public.tipo_movimiento_inventario not null,
  cantidad integer not null,
  fecha timestamptz not null default now(),
  referencia text,
  pedido_id uuid
);

create index if not exists movimientos_producto_id_idx
  on public.movimientos_inventario (producto_id);
create index if not exists movimientos_fecha_idx
  on public.movimientos_inventario (fecha desc);

-- ---------------------------------------------------------------------------
-- Carrito (tendero) e ítems
-- ---------------------------------------------------------------------------
create table if not exists public.carritos (
  id uuid primary key default gen_random_uuid(),
  tendero_id uuid not null references public.profiles (id) on delete cascade,
  updated_at timestamptz not null default now(),
  unique (tendero_id)
);

create table if not exists public.carrito_items (
  id uuid primary key default gen_random_uuid(),
  carrito_id uuid not null references public.carritos (id) on delete cascade,
  producto_id uuid not null references public.productos (id) on delete cascade,
  cantidad integer not null check (cantidad > 0),
  precio_unitario numeric(14, 2) not null,
  unique (carrito_id, producto_id)
);

create index if not exists carrito_items_carrito_id_idx on public.carrito_items (carrito_id);

-- ---------------------------------------------------------------------------
-- Pedidos y detalle (un pedido por proveedor en el modelo B2B)
-- ---------------------------------------------------------------------------
create sequence if not exists public.pedido_numero_seq;

create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  numero_pedido text not null unique default (
    'ORD-' || to_char (now(), 'YYYY') || '-' ||
    lpad (nextval ('public.pedido_numero_seq')::text, 6, '0')
  ),
  tendero_id uuid not null references public.profiles (id) on delete restrict,
  proveedor_id uuid not null references public.profiles (id) on delete restrict,
  fecha timestamptz not null default now(),
  total numeric(14, 2) not null default 0 check (total >= 0),
  destinatario text,
  direccion_entrega text,
  ciudad_entrega_id uuid references public.ciudades (id) on delete set null,
  observaciones text,
  estado public.estado_pedido not null default 'pendiente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pedidos_tendero_id_idx on public.pedidos (tendero_id);
create index if not exists pedidos_proveedor_id_idx on public.pedidos (proveedor_id);
create index if not exists pedidos_estado_idx on public.pedidos (estado);
create index if not exists pedidos_fecha_idx on public.pedidos (fecha desc);

create table if not exists public.pedido_items (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos (id) on delete cascade,
  producto_id uuid not null references public.productos (id) on delete restrict,
  cantidad integer not null check (cantidad > 0),
  precio_unitario numeric(14, 2) not null,
  subtotal numeric(14, 2) not null
);

create index if not exists pedido_items_pedido_id_idx on public.pedido_items (pedido_id);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'movimientos_pedido_fk'
  ) then
    alter table public.movimientos_inventario
      add constraint movimientos_pedido_fk
      foreign key (pedido_id) references public.pedidos (id) on delete set null;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Notificaciones
-- ---------------------------------------------------------------------------
create table if not exists public.notificaciones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  contenido text not null,
  fecha timestamptz not null default now(),
  leida boolean not null default false,
  tipo text
);

create index if not exists notificaciones_user_id_idx
  on public.notificaciones (user_id);
create index if not exists notificaciones_leida_idx
  on public.notificaciones (user_id, leida);

-- ---------------------------------------------------------------------------
-- updated_at en productos / pedidos
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists productos_set_updated_at on public.productos;
create trigger productos_set_updated_at
  before update on public.productos
  for each row execute function public.set_updated_at();

drop trigger if exists pedidos_set_updated_at on public.pedidos;
create trigger pedidos_set_updated_at
  before update on public.pedidos
  for each row execute function public.set_updated_at();

drop trigger if exists carritos_set_updated_at on public.carritos;
create trigger carritos_set_updated_at
  before update on public.carritos
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
  );
$$;

create or replace function public.is_proveedor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'proveedor'
  );
$$;

create or replace function public.is_tendero()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'tendero'
  );
$$;

-- ---------------------------------------------------------------------------
-- RLS: ciudades, categorías
-- ---------------------------------------------------------------------------
alter table public.ciudades enable row level security;
alter table public.categorias enable row level security;

create policy "ciudades_select_authenticated"
  on public.ciudades for select
  to authenticated
  using (true);

create policy "ciudades_write_admin"
  on public.ciudades for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "categorias_select_authenticated"
  on public.categorias for select
  to authenticated
  using (true);

create policy "categorias_write_admin"
  on public.categorias for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- RLS: perfiles — admin puede ver/editar todos (gestión de usuarios)
-- ---------------------------------------------------------------------------
create policy "profiles_select_admin"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

create policy "profiles_update_admin"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- RLS: productos
-- ---------------------------------------------------------------------------
alter table public.productos enable row level security;

create policy "productos_select_catalog"
  on public.productos for select
  to authenticated
  using (
    is_published = true
    or proveedor_id = (select auth.uid())
    or public.is_admin()
  );

create policy "productos_insert_proveedor"
  on public.productos for insert
  to authenticated
  with check (
    proveedor_id = (select auth.uid())
    and public.is_proveedor()
  );

create policy "productos_update_owner"
  on public.productos for update
  to authenticated
  using (proveedor_id = (select auth.uid()) or public.is_admin())
  with check (proveedor_id = (select auth.uid()) or public.is_admin());

create policy "productos_delete_owner"
  on public.productos for delete
  to authenticated
  using (proveedor_id = (select auth.uid()) or public.is_admin());

-- ---------------------------------------------------------------------------
-- RLS: movimientos inventario (dueño del producto o admin)
-- ---------------------------------------------------------------------------
alter table public.movimientos_inventario enable row level security;

create policy "movimientos_select"
  on public.movimientos_inventario for select
  to authenticated
  using (
    exists (
      select 1 from public.productos pr
      where pr.id = producto_id
        and (pr.proveedor_id = (select auth.uid()) or public.is_admin())
    )
  );

create policy "movimientos_write"
  on public.movimientos_inventario for insert
  to authenticated
  with check (
    exists (
      select 1 from public.productos pr
      where pr.id = producto_id
        and pr.proveedor_id = (select auth.uid())
    )
    or public.is_admin()
  );

-- ---------------------------------------------------------------------------
-- RLS: carritos y carrito_items (tendero dueño del carrito)
-- ---------------------------------------------------------------------------
alter table public.carritos enable row level security;
alter table public.carrito_items enable row level security;

create policy "carritos_select_own"
  on public.carritos for select
  to authenticated
  using (
    tendero_id = (select auth.uid())
    or public.is_admin()
  );

create policy "carritos_insert_own"
  on public.carritos for insert
  to authenticated
  with check (
    tendero_id = (select auth.uid())
    and public.is_tendero()
  );

create policy "carritos_update_own"
  on public.carritos for update
  to authenticated
  using (tendero_id = (select auth.uid()) or public.is_admin())
  with check (tendero_id = (select auth.uid()) or public.is_admin());

create policy "carritos_delete_own"
  on public.carritos for delete
  to authenticated
  using (tendero_id = (select auth.uid()) or public.is_admin());

create policy "carrito_items_select"
  on public.carrito_items for select
  to authenticated
  using (
    exists (
      select 1 from public.carritos c
      where c.id = carrito_id
        and (c.tendero_id = (select auth.uid()) or public.is_admin())
    )
  );

create policy "carrito_items_write"
  on public.carrito_items for insert
  to authenticated
  with check (
    exists (
      select 1 from public.carritos c
      where c.id = carrito_id
        and c.tendero_id = (select auth.uid())
    )
  );

create policy "carrito_items_update"
  on public.carrito_items for update
  to authenticated
  using (
    exists (
      select 1 from public.carritos c
      where c.id = carrito_id
        and c.tendero_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.carritos c
      where c.id = carrito_id
        and c.tendero_id = (select auth.uid())
    )
  );

create policy "carrito_items_delete"
  on public.carrito_items for delete
  to authenticated
  using (
    exists (
      select 1 from public.carritos c
      where c.id = carrito_id
        and c.tendero_id = (select auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- RLS: pedidos y pedido_items (tendero que compra / proveedor que vende)
-- ---------------------------------------------------------------------------
alter table public.pedidos enable row level security;
alter table public.pedido_items enable row level security;

create policy "pedidos_select_participants"
  on public.pedidos for select
  to authenticated
  using (
    tendero_id = (select auth.uid())
    or proveedor_id = (select auth.uid())
    or public.is_admin()
  );

create policy "pedidos_insert_tendero"
  on public.pedidos for insert
  to authenticated
  with check (
    tendero_id = (select auth.uid())
    and public.is_tendero()
    and exists (
      select 1
      from public.profiles pr
      where pr.id = proveedor_id
        and pr.role = 'proveedor'
    )
  );

create policy "pedidos_update_participants"
  on public.pedidos for update
  to authenticated
  using (
    tendero_id = (select auth.uid())
    or proveedor_id = (select auth.uid())
    or public.is_admin()
  )
  with check (
    tendero_id = (select auth.uid())
    or proveedor_id = (select auth.uid())
    or public.is_admin()
  );

create policy "pedido_items_select"
  on public.pedido_items for select
  to authenticated
  using (
    exists (
      select 1 from public.pedidos p
      where p.id = pedido_id
        and (
          p.tendero_id = (select auth.uid())
          or p.proveedor_id = (select auth.uid())
          or public.is_admin()
        )
    )
  );

create policy "pedido_items_insert"
  on public.pedido_items for insert
  to authenticated
  with check (
    exists (
      select 1 from public.pedidos p
      where p.id = pedido_id
        and p.tendero_id = (select auth.uid())
    )
  );

create policy "pedido_items_update"
  on public.pedido_items for update
  to authenticated
  using (
    exists (
      select 1 from public.pedidos p
      where p.id = pedido_id
        and (
          p.tendero_id = (select auth.uid())
          or public.is_admin()
        )
    )
  )
  with check (
    exists (
      select 1 from public.pedidos p
      where p.id = pedido_id
        and (
          p.tendero_id = (select auth.uid())
          or public.is_admin()
        )
    )
  );

create policy "pedido_items_delete"
  on public.pedido_items for delete
  to authenticated
  using (
    exists (
      select 1 from public.pedidos p
      where p.id = pedido_id
        and (
          p.tendero_id = (select auth.uid())
          or public.is_admin()
        )
    )
  );

-- ---------------------------------------------------------------------------
-- RLS: notificaciones (destinatario; avisos entre actores vía Edge/ service role)
-- ---------------------------------------------------------------------------
alter table public.notificaciones enable row level security;

create policy "notificaciones_select_own"
  on public.notificaciones for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or public.is_admin()
  );

create policy "notificaciones_insert"
  on public.notificaciones for insert
  to authenticated
  with check (
    public.is_admin()
    or user_id = (select auth.uid())
  );

create policy "notificaciones_update_own"
  on public.notificaciones for update
  to authenticated
  using (user_id = (select auth.uid()) or public.is_admin())
  with check (user_id = (select auth.uid()) or public.is_admin());

create policy "notificaciones_delete_own"
  on public.notificaciones for delete
  to authenticated
  using (user_id = (select auth.uid()) or public.is_admin());

-- ---------------------------------------------------------------------------
-- Permisos API (rol authenticated de Supabase)
-- ---------------------------------------------------------------------------
grant select, insert, update, delete on public.ciudades to authenticated;
grant select, insert, update, delete on public.categorias to authenticated;
grant select, insert, update, delete on public.productos to authenticated;
grant select, insert, update, delete on public.movimientos_inventario to authenticated;
grant select, insert, update, delete on public.carritos to authenticated;
grant select, insert, update, delete on public.carrito_items to authenticated;
grant select, insert, update, delete on public.pedidos to authenticated;
grant select, insert, update, delete on public.pedido_items to authenticated;
grant select, insert, update, delete on public.notificaciones to authenticated;
grant usage, select on sequence public.pedido_numero_seq to authenticated;