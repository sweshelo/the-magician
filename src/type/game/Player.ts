import { IAtom, IUnit } from '@/submodule/suit/types'

export interface Player {
  id: string
  name: string
  deck: IAtom[] // 非公開のため Card ではなく Atom
  hand: IAtom[] // 対戦相手は非公開のため Card ではなく Atom
  field: IUnit[]

  cp: {
    current: number
    max: number
  }

  life: {
    current: number
    max: number
  }
}
