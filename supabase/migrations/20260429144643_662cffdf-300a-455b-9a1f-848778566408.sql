
-- =========================================
-- Cutly AI — Core schema, roles, credits, uploads, billing, API keys
-- =========================================

-- 1) Enums
create type public.app_role as enum ('admin', 'user');
create type public.upload_status as enum ('queued','processing','completed','failed');
create type public.subscription_status as enum ('active','past_due','canceled','trialing','incomplete');
create type public.plan_tier as enum ('free','starter','pro','business');

-- 2) Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "profiles_self_select" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles_self_update" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "profiles_self_insert" on public.profiles for insert to authenticated with check (auth.uid() = id);

-- 3) Roles (separate table to prevent privilege escalation)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;

create policy "user_roles_self_read" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "user_roles_admin_write" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- 4) Credits ledger + balance view
create table public.credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  delta integer not null,                -- positive = grant, negative = consumption
  reason text not null,                  -- 'signup_bonus','subscription','purchase','usage','refund'
  reference text,                        -- razorpay payment id, upload id, etc.
  created_at timestamptz not null default now()
);
alter table public.credits enable row level security;
create index on public.credits(user_id, created_at desc);

create policy "credits_self_read" on public.credits for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

create or replace function public.credit_balance(_user_id uuid)
returns integer language sql stable security definer set search_path = public as $$
  select coalesce(sum(delta),0)::int from public.credits where user_id = _user_id;
$$;

-- 5) Uploads
create table public.uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  original_url text not null,
  result_url text,
  cloudinary_public_id text,
  status public.upload_status not null default 'queued',
  filename text,
  mime_type text,
  width int,
  height int,
  size_bytes bigint,
  credits_used int not null default 1,
  source text not null default 'web',    -- 'web','api','batch'
  api_key_id uuid,
  error text,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  expires_at timestamptz not null default (now() + interval '24 hours')
);
alter table public.uploads enable row level security;
create index on public.uploads(user_id, created_at desc);
create index on public.uploads(expires_at);

create policy "uploads_self_read" on public.uploads for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "uploads_self_insert" on public.uploads for insert to authenticated with check (user_id = auth.uid());
create policy "uploads_self_update" on public.uploads for update to authenticated using (user_id = auth.uid());

-- 6) Subscriptions (Razorpay)
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan public.plan_tier not null default 'free',
  status public.subscription_status not null default 'active',
  razorpay_subscription_id text unique,
  razorpay_customer_id text,
  monthly_credits int not null default 0,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.subscriptions enable row level security;
create index on public.subscriptions(user_id);

create policy "subs_self_read" on public.subscriptions for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- 7) Payments (Razorpay one-time + invoices)
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  razorpay_order_id text,
  razorpay_payment_id text unique,
  amount_paise bigint not null,
  currency text not null default 'INR',
  status text not null,                  -- created, captured, failed, refunded
  plan public.plan_tier,
  credits_granted int not null default 0,
  invoice_url text,
  created_at timestamptz not null default now()
);
alter table public.payments enable row level security;
create index on public.payments(user_id, created_at desc);

create policy "payments_self_read" on public.payments for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- 8) API Keys (hashed; raw key shown once)
create table public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  key_prefix text not null,              -- ck_live_xxx (first 12 chars, displayable)
  key_hash text not null unique,         -- sha256 of full key
  environment text not null default 'live',  -- live | test
  last_used_at timestamptz,
  request_count bigint not null default 0,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.api_keys enable row level security;
create index on public.api_keys(user_id);
create index on public.api_keys(key_hash);

create policy "apikeys_self_read" on public.api_keys for select to authenticated using (user_id = auth.uid());
create policy "apikeys_self_insert" on public.api_keys for insert to authenticated with check (user_id = auth.uid());
create policy "apikeys_self_update" on public.api_keys for update to authenticated using (user_id = auth.uid());
create policy "apikeys_self_delete" on public.api_keys for delete to authenticated using (user_id = auth.uid());

-- 9) Webhook events (idempotency log)
create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,                -- 'razorpay','n8n'
  event_id text not null,
  event_type text,
  payload jsonb,
  processed_at timestamptz not null default now(),
  unique (provider, event_id)
);
alter table public.webhook_events enable row level security;
-- no client policies; only service role writes

-- 10) Updated_at trigger
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;

create trigger profiles_set_updated before update on public.profiles
  for each row execute function public.tg_set_updated_at();
create trigger subs_set_updated before update on public.subscriptions
  for each row execute function public.tg_set_updated_at();

-- 11) On signup: create profile, grant 5 free credits, create free subscription
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role) values (new.id, 'user') on conflict do nothing;

  insert into public.credits (user_id, delta, reason) values (new.id, 5, 'signup_bonus');

  insert into public.subscriptions (user_id, plan, status, monthly_credits)
  values (new.id, 'free', 'active', 5);

  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- 12) Storage bucket for uploads (private)
insert into storage.buckets (id, name, public) values ('cutly-uploads','cutly-uploads', false)
  on conflict (id) do nothing;

create policy "uploads_owner_read" on storage.objects for select to authenticated
  using (bucket_id = 'cutly-uploads' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "uploads_owner_write" on storage.objects for insert to authenticated
  with check (bucket_id = 'cutly-uploads' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "uploads_owner_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'cutly-uploads' and (storage.foldername(name))[1] = auth.uid()::text);
