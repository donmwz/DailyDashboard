-- Kullanıcı dashboard tercihleri (modüller, sıra, tema, veri seçimleri, hava konumu)
create table public.user_dashboard_settings (
    user_id uuid primary key references auth.users (id) on delete cascade,
    theme text not null default 'light' check (theme in ('light', 'dark')),
    modules jsonb not null default '["weather","currency","gold","crypto","stocks","news"]'::jsonb,
    card_order jsonb,
    data_prefs jsonb not null default '{"gold":["GA","C","Y","T"],"crypto":["BTC","ETH"],"stocks":["THYAO","AAPL","IBM"]}'::jsonb,
    weather_location jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.user_dashboard_settings enable row level security;

create policy "Users can view own dashboard settings"
    on public.user_dashboard_settings
    for select
    using (auth.uid() = user_id);

create policy "Users can insert own dashboard settings"
    on public.user_dashboard_settings
    for insert
    with check (auth.uid() = user_id);

create policy "Users can update own dashboard settings"
    on public.user_dashboard_settings
    for update
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

create trigger user_dashboard_settings_updated_at
    before update on public.user_dashboard_settings
    for each row
    execute function public.set_updated_at();
