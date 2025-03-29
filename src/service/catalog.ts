import { Catalog } from '@/type/game/Card'
import master from '../../catalog.json';

const catalog = new Map<string, Catalog>()
// Process each version of the master catalog
// @ts-expect-error だまれ
master.forEach((c: Catalog) => catalog.set(c.id, c))

export default catalog
