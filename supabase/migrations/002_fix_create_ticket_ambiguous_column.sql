-- Fix: create_ticket() 関数内の "column reference is ambiguous" エラーを修正
-- returns table(id uuid, code text) の列名が tickets テーブルのカラム名と衝突していたため、
-- テーブル名で修飾して曖昧さを解消する

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
  while exists (select 1 from public.tickets where tickets.code = v_code) loop
    v_code := public.generate_ticket_code();
  end loop;

  -- チケットを挿入
  insert into public.tickets (code, credits, expires_at, created_by)
  values (v_code, p_credits, p_expires_at, auth.uid())
  returning tickets.id into v_id;

  return query select v_id, v_code;
end;
$$ language plpgsql security definer;
