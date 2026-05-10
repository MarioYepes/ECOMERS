-- Parche rápido si al guardar el perfil aparece:
-- "Could not find the 'bio' column of 'profiles' in the schema cache"
-- (las migraciones 003 / 004 no se habían ejecutado en este proyecto de Supabase).
--
-- SQL Editor → ejecutar una vez. PostgREST refresca el caché en segundos.
-- Si el error persiste 1–2 min: Project Settings → pausar/reanudar no suele ser necesario;
-- basta con volver a guardar.

alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists website_url text;
alter table public.profiles add column if not exists business_hours text;
alter table public.profiles add column if not exists department text;
