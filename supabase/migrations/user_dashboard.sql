-- Dashboard şeması (ayarlar + takvim)
-- Supabase Dashboard → SQL Editor içinde bu dosyanın tamamını çalıştırın.

create table if not exists public.user_dashboard_settings (
    user_id uuid primary key references auth.users (id) on delete cascade,
    theme text not null default 'light' check (theme in ('light', 'dark')),
    modules jsonb not null default '["weather","calendar","currency","gold","crypto","stocks","news"]'::jsonb,
    card_order jsonb,
    data_prefs jsonb not null default '{"gold":["GA","C","Y","T"],"crypto":["BTC","ETH"],"stocks":["THYAO","AAPL","IBM"]}'::jsonb,
    weather_location jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.user_dashboard_settings enable row level security;

drop policy if exists "Users can view own dashboard settings" on public.user_dashboard_settings;
create policy "Users can view own dashboard settings"
    on public.user_dashboard_settings
    for select
    using (auth.uid() = user_id);

drop policy if exists "Users can insert own dashboard settings" on public.user_dashboard_settings;
create policy "Users can insert own dashboard settings"
    on public.user_dashboard_settings
    for insert
    with check (auth.uid() = user_id);

drop policy if exists "Users can update own dashboard settings" on public.user_dashboard_settings;
create policy "Users can update own dashboard settings"
    on public.user_dashboard_settings
    for update
    using (auth.uid() = user_id);

-- Takvim kayıtları (etkinlik / görev / yapılacak)
create table if not exists public.user_calendar_items (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    title text not null,
    type text not null default 'event' check (type in ('event', 'task', 'todo')),
    date date not null,
    time text,
    notify boolean not null default false,
    done boolean not null default false,
    notified_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists user_calendar_items_user_date_idx
    on public.user_calendar_items (user_id, date);

alter table public.user_calendar_items enable row level security;

drop policy if exists "Users can view own calendar items" on public.user_calendar_items;
create policy "Users can view own calendar items"
    on public.user_calendar_items
    for select
    using (auth.uid() = user_id);

drop policy if exists "Users can insert own calendar items" on public.user_calendar_items;
create policy "Users can insert own calendar items"
    on public.user_calendar_items
    for insert
    with check (auth.uid() = user_id);

drop policy if exists "Users can update own calendar items" on public.user_calendar_items;
create policy "Users can update own calendar items"
    on public.user_calendar_items
    for update
    using (auth.uid() = user_id);

drop policy if exists "Users can delete own calendar items" on public.user_calendar_items;
create policy "Users can delete own calendar items"
    on public.user_calendar_items
    for delete
    using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists user_dashboard_settings_updated_at on public.user_dashboard_settings;
create trigger user_dashboard_settings_updated_at
    before update on public.user_dashboard_settings
    for each row
    execute function public.set_updated_at();

drop trigger if exists user_calendar_items_updated_at on public.user_calendar_items;
create trigger user_calendar_items_updated_at
    before update on public.user_calendar_items
    for each row
    execute function public.set_updated_at();
