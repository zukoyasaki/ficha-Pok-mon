import { BagItem } from '../types/pokemon';

export interface PresetItemDefinition {
  name: string;
  category: 'pokeball' | 'medicine' | 'battle' | 'berry' | 'evolution' | 'general';
  imageUrl: string;
  defaultQuantity: number;
  description: string;
}

export const PRESET_ITEMS_CATALOG: PresetItemDefinition[] = [
  // Pokébolas
  {
    name: 'Poké Bola (Poké Ball)',
    category: 'pokeball',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
    defaultQuantity: 15,
    description: 'Dispositivo esférico comum para captura de Pokémon selvagens.',
  },
  {
    name: 'Super Bola (Great Ball)',
    category: 'pokeball',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png',
    defaultQuantity: 10,
    description: 'Bola de alto desempenho com taxa de captura superior à Poké Bola.',
  },
  {
    name: 'Ultra Bola (Ultra Ball)',
    category: 'pokeball',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png',
    defaultQuantity: 8,
    description: 'Bola ultra-avançada com taxa de sucesso altíssima para capturar Pokémon fortes.',
  },
  {
    name: 'Master Ball',
    category: 'pokeball',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png',
    defaultQuantity: 1,
    description: 'A melhor bola existente. Captura qualquer Pokémon selvagem sem chance de falhar.',
  },
  {
    name: 'Bola Noturna (Dusk Ball)',
    category: 'pokeball',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dusk-ball.png',
    defaultQuantity: 5,
    description: 'Especialmente eficaz durante a noite ou no interior de cavernas escuras.',
  },

  // Medicina & Cura
  {
    name: 'Poção (Potion)',
    category: 'medicine',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png',
    defaultQuantity: 10,
    description: 'Remédio em spray que restaura 20 pontos de vida (HP) de um Pokémon.',
  },
  {
    name: 'Super Poção (Super Potion)',
    category: 'medicine',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-potion.png',
    defaultQuantity: 6,
    description: 'Spray medicinal mais potente que restaura 60 pontos de vida (HP).',
  },
  {
    name: 'Hiper Poção (Hyper Potion)',
    category: 'medicine',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hyper-potion.png',
    defaultQuantity: 4,
    description: 'Restaura 120 pontos de HP de um Pokémon ferido em batalha.',
  },
  {
    name: 'Poção Máxima (Max Potion)',
    category: 'medicine',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-potion.png',
    defaultQuantity: 3,
    description: 'Cura completamente todo o HP de um Pokémon de uma só vez.',
  },
  {
    name: 'Cura Total (Full Heal)',
    category: 'medicine',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/full-heal.png',
    defaultQuantity: 5,
    description: 'Elimina todos os problemas de status (paralisia, sono, veneno, queimadura e congelamento).',
  },
  {
    name: 'Reviver (Revive)',
    category: 'medicine',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png',
    defaultQuantity: 5,
    description: 'Revive um Pokémon desmaiado, restaurando metade do seu HP máximo.',
  },
  {
    name: 'Max Revive',
    category: 'medicine',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-revive.png',
    defaultQuantity: 2,
    description: 'Revive um Pokémon desmaiado e recupera totalmente todo o seu HP.',
  },

  // Itens de Batalha & Held Items
  {
    name: 'Restos (Leftovers)',
    category: 'battle',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/leftovers.png',
    defaultQuantity: 1,
    description: 'Item segurado que restaura gradualmente uma fração do HP a cada turno.',
  },
  {
    name: 'Orbe de Vida (Life Orb)',
    category: 'battle',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/life-orb.png',
    defaultQuantity: 1,
    description: 'Aumenta o dano de todos os ataques em 30%, mas consome um pouco de HP a cada acerto.',
  },
  {
    name: 'Faixa Foco (Focus Sash)',
    category: 'battle',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/focus-sash.png',
    defaultQuantity: 1,
    description: 'Permite ao Pokémon resistir com 1 HP a qualquer golpe que o nocautearia se estivesse com HP cheio.',
  },
  {
    name: 'Faixa da Escolha (Choice Band)',
    category: 'battle',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/choice-band.png',
    defaultQuantity: 1,
    description: 'Aumenta o Ataque Físico em 50%, mas trava o usuário no mesmo golpe.',
  },
  {
    name: 'Óculos da Escolha (Choice Specs)',
    category: 'battle',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/choice-specs.png',
    defaultQuantity: 1,
    description: 'Aumenta o Ataque Especial em 50%, mas trava o usuário no mesmo golpe.',
  },
  {
    name: 'Lenço da Escolha (Choice Scarf)',
    category: 'battle',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/choice-scarf.png',
    defaultQuantity: 1,
    description: 'Aumenta a Velocidade em 50%, mas trava o usuário no mesmo golpe.',
  },
  {
    name: 'Colete de Assalto (Assault Vest)',
    category: 'battle',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/assault-vest.png',
    defaultQuantity: 1,
    description: 'Aumenta a Defesa Especial em 50%, mas impede o uso de movimentos de status.',
  },
  {
    name: 'Capacete Dentado (Rocky Helmet)',
    category: 'battle',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rocky-helmet.png',
    defaultQuantity: 1,
    description: 'Causa dano reflexivo a adversários que acertarem ataques de contato físico.',
  },

  // Berries (Frutas)
  {
    name: 'Fruta Sitrus (Sitrus Berry)',
    category: 'berry',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sitrus-berry.png',
    defaultQuantity: 10,
    description: 'Consumida automaticamente quando o HP cai para menos de 50%, curando 25% do HP máximo.',
  },
  {
    name: 'Fruta Lum (Lum Berry)',
    category: 'berry',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lum-berry.png',
    defaultQuantity: 5,
    description: 'Cura imediatamente qualquer problema de condição de status ou confusão mental.',
  },
  {
    name: 'Fruta Oran (Oran Berry)',
    category: 'berry',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png',
    defaultQuantity: 12,
    description: 'Fruta silvestre comum que restaura 10 pontos de HP quando o portador é ferido.',
  },

  // Doces & Evolução
  {
    name: 'Doce Raro (Rare Candy)',
    category: 'evolution',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png',
    defaultQuantity: 5,
    description: 'Doce energizado que eleva o nível do Pokémon instantaneamente em 1 ponto.',
  },
  {
    name: 'Pedra do Fogo (Fire Stone)',
    category: 'evolution',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fire-stone.png',
    defaultQuantity: 1,
    description: 'Pedra mágica avermelhada que irradia calor e desencadeia a evolução de certas espécies.',
  },
  {
    name: 'Pedra da Água (Water Stone)',
    category: 'evolution',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/water-stone.png',
    defaultQuantity: 1,
    description: 'Pedra cristalina azulada que desencadeia a evolução de espécies aquáticas.',
  },
  {
    name: 'Pedra do Trovão (Thunder Stone)',
    category: 'evolution',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/thunder-stone.png',
    defaultQuantity: 1,
    description: 'Pedra com desenho de relâmpago que conduz eletricidade e faz certos Pokémon evoluírem.',
  },
];

export const DEFAULT_ASH_BAG: BagItem[] = [
  {
    id: 'ash-item-0',
    slotIndex: 0,
    name: 'Ultra Bola (Ultra Ball)',
    quantity: 12,
    category: 'pokeball',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png',
    description: 'Ultra Bolas preparadas para capturar novos companheiros de jornada.',
  },
  {
    id: 'ash-item-1',
    slotIndex: 1,
    name: 'Hiper Poção (Hyper Potion)',
    quantity: 8,
    category: 'medicine',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hyper-potion.png',
    description: 'Cura 120 HP da equipe após treinos intensos.',
  },
  {
    id: 'ash-item-2',
    slotIndex: 2,
    name: 'Reviver (Revive)',
    quantity: 6,
    category: 'medicine',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png',
    description: 'Revive companheiros caídos durante batalhas contra Líderes de Ginásio.',
  },
  {
    id: 'ash-item-3',
    slotIndex: 3,
    name: 'Doce Raro (Rare Candy)',
    quantity: 4,
    category: 'evolution',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png',
    description: 'Doces especiais guardados para momentos decisivos.',
  },
  {
    id: 'ash-item-4',
    slotIndex: 4,
    name: 'Fruta Sitrus (Sitrus Berry)',
    quantity: 10,
    category: 'berry',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sitrus-berry.png',
    description: 'Frutas colhidas ao longo da estrada para recuperar HP.',
  },
  {
    id: 'ash-item-5',
    slotIndex: 5,
    name: 'Restos (Leftovers)',
    quantity: 1,
    category: 'battle',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/leftovers.png',
    description: 'Item favorito dos Pokémon para restaurar vida gradualmente.',
  },
];

export const DEFAULT_CYNTHIA_BAG: BagItem[] = [
  {
    id: 'cynthia-item-0',
    slotIndex: 0,
    name: 'Master Ball',
    quantity: 1,
    category: 'pokeball',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png',
    description: 'Reserva exclusiva da Campeã de Sinnoh.',
  },
  {
    id: 'cynthia-item-1',
    slotIndex: 1,
    name: 'Poção Máxima (Max Potion)',
    quantity: 10,
    category: 'medicine',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-potion.png',
    description: 'Recupera totalmente os pontos de vida de qualquer integrante.',
  },
  {
    id: 'cynthia-item-2',
    slotIndex: 2,
    name: 'Max Revive',
    quantity: 5,
    category: 'medicine',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-revive.png',
    description: 'Restaura totalmente um Pokémon nocauteado.',
  },
  {
    id: 'cynthia-item-3',
    slotIndex: 3,
    name: 'Orbe de Vida (Life Orb)',
    quantity: 2,
    category: 'battle',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/life-orb.png',
    description: 'Potencializador de poder ofensivo competitivo.',
  },
];
