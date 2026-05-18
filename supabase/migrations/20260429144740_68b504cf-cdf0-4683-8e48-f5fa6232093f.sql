
-- Pin search_path on all SECURITY DEFINER / trigger functions
alter function public.handle_new_user() set search_path = public, pg_temp;
alter function public.tg_set_updated_at() set search_path = public, pg_temp;
alter function public.has_role(uuid, public.app_role) set search_path = public, pg_temp;
alter function public.credit_balance(uuid) set search_path = public, pg_temp;
