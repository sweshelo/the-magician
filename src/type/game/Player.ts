// FIXME: このファイルがあるのはおかしい。Submoduleに移行すべき。

import { IAtom, ICard, IUnit } from '@/submodule/suit/types'

export interface Player {
  id: string
  name: string
  deck: IAtom[] // 非公開のため Card ではなく Atom
  hand: IAtom[] // 対戦相手は非公開のため Card ではなく Atom
  field: IUnit[]
  trash: ICard[]

  cp: {
    current: number
    max: number
  }

  life: {
    current: number
    max: number
  }
}
