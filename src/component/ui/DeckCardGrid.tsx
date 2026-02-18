import { getImageUrl } from '@/helper/image';
import master from '@/submodule/suit/catalog/catalog';

const JOKER_TABLE = [
  { suffix: '1st', color: 'border-cyan-500' },
  { suffix: '2nd', color: 'border-yellow-500' },
];

interface DeckCardGridProps {
  cards: string[];
  jokers?: string[];
}

export const DeckCardGrid = ({ cards, jokers }: DeckCardGridProps) => {
  return (
    <>
      <div
        className="bg-slate-800/35 w-full p-4 overflow-auto border-y-3 border-white p-3 box-border"
        style={{
          height: `688px`,
          transition: 'opacity 100ms ease-in-out',
        }}
      >
        <div className="flex justify-center">
          <div className={`flex flex-wrap justify-start gap-2`} style={{ width: 1192 }}>
            {cards?.map((catalogId, index) => (
              <div
                key={`deck-preview-${catalogId}-${index}`}
                className={`w-28 h-39 border-2 border-slate-600 rounded justify-center items-center text-slate-500 relative dnd-clickable`}
                style={{
                  backgroundImage: `url(${getImageUrl(catalogId)})`,
                  backgroundSize: 'cover',
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {jokers && jokers.length > 0 && (
        <div className="flex gap-2 flex-col items-center my-3">
          <div className="text-center text-lg">JOKER</div>
          <div className="flex gap-10 justify-center">
            {jokers.map((catalogId, index) => {
              return (
                <div
                  key={catalogId}
                  className={`w-90 border ${JOKER_TABLE[index].color} text-bold px-5 py-1`}
                >
                  {JOKER_TABLE[index].suffix}: {master.get(catalogId)?.id}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
