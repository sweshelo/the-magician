export interface Atom {
  id: string
}

export interface Card extends Atom {
  catalogId: string
}

export interface Catalog {
  id: number
  ref: string
  name: string
  cost: number
  color: number
  bp?: [number, number, number]
  ability: string
  type: 'unit' | 'trigger' | 'intercept' | 'advanced_unit'
  species?: string[]
  version?: string
}
