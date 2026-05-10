-- Departamento (Colombia) en perfiles; city sigue siendo el municipio.

alter table public.profiles
  add column if not exists department text;

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
    department,
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
    new.raw_user_meta_data ->> 'department',
    new.raw_user_meta_data ->> 'address'
  );
  return new;
end;
$$;
