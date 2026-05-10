-- Campos extra del perfil (descripción, web, horario) para pantallas reales.
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists website_url text;
alter table public.profiles add column if not exists business_hours text;
