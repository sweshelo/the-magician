import master from "@/submodule/suit/catalog/catalog";
import { IAtom, ICard } from "@/submodule/suit/types";

export const BackFlipedCard = ({
  card,
}: {
  card: ICard | (IAtom & { color: string });
}) => {
  const colors = {
    1: "red",
    2: "yellow",
    3: "blue",
    4: "green",
    5: "purple",
  };

  const isAtom = "color" in card;
  const color = isAtom
    ? card.color
    : colors[master.get(card.catalogId)?.color as keyof typeof colors];

  return (
    <div
      className="w-19 h-26 border-1 border-white rounded-sm bg-gray-800"
      style={{
        backgroundImage: `url('/image/card/back/${color}.png')`,
        backgroundSize: "cover",
      }}
    />
  );
};
