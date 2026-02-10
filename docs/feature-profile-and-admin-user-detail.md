# マイページ・管理者ユーザー詳細ページの実装

## 概要

ユーザーが自分の対戦履歴・戦績を確認できる「マイページ」(`/profile`)と、管理者が任意のユーザーの詳細を閲覧できるページ(`/admin/users/[id]`)を追加した。

## 変更内容

### 新規ファイル

| ファイル                                  | 説明                                       |
| ----------------------------------------- | ------------------------------------------ |
| `supabase/migrations/004_matches_rls.sql` | matchesテーブルのRLSポリシー追加           |
| `src/actions/profile.ts`                  | プロフィール・対戦履歴取得用Server Actions |
| `src/feature/Profile/ProfileHeader.tsx`   | プロフィールヘッダーコンポーネント         |
| `src/feature/Profile/MatchHistory.tsx`    | 対戦履歴テーブルコンポーネント             |
| `src/app/profile/page.tsx`                | マイページ (`/profile`)                    |
| `src/app/admin/users/[id]/page.tsx`       | 管理者ユーザー詳細ページ                   |

### 変更ファイル

| ファイル                          | 変更内容                              |
| --------------------------------- | ------------------------------------- |
| `src/actions/admin.ts`            | `checkAdminAccess()`に`export`を追加  |
| `src/app/page.tsx`                | TOPページにマイページへのLinkCard追加 |
| `src/feature/Admin/UserTable.tsx` | 各ユーザー行に「詳細」リンク列を追加  |

---

## 詳細

### 1. RLSマイグレーション (`004_matches_rls.sql`)

matchesテーブルにRow Level Securityを有効化し、自分が参加した対戦記録のみ閲覧可能にするSELECTポリシーを追加。

```sql
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can view their own matches"
  ON matches FOR SELECT
  USING (auth.uid()::text = player1_id OR auth.uid()::text = player2_id);
```

- `auth.uid()`は`uuid`型、`player1_id`/`player2_id`は`text`型のため`::text`キャストが必要

### 2. Server Actions (`src/actions/profile.ts`)

#### エクスポートされる型

| 型名                | 説明                                                       |
| ------------------- | ---------------------------------------------------------- |
| `ProfileStats`      | 戦績サマリー (`totalMatches`, `wins`, `losses`, `winRate`) |
| `ProfileResponse`   | `Profile` + `ProfileStats`（取得失敗時は`null`）           |
| `MatchWithOpponent` | `Match` + 対戦相手Profile + 勝敗結果 + 自分/相手のデッキ   |
| `MatchListResponse` | `MatchWithOpponent[]` + `total`                            |

#### エクスポートされるアクション

| アクション                                | 用途                                     | クライアント               |
| ----------------------------------------- | ---------------------------------------- | -------------------------- |
| `getMyProfile()`                          | 自分のプロフィール+戦績取得              | `createClient()` (RLS適用) |
| `getMyMatches({ page, limit })`           | 自分の対戦履歴取得                       | `createClient()` (RLS適用) |
| `getUserProfile(userId)`                  | 管理者用: 任意ユーザーのプロフィール取得 | `createAdminClient()`      |
| `getUserMatches(userId, { page, limit })` | 管理者用: 任意ユーザーの対戦履歴取得     | `createAdminClient()`      |

#### 内部ヘルパー関数

- `computeStats()` - Match配列から勝敗数・勝率を算出
- `determineResult()` - 各対戦の勝敗判定 (`win` / `lose` / `draw`)
- `getMyDeck()` / `getOpponentDeck()` / `getOpponentId()` - player1/player2の判別
- `enrichMatchesWithOpponents()` - 対戦相手プロフィールを`createAdminClient()`でバッチ取得して結合

#### 設計上の注意点

- **対戦相手プロフィール取得**: `profiles`テーブルのRLSは自分のレコードのみSELECT可のため、対戦相手の名前・アバターを表示するには`createAdminClient()`でバッチ取得が必要
- **AUTH_SKIP対応**: 各アクションに`process.env.AUTH_SKIP === 'true'`時のモックデータ返却を実装

### 3. 共有UIコンポーネント

#### `ProfileHeader.tsx`

- アバター画像（未設定時は名前の頭文字をフォールバック表示）
- 表示名 + Discordユーザー名
- 4カラムの戦績グリッド（対戦数 / 勝利 / 敗北 / 勝率）

#### `MatchHistory.tsx`

- テーブルカラム: 日時、結果（勝利/敗北/引分バッジ）、対戦相手、自分のデッキ、相手のデッキ
- **デッキプレビュー**: カードサムネイル先頭5枚 + 残数表示（`+N枚`）、`getImageUrl(cardId, 'small')`使用
- デッキカラムはモバイル非表示 (`hidden md:table-cell`)
- 既存`Pagination`コンポーネントを内蔵
- テーブルデザインは`/stats`ページのスタイルに合わせている

### 4. マイページ (`/profile`)

- Server Component (`force-dynamic`)
- 未ログイン時は`/login`にリダイレクト
- `ProfileHeader` + `MatchHistory`を表示
- ライトテーマ (`bg-gray-100`)、TOPへの戻りリンク付き
- `searchParams.page`でページネーション

### 5. 管理者ユーザー詳細ページ (`/admin/users/[id]`)

- Server Component (`force-dynamic`)
- admin `layout.tsx`による権限チェックが自動適用される
- `getUserProfile(id)` + `getUserMatches(id, { page })` を使用
- ユーザーが見つからない場合はエラーメッセージを表示
- 「ユーザー一覧へ戻る」リンク付き
- ダークテーマ（admin layoutのデザインを踏襲）

### 6. 既存ファイル変更

#### `src/actions/admin.ts`

- `checkAdminAccess()`を`export`に変更し、`profile.ts`から再利用可能に

#### `src/app/page.tsx`

- 統計とソースコードの間にマイページへのLinkCardを追加

#### `src/feature/Admin/UserTable.tsx`

- `Link`のインポート追加
- テーブルヘッダーに空カラム追加
- 各ユーザー行に`/admin/users/${user.id}`への「詳細」リンクを追加

---

## ページ遷移図

```
TOP (/)
├── マイページ (/profile)       ← 新規追加
│   └── ページネーション (/profile?page=N)
└── 管理者ダッシュボード (/admin)
    └── ユーザー一覧 (/admin/users)
        └── ユーザー詳細 (/admin/users/[id])   ← 新規追加
            └── ページネーション (/admin/users/[id]?page=N)
```

## 検証項目

- [ ] `bun run tsc` で型チェック通過
- [ ] `/profile` にアクセスし、ログイン済みユーザーの戦績・対戦履歴が表示される
- [ ] `/profile` に未ログインでアクセスすると `/login` にリダイレクトされる
- [ ] 対戦履歴のページネーションが動作する
- [ ] デッキプレビューにカードサムネイルが表示される
- [ ] `/admin/users` 一覧から「詳細」リンクで `/admin/users/[id]` に遷移できる
- [ ] 管理者ユーザー詳細ページで対戦履歴が表示される
- [ ] 存在しないユーザーIDでアクセスした場合にエラーメッセージが表示される
- [ ] RLSマイグレーションが正常に適用される
