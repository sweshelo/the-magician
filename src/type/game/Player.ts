import { IUnit } from '@/submodule/suit/types'
import { Atom } from './Card'

export interface Player {
  id: string
  name: string
  deck: Atom[] // 非公開のため Card ではなく Atom
  hand: Atom[] // 対戦相手は非公開のため Card ではなく Atom
  field: IUnit[]
}
