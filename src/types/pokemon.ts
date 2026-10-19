export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'steel'
  | 'dark'
  | 'fairy';

export interface PokemonBaseStats {
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
}

export interface PokemonSummary {
  id: number;
  name: string;
  displayName: string;
  gen: number;
  types: PokemonType[];
  region?: string;
  isRegional?: boolean;
}

export interface PokemonData {
  id: number;
  name: string;
  displayName: string;
  types: PokemonType[];
  sprite: string;
  artwork: string;
  shinyArtwork: string;
  stats: PokemonBaseStats;
  height: number; // in meters
  weight: number; // in kg
  abilities: string[];
  suggestedMoves: string[];
  generation: number;
  region?: string;
  isRegional?: boolean;
}

export interface PokemonEvs {
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
}

export interface TeamMember {
  slotId: string;
  pokemon: PokemonData;
  nickname: string;
  level: number;
  isShiny: boolean;
  heldItem: string;
  ability: string;
  moves: string[];
  gender: 'male' | 'female' | 'genderless';
  evs?: PokemonEvs;
  nature?: string;
}

export interface PokemonNature {
  id: string;
  name: string;
  label: string;
  plus?: keyof PokemonEvs;
  minus?: keyof PokemonEvs;
}

export const POKEMON_NATURES: PokemonNature[] = [
  { id: 'hardy', name: 'Hardy', label: 'Hardy (Neutro)' },
  { id: 'lonely', name: 'Lonely', plus: 'attack', minus: 'defense', label: 'Lonely (+Atk, -Def)' },
  { id: 'brave', name: 'Brave', plus: 'attack', minus: 'speed', label: 'Brave (+Atk, -Spe)' },
  { id: 'adamant', name: 'Adamant', plus: 'attack', minus: 'spAttack', label: 'Adamant (+Atk, -SpA)' },
  { id: 'naughty', name: 'Naughty', plus: 'attack', minus: 'spDefense', label: 'Naughty (+Atk, -SpD)' },
  { id: 'bold', name: 'Bold', plus: 'defense', minus: 'attack', label: 'Bold (+Def, -Atk)' },
  { id: 'docile', name: 'Docile', label: 'Docile (Neutro)' },
  { id: 'relaxed', name: 'Relaxed', plus: 'defense', minus: 'speed', label: 'Relaxed (+Def, -Spe)' },
  { id: 'impish', name: 'Impish', plus: 'defense', minus: 'spAttack', label: 'Impish (+Def, -SpA)' },
  { id: 'lax', name: 'Lax', plus: 'defense', minus: 'spDefense', label: 'Lax (+Def, -SpD)' },
  { id: 'timid', name: 'Timid', plus: 'speed', minus: 'attack', label: 'Timid (+Spe, -Atk)' },
  { id: 'hasty', name: 'Hasty', plus: 'speed', minus: 'defense', label: 'Hasty (+Spe, -Def)' },
  { id: 'serious', name: 'Serious', label: 'Serious (Neutro)' },
  { id: 'jolly', name: 'Jolly', plus: 'speed', minus: 'spAttack', label: 'Jolly (+Spe, -SpA)' },
  { id: 'naive', name: 'Naive', plus: 'speed', minus: 'spDefense', label: 'Naive (+Spe, -SpD)' },
  { id: 'modest', name: 'Modest', plus: 'spAttack', minus: 'attack', label: 'Modest (+SpA, -Atk)' },
  { id: 'mild', name: 'Mild', plus: 'spAttack', minus: 'defense', label: 'Mild (+SpA, -Def)' },
  { id: 'quiet', name: 'Quiet', plus: 'spAttack', minus: 'speed', label: 'Quiet (+SpA, -Spe)' },
  { id: 'bashful', name: 'Bashful', label: 'Bashful (Neutro)' },
  { id: 'rash', name: 'Rash', plus: 'spAttack', minus: 'spDefense', label: 'Rash (+SpA, -SpD)' },
  { id: 'calm', name: 'Calm', plus: 'spDefense', minus: 'attack', label: 'Calm (+SpD, -Atk)' },
  { id: 'gentle', name: 'Gentle', plus: 'spDefense', minus: 'defense', label: 'Gentle (+SpD, -Def)' },
  { id: 'sassy', name: 'Sassy', plus: 'spDefense', minus: 'speed', label: 'Sassy (+SpD, -Spe)' },
  { id: 'careful', name: 'Careful', plus: 'spDefense', minus: 'spAttack', label: 'Careful (+SpD, -SpA)' },
  { id: 'quirky', name: 'Quirky', label: 'Quirky (Neutro)' },
];

export interface BagItem {
  id: string;
  slotIndex: number; // 0 to 19 (20 slots total)
  name: string;
  quantity: number;
  imageUrl?: string;
  category?: 'pokeball' | 'medicine' | 'battle' | 'berry' | 'evolution' | 'general';
  description?: string;
}

export interface TrainerProfile {
  name: string;
  trainerClass: string;
  avatarUrl: string;
  badges: string[];
  favoriteType?: PokemonType;
  level?: number;
  region?: string;
  battleQuote?: string;
  idNumber?: string;
}

export interface TrainerSheet {
  id: string;
  name: string;
  profile: TrainerProfile;
  team: (TeamMember | null)[];
  box: TeamMember[];
  bag?: BagItem[];
  createdAt: number;
  updatedAt: number;
}

export const TYPE_COLORS: Record<PokemonType, { bg: string; text: string; border: string; glow: string; label: string }> = {
  normal: { bg: 'bg-stone-500', text: 'text-stone-100', border: 'border-stone-400', glow: 'rgba(168, 168, 120, 0.4)', label: 'Normal' },
  fire: { bg: 'bg-orange-600', text: 'text-orange-50', border: 'border-orange-400', glow: 'rgba(240, 128, 48, 0.5)', label: 'Fogo' },
  water: { bg: 'bg-blue-600', text: 'text-blue-50', border: 'border-blue-400', glow: 'rgba(104, 144, 240, 0.5)', label: 'Água' },
  grass: { bg: 'bg-emerald-600', text: 'text-emerald-50', border: 'border-emerald-400', glow: 'rgba(120, 200, 80, 0.5)', label: 'Planta' },
  electric: { bg: 'bg-amber-500', text: 'text-amber-950', border: 'border-amber-300', glow: 'rgba(248, 208, 48, 0.6)', label: 'Elétrico' },
  ice: { bg: 'bg-cyan-500', text: 'text-cyan-950', border: 'border-cyan-300', glow: 'rgba(152, 216, 216, 0.5)', label: 'Gelo' },
  fighting: { bg: 'bg-red-700', text: 'text-red-50', border: 'border-red-400', glow: 'rgba(192, 48, 40, 0.5)', label: 'Lutador' },
  poison: { bg: 'bg-purple-600', text: 'text-purple-50', border: 'border-purple-400', glow: 'rgba(160, 64, 160, 0.5)', label: 'Venenoso' },
  ground: { bg: 'bg-yellow-700', text: 'text-yellow-50', border: 'border-yellow-500', glow: 'rgba(224, 192, 104, 0.5)', label: 'Terrestre' },
  flying: { bg: 'bg-indigo-400', text: 'text-indigo-950', border: 'border-indigo-300', glow: 'rgba(168, 144, 240, 0.5)', label: 'Voador' },
  psychic: { bg: 'bg-pink-600', text: 'text-pink-50', border: 'border-pink-300', glow: 'rgba(248, 88, 136, 0.5)', label: 'Psíquico' },
  bug: { bg: 'bg-lime-600', text: 'text-lime-50', border: 'border-lime-400', glow: 'rgba(168, 184, 32, 0.5)', label: 'Inseto' },
  rock: { bg: 'bg-amber-700', text: 'text-amber-50', border: 'border-amber-500', glow: 'rgba(184, 160, 56, 0.5)', label: 'Pedra' },
  ghost: { bg: 'bg-violet-800', text: 'text-violet-100', border: 'border-violet-500', glow: 'rgba(112, 88, 152, 0.5)', label: 'Fantasma' },
  dragon: { bg: 'bg-indigo-700', text: 'text-indigo-100', border: 'border-indigo-400', glow: 'rgba(112, 56, 248, 0.5)', label: 'Dragão' },
  steel: { bg: 'bg-slate-500', text: 'text-slate-100', border: 'border-slate-300', glow: 'rgba(184, 184, 208, 0.5)', label: 'Aço' },
  dark: { bg: 'bg-neutral-800', text: 'text-neutral-100', border: 'border-neutral-600', glow: 'rgba(112, 88, 72, 0.5)', label: 'Noturno' },
  fairy: { bg: 'bg-rose-400', text: 'text-rose-950', border: 'border-rose-300', glow: 'rgba(238, 153, 172, 0.5)', label: 'Fada' },
};
