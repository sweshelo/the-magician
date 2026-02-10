-- matchesテーブルにRLSを有効化し、対戦参加者が自分の対戦記録を閲覧できるようにする

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Players can view their own matches" ON matches;
CREATE POLICY "Players can view their own matches"
  ON matches
  FOR SELECT
  USING (auth.uid()::text = player1_id OR auth.uid()::text = player2_id);
