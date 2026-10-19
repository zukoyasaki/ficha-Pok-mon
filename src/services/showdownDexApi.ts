import { PokemonType } from '../types/pokemon';

export type MoveCategoryType = 'level' | 'tm' | 'egg' | 'past_gen';

export interface ShowdownMoveDetail {
  id: string;
  name: string;
  type: PokemonType;
  category: 'Physical' | 'Special' | 'Status';
  basePower: number | null;
  accuracy: number | null;
  pp?: number | null;
  desc?: string;
  level?: number | null; // For level-up moves
  learnMethod: MoveCategoryType;
  learnMethodLabel: string;
  sourceDetail?: string; // e.g. "Nv. 36", "TM/TR", "Ovo", "Gen 7 Tutor"
}

export interface PokemonFullLearnset {
  levelUp: ShowdownMoveDetail[];
  tmHm: ShowdownMoveDetail[];
  egg: ShowdownMoveDetail[];
  pastGen: ShowdownMoveDetail[];
  allMoves: ShowdownMoveDetail[];
}

// In-memory cache for Showdown datasets
let learnsetsCache: Record<string, { learnset?: Record<string, string[]> }> | null = null;
let movesCache: Record<string, any> | null = null;
let pokedexCache: Record<string, { prevo?: string; baseSpecies?: string }> | null = null;
let isFetchingShowdownData = false;
const pendingPromises: Array<() => void> = [];

// Per-pokemon full moves cache
const pokemonFullLearnsetCache = new Map<string, PokemonFullLearnset>();

export async function preloadShowdownData(): Promise<void> {
  if (learnsetsCache && movesCache && pokedexCache) return;

  if (isFetchingShowdownData) {
    return new Promise((resolve) => {
      pendingPromises.push(resolve);
    });
  }

  isFetchingShowdownData = true;

  try {
    const [learnsetsRes, movesRes, pokedexRes] = await Promise.all([
      fetch('https://play.pokemonshowdown.com/data/learnsets.json'),
      fetch('https://play.pokemonshowdown.com/data/moves.json'),
      fetch('https://play.pokemonshowdown.com/data/pokedex.json'),
    ]);

    if (learnsetsRes.ok && movesRes.ok) {
      learnsetsCache = await learnsetsRes.json();
      movesCache = await movesRes.json();
    }
    if (pokedexRes.ok) {
      pokedexCache = await pokedexRes.json();
    }
  } catch (err) {
    console.warn('Failed to fetch Showdown Dex data, using PokeAPI fallback', err);
  } finally {
    isFetchingShowdownData = false;
    while (pendingPromises.length > 0) {
      const resolve = pendingPromises.shift();
      if (resolve) resolve();
    }
  }
}

/**
 * Normalizes Pokemon names to match Showdown's internal ID format.
 */
export function toShowdownId(name: string): string {
  let clean = name.toLowerCase().trim();
  // Handle localized regional suffixes
  clean = clean.replace(/\s+de\s+alola/g, 'alola');
  clean = clean.replace(/\s+de\s+galar/g, 'galar');
  clean = clean.replace(/\s+de\s+hisui/g, 'hisui');
  clean = clean.replace(/\s+de\s+paldea/g, 'paldea');
  // Strip special characters
  return clean.replace(/[^a-z0-9]/g, '');
}

/**
 * Fetches and groups all moves for a Pokémon from dex.pokemonshowdown.com:
 * - Level-up moves (com nível)
 * - TM / HM moves (aprendidos por Máquina Técnica / Oculta)
 * - Egg moves (aprendidos por Ovo / Herança genética própria ou de pré-evoluções)
 * - Past Generations (aprendidos em gerações anteriores, tutors clássicos ou transferências)
 */
export async function getPokemonFullShowdownMoves(
  pokemonName: string,
  pokemonId?: number
): Promise<PokemonFullLearnset> {
  const showdownKey = toShowdownId(pokemonName);

  if (pokemonFullLearnsetCache.has(showdownKey)) {
    return pokemonFullLearnsetCache.get(showdownKey)!;
  }

  // Ensure Showdown datasets are loaded
  await preloadShowdownData();

  if (learnsetsCache && movesCache) {
    const pokeData =
      learnsetsCache[showdownKey] ||
      (pokemonName.includes('-')
        ? learnsetsCache[pokemonName.replace(/-/g, '')]
        : null);

    if (pokeData && pokeData.learnset) {
      // Collect all chain learnsets (self + pre-evolutions) to capture Egg moves accurately
      const allChainLearnsets: Array<{ id: string; learnset: Record<string, string[]> }> = [];
      let curKey: string | undefined = showdownKey;

      while (curKey) {
        if (learnsetsCache[curKey]?.learnset) {
          allChainLearnsets.push({ id: curKey, learnset: learnsetsCache[curKey].learnset! });
        }
        const prevo: string | undefined = pokedexCache?.[curKey]?.prevo;
        curKey = prevo ? toShowdownId(prevo) : undefined;
      }

      const selfLearnset = pokeData.learnset;

      const levelUp: ShowdownMoveDetail[] = [];
      const tmHm: ShowdownMoveDetail[] = [];
      const egg: ShowdownMoveDetail[] = [];
      const pastGen: ShowdownMoveDetail[] = [];

      // Collect all unique moves across self and pre-evolutions
      const allMoveKeys = new Set<string>();
      allChainLearnsets.forEach((chain) => {
        Object.keys(chain.learnset).forEach((k) => allMoveKeys.add(k));
      });

      for (const moveId of allMoveKeys) {
        const moveInfo = movesCache[moveId] || {};
        const moveName = moveInfo.name || moveId.charAt(0).toUpperCase() + moveId.slice(1);
        const type = (moveInfo.type ? moveInfo.type.toLowerCase() : 'normal') as PokemonType;
        const category = (moveInfo.category || 'Physical') as
          | 'Physical'
          | 'Special'
          | 'Status';

        const baseMove: Omit<ShowdownMoveDetail, 'learnMethod' | 'learnMethodLabel'> = {
          id: moveId,
          name: moveName,
          type,
          category,
          basePower: moveInfo.basePower && moveInfo.basePower > 0 ? moveInfo.basePower : null,
          accuracy:
            typeof moveInfo.accuracy === 'number' && moveInfo.accuracy > 0
              ? moveInfo.accuracy
              : null,
          pp: moveInfo.pp || 15,
          desc: moveInfo.shortDesc || moveInfo.desc || '',
        };

        const selfMethods = selfLearnset[moveId] || [];

        // 1. Check Level-up (prefer Gen 9 or latest available)
        let levelLearned: number | null = null;
        let highestGen = -1;
        let hasGen9TM = false;
        let hasAnyTM = false;
        let hasGen9Method = false;

        for (const m of selfMethods) {
          const match = m.match(/^(\d+)L(\d+)$/);
          if (match) {
            const gen = parseInt(match[1], 10);
            const lvl = parseInt(match[2], 10);
            if (gen > highestGen) {
              highestGen = gen;
              levelLearned = lvl;
            }
          }
          if (m.startsWith('9M')) hasGen9TM = true;
          if (m.includes('M')) hasAnyTM = true;
          if (m.startsWith('9')) hasGen9Method = true;
        }

        if (levelLearned !== null) {
          levelUp.push({
            ...baseMove,
            level: levelLearned,
            learnMethod: 'level',
            learnMethodLabel: levelLearned === 0 ? 'Evolução' : `Nv. ${levelLearned}`,
            sourceDetail: levelLearned === 0 ? 'Na Evolução' : `Aprendido no Nível ${levelLearned}`,
          });
        }

        // 2. Check TM / HM (Gen 9 TM, or TM if Pokemon is in current gen)
        if (hasGen9TM || (hasAnyTM && hasGen9Method)) {
          tmHm.push({
            ...baseMove,
            learnMethod: 'tm',
            learnMethodLabel: 'TM / HM',
            sourceDetail: 'Máquina Técnica (TM / HM)',
          });
        }

        // 3. Check Egg move (in self or any pre-evolution)
        let isEgg = false;
        for (const chain of allChainLearnsets) {
          const methods = chain.learnset[moveId] || [];
          if (methods.some((code) => code.includes('E'))) {
            isEgg = true;
            break;
          }
        }

        if (isEgg) {
          egg.push({
            ...baseMove,
            learnMethod: 'egg',
            learnMethodLabel: 'Ovo (Egg Move)',
            sourceDetail: 'Movimento de Cruzamento / Herança por Ovo',
          });
        }

        // 4. Check Past Generations (Moves learned only in past generations / tutors / transfers)
        if (!hasGen9Method && selfMethods.length > 0) {
          pastGen.push({
            ...baseMove,
            learnMethod: 'past_gen',
            learnMethodLabel: 'Gen Passada',
            sourceDetail: 'Gerações Passadas / Move Tutor Antigo / Transferência',
          });
        } else if (hasAnyTM && !hasGen9TM && !hasGen9Method) {
          pastGen.push({
            ...baseMove,
            learnMethod: 'past_gen',
            learnMethodLabel: 'TM Passado',
            sourceDetail: 'TM em Gerações Anteriores',
          });
        }
      }

      // Sort
      levelUp.sort((a, b) => (a.level ?? 0) - (b.level ?? 0) || a.name.localeCompare(b.name));
      tmHm.sort((a, b) => a.name.localeCompare(b.name));
      egg.sort((a, b) => a.name.localeCompare(b.name));
      pastGen.sort((a, b) => a.name.localeCompare(b.name));

      // Build unified allMoves (distinct by ID, preserving primary method)
      const allMovesMap = new Map<string, ShowdownMoveDetail>();
      levelUp.forEach((m) => allMovesMap.set(m.id, m));
      tmHm.forEach((m) => {
        if (!allMovesMap.has(m.id)) allMovesMap.set(m.id, m);
      });
      egg.forEach((m) => {
        if (!allMovesMap.has(m.id)) allMovesMap.set(m.id, m);
      });
      pastGen.forEach((m) => {
        if (!allMovesMap.has(m.id)) allMovesMap.set(m.id, m);
      });

      const allMoves = Array.from(allMovesMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      const result: PokemonFullLearnset = {
        levelUp,
        tmHm,
        egg,
        pastGen,
        allMoves,
      };

      pokemonFullLearnsetCache.set(showdownKey, result);
      return result;
    }
  }

  // Fallback to PokeAPI
  if (pokemonId) {
    try {
      const fallbackLearnset = await fetchFullMovesFromPokeAPI(pokemonId);
      pokemonFullLearnsetCache.set(showdownKey, fallbackLearnset);
      return fallbackLearnset;
    } catch (e) {
      console.warn('PokeAPI fallback learnset failed:', e);
    }
  }

  return {
    levelUp: [],
    tmHm: [],
    egg: [],
    pastGen: [],
    allMoves: [],
  };
}

/**
 * Backward compatibility: returns just level up moves
 */
export async function getPokemonShowdownLevelMoves(
  pokemonName: string,
  pokemonId?: number
): Promise<ShowdownMoveDetail[]> {
  const full = await getPokemonFullShowdownMoves(pokemonName, pokemonId);
  return full.levelUp;
}

// PokeAPI fallback parser for Level, TM/HM, Egg, and Past Gen/Tutor
async function fetchFullMovesFromPokeAPI(pokemonId: number): Promise<PokemonFullLearnset> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
  if (!res.ok) {
    return { levelUp: [], tmHm: [], egg: [], pastGen: [], allMoves: [] };
  }
  const data = await res.json();

  const levelUp: ShowdownMoveDetail[] = [];
  const tmHm: ShowdownMoveDetail[] = [];
  const egg: ShowdownMoveDetail[] = [];
  const pastGen: ShowdownMoveDetail[] = [];
  const allMovesMap = new Map<string, ShowdownMoveDetail>();

  for (const m of data.moves) {
    const moveName = m.move.name
      .split('-')
      .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');

    const vgs = m.version_group_details || [];
    const hasLevel = vgs.find((v: any) => v.move_learn_method.name === 'level-up');
    const hasTM = vgs.find((v: any) => v.move_learn_method.name === 'machine');
    const hasEgg = vgs.find((v: any) => v.move_learn_method.name === 'egg');
    const hasTutor = vgs.find((v: any) => v.move_learn_method.name === 'tutor');

    const baseMove: Omit<ShowdownMoveDetail, 'learnMethod' | 'learnMethodLabel'> = {
      id: m.move.name,
      name: moveName,
      type: 'normal',
      category: 'Physical',
      basePower: null,
      accuracy: null,
      pp: 15,
    };

    if (hasLevel) {
      const item: ShowdownMoveDetail = {
        ...baseMove,
        level: hasLevel.level_learned_at,
        learnMethod: 'level',
        learnMethodLabel: `Nv. ${hasLevel.level_learned_at}`,
        sourceDetail: `Aprendido no Nível ${hasLevel.level_learned_at}`,
      };
      levelUp.push(item);
      allMovesMap.set(item.id, item);
    }

    if (hasTM) {
      const item: ShowdownMoveDetail = {
        ...baseMove,
        learnMethod: 'tm',
        learnMethodLabel: 'TM / HM',
        sourceDetail: 'Máquina Técnica (TM / HM)',
      };
      tmHm.push(item);
      if (!allMovesMap.has(item.id)) allMovesMap.set(item.id, item);
    }

    if (hasEgg) {
      const item: ShowdownMoveDetail = {
        ...baseMove,
        learnMethod: 'egg',
        learnMethodLabel: 'Ovo',
        sourceDetail: 'Movimento de Ovo',
      };
      egg.push(item);
      if (!allMovesMap.has(item.id)) allMovesMap.set(item.id, item);
    }

    if (hasTutor || (!hasLevel && !hasTM && !hasEgg)) {
      const item: ShowdownMoveDetail = {
        ...baseMove,
        learnMethod: 'past_gen',
        learnMethodLabel: 'Gen Passada / Tutor',
        sourceDetail: 'Move Tutor / Gerações Passadas',
      };
      pastGen.push(item);
      if (!allMovesMap.has(item.id)) allMovesMap.set(item.id, item);
    }
  }

  levelUp.sort((a, b) => (a.level ?? 0) - (b.level ?? 0));
  tmHm.sort((a, b) => a.name.localeCompare(b.name));
  egg.sort((a, b) => a.name.localeCompare(b.name));
  pastGen.sort((a, b) => a.name.localeCompare(b.name));

  return {
    levelUp,
    tmHm,
    egg,
    pastGen,
    allMoves: Array.from(allMovesMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
  };
}
