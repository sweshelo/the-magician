-- 旧シグネチャの関数を削除（引数ありバージョン）
drop function if exists public.get_card_usage_ranking(int);

-- カード使用ランキング集計RPC
create or replace function public.get_card_usage_ranking()
returns table(card_id text, use_count bigint) as $$
  select
    card_id,
    count(*) as use_count
  from (
    select jsonb_array_elements_text(player1_deck) as card_id
    from public.matches
    where player1_deck is not null
      and jsonb_typeof(player1_deck) = 'array'
    union all
    select jsonb_array_elements_text(player2_deck) as card_id
    from public.matches
    where player2_deck is not null
      and jsonb_typeof(player2_deck) = 'array'
  ) as all_cards
  group by card_id
  order by use_count desc;
$$ language sql stable security definer;
