'use client';

import master from '@/submodule/suit/catalog/catalog';
import classNames from 'classnames';
import { defaultUIColors, getColorCode } from '@/helper/color';
import Image from 'next/image';
import { useSystemContext } from '@/hooks/system/hooks';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import keywordsData from '@/submodule/suit/catalog/keywords.json';
import { BattleIconDetail } from './BattleIconsView';
import { Tooltip } from 'react-tooltip';
import DOMPurify from 'dompurify';
import { ICard } from '@/submodule/suit/types';
import { getImageUrl } from '@/helper/image';
import { Rnd } from 'react-rnd';

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

interface CardDetailWindowProps {
  x?: number;
  y?: number;
}

// カードのアスペクト比に合わせた固定サイズ
const IMAGE_SIZE = { width: 300, height: 420 };
const ABILITY_SIZE = { width: 400, height: 340 };

export const CardDetailWindow = ({ x = 0, y = 0 }: CardDetailWindowProps) => {
  const { detailCard, setDetailCard, detailPosition } = useSystemContext();
  const [position, setPosition] = useState({ x, y });
  const [abilitySize, setAbilitySize] = useState(ABILITY_SIZE);
  const [imageSize, setImageSize] = useState(IMAGE_SIZE);
  const [abilityMode, setAbilityMode] = useState(true);
  const [previousCard, setPreviousCard] = useState<ICard | undefined>(undefined);

  // 現在のモードに応じたサイズを取得
  const currentSize = abilityMode ? abilitySize : imageSize;
  const setCurrentSize = abilityMode ? setAbilitySize : setImageSize;

  // 内部ナビゲーションかどうかを追跡
  const isInternalNavigation = useRef(false);
  // 前回のdetailCardを追跡（閉じて再度開いたときの検出用）
  const prevDetailCard = useRef(detailCard);

  // 外部からカードが変更された場合、履歴をクリア
  useEffect(() => {
    if (!isInternalNavigation.current) {
      setPreviousCard(undefined);
    }
    isInternalNavigation.current = false;
  }, [detailCard?.catalogId]);

  // カードが閉じられた後に再度開かれた場合、位置をリセット
  useEffect(() => {
    if (prevDetailCard.current === undefined && detailCard !== undefined) {
      setPosition(detailPosition);
    }
    prevDetailCard.current = detailCard;
  }, [detailCard, detailPosition]);

  // 関連カードに遷移する際、現在のカードを履歴に保存
  const navigateToRelatedCard = useCallback(
    (newCatalogId: string) => {
      if (detailCard) {
        setPreviousCard(detailCard);
      }
      isInternalNavigation.current = true;
      setDetailCard({
        id: `related-${newCatalogId}`,
        catalogId: newCatalogId,
        lv: 1,
      });
    },
    [detailCard, setDetailCard]
  );

  // 前のカードに戻る
  const goBackToPreviousCard = useCallback(() => {
    if (previousCard) {
      isInternalNavigation.current = true;
      setDetailCard(previousCard);
      setPreviousCard(undefined);
    }
  }, [previousCard, setDetailCard]);

  // If no card is selected, don't render anything
  if (!detailCard) return null;

  return (
    <Rnd
      style={{ position: 'fixed' }}
      size={currentSize}
      position={position}
      onDragStop={(_e, d) => setPosition({ x: d.x, y: d.y })}
      onResizeStop={(_e, _direction, ref, _delta, newPosition) => {
        setCurrentSize({ width: ref.offsetWidth, height: ref.offsetHeight });
        setPosition(newPosition);
      }}
      minWidth={abilityMode ? 320 : IMAGE_SIZE.width}
      minHeight={abilityMode ? 280 : IMAGE_SIZE.height}
      maxWidth={abilityMode ? 600 : IMAGE_SIZE.width}
      maxHeight={abilityMode ? 500 : IMAGE_SIZE.height}
      dragHandleClassName="drag-handle"
      enableResizing={abilityMode ? { bottomRight: true } : false}
      className={`${defaultUIColors.playerInfoBackground} rounded-lg shadow-lg z-50 border ${defaultUIColors.border} overflow-hidden`}
    >
      <div className="flex flex-col h-full w-full">
        <AbilityPane
          catalogId={detailCard.catalogId}
          setDetailCard={setDetailCard}
          abilityMode={abilityMode}
          setAbilityMode={setAbilityMode}
          onNavigateToRelated={navigateToRelatedCard}
          previousCard={previousCard}
          onGoBack={goBackToPreviousCard}
        />
        {/* リサイズハンドル（AbilityModeのみ表示） */}
        {abilityMode && (
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-center justify-center text-gray-500 text-xs">
            ⋱
          </div>
        )}
      </div>
    </Rnd>
  );
};

// 関連カードを表示するコンポーネント
const RelatedCards = ({
  relatedIds,
  onNavigate,
  previousCard,
  onGoBack,
}: {
  relatedIds: string[];
  onNavigate: (catalogId: string) => void;
  previousCard?: ICard;
  onGoBack: () => void;
}) => {
  // 関連カードのカタログを取得
  const relatedCatalogs = relatedIds
    .map(id => master.get(id))
    .filter((catalog): catalog is NonNullable<typeof catalog> => catalog !== undefined);

  const previousCatalog = previousCard ? master.get(previousCard.catalogId) : undefined;
  const hasContent = relatedCatalogs.length > 0 || previousCatalog;

  if (!hasContent) return null;

  return (
    <div className="my-3">
      <div className="text-sm font-bold mb-1">関連カード</div>
      <div className="flex flex-wrap gap-1">
        {/* 戻るボタン（前のカードがある場合） */}
        {previousCatalog && (
          <div
            className="cursor-pointer hover:opacity-80 transition-opacity relative"
            onClick={onGoBack}
            title={`← ${previousCatalog.name} に戻る`}
          >
            <Image
              src={getImageUrl(previousCatalog.id)}
              alt={previousCatalog.name}
              width={40}
              height={56}
              className="rounded-sm border-2 border-blue-500"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-sm">
              <span className="text-white text-lg font-bold">←</span>
            </div>
          </div>
        )}
        {/* 関連カード */}
        {relatedCatalogs.map(catalog => (
          <div
            key={catalog.id}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onNavigate(catalog.id)}
            title={catalog.name}
          >
            <Image
              src={getImageUrl(catalog.id)}
              alt={catalog.name}
              width={40}
              height={56}
              className="rounded-sm border border-gray-600"
            />
          </div>
        ))}
      </div>
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
  catalogId,
  setDetailCard,
  abilityMode,
  setAbilityMode,
  onNavigateToRelated,
  previousCard,
  onGoBack,
}: {
  catalogId: string;
  setDetailCard: Dispatch<SetStateAction<ICard | undefined>>;
  abilityMode: boolean;
  setAbilityMode: Dispatch<SetStateAction<boolean>>;
  onNavigateToRelated: (catalogId: string) => void;
  previousCard?: ICard;
  onGoBack: () => void;
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
        className={`drag-handle flex justify-between items-center p-3 h-20 ${defaultUIColors.background} cursor-move`}
        style={{
          backgroundImage: `url(${getImageUrl(catalogId)})`,
          backgroundSize: 'cover',
          backgroundPosition: '0% -140px',
        }}
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
          className={`${defaultUIColors.text.secondary} hover:${defaultUIColors.text.primary} cursor-pointer`}
        >
          ✕
        </button>
      </div>

      {/* カード情報 */}
      <div className="p-4 flex-1 flex flex-col overflow-hidden">
        {/* 効果 */}
        <div className="mb-3 flex-1 flex flex-col overflow-hidden">
          {/* スクロール可能なテキストエリア */}
          <div className="flex-1 overflow-y-auto mb-2">
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
            {/* 関連カード */}
            {(catalog.related || previousCard) && (
              <RelatedCards
                relatedIds={catalog.related || []}
                onNavigate={onNavigateToRelated}
                previousCard={previousCard}
                onGoBack={onGoBack}
              />
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
    <ImagePane catalogId={catalogId} setAbilityMode={setAbilityMode} />
  );
};

const ImagePane = ({
  catalogId,
  setAbilityMode,
}: {
  catalogId: string;
  setAbilityMode: Dispatch<SetStateAction<boolean>>;
}) => {
  const catalog = master.get(catalogId);

  if (!catalog) return null;

  return (
    <div
      className={`drag-handle flex justify-between items-center p-3 h-full ${defaultUIColors.background} cursor-move`}
      style={{
        backgroundImage: `url(${getImageUrl(catalogId, 'full')})`,
        backgroundSize: 'cover',
      }}
      onClick={() => setAbilityMode(true)}
    />
  );
};
