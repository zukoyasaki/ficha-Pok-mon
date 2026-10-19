import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Download,
  Upload,
  RefreshCw,
  Award,
  Bookmark,
  Check,
  Package,
  Layers,
  UserPlus,
  BookOpen,
  Swords,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  TrainerProfile,
  TeamMember,
  PokemonData,
  TrainerSheet,
  BagItem,
} from './types/pokemon';
import { INITIAL_POKEMON_LIST } from './data/pokemonData';
import { TRAINER_PRESETS } from './data/trainerPresets';
import { DEFAULT_ASH_BAG, DEFAULT_CYNTHIA_BAG } from './data/bagPresets';
import { TrainerProfileCard } from './components/TrainerProfileCard';
import { PokemonTeamBuilder } from './components/PokemonTeamBuilder';
import { PokemonBoxSection } from './components/PokemonBoxSection';
import { PokemonPickerModal } from './components/PokemonPickerModal';
import { PokemonDetailModal } from './components/PokemonDetailModal';
import { TrainerPassportModal } from './components/TrainerPassportModal';
import { ChooseFromBoxModal } from './components/ChooseFromBoxModal';
import { TrainerSheetsModal } from './components/TrainerSheetsModal';
import { CreateTrainerSheetModal } from './components/CreateTrainerSheetModal';
import { TrainerBagModal } from './components/TrainerBagModal';
import { MoveDexModal } from './components/MoveDexModal';
import { SpriteFormatToggle } from './components/SpriteFormatToggle';

const SHEETS_STORAGE_KEY = 'pokebuilder_trainer_sheets_v2';
const OLD_STORAGE_KEY = 'pokebuilder_trainer_v1';
const ACTIVE_SHEET_KEY = 'pokebuilder_active_sheet_id';

function buildInitialDefaultSheets(): TrainerSheet[] {
  const pikachu = INITIAL_POKEMON_LIST.find((p) => p.name === 'pikachu') || INITIAL_POKEMON_LIST[1];
  const charizard = INITIAL_POKEMON_LIST.find((p) => p.name === 'charizard') || INITIAL_POKEMON_LIST[0];
  const lucario = INITIAL_POKEMON_LIST.find((p) => p.name === 'lucario') || INITIAL_POKEMON_LIST[4];

  const gengar = INITIAL_POKEMON_LIST.find((p) => p.name === 'gengar') || INITIAL_POKEMON_LIST[5];
  const blastoise = INITIAL_POKEMON_LIST.find((p) => p.name === 'blastoise') || INITIAL_POKEMON_LIST[2];
  const venusaur = INITIAL_POKEMON_LIST.find((p) => p.name === 'venusaur') || INITIAL_POKEMON_LIST[3];

  const sheet1: TrainerSheet = {
    id: 'sheet-ash',
    name: 'Ficha Principal - Ash Ketchum',
    profile: {
      name: 'Ash Ketchum',
      trainerClass: 'Mestre Pokémon',
      avatarUrl: 'https://play.pokemonshowdown.com/sprites/trainers/ash.png',
      badges: ['Fogo', 'Elétrico', 'Grama', 'Fantasma'],
      favoriteType: 'electric',
    },
    team: [
      {
        slotId: 'slot-ash-1',
        pokemon: pikachu,
        nickname: 'Pikachu',
        level: 68,
        isShiny: false,
        heldItem: 'Bola de Luz (Light Ball)',
        ability: 'Static',
        moves: ['Thunderbolt', 'Volt Tackle', 'Iron Tail', 'Quick Attack', 'Electro Ball', 'Agility'],
        gender: 'male',
      },
      {
        slotId: 'slot-ash-2',
        pokemon: charizard,
        nickname: 'Fagulha',
        level: 65,
        isShiny: false,
        heldItem: 'Restos (Leftovers)',
        ability: 'Blaze',
        moves: ['Flamethrower', 'Air Slash', 'Dragon Pulse', 'Solar Beam', 'Roost', 'Focus Blast'],
        gender: 'male',
      },
      {
        slotId: 'slot-ash-3',
        pokemon: lucario,
        nickname: 'Aura',
        level: 64,
        isShiny: false,
        heldItem: 'Faixa Foco (Focus Sash)',
        ability: 'Steadfast',
        moves: ['Aura Sphere', 'Close Combat', 'Flash Cannon', 'Extreme Speed', 'Swords Dance', 'Ice Punch'],
        gender: 'male',
      },
      null,
      null,
      null,
    ],
    box: [
      {
        slotId: 'box-ash-1',
        pokemon: gengar,
        nickname: 'Sombra',
        level: 63,
        isShiny: false,
        heldItem: 'Orbe de Vida (Life Orb)',
        ability: 'Cursed Body',
        moves: ['Shadow Ball', 'Sludge Bomb', 'Thunderbolt', 'Focus Blast', 'Destiny Bond', 'Confuse Ray'],
        gender: 'male',
      },
      {
        slotId: 'box-ash-2',
        pokemon: blastoise,
        nickname: 'Tsunami',
        level: 65,
        isShiny: true,
        heldItem: 'Restos (Leftovers)',
        ability: 'Torrent',
        moves: ['Hydro Pump', 'Ice Beam', 'Flash Cannon', 'Shell Smash', 'Rapid Spin', 'Protect'],
        gender: 'male',
      },
      {
        slotId: 'box-ash-3',
        pokemon: venusaur,
        nickname: 'Florasauro',
        level: 64,
        isShiny: false,
        heldItem: 'Lodo Preto (Black Sludge)',
        ability: 'Overgrow',
        moves: ['Giga Drain', 'Sludge Bomb', 'Leech Seed', 'Sleep Powder', 'Earth Power', 'Synthesis'],
        gender: 'male',
      },
    ],
    bag: DEFAULT_ASH_BAG,
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now(),
  };

  const sheet2: TrainerSheet = {
    id: 'sheet-cynthia',
    name: 'Ficha da Campeã - Cynthia',
    profile: {
      name: 'Cynthia',
      trainerClass: 'Campeã da Liga de Sinnoh',
      avatarUrl: 'https://play.pokemonshowdown.com/sprites/trainers/cynthia.png',
      badges: ['Fogo', 'Grama', 'Veneno', 'Fantasma', 'Elétrico'],
      favoriteType: 'dragon',
    },
    team: [
      {
        slotId: 'slot-cynthia-1',
        pokemon: gengar,
        nickname: 'Gengar',
        level: 76,
        isShiny: false,
        heldItem: 'Faixa Foco (Focus Sash)',
        ability: 'Cursed Body',
        moves: ['Shadow Ball', 'Sludge Bomb', 'Focus Blast', 'Destiny Bond', 'Thunderbolt', 'Hypnosis'],
        gender: 'female',
      },
      {
        slotId: 'slot-cynthia-2',
        pokemon: lucario,
        nickname: 'Lucario',
        level: 74,
        isShiny: false,
        heldItem: 'Orbe de Vida (Life Orb)',
        ability: 'Inner Focus',
        moves: ['Aura Sphere', 'Flash Cannon', 'Dragon Pulse', 'Psychic', 'Extreme Speed', 'Nasty Plot'],
        gender: 'male',
      },
      {
        slotId: 'slot-cynthia-3',
        pokemon: blastoise,
        nickname: 'Milotic',
        level: 74,
        isShiny: true,
        heldItem: 'Restos (Leftovers)',
        ability: 'Torrent',
        moves: ['Hydro Pump', 'Ice Beam', 'Shell Smash', 'Protect', 'Rapid Spin', 'Flash Cannon'],
        gender: 'female',
      },
      null,
      null,
      null,
    ],
    box: [],
    bag: DEFAULT_CYNTHIA_BAG,
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now(),
  };

  return [sheet1, sheet2];
}

function loadInitialSheets(): TrainerSheet[] {
  const saved = localStorage.getItem(SHEETS_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse sheets', e);
    }
  }

  const defaults = buildInitialDefaultSheets();
  const oldSaved = localStorage.getItem(OLD_STORAGE_KEY);
  if (oldSaved) {
    try {
      const parsed = JSON.parse(oldSaved);
      if (parsed.profile) {
        defaults[0] = {
          ...defaults[0],
          name: `Ficha - ${parsed.profile.name || 'Treinador'}`,
          profile: parsed.profile,
          team: parsed.team || defaults[0].team,
          box: parsed.box || defaults[0].box,
          updatedAt: Date.now(),
        };
      }
    } catch (e) {
      console.error('Failed to migrate old data', e);
    }
  }
  return defaults;
}

export default function App() {
  // All saved trainer sheets
  const [sheets, setSheets] = useState<TrainerSheet[]>(loadInitialSheets);

  // Active sheet ID
  const [activeSheetId, setActiveSheetId] = useState<string>(() => {
    const initialSheets = loadInitialSheets();
    const savedActive = localStorage.getItem(ACTIVE_SHEET_KEY);
    if (savedActive && initialSheets.some((s) => s.id === savedActive)) {
      return savedActive;
    }
    return initialSheets[0]?.id || 'sheet-ash';
  });

  // Current active sheet object
  const activeSheet =
    sheets.find((s) => s.id === activeSheetId) || sheets[0] || buildInitialDefaultSheets()[0];

  // Active trainer profile state
  const [trainerProfile, setTrainerProfile] = useState<TrainerProfile>(activeSheet.profile);

  // Active team (up to 6 Pokémon)
  const [team, setTeam] = useState<(TeamMember | null)[]>(activeSheet.team);

  // Active Pokémon Box storage
  const [box, setBox] = useState<TeamMember[]>(activeSheet.box);

  // Active Trainer Bag (20 Slots)
  const [bag, setBag] = useState<BagItem[]>(activeSheet.bag || DEFAULT_ASH_BAG);

  // Modals state
  const [pickerTarget, setPickerTarget] = useState<
    { type: 'team'; slotIndex: number } | { type: 'box' } | null
  >(null);

  const [detailTarget, setDetailTarget] = useState<
    { type: 'team'; index: number } | { type: 'box'; index: number } | null
  >(null);

  const [chooseFromBoxSlotIndex, setChooseFromBoxSlotIndex] = useState<number | null>(null);
  const [passportModalOpen, setPassportModalOpen] = useState(false);
  const [sheetsModalOpen, setSheetsModalOpen] = useState(false);
  const [createSheetModalOpen, setCreateSheetModalOpen] = useState(false);
  const [bagModalOpen, setBagModalOpen] = useState(false);
  const [moveDexModalOpen, setMoveDexModalOpen] = useState(false);
  const [isPokedexExplorer, setIsPokedexExplorer] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Ref to prevent circular updates
  const isSwitchingSheetRef = useRef(false);

  // Synchronize active sheet changes to `sheets` array
  useEffect(() => {
    if (isSwitchingSheetRef.current) {
      isSwitchingSheetRef.current = false;
      return;
    }

    setSheets((prevSheets) =>
      prevSheets.map((s) => {
        if (s.id === activeSheetId) {
          return {
            ...s,
            profile: trainerProfile,
            team,
            box,
            bag,
            updatedAt: Date.now(),
          };
        }
        return s;
      })
    );
  }, [trainerProfile, team, box, bag, activeSheetId]);

  // Save sheets and active ID to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SHEETS_STORAGE_KEY, JSON.stringify(sheets));
      localStorage.setItem(ACTIVE_SHEET_KEY, activeSheetId);
      // Also write back to OLD_STORAGE_KEY for backward compatibility
      localStorage.setItem(
        OLD_STORAGE_KEY,
        JSON.stringify({ profile: trainerProfile, team, box })
      );
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [sheets, activeSheetId, trainerProfile, team, box]);

  const showNotification = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Switch to another trainer sheet
  const handleSelectSheet = (sheetId: string) => {
    const target = sheets.find((s) => s.id === sheetId);
    if (!target) return;

    isSwitchingSheetRef.current = true;
    setActiveSheetId(sheetId);
    setTrainerProfile(target.profile);
    setTeam(target.team);
    setBox(target.box);
    setBag(target.bag || []);
    localStorage.setItem(ACTIVE_SHEET_KEY, sheetId);
    showNotification(`Ficha carregada: ${target.name} (${target.profile.name})!`);
  };

  // Create new trainer sheet
  const handleCreateSheet = (newSheetData: {
    sheetName: string;
    profile: TrainerProfile;
    team: (TeamMember | null)[];
    box: TeamMember[];
  }) => {
    const newSheet: TrainerSheet = {
      id: 'sheet-' + Date.now(),
      name: newSheetData.sheetName,
      profile: newSheetData.profile,
      team: newSheetData.team,
      box: newSheetData.box,
      bag: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    isSwitchingSheetRef.current = true;
    setSheets((prev) => [...prev, newSheet]);
    setActiveSheetId(newSheet.id);
    setTrainerProfile(newSheet.profile);
    setTeam(newSheet.team);
    setBox(newSheet.box);
    setBag([]);
    localStorage.setItem(ACTIVE_SHEET_KEY, newSheet.id);
    showNotification(`Nova ficha criada: "${newSheet.name}"!`);
  };

  // Duplicate an existing trainer sheet
  const handleDuplicateSheet = (sheetId: string) => {
    const source = sheets.find((s) => s.id === sheetId);
    if (!source) return;

    const duplicated: TrainerSheet = {
      id: 'sheet-' + Date.now(),
      name: `${source.name} (Cópia)`,
      profile: { ...source.profile },
      team: JSON.parse(JSON.stringify(source.team)),
      box: JSON.parse(JSON.stringify(source.box)),
      bag: JSON.parse(JSON.stringify(source.bag || [])),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    isSwitchingSheetRef.current = true;
    setSheets((prev) => [...prev, duplicated]);
    setActiveSheetId(duplicated.id);
    setTrainerProfile(duplicated.profile);
    setTeam(duplicated.team);
    setBox(duplicated.box);
    setBag(duplicated.bag || []);
    localStorage.setItem(ACTIVE_SHEET_KEY, duplicated.id);
    showNotification(`Ficha duplicada: "${duplicated.name}"!`);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.5 } });
  };

  // Delete a trainer sheet
  const handleDeleteSheet = (sheetId: string) => {
    if (sheets.length <= 1) {
      showNotification('Você deve manter pelo menos 1 ficha ativa!');
      return;
    }

    const remaining = sheets.filter((s) => s.id !== sheetId);
    setSheets(remaining);

    if (activeSheetId === sheetId) {
      const nextSheet = remaining[0];
      isSwitchingSheetRef.current = true;
      setActiveSheetId(nextSheet.id);
      setTrainerProfile(nextSheet.profile);
      setTeam(nextSheet.team);
      setBox(nextSheet.box);
      setBag(nextSheet.bag || []);
      localStorage.setItem(ACTIVE_SHEET_KEY, nextSheet.id);
      showNotification(`Ficha excluída. Alternado para: "${nextSheet.name}"`);
    } else {
      showNotification('Ficha excluída com sucesso.');
    }
  };

  // Rename a trainer sheet
  const handleRenameSheet = (sheetId: string, newName: string) => {
    setSheets((prev) =>
      prev.map((s) =>
        s.id === sheetId ? { ...s, name: newName, updatedAt: Date.now() } : s
      )
    );
    showNotification(`Identificação alterada para: "${newName}"`);
  };

  // Open Pokédex browser directly from top bar
  const handleOpenPokedexBrowser = () => {
    const firstEmpty = team.findIndex((m) => m === null);
    if (firstEmpty !== -1) {
      setPickerTarget({ type: 'team', slotIndex: firstEmpty });
    } else {
      setPickerTarget({ type: 'box' });
    }
    setIsPokedexExplorer(true);
  };

  // Open picker for a team slot
  const handleOpenPicker = (slotIndex: number) => {
    setIsPokedexExplorer(false);
    setPickerTarget({ type: 'team', slotIndex });
  };

  // Open picker for the Box
  const handleOpenPickerForBox = () => {
    setIsPokedexExplorer(false);
    setPickerTarget({ type: 'box' });
  };

  // Select Pokemon from picker modal
  const handleSelectPokemon = (pokemon: PokemonData, asShiny: boolean) => {
    if (!pickerTarget) return;

    const newMember: TeamMember = {
      slotId: `${pickerTarget.type}-${Date.now()}`,
      pokemon,
      nickname: '',
      level: 50,
      isShiny: asShiny,
      heldItem: '',
      ability: pokemon.abilities[0] || '',
      moves: [...pokemon.suggestedMoves.slice(0, 6)],
      gender: 'male',
    };

    if (pickerTarget.type === 'team') {
      const newTeam = [...team];
      newTeam[pickerTarget.slotIndex] = newMember;
      setTeam(newTeam);
      showNotification(`${pokemon.displayName} adicionado ao Slot #${pickerTarget.slotIndex + 1}!`);
    } else {
      setBox([...box, newMember]);
      showNotification(`${pokemon.displayName} adicionado ao Box!`);
    }

    setPickerTarget(null);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
    });
  };

  // Open detail modal for team member
  const handleOpenDetail = (slotIndex: number) => {
    if (team[slotIndex]) {
      setDetailTarget({ type: 'team', index: slotIndex });
    }
  };

  // Open detail modal for box member
  const handleEditBoxMember = (boxIndex: number) => {
    if (box[boxIndex]) {
      setDetailTarget({ type: 'box', index: boxIndex });
    }
  };

  // Update member from detail modal
  const handleUpdateMember = (updated: TeamMember) => {
    if (!detailTarget) return;

    if (detailTarget.type === 'team') {
      const newTeam = [...team];
      newTeam[detailTarget.index] = updated;
      setTeam(newTeam);
    } else {
      const newBox = [...box];
      newBox[detailTarget.index] = updated;
      setBox(newBox);
    }
    showNotification(`Dados de ${updated.nickname || updated.pokemon.displayName} atualizados!`);
  };

  // Remove member from team
  const handleRemoveMember = (slotIndex: number) => {
    const removedName = team[slotIndex]?.nickname || team[slotIndex]?.pokemon.displayName;
    const newTeam = [...team];
    newTeam[slotIndex] = null;
    setTeam(newTeam);
    if (removedName) {
      showNotification(`${removedName} foi removido do time.`);
    }
  };

  // Remove member from box
  const handleRemoveBoxMember = (boxIndex: number) => {
    const removedName = box[boxIndex]?.nickname || box[boxIndex]?.pokemon.displayName;
    const newBox = [...box];
    newBox.splice(boxIndex, 1);
    setBox(newBox);
    if (removedName) {
      showNotification(`${removedName} foi liberado do Box.`);
    }
  };

  // Send team member to box
  const handleSendToBox = (slotIndex: number) => {
    const member = team[slotIndex];
    if (!member) return;

    const newTeam = [...team];
    newTeam[slotIndex] = null;
    setTeam(newTeam);
    setBox([...box, member]);

    showNotification(`${member.nickname || member.pokemon.displayName} foi enviado para o Box!`);
  };

  // Move or swap from box to team
  const handleMoveBoxToTeam = (boxIndex: number, targetSlotIndex?: number) => {
    const boxMember = box[boxIndex];
    if (!boxMember) return;

    let targetSlot = targetSlotIndex;
    if (targetSlot === undefined) {
      targetSlot = team.findIndex((m) => m === null);
      if (targetSlot === -1) targetSlot = 0;
    }

    const currentOccupant = team[targetSlot];
    const newTeam = [...team];
    newTeam[targetSlot] = boxMember;

    const newBox = [...box];
    if (currentOccupant) {
      // Swap: occupant goes into the box slot
      newBox[boxIndex] = currentOccupant;
      showNotification(
        `Trocado: ${boxMember.nickname || boxMember.pokemon.displayName} entrou no time e ${
          currentOccupant.nickname || currentOccupant.pokemon.displayName
        } foi para o Box!`
      );
    } else {
      // Slot was empty: just remove from box
      newBox.splice(boxIndex, 1);
      showNotification(
        `${boxMember.nickname || boxMember.pokemon.displayName} foi colocado no time!`
      );
    }

    setTeam(newTeam);
    setBox(newBox);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
  };

  // Toggle shiny on filled team slot
  const handleToggleShiny = (slotIndex: number) => {
    const member = team[slotIndex];
    if (!member) return;
    const newTeam = [...team];
    newTeam[slotIndex] = {
      ...member,
      isShiny: !member.isShiny,
    };
    setTeam(newTeam);
  };

  // Move / swap team slot position
  const handleMoveSlot = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= 6) return;
    const newTeam = [...team];
    const temp = newTeam[fromIndex];
    newTeam[fromIndex] = newTeam[toIndex];
    newTeam[toIndex] = temp;
    setTeam(newTeam);
  };

  // Randomize Trainer Profile
  const handleRandomizeTrainer = () => {
    const randomPreset = TRAINER_PRESETS[Math.floor(Math.random() * TRAINER_PRESETS.length)];
    setTrainerProfile({
      name: randomPreset.name,
      trainerClass: randomPreset.trainerClass,
      avatarUrl: randomPreset.avatarUrl,
      badges: ['Fogo', 'Elétrico', 'Grama', 'Fantasma'],
      favoriteType: randomPreset.favoriteType,
    });
    showNotification(`Treinador sorteado: ${randomPreset.name}!`);
  };

  // Randomize Team (6 distinct random pokemon)
  const handleRandomizeTeam = () => {
    const shuffled = [...INITIAL_POKEMON_LIST].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 6);

    const randomizedTeam: (TeamMember | null)[] = selected.map((p, idx) => ({
      slotId: `random-${idx}-${Date.now()}`,
      pokemon: p,
      nickname: '',
      level: Math.floor(Math.random() * 25) + 55,
      isShiny: Math.random() < 0.25,
      heldItem: '',
      ability: p.abilities[0] || '',
      moves: [...p.suggestedMoves.slice(0, 6)],
      gender: 'male',
    }));

    setTeam(randomizedTeam);
    confetti({ particleCount: 50, spread: 80, origin: { y: 0.5 } });
    showNotification('Novo time aleatório convocado!');
  };

  // Clear Team
  const handleClearTeam = () => {
    setTeam([null, null, null, null, null, null]);
    showNotification('Equipe esvaziada.');
  };

  // Current member being edited in detail modal
  const currentDetailMember =
    detailTarget?.type === 'team'
      ? team[detailTarget.index]
      : detailTarget?.type === 'box'
      ? box[detailTarget.index]
      : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 border border-emerald-500/50 text-emerald-300 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Main Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand + Barra Superior (Pokédex & Move) */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-b from-rose-600 to-rose-700 flex items-center justify-center shadow-lg shadow-rose-950/50 border border-rose-400/40">
                {/* Pokéball line styling */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-slate-950" />
                <div className="relative w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-950 flex items-center justify-center z-10">
                  <div className="w-1 h-1 rounded-full bg-slate-900" />
                </div>
              </div>
              <div>
                <span className="font-black text-lg text-white tracking-wide">
                  PokéBuilder
                </span>
              </div>
            </div>

            {/* Barra Superior ao lado de PokéBuilder com Pokédex e Move */}
            <nav className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800 shadow-inner" aria-label="Navegação da Barra Superior">
              <button
                type="button"
                onClick={handleOpenPokedexBrowser}
                className="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95"
                title="Abrir Pokédex Nacional Oficial com mais de 1025 Pokémon"
              >
                <BookOpen className="w-3.5 h-3.5 text-rose-400" />
                <span>Pokédex</span>
              </button>

              <button
                type="button"
                onClick={() => setMoveDexModalOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95"
                title="Abrir Catálogo Oficial de Movimentos e Golpes (MoveDex)"
              >
                <Swords className="w-3.5 h-3.5 text-amber-400" />
                <span>Move</span>
              </button>
            </nav>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <SpriteFormatToggle size="sm" showLabel={true} className="hidden sm:inline-flex" />

            <button
              type="button"
              onClick={() => setSheetsModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700 shadow-sm"
              title="Ver e alternar entre todas as fichas de treinador criadas"
            >
              <Layers className="w-3.5 h-3.5 text-rose-400" />
              <span>Fichas ({sheets.length})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                showNotification('Ficha e Box salvos com sucesso!');
                confetti({ particleCount: 30, spread: 50, origin: { y: 0.1 } });
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
            >
              <Bookmark className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Salvar</span>
            </button>
            <button
              type="button"
              onClick={() => setPassportModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold shadow-md shadow-rose-950/40 flex items-center gap-1.5 transition"
            >
              <Award className="w-4 h-4" />
              <span>Ficha da Liga</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Welcome Kicker */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Construção de Personagem, Time & Box Pokémon
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Personalize seu treinador à esquerda e monte sua equipe com até 6 Pokémon à direita. Crie múltiplas fichas independentes e alterne quando quiser!
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Time: {team.filter(Boolean).length}/6
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
              <Package className="w-3 h-3 text-blue-400" />
              Box: {box.length}
            </span>
            <button
              type="button"
              onClick={() => setSheetsModalOpen(true)}
              className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer"
            >
              <Layers className="w-3 h-3 text-rose-400" />
              {sheets.length} {sheets.length === 1 ? 'Ficha' : 'Fichas'}
            </button>
          </div>
        </div>

        {/* Two-Column Grid: Left (Character) & Right (Pokemon Team + Box) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Trainer Character (4 of 12 cols on desktop) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky lg:top-24">
            <TrainerProfileCard
              profile={trainerProfile}
              onChangeProfile={setTrainerProfile}
              onRandomizeTrainer={handleRandomizeTrainer}
              onOpenPassport={() => setPassportModalOpen(true)}
              sheets={sheets}
              activeSheetId={activeSheetId}
              onSelectSheet={handleSelectSheet}
              onOpenCreateSheet={() => setCreateSheetModalOpen(true)}
              onOpenSheetsList={() => setSheetsModalOpen(true)}
              bag={bag}
              onOpenBag={() => setBagModalOpen(true)}
            />
          </div>

          {/* Right Column: Pokemon Team Builder and Pokemon Box Section */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Active Team (6 Slots) */}
            <PokemonTeamBuilder
              team={team}
              onOpenPicker={handleOpenPicker}
              onOpenDetail={handleOpenDetail}
              onRemoveMember={handleRemoveMember}
              onToggleShiny={handleToggleShiny}
              onMoveSlot={handleMoveSlot}
              onRandomizeTeam={handleRandomizeTeam}
              onClearTeam={handleClearTeam}
              onSendToBox={handleSendToBox}
              onBringFromBox={(slotIndex) => setChooseFromBoxSlotIndex(slotIndex)}
              boxCount={box.length}
            />

            {/* Box Section (PC Storage) */}
            <PokemonBoxSection
              box={box}
              team={team}
              onOpenPickerForBox={handleOpenPickerForBox}
              onEditBoxMember={handleEditBoxMember}
              onRemoveBoxMember={handleRemoveBoxMember}
              onMoveToTeam={handleMoveBoxToTeam}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            PokéBuilder © {new Date().getFullYear()} · Treinador, Equipe de Batalha (6) & Box de Armazenamento.
          </p>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Múltiplas Fichas de Treinador</span>
            <span>·</span>
            <span>Todos os 1025 Pokémon</span>
            <span>·</span>
            <span>Edição de Golpes, Níveis & Itens</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {pickerTarget !== null && (
        <PokemonPickerModal
          isOpen={true}
          onClose={() => {
            setPickerTarget(null);
            setIsPokedexExplorer(false);
          }}
          onSelectPokemon={handleSelectPokemon}
          targetSlotIndex={pickerTarget.type === 'team' ? pickerTarget.slotIndex : 0}
          mode={isPokedexExplorer ? 'pokedex' : 'picker'}
        />
      )}

      {detailTarget !== null && currentDetailMember !== null && (
        <PokemonDetailModal
          isOpen={true}
          member={currentDetailMember}
          slotIndex={detailTarget.index}
          onClose={() => setDetailTarget(null)}
          onUpdateMember={handleUpdateMember}
          onRemoveMember={() => {
            if (detailTarget.type === 'team') {
              handleRemoveMember(detailTarget.index);
            } else if (detailTarget.type === 'box') {
              handleRemoveBoxMember(detailTarget.index);
            }
            setDetailTarget(null);
          }}
        />
      )}

      {chooseFromBoxSlotIndex !== null && (
        <ChooseFromBoxModal
          isOpen={true}
          onClose={() => setChooseFromBoxSlotIndex(null)}
          box={box}
          targetSlotIndex={chooseFromBoxSlotIndex}
          onSelectFromBox={(boxIdx, slotIdx) => {
            handleMoveBoxToTeam(boxIdx, slotIdx);
            setChooseFromBoxSlotIndex(null);
          }}
        />
      )}

      {passportModalOpen && (
        <TrainerPassportModal
          isOpen={true}
          onClose={() => setPassportModalOpen(false)}
          profile={trainerProfile}
          team={team}
          bag={bag}
          sheetName={activeSheet.name}
        />
      )}

      {/* Trainer Bag / Mochila Modal (20 Slots) */}
      {bagModalOpen && (
        <TrainerBagModal
          isOpen={true}
          onClose={() => setBagModalOpen(false)}
          trainerName={trainerProfile.name}
          bag={bag}
          onSaveBag={(updatedBag) => {
            setBag(updatedBag);
            showNotification('Mochila salva com sucesso!');
            confetti({ particleCount: 30, spread: 50, origin: { y: 0.2 } });
          }}
        />
      )}

      {/* MoveDex Modal */}
      {moveDexModalOpen && (
        <MoveDexModal
          isOpen={true}
          onClose={() => setMoveDexModalOpen(false)}
        />
      )}

      {sheetsModalOpen && (
        <TrainerSheetsModal
          isOpen={true}
          onClose={() => setSheetsModalOpen(false)}
          sheets={sheets}
          activeSheetId={activeSheetId}
          onSelectSheet={handleSelectSheet}
          onOpenCreateNew={() => {
            setSheetsModalOpen(false);
            setCreateSheetModalOpen(true);
          }}
          onDuplicateSheet={handleDuplicateSheet}
          onDeleteSheet={handleDeleteSheet}
          onRenameSheet={handleRenameSheet}
        />
      )}

      {createSheetModalOpen && (
        <CreateTrainerSheetModal
          isOpen={true}
          onClose={() => setCreateSheetModalOpen(false)}
          onCreateSheet={handleCreateSheet}
          existingCount={sheets.length}
        />
      )}
    </div>
  );
}
