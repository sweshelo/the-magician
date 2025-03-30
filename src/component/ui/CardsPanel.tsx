import { ICard } from "@/submodule/suit/types"
import { CardView } from "./CardView"

interface CardsPanelProps {
  cards: ICard[]
}

export const CardsPanel = ({ cards }: CardsPanelProps) => {
  return (cards.map(card => (
    <CardView card={card} key={card.id} />
  )))
}