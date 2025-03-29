// catalog.json 生成

const base = 'https://coj.sega.jp/player/card/data/card_list_'
const pages = [
  "Ver.2.3EX2.json",
  "Ver.2.3EX1.json",
  "Ver.2.3.json",
  "Ver.2.2EX.json",
  "Ver.2.2.json",
  "Ver.2.1EX.json",
  "Ver.2.1.json",
  "Ver.2.0EX3.json",
  "Ver.2.0EX2.json",
  "Ver.2.0EX1.json",
  "Ver.2.0.json",
  "Ver.1.4EX3.json",
  "Ver.1.4EX2.json",
  "Ver.1.4EX1.json",
  "Ver.1.4.json",
  "Ver.1.3EX2.json",
  "Ver.1.3EX1.json",
  "Ver.1.3.json",
  "Ver.1.2EX.json",
  "Ver.1.2.json",
  "Classic.json",
  "Sp.json",
  // "joker.json",
  // "virus.json", - カードNo.がないので取得しない
  // "interceptunit.json", - カードNo.がないので取得しない
  "PR.json"
]

async function main() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cards: any[] = [];
  for await (const url of pages) {
    const response = await fetch(`${base}${url}`)
    const { card: _cards } = await response.json()
    cards = [...cards, ..._cards]
  }

  // 当システムにおけるデータ形式に変換
  console.log(JSON.stringify(cards.map((card) => {
    const species = [card.species, card.species2].filter(v => v !== '-')
    const bp = [card.bp1, card.bp2, card.bp3].filter(v => v > 0)
    return {
      id: card.viewNo,
      name: card.name,
      rarity: card.rarity,
      type: card.type,
      color: card.cId,
      species: species.length ? species : undefined,
      cost: card.cp,
      bp: bp.length ? bp : undefined,
      ability: card.ability
        .replace(/<br>/g, '\n')
        .replace(/[Ａ-Ｚａ-ｚ０-９％＋－]/g, (s: string) =>
          String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
        )
        .trim(),
      originality: card.op,
      img: card.lImg.replace('../img', ''),
      info: {
        version: card.ver,
        number: card.no,
      },
    };
  }).sort((a, b) => a.info.version - b.info.version)))
}

main()
