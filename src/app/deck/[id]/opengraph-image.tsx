import { ImageResponse } from 'next/og';
import { getDeck } from '@/actions/deck';
import master from '@/submodule/suit/catalog/catalog';

export const runtime = 'nodejs';
export const alt = 'デッキ詳細';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const PADDING = 10;
const COLS = 10;
const ROWS = 4;
const COL_GAP = 4;
const ROW_GAP = 4;
// カード幅: (1180 - 9×4) / 10 = 114px
// カード高さ: (610 - 3×4) / 4 = 149px
const CARD_WIDTH = 114;
const CARD_HEIGHT = 149;

/**
 * OG画像向けカード画像URL取得
 * OG画像はSNSクローラーがフェッチするため、NEXT_PUBLIC_IMAGE_SELF_HOSTINGに関わらず
 * 常にcoj.sega.jpの公開URLを返す
 */
function getOgCardImageUrl(catalogId: string): string {
  const entry = master.get(catalogId);
  if (!entry?.img) return '';
  const baseUrl = `https://coj.sega.jp/player/img${entry.img}`;
  return baseUrl.replace('large_card/card_large_', 'thum/thum_');
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OgImage({ params }: Props) {
  const { id } = await params;
  const deck = await getDeck(id);

  if (!deck) {
    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: '#888', fontSize: 48 }}>デッキが見つかりません</span>
        </div>
      ),
      { width: 1200, height: 630 },
    );
  }

  // deck.cards のみ使用（JOKERは含まない）
  const MAX_CARDS = COLS * ROWS;
  const slots = Array.from({ length: MAX_CARDS }, (_, i) => deck.cards[i] ?? '');

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: '#000',
          display: 'flex',
          flexDirection: 'column',
          padding: PADDING,
          boxSizing: 'border-box',
        }}
      >
        {Array.from({ length: ROWS }, (_, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: rowIndex < ROWS - 1 ? ROW_GAP : 0,
            }}
          >
            {Array.from({ length: COLS }, (_, colIndex) => {
              const catalogId = slots[rowIndex * COLS + colIndex];
              const imgUrl = catalogId ? getOgCardImageUrl(catalogId) : '';
              return (
                <div
                  key={colIndex}
                  style={{
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                    marginRight: colIndex < COLS - 1 ? COL_GAP : 0,
                    backgroundColor: '#111',
                    overflow: 'hidden',
                    display: 'flex',
                  }}
                >
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      width={CARD_WIDTH}
                      height={CARD_HEIGHT}
                      style={{ width: CARD_WIDTH, height: CARD_HEIGHT, objectFit: 'cover' }}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
