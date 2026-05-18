
-- Lock down SECURITY DEFINER functions
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.tg_set_updated_at() from public, anon, authenticated;
revoke all on function public.has_role(uuid, public.app_role) from public, anon;
revoke all on function public.credit_balance(uuid) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;
grant execute on function public.credit_balance(uuid) to authenticated;

-- Webhook events: explicit deny-all for clients (only service role bypasses RLS)
create policy "webhook_events_no_client" on public.webhook_events for select to authenticated using (public.has_role(auth.uid(),'admin'));
