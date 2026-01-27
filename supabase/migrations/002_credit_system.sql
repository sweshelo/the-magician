-- =====================================================
-- クレジット制への移行マイグレーション
-- =====================================================

-- =====================================================
-- 1. subscriptionsテーブルの削除
-- =====================================================
drop trigger if exists on_profile_created on public.profiles;
drop function if exists public.handle_new_profile();
drop trigger if exists update_subscriptions_updated_at on public.subscriptions;
drop policy if exists "Users can view own subscription" on public.subscriptions;
drop table if exists public.subscriptions;

-- 古いヘルパー関数も削除
drop function if exists public.can_play(uuid);
drop function if exists public.get_today_play_count(uuid);

-- =====================================================
-- 2. profilesテーブルに管理者フラグを追加
-- =====================================================
alter table public.profiles add column if not exists is_admin boolean default false;

-- =====================================================
-- 3. system_configテーブル（システム設定）
-- =====================================================
create table if not exists public.system_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now() not null
);

-- RLSを有効化（読み取りは全員可、書き込みは管理者のみ）
alter table public.system_config enable row level security;

create policy "Anyone can read system config"
  on public.system_config for select
  using (true);

create policy "Admins can update system config"
  on public.system_config for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Admins can insert system config"
  on public.system_config for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- 初期値を設定
insert into public.system_config (key, value)
values ('daily_free_plays', '3'::jsonb)
on conflict (key) do nothing;

-- updated_atトリガー
create trigger update_system_config_updated_at
  before update on public.system_config
  for each row execute procedure public.update_updated_at_column();

-- =====================================================
-- 4. user_creditsテーブル（ユーザークレジット残高）
-- =====================================================
create table if not exists public.user_credits (
  user_id uuid references public.profiles on delete cascade primary key,
  balance int not null default 0 check (balance >= 0),
  updated_at timestamptz default now() not null
);

-- RLS
alter table public.user_credits enable row level security;

create policy "Users can view own credits"
  on public.user_credits for select
  using (auth.uid() = user_id);

-- クレジットの更新はServer Actions（service_role）経由のみ
-- ユーザー自身による直接更新は許可しない

-- updated_atトリガー
create trigger update_user_credits_updated_at
  before update on public.user_credits
  for each row execute procedure public.update_updated_at_column();

-- =====================================================
-- 5. ticketsテーブル（チケット）
-- =====================================================
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  credits int not null check (credits > 0),
  owner_id uuid references public.profiles on delete set null,
  redeemed_at timestamptz,
  expires_at timestamptz,  -- NULL = 永久有効
  created_at timestamptz default now() not null,
  created_by uuid references public.profiles
);

-- インデックス
create index if not exists idx_tickets_code on public.tickets(code);
create index if not exists idx_tickets_owner_id on public.tickets(owner_id);

-- RLS
alter table public.tickets enable row level security;

-- 管理者は全チケットを参照可能
create policy "Admins can view all tickets"
  on public.tickets for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- ユーザーは自分が所有するチケットのみ参照可能
create policy "Users can view own tickets"
  on public.tickets for select
  using (auth.uid() = owner_id);

-- 管理者のみチケット発行可能
create policy "Admins can insert tickets"
  on public.tickets for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- =====================================================
-- 6. play_logsテーブルの更新（消費タイプを追加）
-- =====================================================
-- 消費タイプ: 'free'（無料枠）, 'credit'（クレジット）
alter table public.play_logs add column if not exists consumption_type text default 'free';

-- =====================================================
-- 7. ヘルパー関数
-- =====================================================

-- 今日の無料枠プレイ回数を取得
create or replace function public.get_today_free_play_count(p_user_id uuid)
returns int as $$
  select count(*)::int
  from public.play_logs
  where user_id = p_user_id
    and consumption_type = 'free'
    and played_at >= date_trunc('day', now() at time zone 'Asia/Tokyo')
    and played_at < date_trunc('day', now() at time zone 'Asia/Tokyo') + interval '1 day';
$$ language sql security definer;

-- 1日の無料プレイ回数設定を取得
create or replace function public.get_daily_free_plays()
returns int as $$
  select coalesce((value)::int, 3)
  from public.system_config
  where key = 'daily_free_plays';
$$ language sql security definer;

-- ユーザーのクレジット残高を取得
create or replace function public.get_user_credits(p_user_id uuid)
returns int as $$
  select coalesce(balance, 0)
  from public.user_credits
  where user_id = p_user_id;
$$ language sql security definer;

-- プレイ可能かどうかをチェック（無料枠 + クレジット）
create or replace function public.can_play(p_user_id uuid)
returns boolean as $$
declare
  v_daily_free int;
  v_today_free_count int;
  v_credits int;
begin
  -- 1日の無料回数を取得
  v_daily_free := public.get_daily_free_plays();

  -- 今日の無料枠使用回数を取得
  v_today_free_count := public.get_today_free_play_count(p_user_id);

  -- 無料枠が残っている場合
  if v_today_free_count < v_daily_free then
    return true;
  end if;

  -- クレジット残高を確認
  v_credits := public.get_user_credits(p_user_id);

  return v_credits > 0;
end;
$$ language plpgsql security definer;

-- クレジットを消費してプレイを記録（トランザクション）
create or replace function public.consume_play_credit(
  p_user_id uuid,
  p_deck_id uuid default null,
  p_room_id text default null
)
returns table(success boolean, consumption_type text, play_log_id uuid) as $$
declare
  v_daily_free int;
  v_today_free_count int;
  v_credits int;
  v_consumption_type text;
  v_play_log_id uuid;
begin
  -- 1日の無料回数を取得
  v_daily_free := public.get_daily_free_plays();

  -- 今日の無料枠使用回数を取得
  v_today_free_count := public.get_today_free_play_count(p_user_id);

  -- 無料枠が残っている場合
  if v_today_free_count < v_daily_free then
    v_consumption_type := 'free';
  else
    -- クレジット残高を確認
    v_credits := public.get_user_credits(p_user_id);

    if v_credits <= 0 then
      return query select false, null::text, null::uuid;
      return;
    end if;

    -- クレジットを消費
    update public.user_credits
    set balance = balance - 1
    where user_id = p_user_id;

    v_consumption_type := 'credit';
  end if;

  -- プレイログを記録
  insert into public.play_logs (user_id, deck_id, room_id, consumption_type)
  values (p_user_id, p_deck_id, p_room_id, v_consumption_type)
  returning id into v_play_log_id;

  return query select true, v_consumption_type, v_play_log_id;
end;
$$ language plpgsql security definer;

-- チケットを使用してクレジットをチャージ
create or replace function public.redeem_ticket(p_user_id uuid, p_code text)
returns table(success boolean, credits_added int, message text) as $$
declare
  v_ticket record;
begin
  -- チケットを検索
  select * into v_ticket
  from public.tickets
  where code = p_code
  for update;  -- ロック

  if v_ticket is null then
    return query select false, 0, 'チケットが見つかりません'::text;
    return;
  end if;

  -- 既に使用済みかチェック
  if v_ticket.owner_id is not null then
    return query select false, 0, 'このチケットは既に使用されています'::text;
    return;
  end if;

  -- 有効期限をチェック
  if v_ticket.expires_at is not null and v_ticket.expires_at < now() then
    return query select false, 0, 'このチケットは有効期限が切れています'::text;
    return;
  end if;

  -- チケットを使用済みに更新
  update public.tickets
  set owner_id = p_user_id,
      redeemed_at = now()
  where id = v_ticket.id;

  -- クレジットをチャージ（upsert）
  insert into public.user_credits (user_id, balance)
  values (p_user_id, v_ticket.credits)
  on conflict (user_id) do update
  set balance = public.user_credits.balance + v_ticket.credits;

  return query select true, v_ticket.credits, 'チケットを使用しました'::text;
end;
$$ language plpgsql security definer;

-- ランダムなチケットコードを生成（16文字）
create or replace function public.generate_ticket_code()
returns text as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';  -- 紛らわしい文字を除外
  result text := '';
  i int;
begin
  for i in 1..16 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  end loop;
  return result;
end;
$$ language plpgsql;

-- チケットを発行（管理者用）
create or replace function public.create_ticket(
  p_credits int,
  p_expires_at timestamptz default now() + interval '30 days'
)
returns table(id uuid, code text) as $$
declare
  v_code text;
  v_id uuid;
begin
  -- コードを生成
  v_code := public.generate_ticket_code();

  -- 重複チェック（万が一の場合）
  while exists (select 1 from public.tickets where code = v_code) loop
    v_code := public.generate_ticket_code();
  end loop;

  -- チケットを挿入
  insert into public.tickets (code, credits, expires_at, created_by)
  values (v_code, p_credits, p_expires_at, auth.uid())
  returning tickets.id into v_id;

  return query select v_id, v_code;
end;
$$ language plpgsql security definer;
