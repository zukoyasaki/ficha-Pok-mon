import { PokemonSummary, PokemonType } from '../types/pokemon';

export interface RegionDefinition {
  id: string;
  name: string;
  gen: number;
  generationLabel: string;
  rangeLabel: string;
  startId: number;
  endId: number;
  count: number;
  color: string;
  bgBadge: string;
  description: string;
}

export const REGIONS_LIST: RegionDefinition[] = [
  {
    id: 'kanto',
    name: 'Kanto',
    gen: 1,
    generationLabel: '1ª Geração',
    rangeLabel: '#001 - #151',
    startId: 1,
    endId: 151,
    count: 151,
    color: 'from-rose-600 to-red-700',
    bgBadge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    description: 'Bulbasaur a Mew. A clássica região original.',
  },
  {
    id: 'johto',
    name: 'Johto',
    gen: 2,
    generationLabel: '2ª Geração',
    rangeLabel: '#152 - #251',
    startId: 152,
    endId: 251,
    count: 100,
    color: 'from-amber-500 to-yellow-600',
    bgBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    description: 'Chikorita a Celebi. Tradições antigas e torres lendárias.',
  },
  {
    id: 'hoenn',
    name: 'Hoenn',
    gen: 3,
    generationLabel: '3ª Geração',
    rangeLabel: '#252 - #386',
    startId: 252,
    endId: 386,
    count: 135,
    color: 'from-emerald-600 to-teal-700',
    bgBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'Treecko a Deoxys. Terra, mar e clima dinâmico.',
  },
  {
    id: 'sinnoh',
    name: 'Sinnoh',
    gen: 4,
    generationLabel: '4ª Geração',
    rangeLabel: '#387 - #493',
    startId: 387,
    endId: 493,
    count: 107,
    color: 'from-blue-600 to-indigo-700',
    bgBadge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    description: 'Turtwig a Arceus. Mitologia da criação, tempo e espaço.',
  },
  {
    id: 'unova',
    name: 'Unova',
    gen: 5,
    generationLabel: '5ª Geração',
    rangeLabel: '#494 - #649',
    startId: 494,
    endId: 649,
    count: 156,
    color: 'from-slate-600 to-zinc-800',
    bgBadge: 'bg-slate-400/20 text-slate-200 border-slate-400/40',
    description: 'Victini a Genesect. Metrópoles modernas e natureza vasta.',
  },
  {
    id: 'kalos',
    name: 'Kalos',
    gen: 6,
    generationLabel: '6ª Geração',
    rangeLabel: '#650 - #721',
    startId: 650,
    endId: 721,
    count: 72,
    color: 'from-pink-600 to-fuchsia-700',
    bgBadge: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    description: 'Chespin a Volcanion. Elegância, beleza e Mega Evolução.',
  },
  {
    id: 'alola',
    name: 'Alola',
    gen: 7,
    generationLabel: '7ª Geração',
    rangeLabel: '#722 - #809',
    startId: 722,
    endId: 809,
    count: 88,
    color: 'from-orange-500 to-amber-600',
    bgBadge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    description: 'Rowlet a Melmetal. O arquipélago tropical e Z-Moves.',
  },
  {
    id: 'galar',
    name: 'Galar & Hisui',
    gen: 8,
    generationLabel: '8ª Geração',
    rangeLabel: '#810 - #905',
    startId: 810,
    endId: 905,
    count: 96,
    color: 'from-cyan-600 to-sky-700',
    bgBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    description: 'Grookey a Enamorus. Estádios épicos e passado ancestral.',
  },
  {
    id: 'paldea',
    name: 'Paldea',
    gen: 9,
    generationLabel: '9ª Geração',
    rangeLabel: '#906 - #1025',
    startId: 906,
    endId: 1025,
    count: 120,
    color: 'from-violet-600 to-purple-800',
    bgBadge: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    description: 'Sprigatito a Pecharunt. O mundo aberto e Terastalização.',
  },
  {
    id: 'regional_forms',
    name: 'Formas Regionais',
    gen: 0,
    generationLabel: 'Variantes Regionais',
    rangeLabel: 'Alola · Galar · Hisui · Paldea',
    startId: 10000,
    endId: 10999,
    count: 51,
    color: 'from-emerald-500 via-cyan-500 to-violet-600',
    bgBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'Adaptações e aparências únicas exclusivas de cada região.',
  },
];

export const REGIONAL_FORMS_LIST: PokemonSummary[] = [
  // --- ALOLA FORMS (Gen 7) ---
  { id: 10091, name: 'rattata-alola', displayName: 'Rattata de Alola', gen: 7, types: ['dark', 'normal'], region: 'Alola', isRegional: true },
  { id: 10092, name: 'raticate-alola', displayName: 'Raticate de Alola', gen: 7, types: ['dark', 'normal'], region: 'Alola', isRegional: true },
  { id: 10100, name: 'raichu-alola', displayName: 'Raichu de Alola', gen: 7, types: ['electric', 'psychic'], region: 'Alola', isRegional: true },
  { id: 10101, name: 'sandshrew-alola', displayName: 'Sandshrew de Alola', gen: 7, types: ['ice', 'steel'], region: 'Alola', isRegional: true },
  { id: 10102, name: 'sandslash-alola', displayName: 'Sandslash de Alola', gen: 7, types: ['ice', 'steel'], region: 'Alola', isRegional: true },
  { id: 10103, name: 'vulpix-alola', displayName: 'Vulpix de Alola', gen: 7, types: ['ice'], region: 'Alola', isRegional: true },
  { id: 10104, name: 'ninetales-alola', displayName: 'Ninetales de Alola', gen: 7, types: ['ice', 'fairy'], region: 'Alola', isRegional: true },
  { id: 10105, name: 'diglett-alola', displayName: 'Diglett de Alola', gen: 7, types: ['ground', 'steel'], region: 'Alola', isRegional: true },
  { id: 10106, name: 'dugtrio-alola', displayName: 'Dugtrio de Alola', gen: 7, types: ['ground', 'steel'], region: 'Alola', isRegional: true },
  { id: 10107, name: 'meowth-alola', displayName: 'Meowth de Alola', gen: 7, types: ['dark'], region: 'Alola', isRegional: true },
  { id: 10108, name: 'persian-alola', displayName: 'Persian de Alola', gen: 7, types: ['dark'], region: 'Alola', isRegional: true },
  { id: 10109, name: 'geodude-alola', displayName: 'Geodude de Alola', gen: 7, types: ['rock', 'electric'], region: 'Alola', isRegional: true },
  { id: 10110, name: 'graveler-alola', displayName: 'Graveler de Alola', gen: 7, types: ['rock', 'electric'], region: 'Alola', isRegional: true },
  { id: 10111, name: 'golem-alola', displayName: 'Golem de Alola', gen: 7, types: ['rock', 'electric'], region: 'Alola', isRegional: true },
  { id: 10112, name: 'grimer-alola', displayName: 'Grimer de Alola', gen: 7, types: ['poison', 'dark'], region: 'Alola', isRegional: true },
  { id: 10113, name: 'muk-alola', displayName: 'Muk de Alola', gen: 7, types: ['poison', 'dark'], region: 'Alola', isRegional: true },
  { id: 10114, name: 'exeggutor-alola', displayName: 'Exeggutor de Alola', gen: 7, types: ['grass', 'dragon'], region: 'Alola', isRegional: true },
  { id: 10115, name: 'marowak-alola', displayName: 'Marowak de Alola', gen: 7, types: ['fire', 'ghost'], region: 'Alola', isRegional: true },

  // --- GALAR FORMS (Gen 8) ---
  { id: 10161, name: 'meowth-galar', displayName: 'Meowth de Galar', gen: 8, types: ['steel'], region: 'Galar', isRegional: true },
  { id: 10162, name: 'ponyta-galar', displayName: 'Ponyta de Galar', gen: 8, types: ['psychic'], region: 'Galar', isRegional: true },
  { id: 10163, name: 'rapidash-galar', displayName: 'Rapidash de Galar', gen: 8, types: ['psychic', 'fairy'], region: 'Galar', isRegional: true },
  { id: 10164, name: 'slowpoke-galar', displayName: 'Slowpoke de Galar', gen: 8, types: ['psychic'], region: 'Galar', isRegional: true },
  { id: 10165, name: 'slowbro-galar', displayName: 'Slowbro de Galar', gen: 8, types: ['poison', 'psychic'], region: 'Galar', isRegional: true },
  { id: 10166, name: 'farfetchd-galar', displayName: "Farfetch'd de Galar", gen: 8, types: ['fighting'], region: 'Galar', isRegional: true },
  { id: 10167, name: 'weezing-galar', displayName: 'Weezing de Galar', gen: 8, types: ['poison', 'fairy'], region: 'Galar', isRegional: true },
  { id: 10168, name: 'mr-mime-galar', displayName: 'Mr. Mime de Galar', gen: 8, types: ['ice', 'psychic'], region: 'Galar', isRegional: true },
  { id: 10169, name: 'articuno-galar', displayName: 'Articuno de Galar', gen: 8, types: ['psychic', 'flying'], region: 'Galar', isRegional: true },
  { id: 10170, name: 'zapdos-galar', displayName: 'Zapdos de Galar', gen: 8, types: ['fighting', 'flying'], region: 'Galar', isRegional: true },
  { id: 10171, name: 'moltres-galar', displayName: 'Moltres de Galar', gen: 8, types: ['dark', 'flying'], region: 'Galar', isRegional: true },
  { id: 10172, name: 'slowking-galar', displayName: 'Slowking de Galar', gen: 8, types: ['poison', 'psychic'], region: 'Galar', isRegional: true },
  { id: 10173, name: 'corsola-galar', displayName: 'Corsola de Galar', gen: 8, types: ['ghost'], region: 'Galar', isRegional: true },
  { id: 10174, name: 'zigzagoon-galar', displayName: 'Zigzagoon de Galar', gen: 8, types: ['dark', 'normal'], region: 'Galar', isRegional: true },
  { id: 10175, name: 'linoone-galar', displayName: 'Linoone de Galar', gen: 8, types: ['dark', 'normal'], region: 'Galar', isRegional: true },
  { id: 10176, name: 'darumaka-galar', displayName: 'Darumaka de Galar', gen: 8, types: ['ice'], region: 'Galar', isRegional: true },
  { id: 10177, name: 'darmanitan-galar', displayName: 'Darmanitan de Galar', gen: 8, types: ['ice'], region: 'Galar', isRegional: true },
  { id: 10178, name: 'yamask-galar', displayName: 'Yamask de Galar', gen: 8, types: ['ground', 'ghost'], region: 'Galar', isRegional: true },
  { id: 10179, name: 'stunfisk-galar', displayName: 'Stunfisk de Galar', gen: 8, types: ['ground', 'steel'], region: 'Galar', isRegional: true },

  // --- HISUI FORMS (Gen 8) ---
  { id: 10229, name: 'growlithe-hisui', displayName: 'Growlithe de Hisui', gen: 8, types: ['fire', 'rock'], region: 'Hisui', isRegional: true },
  { id: 10230, name: 'arcanine-hisui', displayName: 'Arcanine de Hisui', gen: 8, types: ['fire', 'rock'], region: 'Hisui', isRegional: true },
  { id: 10231, name: 'voltorb-hisui', displayName: 'Voltorb de Hisui', gen: 8, types: ['electric', 'grass'], region: 'Hisui', isRegional: true },
  { id: 10232, name: 'electrode-hisui', displayName: 'Electrode de Hisui', gen: 8, types: ['electric', 'grass'], region: 'Hisui', isRegional: true },
  { id: 10233, name: 'typhlosion-hisui', displayName: 'Typhlosion de Hisui', gen: 8, types: ['fire', 'ghost'], region: 'Hisui', isRegional: true },
  { id: 10234, name: 'qwilfish-hisui', displayName: 'Qwilfish de Hisui', gen: 8, types: ['dark', 'poison'], region: 'Hisui', isRegional: true },
  { id: 10235, name: 'sneasel-hisui', displayName: 'Sneasel de Hisui', gen: 8, types: ['fighting', 'poison'], region: 'Hisui', isRegional: true },
  { id: 10236, name: 'samurott-hisui', displayName: 'Samurott de Hisui', gen: 8, types: ['water', 'dark'], region: 'Hisui', isRegional: true },
  { id: 10237, name: 'lilligant-hisui', displayName: 'Lilligant de Hisui', gen: 8, types: ['grass', 'fighting'], region: 'Hisui', isRegional: true },
  { id: 10238, name: 'zorua-hisui', displayName: 'Zorua de Hisui', gen: 8, types: ['normal', 'ghost'], region: 'Hisui', isRegional: true },
  { id: 10239, name: 'zoroark-hisui', displayName: 'Zoroark de Hisui', gen: 8, types: ['normal', 'ghost'], region: 'Hisui', isRegional: true },
  { id: 10240, name: 'braviary-hisui', displayName: 'Braviary de Hisui', gen: 8, types: ['psychic', 'flying'], region: 'Hisui', isRegional: true },
  { id: 10241, name: 'sliggoo-hisui', displayName: 'Sliggoo de Hisui', gen: 8, types: ['steel', 'dragon'], region: 'Hisui', isRegional: true },
  { id: 10242, name: 'goodra-hisui', displayName: 'Goodra de Hisui', gen: 8, types: ['steel', 'dragon'], region: 'Hisui', isRegional: true },
  { id: 10243, name: 'avalugg-hisui', displayName: 'Avalugg de Hisui', gen: 8, types: ['ice', 'rock'], region: 'Hisui', isRegional: true },
  { id: 10244, name: 'decidueye-hisui', displayName: 'Decidueye de Hisui', gen: 8, types: ['grass', 'fighting'], region: 'Hisui', isRegional: true },

  // --- PALDEA FORMS (Gen 9) ---
  { id: 10250, name: 'tauros-paldea-combat', displayName: 'Tauros de Paldea (Combate)', gen: 9, types: ['fighting'], region: 'Paldea', isRegional: true },
  { id: 10251, name: 'tauros-paldea-blaze', displayName: 'Tauros de Paldea (Fogo)', gen: 9, types: ['fighting', 'fire'], region: 'Paldea', isRegional: true },
  { id: 10252, name: 'tauros-paldea-aqua', displayName: 'Tauros de Paldea (Água)', gen: 9, types: ['fighting', 'water'], region: 'Paldea', isRegional: true },
  { id: 10253, name: 'wooper-paldea', displayName: 'Wooper de Paldea', gen: 9, types: ['poison', 'ground'], region: 'Paldea', isRegional: true },
];

export function getPokemonRegionInfo(id: number): {
  regionName: string;
  gen: number;
  generationLabel: string;
  badgeStyle: string;
  isRegionalForm: boolean;
} {
  if (id >= 10000) {
    if (id >= 10091 && id <= 10115) {
      return {
        regionName: 'Alola',
        gen: 7,
        generationLabel: '7ª Geração (Forma Alola)',
        badgeStyle: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
        isRegionalForm: true,
      };
    }
    if (id >= 10161 && id <= 10179) {
      return {
        regionName: 'Galar',
        gen: 8,
        generationLabel: '8ª Geração (Forma Galar)',
        badgeStyle: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        isRegionalForm: true,
      };
    }
    if (id >= 10229 && id <= 10244) {
      return {
        regionName: 'Hisui',
        gen: 8,
        generationLabel: '8ª Geração (Forma Hisui)',
        badgeStyle: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
        isRegionalForm: true,
      };
    }
    return {
      regionName: 'Paldea',
      gen: 9,
      generationLabel: '9ª Geração (Forma Paldea)',
      badgeStyle: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
      isRegionalForm: true,
    };
  }

  if (id <= 151) {
    return {
      regionName: 'Kanto',
      gen: 1,
      generationLabel: '1ª Geração (Kanto)',
      badgeStyle: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      isRegionalForm: false,
    };
  }
  if (id <= 251) {
    return {
      regionName: 'Johto',
      gen: 2,
      generationLabel: '2ª Geração (Johto)',
      badgeStyle: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      isRegionalForm: false,
    };
  }
  if (id <= 386) {
    return {
      regionName: 'Hoenn',
      gen: 3,
      generationLabel: '3ª Geração (Hoenn)',
      badgeStyle: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      isRegionalForm: false,
    };
  }
  if (id <= 493) {
    return {
      regionName: 'Sinnoh',
      gen: 4,
      generationLabel: '4ª Geração (Sinnoh)',
      badgeStyle: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      isRegionalForm: false,
    };
  }
  if (id <= 649) {
    return {
      regionName: 'Unova',
      gen: 5,
      generationLabel: '5ª Geração (Unova)',
      badgeStyle: 'bg-slate-400/20 text-slate-200 border-slate-400/40',
      isRegionalForm: false,
    };
  }
  if (id <= 721) {
    return {
      regionName: 'Kalos',
      gen: 6,
      generationLabel: '6ª Geração (Kalos)',
      badgeStyle: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
      isRegionalForm: false,
    };
  }
  if (id <= 809) {
    return {
      regionName: 'Alola',
      gen: 7,
      generationLabel: '7ª Geração (Alola)',
      badgeStyle: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      isRegionalForm: false,
    };
  }
  if (id <= 905) {
    return {
      regionName: 'Galar',
      gen: 8,
      generationLabel: '8ª Geração (Galar)',
      badgeStyle: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      isRegionalForm: false,
    };
  }
  return {
    regionName: 'Paldea',
    gen: 9,
    generationLabel: '9ª Geração (Paldea)',
    badgeStyle: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    isRegionalForm: false,
  };
}
