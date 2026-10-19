import { PokemonType } from '../types/pokemon';

export interface MoveDexEntry {
  id: string;
  num: number;
  name: string;
  type: PokemonType;
  category: 'Physical' | 'Special' | 'Status';
  basePower: number;
  accuracy: number | true; // true means does not check accuracy (e.g. Swift)
  pp: number;
  priority: number;
  target?: string;
  desc: string;
}

let cachedMovesList: MoveDexEntry[] | null = null;
let isFetchingMoves = false;
const pendingMovesResolvers: Array<() => void> = [];

export async function fetchAllShowdownMoves(): Promise<MoveDexEntry[]> {
  if (cachedMovesList) {
    return cachedMovesList;
  }

  if (isFetchingMoves) {
    return new Promise((resolve) => {
      pendingMovesResolvers.push(() => resolve(cachedMovesList || []));
    });
  }

  isFetchingMoves = true;

  try {
    const [movesRes, textRes] = await Promise.all([
      fetch('https://play.pokemonshowdown.com/data/moves.json'),
      fetch('https://raw.githubusercontent.com/smogon/pokemon-showdown/master/data/text/moves.ts').catch(
        () => null
      ),
    ]);

    if (!movesRes.ok) {
      throw new Error(`Failed to fetch Showdown moves: ${movesRes.status}`);
    }

    const rawMoves = await movesRes.json();

    // Parse descriptions from text/moves.ts if available
    const descMap = new Map<string, string>();
    if (textRes && textRes.ok) {
      try {
        const textRaw = await textRes.text();
        const regex = /([a-z0-9]+):\s*\{([^}]+)\}/g;
        let match;
        while ((match = regex.exec(textRaw)) !== null) {
          const id = match[1];
          const block = match[2];
          const shortDescMatch = block.match(/shortDesc:\s*"([^"]+)"/);
          const descMatch = block.match(/desc:\s*"([^"]+)"/);
          const finalDesc = shortDescMatch ? shortDescMatch[1] : descMatch ? descMatch[1] : '';
          if (finalDesc) {
            descMap.set(id, finalDesc);
          }
        }
      } catch (err) {
        console.warn('Could not parse moves text:', err);
      }
    }

    const result: MoveDexEntry[] = [];

    for (const [id, m] of Object.entries<any>(rawMoves)) {
      // Exclude nonstandard moves like Pokestar, G-Max, or internal moves
      if (m.isNonstandard && m.isNonstandard !== 'Past') {
        continue;
      }
      if (!m.name || !m.type || !m.category) {
        continue;
      }

      const typeKey = (m.type ? m.type.toLowerCase() : 'normal') as PokemonType;
      const category = (m.category || 'Physical') as 'Physical' | 'Special' | 'Status';

      result.push({
        id,
        num: m.num || 0,
        name: m.name,
        type: typeKey,
        category,
        basePower: m.basePower || 0,
        accuracy: typeof m.accuracy === 'number' ? m.accuracy : true,
        pp: m.pp || 15,
        priority: m.priority || 0,
        target: m.target || 'normal',
        desc: descMap.get(id) || m.desc || m.shortDesc || 'Movimento oficial Pokémon.',
      });
    }

    // Sort alphabetically by name by default
    result.sort((a, b) => a.name.localeCompare(b.name));
    cachedMovesList = result;
    return result;
  } catch (error) {
    console.error('Error fetching MoveDex:', error);
    return [];
  } finally {
    isFetchingMoves = false;
    while (pendingMovesResolvers.length > 0) {
      const res = pendingMovesResolvers.shift();
      if (res) res();
    }
  }
}
