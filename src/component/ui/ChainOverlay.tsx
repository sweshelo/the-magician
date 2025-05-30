import React from 'react';

interface ChainOverlayProps {
  isSmall?: boolean;
}

/**
 * カード上に2本の対角線チェーン（四角い輪の連なり）と中央の赤い輪を描画するオーバーレイ
 */
export const ChainOverlay: React.FC<ChainOverlayProps> = ({ isSmall = false }) => {
  // カードサイズ
  const cardWidth = isSmall ? 76 : 112;
  const cardHeight = isSmall ? 104 : 156;

  // チェーンの輪（四角形）の数
  const numLinks = isSmall ? 5 : 20;
  // 四角形のサイズ
  const linkSize = isSmall ? 5 : 7;
  // 四角形の角丸
  const linkRadius = linkSize * 0.25;

  // チェーンの色
  const linkColor = '#ff0000';
  const linkBorder = '#990000';

  // 中央の輪
  const ringRadius = isSmall ? 11 : 16;
  const ringStroke = isSmall ? 2 : 4;
  const ringColor = '#ff0000';

  // 対角線上の四角形座標を計算
  // leftTopToRightBottom: 左上→右下, rightTopToLeftBottom: 右上→左下
  const getDiagonalPositions = (direction: 'leftTopToRightBottom' | 'rightTopToLeftBottom') => {
    return Array.from({ length: numLinks }).map((_, i) => {
      const t = i / (numLinks - 1);
      if (direction === 'leftTopToRightBottom') {
        // 左上→右下
        return {
          x: t * cardWidth,
          y: t * cardHeight,
        };
      } else {
        // 右上→左下
        return {
          x: (1 - t) * cardWidth,
          y: t * cardHeight,
        };
      }
    });
  };

  // 2本の対角線（バツ印: 左上→右下, 右上→左下）
  const diagonal1 = getDiagonalPositions('leftTopToRightBottom'); // 左上→右下
  const diagonal2 = getDiagonalPositions('rightTopToLeftBottom'); // 右上→左下

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{ width: cardWidth, height: cardHeight }}
    >
      <svg
        width={cardWidth}
        height={cardHeight}
        style={{ display: 'block', width: '100%', height: '100%' }}
      >
        {/* チェーン1（左上→右下） */}
        {diagonal1.map((pos, idx) => (
          <rect
            key={`chain1-${idx}`}
            x={pos.x - linkSize / 2}
            y={pos.y - linkSize / 2}
            width={linkSize}
            height={linkSize}
            rx={linkRadius}
            fill={linkColor}
            stroke={linkBorder}
            strokeWidth={1.5}
            opacity={0.95}
            filter="url(#chainShadow)"
          />
        ))}
        {/* チェーン2（右上→左下） */}
        {diagonal2.map((pos, idx) => (
          <rect
            key={`chain2-${idx}`}
            x={pos.x - linkSize / 2}
            y={pos.y - linkSize / 2}
            width={linkSize}
            height={linkSize}
            rx={linkRadius}
            fill={linkColor}
            stroke={linkBorder}
            strokeWidth={1.5}
            opacity={0.95}
            filter="url(#chainShadow)"
          />
        ))}
        {/* 中央の赤い輪 */}
        <circle
          cx={cardWidth / 2}
          cy={cardHeight / 2}
          r={ringRadius}
          fill="none"
          stroke={ringColor}
          strokeWidth={ringStroke}
          opacity={0.9}
          filter="url(#ringShadow)"
        />
        {/* SVGフィルタ（影） */}
        <defs>
          <filter id="chainShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="#990000" floodOpacity="0.5" />
          </filter>
          <filter id="ringShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#990000" floodOpacity="0.4" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
