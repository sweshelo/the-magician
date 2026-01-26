-- =====================================================
-- The Magician - 初期スキーマ
-- =====================================================

-- =====================================================
-- profiles テーブル
-- ユーザープロファイル（auth.usersと1:1で連携）
-- =====================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  discord_id text unique not null,
  discord_username text not null,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- プロファイル用RLS
alter table public.profiles enable row level security;

-- 自分のプロファイルのみ参照可能
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- 自分のプロファイルのみ更新可能
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 新規ユーザー登録時にプロファイルを自動作成するトリガー関数
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, discord_id, discord_username, display_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'provider_id',
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Unknown'),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 新規ユーザー作成時にトリガーを実行
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =====================================================
-- decks テーブル
-- ユーザーのデッキデータ
-- =====================================================
create table public.decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  title text not null,
  cards text[] not null,
  jokers text[] not null default '{}',
  is_main boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,

  -- 同一ユーザーで同じタイトルのデッキは作成不可
  constraint unique_deck_title_per_user unique (user_id, title)
);

-- デッキ用RLS
alter table public.decks enable row level security;

-- 自分のデッキのみ参照可能
create policy "Users can view own decks"
  on public.decks for select
  using (auth.uid() = user_id);

-- 自分のデッキのみ挿入可能
create policy "Users can insert own decks"
  on public.decks for insert
  with check (auth.uid() = user_id);

-- 自分のデッキのみ更新可能
create policy "Users can update own decks"
  on public.decks for update
  using (auth.uid() = user_id);

-- 自分のデッキのみ削除可能
create policy "Users can delete own decks"
  on public.decks for delete
  using (auth.uid() = user_id);

-- メインデッキの一意性を保証する関数
-- 同一ユーザーでis_main=trueは1つだけ
create or replace function public.ensure_single_main_deck()
returns trigger as $$
begin
  if new.is_main = true then
    update public.decks
    set is_main = false
    where user_id = new.user_id and id != new.id and is_main = true;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger ensure_single_main_deck_trigger
  before insert or update on public.decks
  for each row execute procedure public.ensure_single_main_deck();

-- =====================================================
-- play_logs テーブル
-- プレイ履歴（回数制限用）
-- =====================================================
create table public.play_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  deck_id uuid references public.decks on delete set null,
  played_at timestamptz default now() not null,
  room_id text,
  result text -- 'win', 'lose', 'draw', 'disconnect' など
);

-- プレイログ用RLS
alter table public.play_logs enable row level security;

-- 自分のプレイログのみ参照可能
create policy "Users can view own play logs"
  on public.play_logs for select
  using (auth.uid() = user_id);

-- 自分のプレイログのみ挿入可能
create policy "Users can insert own play logs"
  on public.play_logs for insert
  with check (auth.uid() = user_id);

-- =====================================================
-- subscriptions テーブル
-- 課金状態（将来用）
-- =====================================================
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null unique,
  plan text not null default 'free', -- 'free', 'premium' など
  daily_play_limit int not null default 3,
  valid_until timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- サブスクリプション用RLS
alter table public.subscriptions enable row level security;

-- 自分のサブスクリプションのみ参照可能
create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- 新規ユーザー登録時にfreeプランを自動作成するトリガー
create or replace function public.handle_new_profile()
returns trigger as $$
begin
  insert into public.subscriptions (user_id, plan, daily_play_limit)
  values (new.id, 'free', 3);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_created
  after insert on public.profiles
  for each row execute procedure public.handle_new_profile();

-- =====================================================
-- ヘルパー関数
-- =====================================================

-- 今日のプレイ回数を取得
create or replace function public.get_today_play_count(p_user_id uuid)
returns int as $$
  select count(*)::int
  from public.play_logs
  where user_id = p_user_id
    and played_at >= date_trunc('day', now() at time zone 'Asia/Tokyo')
    and played_at < date_trunc('day', now() at time zone 'Asia/Tokyo') + interval '1 day';
$$ language sql security definer;

-- プレイ可能かどうかをチェック
create or replace function public.can_play(p_user_id uuid)
returns boolean as $$
declare
  v_daily_limit int;
  v_today_count int;
  v_valid_until timestamptz;
begin
  -- サブスクリプション情報を取得
  select daily_play_limit, valid_until
  into v_daily_limit, v_valid_until
  from public.subscriptions
  where user_id = p_user_id;

  -- サブスクリプションがない場合はデフォルト制限
  if v_daily_limit is null then
    v_daily_limit := 3;
  end if;

  -- プレミアムプランで有効期限内なら無制限
  if v_valid_until is not null and v_valid_until > now() then
    return true;
  end if;

  -- 今日のプレイ回数をチェック
  v_today_count := public.get_today_play_count(p_user_id);

  return v_today_count < v_daily_limit;
end;
$$ language plpgsql security definer;

-- =====================================================
-- インデックス
-- =====================================================
create index idx_decks_user_id on public.decks(user_id);
create index idx_play_logs_user_id on public.play_logs(user_id);
create index idx_play_logs_played_at on public.play_logs(played_at);
create index idx_subscriptions_user_id on public.subscriptions(user_id);

-- updated_at を自動更新するトリガー関数
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 各テーブルにupdated_atトリガーを設定
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

create trigger update_decks_updated_at
  before update on public.decks
  for each row execute procedure public.update_updated_at_column();

create trigger update_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure public.update_updated_at_column();
