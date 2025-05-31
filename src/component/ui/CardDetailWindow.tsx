'use client';

import master from '@/submodule/suit/catalog/catalog';
import classNames from 'classnames';
import { colorTable, getColorCode } from '@/helper/color';
import Image from 'next/image';
import { useSystemContext } from '@/hooks/system/hooks';
import { useDraggable } from '@dnd-kit/core';
import { Dispatch, SetStateAction, useState } from 'react';
import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import keywordsData from '@/submodule/suit/catalog/keywords.json';
import { BattleIconDetail } from './BattleIconsView';
import { Tooltip } from 'react-tooltip';
import DOMPurify from 'dompurify';
import { ICard } from '@/submodule/suit/types';

interface LevelProps {
  lv: number;
  bp?: number;
  active?: boolean;
}
export const Level = ({ bp, lv, active }: LevelProps) => {
  return (
    <div
      className={classNames(
        'flex rounded h-6 flex-1 items-center justify-center text-xs font-bold mr-1 px-4',
        {
          'bg-red-700': active,
          'bg-slate-600': !active,
        }
      )}
    >
      <div className="flex-1">Lv.{lv}</div>
      <div className="flex-1 text-right text-xl">{bp}</div>
    </div>
  );
};

export const CardDetailWindow = () => {
  const { detailCard, setDetailCard, detailPosition } = useSystemContext();
  const [abilityMode, setAbilityMode] = useState(true);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `card-detail-${detailCard?.id || 'window'}`,
    disabled: !detailCard,
    data: {
      type: 'card-detail-window',
      cardId: detailCard?.catalogId,
    },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    left: `${detailPosition.x}px`,
    top: `${detailPosition.y}px`,
  };

  // If no card is selected, don't render anything
  if (!detailCard) return null;

  return (
    <div
      ref={setNodeRef}
      className={`fixed w-100 ${colorTable.ui.playerInfoBackground} rounded-lg shadow-lg z-50 border ${colorTable.ui.border} overflow-hidden`}
      style={style}
    >
      <AbilityPane
        attributes={attributes}
        listeners={listeners}
        catalogId={detailCard.catalogId}
        setDetailCard={setDetailCard}
        abilityMode={abilityMode}
        setAbilityMode={setAbilityMode}
      />
    </div>
  );
};

// 関連アビリティを表示するコンポーネント
const RelatedAbilities = ({ abilityText, isVirus }: { abilityText: string; isVirus: boolean }) => {
  // HTMLタグを削除してプレーンテキストを取得
  const plainText = abilityText.replace(/<[^>]*>/g, '');

  // キーワード一覧から、テキスト内に含まれるキーワードを検索 (matcherフィールドを使用)
  const foundKeywords = keywordsData.filter(keyword => {
    // ウイルスカードの場合は特定のキーワードを除外する可能性も考慮
    if (isVirus && keyword.title === 'virus_specific_keyword') {
      return false;
    }
    return plainText.includes(`${keyword.matcher}`);
  });

  // 見つかったキーワードがない場合は何も表示しない
  if (foundKeywords.length === 0) return null;

  return (
    <div className="my-3">
      <div className="text-sm font-bold mb-1">関連アビリティ</div>
      <div className="flex flex-wrap gap-2">
        {foundKeywords.map((keyword, index) => (
          <div key={index} className="inline-block">
            <Image
              src={
                keyword['no-image']
                  ? '/image/icon/no-image.png'
                  : `/image/icon/${keyword.title}.png`
              }
              alt={''}
              width={24}
              height={24}
              className="inline-block"
              data-tooltip-id={`ability-tooltip-${keyword.title}`}
            />
            <Tooltip id={`ability-tooltip-${keyword.title}`} place="top" className="z-50 max-w-xs">
              <BattleIconDetail name={keyword.title} />
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  );
};

const AbilityPane = ({
  attributes,
  listeners,
  catalogId,
  setDetailCard,
  abilityMode,
  setAbilityMode,
}: {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
  catalogId: string;
  setDetailCard: Dispatch<SetStateAction<ICard | undefined>>;
  abilityMode: boolean;
  setAbilityMode: Dispatch<SetStateAction<boolean>>;
}) => {
  const cardType = {
    unit: 'ユニットカード',
    advanced_unit: '進化カード',
    trigger: 'トリガーカード',
    intercept: 'インターセプトカード',
    virus: 'ウィルスユニット',
    joker: 'ジョーカーカード',
  };

  const catalog = master.get(catalogId);
  return catalog && abilityMode ? (
    <>
      {/* ウィンドウヘッダー */}
      <div
        className={`flex justify-between items-center p-3 h-20 ${colorTable.ui.background} cursor-move`}
        style={{
          backgroundImage: process.env.NEXT_PUBLIC_IMAGE_SELF_HOSTING
            ? `url(https://coj.sega.jp/player/img/${master.get(catalogId)?.img})`
            : `url(/image/card/full/${catalogId}.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: '0% -140px',
        }}
        {...attributes}
        {...listeners}
        onDoubleClick={() => setAbilityMode(false)}
      >
        <div className="rounded-sm border-3 border-gray">
          <div
            className={`w-6 h-6 flex items-center justify-center font-bold ${getColorCode(catalog.color)}`}
          >
            {catalog.cost}
          </div>
        </div>
        <h3 className="font-bold bg-black/50 px-6 py-2 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <span className="mr-2">{catalog.name}</span>
            {catalog.type !== 'virus' && catalog.type !== 'joker' && (
              <Image
                src={`https://coj.sega.jp/player/images/common/card/r_${catalog.rarity}.png`}
                alt={catalog.rarity}
                width={32}
                height={32}
              />
            )}
          </div>
          <span className="text-xs mt-1">
            {`${cardType[catalog.type]} - ${catalog.id} ${catalog.species ? '| ' + catalog.species.join(' / ') : ''}`}
          </span>
        </h3>
        <button
          onClick={() => setDetailCard(undefined)}
          onTouchStart={() => setDetailCard(undefined)}
          className={`${colorTable.ui.text.secondary} hover:${colorTable.ui.text.primary} cursor-pointer`}
        >
          ✕
        </button>
      </div>

      {/* カード情報 */}
      <div className="p-4 h-60">
        {/* 効果 */}
        <div className="mb-3">
          {/* スクロール可能なテキストエリア */}
          <div className="h-42 overflow-y-auto mb-2">
            <p
              className={`text-sm rounded whitespace-pre-wrap select-text`}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(catalog.ability, { ALLOWED_TAGS: ['span'] }),
              }}
            />
            {/* 関連アビリティ */}
            {catalog.ability && (
              <RelatedAbilities abilityText={catalog.ability} isVirus={catalog.type === 'virus'} />
            )}
          </div>
        </div>

        {/* BP */}
        {catalog.type !== 'joker' && (
          <div className="justify-between">
            <div className="flex flex-row items-center">
              <Level lv={1} bp={catalog.bp && catalog.bp[0]} active={true} />
              <Level lv={2} bp={catalog.bp && catalog.bp[1]} />
              <Level lv={3} bp={catalog.bp && catalog.bp[2]} />
            </div>
          </div>
        )}
      </div>
    </>
  ) : (
    <ImagePane
      attributes={attributes}
      listeners={listeners}
      catalogId={catalogId}
      setAbilityMode={setAbilityMode}
    />
  );
};

const ImagePane = ({
  attributes,
  listeners,
  catalogId,
  setAbilityMode,
}: {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
  catalogId: string;
  setAbilityMode: Dispatch<SetStateAction<boolean>>;
}) => {
  const catalog = master.get(catalogId);

  if (!catalog) return null;

  const handleClick = () => {
    setAbilityMode(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Handle tablet touch end event with small delay to ensure it's not part of a drag
    e.preventDefault();
    setTimeout(() => {
      setAbilityMode(true);
    }, 10);
  };

  return (
    <div
      className={`flex justify-between items-center p-3 h-140 ${colorTable.ui.background} cursor-pointer`}
      style={{
        backgroundImage: process.env.NEXT_PUBLIC_IMAGE_SELF_HOSTING
          ? `url(https://coj.sega.jp/player/img/${master.get(catalogId)?.img})`
          : `url(/image/card/full/${catalogId}.jpg)`,
        backgroundSize: 'cover',
      }}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
    />
  );
};
