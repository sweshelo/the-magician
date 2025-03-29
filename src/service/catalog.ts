import { Catalog } from '@/type/game/Card'
import master from '../../catalog.json';

interface CardMaster {
  id: number;
  ref: string;
  name: string;
  rare: string
  type: string
  color: string
  species?: string[]
  cost: number
  bp?: number[]
  ability: string
}

const transformColor = (colorString: string) => {
  switch (colorString) {
    case '赤属性':
      return 1;
    case '黄属性':
      return 2;
    case '青属性':
      return 3;
    case '緑属性':
      return 4;
    case '紫属性':
      return 5;
    case '無属性':
    default:
      return 0;
  }
}

const catalog = new Map<string, Catalog>()
// Process each version of the master catalog
Object.entries(master).forEach(([version, cards]) => {
  cards.map((card: CardMaster): Catalog => {
    const [bp1, bp2, bp3] = card.bp ?? []
    return ({
      ...card,
      bp: card.bp ? [bp1, bp2, bp3] : undefined,
      type: card.type as Catalog['type'],
      color: transformColor(card.color),
      version, // Add version information from master's key
    })
  }).forEach(c => catalog.set(c.ref, c))
})

export default catalog
