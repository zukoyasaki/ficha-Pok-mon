import { PokemonType } from '../types/pokemon';

export interface TrainerPreset {
  id: string;
  name: string;
  trainerClass: string;
  region: string;
  avatarUrl: string;
  battleQuote: string;
  favoriteType: PokemonType;
  level: number;
}

export const TRAINER_PRESETS: TrainerPreset[] = [
  {
    id: 'red',
    name: 'Red',
    trainerClass: 'Campeão Lendário',
    region: 'Kanto',
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/red.png',
    battleQuote: '...',
    favoriteType: 'fire',
    level: 88,
  },
  {
    id: 'cynthia',
    name: 'Cynthia',
    trainerClass: 'Campeã da Liga',
    region: 'Sinnoh',
    avatarUrl: 'https://play.pokemonshowdown.com/sprites/trainers/cynthia.png',
    battleQuote: 'Este confronto me inspirou! Mostre-me todo o poder do seu elo!',
    favoriteType: 'dragon',
    level: 78,
  },
  {
    id: 'ash',
    name: 'Ash Ketchum',
    trainerClass: 'Mestre Pokémon',
    region: 'Kanto',
    avatarUrl: 'https://play.pokemonshowdown.com/sprites/trainers/ash.png',
    battleQuote: 'Pikachu, eu escolho você! Vamos vencer juntos!',
    favoriteType: 'electric',
    level: 80,
  },
  {
    id: 'blue',
    name: 'Blue Oak',
    trainerClass: 'Líder de Ginásio',
    region: 'Kanto',
    avatarUrl: 'https://play.pokemonshowdown.com/sprites/trainers/blue.png',
    battleQuote: 'Até mais, perdedores! Eu sou o melhor treinador do mundo!',
    favoriteType: 'water',
    level: 75,
  },
  {
    id: 'steven',
    name: 'Steven Stone',
    trainerClass: 'Especialista em Minerais',
    region: 'Hoenn',
    avatarUrl: 'https://play.pokemonshowdown.com/sprites/trainers/steven.png',
    battleQuote: 'No final, eu sou o mais forte e o que vai mais fundo nas pedras preciosas.',
    favoriteType: 'steel',
    level: 77,
  },
  {
    id: 'dawn',
    name: 'Dawn',
    trainerClass: 'Coordenadora Pokémon',
    region: 'Sinnoh',
    avatarUrl: 'https://play.pokemonshowdown.com/sprites/trainers/dawn.png',
    battleQuote: 'Sem problemas! Brilharemos nos palcos e nos ginásios!',
    favoriteType: 'water',
    level: 65,
  },
  {
    id: 'leon',
    name: 'Leon',
    trainerClass: 'Campeão Invicto',
    region: 'Galar',
    avatarUrl: 'https://play.pokemonshowdown.com/sprites/trainers/leon.png',
    battleQuote: 'Vamos fazer deste o momento mais eletrizante de todos!',
    favoriteType: 'fire',
    level: 85,
  },
  {
    id: 'hilda',
    name: 'Hilda',
    trainerClass: 'Treinadora Veterana',
    region: 'Unova',
    avatarUrl: 'https://play.pokemonshowdown.com/sprites/trainers/hilda.png',
    battleQuote: 'Minha equipe e eu treinamos duro para este momento!',
    favoriteType: 'fighting',
    level: 70,
  },
  {
    id: 'nemona',
    name: 'Nemona',
    trainerClass: 'Treinadora Classe Campeã',
    region: 'Paldea',
    avatarUrl: 'https://play.pokemonshowdown.com/sprites/trainers/nemona.png',
    battleQuote: 'Você quer batalhar agora mesmo?! Vamos logo, mal posso esperar!',
    favoriteType: 'fighting',
    level: 68,
  },
  {
    id: 'lance',
    name: 'Lance',
    trainerClass: 'Mestre dos Dragões',
    region: 'Johto',
    avatarUrl: 'https://play.pokemonshowdown.com/sprites/trainers/lance.png',
    battleQuote: 'A fúria dos dragões rugirá na arena!',
    favoriteType: 'dragon',
    level: 76,
  },
];

export const TRAINER_CLASSES = [
  'Treinador Ace',
  'Líder de Ginásio',
  'Campeão da Liga',
  'Elite dos Quatro',
  'Mestre Pokémon',
  'Pesquisador Pokémon',
  'Criador Pokémon',
  'Patrulheiro / Ranger',
  'Coordenador Pokémon',
  'Treinador Novato',
  'Veterano de Batalha',
  'Membro da Equipe Rocket',
  'Cientista da Silph S.A.',
  'Pescador Lendário',
  'Treinador Dragão',
  'Colecionador de Pokémon',
];

export interface ElementalBadge {
  id: string;
  name: string;
  element: string;
  color: string;
  symbol: string;
  iconName: 'Flame' | 'Leaf' | 'Skull' | 'Ghost' | 'Feather' | 'Eye' | 'Shield' | 'Zap';
}

export const TRAINER_BADGES: ElementalBadge[] = [
  { id: 'fire', name: 'Fogo', element: 'Fogo', color: '#F97316', symbol: '🔥', iconName: 'Flame' },
  { id: 'grass', name: 'Grama', element: 'Grama', color: '#22C55E', symbol: '🌿', iconName: 'Leaf' },
  { id: 'poison', name: 'Veneno', element: 'Veneno', color: '#A855F7', symbol: '☠️', iconName: 'Skull' },
  { id: 'ghost', name: 'Fantasma', element: 'Fantasma', color: '#818CF8', symbol: '👻', iconName: 'Ghost' },
  { id: 'flying', name: 'Voador', element: 'Voador', color: '#38BDF8', symbol: '🪽', iconName: 'Feather' },
  { id: 'psychic', name: 'Psychic', element: 'Psychic', color: '#EC4899', symbol: '👁️', iconName: 'Eye' },
  { id: 'metal', name: 'Metal', element: 'Metal', color: '#94A3B8', symbol: '🛡️', iconName: 'Shield' },
  { id: 'electric', name: 'Elétrico', element: 'Elétrico', color: '#EAB308', symbol: '⚡', iconName: 'Zap' },
];

export const REGIONS_LIST = [
  'Kanto',
  'Johto',
  'Hoenn',
  'Sinnoh',
  'Unova',
  'Kalos',
  'Alola',
  'Galar',
  'Paldea',
];

export const REGION_BADGES: Record<string, { id: string; name: string; color: string }[]> = {
  Kanto: [
    { id: 'boulder', name: 'Rocha (Brock)', color: '#9E9E9E' },
    { id: 'cascade', name: 'Cascata (Misty)', color: '#29B6F6' },
    { id: 'thunder', name: 'Trovão (Lt. Surge)', color: '#FDD835' },
    { id: 'rainbow', name: 'Arco-Íris (Erika)', color: '#66BB6A' },
    { id: 'soul', name: 'Alma (Koga)', color: '#AB47BC' },
    { id: 'marsh', name: 'Pântano (Sabrina)', color: '#EC407A' },
    { id: 'volcano', name: 'Vulcão (Blaine)', color: '#EF5350' },
    { id: 'earth', name: 'Terra (Giovanni)', color: '#8D6E63' },
  ],
  Johto: [
    { id: 'zephyr', name: 'Zéfiro', color: '#90CAF9' },
    { id: 'hive', name: 'Colmeia', color: '#A5D6A7' },
    { id: 'plain', name: 'Planície', color: '#E0E0E0' },
    { id: 'fog', name: 'Nevoeiro', color: '#B39DDB' },
    { id: 'storm', name: 'Tempestade', color: '#FFE082' },
    { id: 'mineral', name: 'Mineral', color: '#B0BEC5' },
    { id: 'glacier', name: 'Geleira', color: '#80DEEA' },
    { id: 'rising', name: 'Ascensão', color: '#9FA8DA' },
  ],
  Hoenn: [
    { id: 'stone', name: 'Pedra', color: '#BCAAA4' },
    { id: 'knuckle', name: 'Punho', color: '#FFAB91' },
    { id: 'dynamo', name: 'Dínamo', color: '#FFF59D' },
    { id: 'heat', name: 'Calor', color: '#FF8A80' },
    { id: 'balance', name: 'Equilíbrio', color: '#E0E0E0' },
    { id: 'feather', name: 'Pena', color: '#B3E5FC' },
    { id: 'mind', name: 'Mente', color: '#F48FB1' },
    { id: 'rain', name: 'Chuva', color: '#81D4FA' },
  ],
  Sinnoh: [
    { id: 'coal', name: 'Carvão', color: '#616161' },
    { id: 'forest', name: 'Floresta', color: '#81C784' },
    { id: 'cobble', name: 'Paralelepípedo', color: '#A1887F' },
    { id: 'fen', name: 'Brejo', color: '#4DD0E1' },
    { id: 'relic', name: 'Relíquia', color: '#CE93D8' },
    { id: 'mine', name: 'Mina', color: '#90A4AE' },
    { id: 'icicle', name: 'Estalactite', color: '#E0F7FA' },
    { id: 'beacon', name: 'Farol', color: '#FFF176' },
  ],
  Paldea: [
    { id: 'cortondo', name: 'Inseto (Cortondo)', color: '#C5E1A5' },
    { id: 'artazon', name: 'Planta (Artazon)', color: '#A5D6A7' },
    { id: 'levincia', name: 'Elétrico (Levincia)', color: '#FFF59D' },
    { id: 'cascarrafa', name: 'Água (Cascarrafa)', color: '#80D8FF' },
    { id: 'medali', name: 'Normal (Medali)', color: '#EEEEEE' },
    { id: 'montenevera', name: 'Fantasma (Montenevera)', color: '#D1C4E9' },
    { id: 'alfornada', name: 'Psíquico (Alfornada)', color: '#F8BBD0' },
    { id: 'glaseado', name: 'Gelo (Glaseado)', color: '#B2EBF2' },
  ],
};
