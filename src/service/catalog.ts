import { Catalog } from "@/type/game/Card";

// モックカードデータ
const catalog = new Map<string, Catalog>();

const data: Catalog[] = [
  {
    id: '1-0-001',
    name: 'ブラッドハウンド',
    cost: 1,
    color: 1,
    bp: [3000, 4000, 5000],
    text: '■ダメージブレイク\nこのユニットがオーバークロックした時、対戦相手のユニットを1体選ぶ。それに4000ダメージを与える。',
    image: '🐕️',
    type: 'Unit',
  },
  {
    id: '2-3-128',
    name: '戦乙女ジャンヌダルク',
    cost: 4,
    color: 4,
    bp: [4000, 5000, 6000],
    text: '【不屈】\n■戦女神の誓い\n自身は効果によるダメージを受けず、そのダメージをこのユニットの基本ＢＰに＋する。\n■オルレアンの一撃\n自身がフィールドに出た時、ＢＰを＋［あなたの受けているライフダメージ×１０００］し、対戦相手のユニットを１体選ぶ。それの基本ＢＰをこのユニットのＢＰ分－する。\n自身がオーバークロックした時、対戦相手の全てのユニットの基本ＢＰを－３０００し、【攻撃禁止】を与える。',
    image: '🏋️‍♀️',
    type: 'Unit',
  }
]

data.forEach(c => catalog.set(c.id, c));

export default catalog;