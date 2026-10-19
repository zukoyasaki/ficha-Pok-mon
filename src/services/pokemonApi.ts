import { INITIAL_POKEMON_LIST } from '../data/pokemonData';
import { PokemonData, PokemonSummary, PokemonType } from '../types/pokemon';
import allPokemonRaw from '../data/allPokemonList.json';
import { REGIONAL_FORMS_LIST, getPokemonRegionInfo } from '../data/regionalPokemon';

// Combine base 1025 Pokémon with regional forms (Alola, Galar, Hisui, Paldea)
export const ALL_POKEMON_LIST: PokemonSummary[] = [
  ...(allPokemonRaw as PokemonSummary[]).map((p) => {
    const reg = getPokemonRegionInfo(p.id);
    return {
      ...p,
      region: reg.regionName,
      isRegional: reg.isRegionalForm,
    };
  }),
  ...REGIONAL_FORMS_LIST,
];

// In-memory cache for full Pokémon details
const detailsCache = new Map<number, PokemonData>();

// Seed with initial curated list
INITIAL_POKEMON_LIST.forEach((p) => {
  detailsCache.set(p.id, p);
});

export function getPokemonArtwork(id: number, isShiny = false): string {
  if (isShiny) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`;
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function getPokemonSprite(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getPokemonAnimatedGif(id: number, isShiny = false): string {
  if (isShiny) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${id}.gif`;
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
}

export async function fetchPokemonDetails(id: number): Promise<PokemonData> {
  // Check cache first
  if (detailsCache.has(id)) {
    return detailsCache.get(id)!;
  }

  const summary = ALL_POKEMON_LIST.find((p) => p.id === id);
  const fallbackDisplayName = summary
    ? summary.displayName
    : `Pokemon #${id}`;
  const fallbackTypes: PokemonType[] = summary ? summary.types : ['normal'];
  const fallbackGen = summary ? summary.gen : 1;

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) throw new Error('PokeAPI response not ok');
    const data = await res.json();

    const types = data.types.map((t: { type: { name: string } }) => t.type.name as PokemonType);
    const abilities = data.abilities.map((a: { ability: { name: string } }) =>
      a.ability.name.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
    );
    const moves = data.moves.slice(0, 15).map((m: { move: { name: string } }) =>
      m.move.name.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
    );

    const statMap: Record<string, number> = {};
    for (const s of data.stats) {
      statMap[s.stat.name] = s.base_stat;
    }

    const regInfo = getPokemonRegionInfo(id);

    const pokemon: PokemonData = {
      id: data.id,
      name: data.name,
      displayName: fallbackDisplayName,
      types: types.length > 0 ? types : fallbackTypes,
      sprite: data.sprites.front_default || getPokemonSprite(data.id),
      artwork:
        data.sprites.other?.['official-artwork']?.front_default ||
        getPokemonArtwork(data.id, false),
      shinyArtwork:
        data.sprites.other?.['official-artwork']?.front_shiny ||
        getPokemonArtwork(data.id, true),
      stats: {
        hp: statMap['hp'] || 70,
        attack: statMap['attack'] || 70,
        defense: statMap['defense'] || 70,
        spAttack: statMap['special-attack'] || 70,
        spDefense: statMap['special-defense'] || 70,
        speed: statMap['speed'] || 70,
      },
      height: data.height ? data.height / 10 : 1.0,
      weight: data.weight ? data.weight / 10 : 20.0,
      abilities: abilities.length > 0 ? abilities : ['Adaptação', 'Foco'],
      suggestedMoves:
        moves.length >= 6
          ? moves
          : [
              ...moves,
              'Ataque Rápido',
              'Proteção',
              'Investida',
              'Descanso',
              'Substituto',
              'Tóxico',
            ].slice(0, 6),
      generation: fallbackGen,
      region: regInfo.regionName,
      isRegional: regInfo.isRegionalForm,
    };

    detailsCache.set(id, pokemon);
    return pokemon;
  } catch (err) {
    console.warn(`Fallback used for Pokemon #${id}:`, err);
    const regInfo = getPokemonRegionInfo(id);
    // Offline or network failure fallback
    const fallbackPokemon: PokemonData = {
      id,
      name: summary ? summary.name : `pokemon-${id}`,
      displayName: fallbackDisplayName,
      types: fallbackTypes,
      sprite: getPokemonSprite(id),
      artwork: getPokemonArtwork(id, false),
      shinyArtwork: getPokemonArtwork(id, true),
      stats: { hp: 75, attack: 75, defense: 75, spAttack: 75, spDefense: 75, speed: 75 },
      height: 1.0,
      weight: 25.0,
      abilities: ['Pressão', 'Foco Interno'],
      suggestedMoves: ['Ataque Rápido', 'Golpe Físico', 'Investida', 'Proteção'],
      generation: fallbackGen,
      region: regInfo.regionName,
      isRegional: regInfo.isRegionalForm,
    };
    detailsCache.set(id, fallbackPokemon);
    return fallbackPokemon;
  }
}

// Type effectiveness table for defenses
// Values: 2 = weak (takes 2x), 0.5 = resists (takes 0.5x), 0 = immune (takes 0x), 1 = neutral
export const TYPE_CHART: Record<PokemonType, Partial<Record<PokemonType, number>>> = {
  normal: { fighting: 2, ghost: 0 },
  fire: { water: 2, ground: 2, rock: 2, fire: 0.5, grass: 0.5, ice: 0.5, bug: 0.5, steel: 0.5, fairy: 0.5 },
  water: { electric: 2, grass: 2, fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5 },
  grass: { fire: 2, ice: 2, poison: 2, flying: 2, bug: 2, water: 0.5, electric: 0.5, grass: 0.5, ground: 0.5 },
  electric: { ground: 2, electric: 0.5, flying: 0.5, steel: 0.5 },
  ice: { fire: 2, fighting: 2, rock: 2, steel: 2, ice: 0.5 },
  fighting: { flying: 2, psychic: 2, fairy: 2, bug: 0.5, rock: 0.5, dark: 0.5 },
  poison: { ground: 2, psychic: 2, grass: 0.5, fighting: 0.5, poison: 0.5, bug: 0.5, fairy: 0.5 },
  ground: { water: 2, grass: 2, ice: 2, poison: 0.5, rock: 0.5, electric: 0 },
  flying: { electric: 2, ice: 2, rock: 2, grass: 0.5, fighting: 0.5, bug: 0.5, ground: 0 },
  psychic: { bug: 2, ghost: 2, dark: 2, fighting: 0.5, psychic: 0.5 },
  bug: { fire: 2, flying: 2, rock: 2, grass: 0.5, fighting: 0.5, ground: 0.5 },
  rock: { water: 2, grass: 2, fighting: 2, ground: 2, steel: 2, normal: 0.5, fire: 0.5, poison: 0.5, flying: 0.5 },
  ghost: { ghost: 2, dark: 2, poison: 0.5, bug: 0.5, normal: 0, fighting: 0 },
  dragon: { ice: 2, dragon: 2, fairy: 2, fire: 0.5, water: 0.5, grass: 0.5, electric: 0.5 },
  steel: { fire: 2, fighting: 2, ground: 2, normal: 0.5, grass: 0.5, ice: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 0.5, dragon: 0.5, steel: 0.5, fairy: 0.5, poison: 0 },
  dark: { fighting: 2, bug: 2, fairy: 2, ghost: 0.5, dark: 0.5, psychic: 0 },
  fairy: { poison: 2, steel: 2, fighting: 0.5, bug: 0.5, dark: 0.5, dragon: 0 },
};

export function calculateDefensiveMultiplier(defenderTypes: PokemonType[], attackType: PokemonType): number {
  let multiplier = 1;
  for (const defType of defenderTypes) {
    const table = TYPE_CHART[defType];
    if (table && table[attackType] !== undefined) {
      multiplier *= table[attackType]!;
    }
  }
  return multiplier;
}
