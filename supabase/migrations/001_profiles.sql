-- TenderMarket — ejecutar en Supabase: SQL Editor → New query → Run
-- Luego aplicar el dominio POS: 002_pos_domain.sql (pedidos, productos, carrito, etc.)
-- y 003_profile_extended.sql (bio, web, horario en profiles).
--
-- Antes, en el panel de Supabase:
-- Authentication → URL Configuration → Site URL: http://localhost:3000
-- Redirect URLs: http://localhost:3000/auth/callback, /auth/login, /auth/update-password
-- (callback = confirmación de registro; login = enlace de recuperación; añade tu dominio en prod).
--
-- Para desarrollo rápido: Authentication → Providers → Email → desactivar «Confirm email»
--
-- Crea la tabla de perfiles enlazada a auth.users y un trigger al registrarse.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'tendero'
    check (role in ('tendero', 'proveedor', 'admin')),
  phone text,
  business_name text,
  business_type text,
  nit text,
  city text,
  address text,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using ((select auth.uid()) = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check ((select auth.uid()) = id);

create policy "profiles_update_own"
  on public.profiles for update
  using ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    role,
    phone,
    business_name,
    business_type,
    nit,
    city,
    address
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'tendero'),
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'business_name',
    new.raw_user_meta_data ->> 'business_type',
    new.raw_user_meta_data ->> 'nit',
    new.raw_user_meta_data ->> 'city',
    new.raw_user_meta_data ->> 'address'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
