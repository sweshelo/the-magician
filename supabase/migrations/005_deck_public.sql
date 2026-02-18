-- is_public カラムを追加
ALTER TABLE public.decks ADD COLUMN is_public boolean DEFAULT false NOT NULL;

-- 公開デッキは誰でも閲覧可能にする RLS ポリシー
CREATE POLICY "Anyone can view public decks"
  ON public.decks FOR SELECT
  USING (is_public = true);
