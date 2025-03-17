export interface Atom {
  id: string
}

export interface Card extends Atom {
  catalogId: string
}

export interface Catalog {
  id: string;
  name: string
  cost: number
  color: number
  bp: [number, number, number] | undefined
  text: string;
  image: string // mock only
  type: 'Unit' | 'Trigger'
}