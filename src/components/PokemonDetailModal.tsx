import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Sparkles,
  Zap,
  Check,
  Trash2,
  Lock,
  Unlock,
  Search,
  BookOpen,
  ExternalLink,
  Disc,
  Egg,
  History,
  Swords,
  Globe,
  SlidersHorizontal,
  Plus,
  Minus,
  RotateCcw,
  Activity,
  TrendingUp,
  Shield,
  Heart,
} from 'lucide-react';
import {
  TeamMember,
  TYPE_COLORS,
  PokemonType,
  PokemonEvs,
  POKEMON_NATURES,
  PokemonNature,
} from '../types/pokemon';
import { POPULAR_ITEMS } from '../data/pokemonData';
import { getPokemonRegionInfo } from '../data/regionalPokemon';
import {
  ShowdownMoveDetail,
  PokemonFullLearnset,
  getPokemonFullShowdownMoves,
  MoveCategoryType,
} from '../services/showdownDexApi';
import { PokemonSpriteImage } from './PokemonSpriteImage';
import { SpriteFormatToggle } from './SpriteFormatToggle';

interface PokemonDetailModalProps {
  isOpen: boolean;
  member: TeamMember | null;
  slotIndex: number;
  onClose: () => void;
  onUpdateMember: (updated: TeamMember) => void;
  onRemoveMember: (slotId: string) => void;
}

type TabType = 'level' | 'tm' | 'egg' | 'past_gen' | 'all';

export const MAX_TOTAL_EVS = 66;
export const MAX_EV_PER_STAT = 32;
export const FIXED_IV = 31;

/**
 * Calculates a Pokémon's stat at a given level considering IV = 31, EV bonus, and Nature multiplier.
 * Formula oficial de batalha Pokémon (Showdown / Cartucho):
 * - HP: floor(((2 * Base + 31) * Level) / 100) + Level + 10 + EV (Shedinja = 1)
 * - Outros stats: floor((floor(((2 * Base + 31) * Level) / 100) + 5 + EV) * natureMultiplier)
 */
export function calculateStatAtLevel(
  base: number,
  statKey: keyof PokemonEvs,
  level: number,
  ev: number = 0,
  pokemonName?: string,
  natureId: string = 'hardy'
): {
  baseAtLevel: number;
  evBonus: number;
  finalStat: number;
  natureEffect: 'plus' | 'minus' | 'neutral';
} {
  const safeLvl = Math.max(1, Math.min(100, Number(level) || 50));
  const safeEv = Math.max(0, Math.min(MAX_EV_PER_STAT, Number(ev) || 0));

  if (statKey === 'hp') {
    if (base === 1 || pokemonName?.toLowerCase() === 'shedinja') {
      return { baseAtLevel: 1, evBonus: 0, finalStat: 1, natureEffect: 'neutral' };
    }
    const baseAtLevel = Math.floor(((2 * base + FIXED_IV) * safeLvl) / 100) + safeLvl + 10;
    return {
      baseAtLevel,
      evBonus: safeEv,
      finalStat: baseAtLevel + safeEv,
      natureEffect: 'neutral',
    };
  } else {
    const baseAtLevel = Math.floor(((2 * base + FIXED_IV) * safeLvl) / 100) + 5;
    const rawWithEv = baseAtLevel + safeEv;

    const natDef = POKEMON_NATURES.find(
      (n) => n.id.toLowerCase() === natureId.toLowerCase() || n.name.toLowerCase() === natureId.toLowerCase()
    );
    let natureMultiplier = 1.0;
    let natureEffect: 'plus' | 'minus' | 'neutral' = 'neutral';

    if (natDef?.plus === statKey) {
      natureMultiplier = 1.1;
      natureEffect = 'plus';
    } else if (natDef?.minus === statKey) {
      natureMultiplier = 0.9;
      natureEffect = 'minus';
    }

    const finalStat = Math.floor(rawWithEv * natureMultiplier);
    return {
      baseAtLevel,
      evBonus: safeEv,
      finalStat,
      natureEffect,
    };
  }
}

/**
 * Retorna a cor da barra de estatística base seguindo o padrão do Pokémon Showdown
 */
export function getBaseStatBarColor(base: number): string {
  if (base >= 130) return '#10b981'; // emerald vibrante
  if (base >= 100) return '#22c55e'; // verde
  if (base >= 85) return '#84cc16'; // lima / amarelo-esverdeado
  if (base >= 70) return '#eab308'; // amarelo
  if (base >= 50) return '#f97316'; // laranja
  return '#ef4444'; // vermelho
}

interface EvStatInputProps {
  evVal: number;
  natureEffect: 'plus' | 'minus' | 'neutral';
  onChange: (val: number) => void;
}

const EvStatInput: React.FC<EvStatInputProps> = ({ evVal, natureEffect, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [tempText, setTempText] = useState('');

  const displayValue = useMemo(() => {
    if (isFocused) return tempText;
    if (evVal === 0) {
      if (natureEffect === 'minus') return '-';
      return '';
    }
    if (natureEffect === 'plus') return `${evVal}+`;
    if (natureEffect === 'minus') return `${evVal}-`;
    return `${evVal}`;
  }, [isFocused, tempText, evVal, natureEffect]);

  const textColor = useMemo(() => {
    if (isFocused) return 'text-white font-mono font-semibold';
    if (natureEffect === 'plus') return 'text-emerald-400 font-bold font-mono';
    if (natureEffect === 'minus') return 'text-rose-400 font-bold font-mono';
    return evVal > 0 ? 'text-white font-semibold font-mono' : 'text-slate-400 font-mono';
  }, [isFocused, natureEffect, evVal]);

  return (
    <input
      type="text"
      value={displayValue}
      onFocus={() => {
        setIsFocused(true);
        setTempText(evVal === 0 ? '' : String(evVal));
      }}
      onBlur={() => {
        setIsFocused(false);
        const parsed = parseInt(tempText, 10);
        if (!isNaN(parsed)) {
          onChange(parsed);
        } else if (tempText.trim() === '') {
          onChange(0);
        }
      }}
      onChange={(e) => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        setTempText(raw);
        const parsed = parseInt(raw, 10);
        if (!isNaN(parsed)) {
          onChange(parsed);
        } else if (raw === '') {
          onChange(0);
        }
      }}
      className={`w-11 sm:w-14 h-7 sm:h-8 rounded-md bg-slate-900 border border-slate-700 text-center text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition shadow-inner ${textColor}`}
      placeholder=""
    />
  );
};

export const PokemonDetailModal: React.FC<PokemonDetailModalProps> = ({
  isOpen,
  member,
  slotIndex,
  onClose,
  onUpdateMember,
  onRemoveMember,
}) => {
  const regInfo = member ? getPokemonRegionInfo(member.pokemon.id) : getPokemonRegionInfo(1);

  const [nickname, setNickname] = useState(member?.nickname || '');
  const [level, setLevel] = useState(member?.level ?? 50);
  const [isShiny, setIsShiny] = useState(member?.isShiny ?? false);
  const [heldItem, setHeldItem] = useState(member?.heldItem || '');
  const [ability, setAbility] = useState(member?.ability || member?.pokemon?.abilities?.[0] || '');
  const [moves, setMoves] = useState<string[]>(() => {
    const list = member ? [...member.moves] : [];
    while (list.length < 6) list.push('');
    return list.slice(0, 6);
  });

  // State for EVs (Max 66 total, Max 32 per stat)
  const [evs, setEvs] = useState<PokemonEvs>(() => {
    return (
      member?.evs || {
        hp: 0,
        attack: 0,
        defense: 0,
        spAttack: 0,
        spDefense: 0,
        speed: 0,
      }
    );
  });

  // State for Nature (default Jolly to match competitive standard)
  const [nature, setNature] = useState<string>(member?.nature || 'jolly');

  // Sync state whenever member changes
  useEffect(() => {
    if (member) {
      setNickname(member.nickname || '');
      setLevel(member.level);
      setIsShiny(member.isShiny);
      setHeldItem(member.heldItem || '');
      setAbility(member.ability || member.pokemon.abilities[0] || '');
      const list = [...member.moves];
      while (list.length < 6) list.push('');
      setMoves(list.slice(0, 6));
      setEvs(
        member.evs || {
          hp: 0,
          attack: 0,
          defense: 0,
          spAttack: 0,
          spDefense: 0,
          speed: 0,
        }
      );
      setNature(member.nature || 'jolly');
    }
  }, [member]);

  // State for Showdown Dex categorized learnset
  const [learnset, setLearnset] = useState<PokemonFullLearnset>({
    levelUp: [],
    tmHm: [],
    egg: [],
    pastGen: [],
    allMoves: [],
  });
  const [isLoadingMoves, setIsLoadingMoves] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('level');
  const [levelSubFilter, setLevelSubFilter] = useState<'available' | 'all'>('available');
  const [moveSearchQuery, setMoveSearchQuery] = useState('');
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);

  // Load comprehensive learnset from dex.pokemonshowdown.com
  useEffect(() => {
    if (!isOpen || !member) return;
    let isMounted = true;
    setIsLoadingMoves(true);

    getPokemonFullShowdownMoves(member.pokemon.name, member.pokemon.id)
      .then((data) => {
        if (isMounted) {
          setLearnset(data);
          setIsLoadingMoves(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching Showdown learnset:', err);
        if (isMounted) {
          setIsLoadingMoves(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, member?.pokemon.name, member?.pokemon.id]);

  // Level-up moves available up to current level
  const availableLevelMoves = useMemo(() => {
    return learnset.levelUp.filter((m) => (m.level ?? 0) <= level);
  }, [learnset.levelUp, level]);

  // Moves list based on current active tab and search
  const currentTabMoves = useMemo(() => {
    let list: ShowdownMoveDetail[] = [];

    switch (activeTab) {
      case 'level':
        list = levelSubFilter === 'available' ? availableLevelMoves : learnset.levelUp;
        break;
      case 'tm':
        list = learnset.tmHm;
        break;
      case 'egg':
        list = learnset.egg;
        break;
      case 'past_gen':
        list = learnset.pastGen;
        break;
      case 'all':
        list = learnset.allMoves;
        break;
    }

    if (moveSearchQuery.trim()) {
      const q = moveSearchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.type.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          (m.desc && m.desc.toLowerCase().includes(q)) ||
          (m.level !== undefined && String(m.level).includes(q))
      );
    }

    return list;
  }, [activeTab, levelSubFilter, availableLevelMoves, learnset, moveSearchQuery]);

  // EV pool calculations
  const totalUsedEvs = useMemo(() => {
    return (
      (evs.hp || 0) +
      (evs.attack || 0) +
      (evs.defense || 0) +
      (evs.spAttack || 0) +
      (evs.spDefense || 0) +
      (evs.speed || 0)
    );
  }, [evs]);

  const remainingEvs = Math.max(0, MAX_TOTAL_EVS - totalUsedEvs);

  const handleEvChange = (statKey: keyof PokemonEvs, delta: number) => {
    const current = evs[statKey] || 0;
    if (delta > 0) {
      const allowed = Math.min(delta, MAX_EV_PER_STAT - current, remainingEvs);
      if (allowed <= 0) return;
      setEvs((prev) => ({
        ...prev,
        [statKey]: current + allowed,
      }));
    } else if (delta < 0) {
      const allowed = Math.min(-delta, current);
      if (allowed <= 0) return;
      setEvs((prev) => ({
        ...prev,
        [statKey]: Math.max(0, current - allowed),
      }));
    }
  };

  const handleSetDirectEv = (statKey: keyof PokemonEvs, val: number) => {
    const current = evs[statKey] || 0;
    const target = Math.max(0, Math.min(MAX_EV_PER_STAT, val));
    const otherEvs = totalUsedEvs - current;
    const maxPossible = Math.min(MAX_EV_PER_STAT, MAX_TOTAL_EVS - otherEvs);
    const clamped = Math.max(0, Math.min(target, maxPossible));
    setEvs((prev) => ({
      ...prev,
      [statKey]: clamped,
    }));
  };

  const handleResetEvs = () => {
    setEvs({
      hp: 0,
      attack: 0,
      defense: 0,
      spAttack: 0,
      spDefense: 0,
      speed: 0,
    });
  };

  const handleApplyEvPreset = (preset: 'offensive_phys' | 'offensive_spec' | 'defensive' | 'balanced') => {
    switch (preset) {
      case 'offensive_phys':
        // +32 Atk, +32 Spe, +2 HP = 66, Jolly (+Spe, -SpA)
        setEvs({
          hp: 2,
          attack: 32,
          defense: 0,
          spAttack: 0,
          spDefense: 0,
          speed: 32,
        });
        setNature('jolly');
        break;
      case 'offensive_spec':
        // +32 SpA, +32 Spe, +2 HP = 66, Timid (+Spe, -Atk)
        setEvs({
          hp: 2,
          attack: 0,
          defense: 0,
          spAttack: 32,
          spDefense: 0,
          speed: 32,
        });
        setNature('timid');
        break;
      case 'defensive':
        // +32 HP, +32 Def, +2 SpD = 66, Bold (+Def, -Atk)
        setEvs({
          hp: 32,
          attack: 0,
          defense: 32,
          spAttack: 0,
          spDefense: 2,
          speed: 0,
        });
        setNature('bold');
        break;
      case 'balanced':
        // 11 in each of the 6 stats = 66, Hardy (Neutro)
        setEvs({
          hp: 11,
          attack: 11,
          defense: 11,
          spAttack: 11,
          spDefense: 11,
          speed: 11,
        });
        setNature('hardy');
        break;
    }
  };

  const handleSave = () => {
    if (!member) return;
    onUpdateMember({
      ...member,
      nickname: nickname.trim(),
      level: Math.max(1, Math.min(100, Number(level) || 50)),
      isShiny,
      heldItem: heldItem.trim(),
      ability,
      moves: moves.map((m) => m.trim()).filter((m) => m.length > 0),
      evs,
      nature,
    });
    onClose();
  };

  const handleMoveChange = (index: number, val: string) => {
    const updated = [...moves];
    updated[index] = val;
    setMoves(updated);
  };

  // Click on a move card from Showdown Dex list
  const handleSelectShowdownMove = (moveName: string) => {
    // If already in moveset, clicking it removes it
    const existingIndex = moves.findIndex((m) => m.toLowerCase() === moveName.toLowerCase());
    if (existingIndex !== -1) {
      handleMoveChange(existingIndex, '');
      return;
    }

    // Place into selected slot or first empty slot
    let targetIdx = selectedSlotIndex;
    if (moves[targetIdx]) {
      const firstEmpty = moves.findIndex((m) => !m);
      if (firstEmpty !== -1) {
        targetIdx = firstEmpty;
      }
    }

    handleMoveChange(targetIdx, moveName);
    // Advance selected slot to next
    setSelectedSlotIndex((targetIdx + 1) % 6);
  };

  // Quick fill 6 best level-appropriate moves
  const handleAutoFillLevelMoves = () => {
    const sorted = [...availableLevelMoves].sort((a, b) => {
      if (b.level !== a.level) return (b.level ?? 0) - (a.level ?? 0);
      return (b.basePower || 0) - (a.basePower || 0);
    });

    const chosen: string[] = [];
    for (const m of sorted) {
      if (!chosen.includes(m.name) && chosen.length < 6) {
        chosen.push(m.name);
      }
    }

    while (chosen.length < 6) {
      chosen.push('');
    }

    setMoves(chosen);
  };

  const handleClearAllMoves = () => {
    setMoves(['', '', '', '', '', '']);
  };

  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl max-h-[96vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white font-black text-sm flex items-center justify-center shadow-lg">
              #{slotIndex + 1}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  Personalizar {member.pokemon.displayName}
                  {isShiny && <Sparkles className="w-4 h-4 text-amber-400" />}
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${regInfo.badgeStyle}`}>
                  Região de {regInfo.regionName}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                {member.pokemon.types.map((type) => (
                  <span
                    key={type}
                    className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      TYPE_COLORS[type]?.bg || 'bg-slate-700'
                    } ${TYPE_COLORS[type]?.text || 'text-white'}`}
                  >
                    {TYPE_COLORS[type]?.label || type}
                  </span>
                ))}
                <span className="text-[11px] text-slate-400 ml-1">
                  Nível Atual: <strong className="text-white">{level}</strong>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin">
          {/* Top visual, nickname, level & ability row */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="relative group flex-shrink-0">
              <div className="w-28 h-28 flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-950 rounded-2xl p-2 border border-slate-700/80 overflow-hidden shadow-inner">
                <PokemonSpriteImage
                  id={member.pokemon.id}
                  name={member.pokemon.name}
                  isShiny={isShiny}
                  className="max-h-full max-w-full drop-shadow-lg scale-110"
                  alt={member.pokemon.displayName}
                />
              </div>
              <button
                type="button"
                onClick={() => setIsShiny(!isShiny)}
                className={`mt-2 w-full py-1 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition ${
                  isShiny
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                {isShiny ? 'Shiny Ativo ✨' : 'Tornar Shiny'}
              </button>

              <div className="mt-1.5 w-full flex justify-center">
                <SpriteFormatToggle size="sm" showLabel={true} className="w-full justify-center" />
              </div>
            </div>

            <div className="flex-1 space-y-3 w-full">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Apelido do Pokémon (Opcional)
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={`Ex: ${member.pokemon.displayName}`}
                  maxLength={30}
                  className="w-full px-3.5 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Level with quick slider/input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Nível Atual ({level})
                    </label>
                    <span className="text-[10px] text-rose-400 font-semibold">
                      Desbloqueia golpes de nível
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={level}
                      onChange={(e) =>
                        setLevel(Math.max(1, Math.min(100, Number(e.target.value) || 1)))
                      }
                      className="w-20 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white font-mono font-bold focus:outline-none focus:border-rose-500 text-center"
                    />
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={level}
                      onChange={(e) => setLevel(Number(e.target.value))}
                      className="flex-1 accent-rose-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Ability */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Habilidade
                  </label>
                  <select
                    value={ability}
                    onChange={(e) => setAbility(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500 cursor-pointer font-medium"
                  >
                    {member.pokemon.abilities.map((ab) => (
                      <option key={ab} value={ab}>
                        {ab}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Held Item */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Item Segurado (Held Item)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={heldItem}
                onChange={(e) => setHeldItem(e.target.value)}
                placeholder="Ex: Restos (Leftovers), Faixa Foco, Bola de Luz..."
                className="flex-1 px-3.5 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <select
                onChange={(e) => {
                  if (e.target.value) setHeldItem(e.target.value);
                }}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="">Itens comuns...</option>
                {POPULAR_ITEMS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Moveset (6 Slots) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Swords className="w-4 h-4 text-rose-400" />
                  Moveset Ativo ({moves.filter(Boolean).length}/6 Golpes)
                </label>
                <p className="text-[11px] text-slate-400">
                  Selecione um slot para equipar ou clique em qualquer golpe das categorias abaixo (Showdown Dex)
                </p>
              </div>

              <button
                type="button"
                onClick={handleClearAllMoves}
                className="text-[11px] text-slate-400 hover:text-red-400 font-semibold transition"
              >
                Esvaziar Slots
              </button>
            </div>

            {/* 6 Move Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {[0, 1, 2, 3, 4, 5].map((idx) => {
                const moveVal = moves[idx] || '';
                const isSelected = selectedSlotIndex === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedSlotIndex(idx)}
                    className={`relative rounded-xl border p-2.5 flex items-center justify-between cursor-pointer transition ${
                      isSelected
                        ? 'border-rose-500 bg-rose-500/10 ring-1 ring-rose-500'
                        : moveVal
                        ? 'border-slate-700 bg-slate-800/80 hover:border-slate-600'
                        : 'border-dashed border-slate-800 bg-slate-950/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="w-5 h-5 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-mono font-bold text-rose-400 flex-shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={moveVal}
                        onChange={(e) => handleMoveChange(idx, e.target.value)}
                        placeholder="Vazio (Clique para preencher)"
                        className="bg-transparent text-xs font-bold text-white placeholder-slate-500 focus:outline-none w-full truncate"
                      />
                    </div>

                    {moveVal && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveChange(idx, '');
                        }}
                        className="text-slate-500 hover:text-red-400 p-1"
                        title="Limpar este golpe"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* BANCO DE GOLPES: DEX.POKEMONSHOWDOWN.COM (Nível, TM/HM, Ovo, Past Gen) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-inner space-y-4">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    Aprender Golpes (dex.pokemonshowdown.com)
                  </span>
                  <a
                    href={`https://dex.pokemonshowdown.com/pokemon/${member.pokemon.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-400 hover:text-sky-300 bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded-md transition"
                    title="Ver página oficial no Pokémon Showdown Dex"
                  >
                    <span>dex.pokemonshowdown.com</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Movimentos oficiais por Nível, TM/HM, Cruzamento por Ovo e Gerações Passadas/Transferência.
                </p>
              </div>

              {/* Action buttons */}
              {activeTab === 'level' && (
                <button
                  type="button"
                  onClick={handleAutoFillLevelMoves}
                  disabled={availableLevelMoves.length === 0}
                  className="py-1.5 px-3 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-rose-950/30 flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-40"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Preencher Golpes do Nv. {level}</span>
                </button>
              )}
            </div>

            {/* Category Navigation Tabs: Nível, TM/HM, Ovo, Past Gen, Todos */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {/* Tab 1: Por Nível */}
              <button
                type="button"
                onClick={() => setActiveTab('level')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  activeTab === 'level'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Por Nível</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/70 font-mono">
                  {learnset.levelUp.length}
                </span>
              </button>

              {/* Tab 2: TM / HM */}
              <button
                type="button"
                onClick={() => setActiveTab('tm')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  activeTab === 'tm'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                <Disc className="w-3.5 h-3.5 text-blue-400" />
                <span>TM / HM</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/70 font-mono">
                  {learnset.tmHm.length}
                </span>
              </button>

              {/* Tab 3: Ovo (Egg Moves) */}
              <button
                type="button"
                onClick={() => setActiveTab('egg')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  activeTab === 'egg'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                <Egg className="w-3.5 h-3.5 text-amber-400" />
                <span>Ovo (Egg Moves)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/70 font-mono">
                  {learnset.egg.length}
                </span>
              </button>

              {/* Tab 4: Past Generations / Tutors */}
              <button
                type="button"
                onClick={() => setActiveTab('past_gen')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  activeTab === 'past_gen'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                <History className="w-3.5 h-3.5 text-purple-400" />
                <span>Gerações Passadas</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/70 font-mono">
                  {learnset.pastGen.length}
                </span>
              </button>

              {/* Tab 5: Todos os Golpes */}
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  activeTab === 'all'
                    ? 'bg-slate-700 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Todos</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/70 font-mono">
                  {learnset.allMoves.length}
                </span>
              </button>
            </div>

            {/* Sub-controls: Level subfilter (when activeTab === 'level') & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              {activeTab === 'level' ? (
                <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setLevelSubFilter('available')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                      levelSubFilter === 'available'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Unlock className="w-3 h-3 text-emerald-400" />
                    <span>Disponíveis até o Nv. {level}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/80 font-mono">
                      {availableLevelMoves.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLevelSubFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                      levelSubFilter === 'all'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Todos os Níveis (1-100)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/80 font-mono">
                      {learnset.levelUp.length}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  {activeTab === 'tm' && (
                    <span>Movimentos aprendidos via Máquinas Técnicas (TM/TR/HM):</span>
                  )}
                  {activeTab === 'egg' && (
                    <span>Movimentos herdados por cruzamento de ovo (inclui pré-evoluções):</span>
                  )}
                  {activeTab === 'past_gen' && (
                    <span>Movimentos disponíveis em jogos anteriores ou Move Tutors clássicos:</span>
                  )}
                  {activeTab === 'all' && (
                    <span>Catálogo completo de todos os golpes que este Pokémon pode ter:</span>
                  )}
                </div>
              )}

              {/* Quick Search */}
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={moveSearchQuery}
                  onChange={(e) => setMoveSearchQuery(e.target.value)}
                  placeholder="Buscar golpe por nome ou tipo..."
                  className="w-full pl-8 pr-6 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                {moveSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setMoveSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Moves List Grid */}
            <div className="max-h-72 overflow-y-auto pr-1 scrollbar-thin">
              {isLoadingMoves ? (
                <div className="py-14 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                  <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">
                    Carregando banco de golpes do Showdown (Nível, TM/HM, Ovo, Past Gen)...
                  </span>
                </div>
              ) : currentTabMoves.length === 0 ? (
                <div className="py-10 text-center text-slate-500 text-xs">
                  {moveSearchQuery
                    ? `Nenhum golpe encontrado para "${moveSearchQuery}" nesta categoria.`
                    : activeTab === 'level' && levelSubFilter === 'available'
                    ? `Nenhum golpe aprendido até o Nível ${level}. Aumente o nível do Pokémon ou selecione "Todos os Níveis".`
                    : activeTab === 'egg'
                    ? 'Este Pokémon não possui Egg moves registrados (ex: lendários ou Pokémon sem gênero).'
                    : 'Nenhum golpe encontrado nesta categoria.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {currentTabMoves.map((m) => {
                    const isEquipped = moves.some(
                      (eq) => eq.toLowerCase() === m.name.toLowerCase()
                    );
                    const isLevelMove = m.learnMethod === 'level' || m.level !== undefined && m.level !== null;
                    const isUnlocked = !isLevelMove || (m.level ?? 0) <= level;
                    const typeStyle = TYPE_COLORS[m.type];

                    // Visual badge based on learn method
                    let methodBadge = null;
                    if (isLevelMove) {
                      methodBadge = (
                        <span
                          className={`px-1.5 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                            m.level === 0 || m.level === 1
                              ? 'bg-slate-800 text-slate-300'
                              : isUnlocked
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-800/80 text-slate-500 border border-slate-800'
                          }`}
                        >
                          {m.level === 0 ? 'Evolução' : `Nv. ${m.level}`}
                        </span>
                      );
                    } else if (m.learnMethod === 'tm') {
                      methodBadge = (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                          <Disc className="w-2.5 h-2.5" /> TM / HM
                        </span>
                      );
                    } else if (m.learnMethod === 'egg') {
                      methodBadge = (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <Egg className="w-2.5 h-2.5" /> Ovo
                        </span>
                      );
                    } else {
                      methodBadge = (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                          <History className="w-2.5 h-2.5" /> Gen Passada
                        </span>
                      );
                    }

                    return (
                      <button
                        key={`${m.id}-${m.learnMethod}-${m.level ?? ''}`}
                        type="button"
                        onClick={() => handleSelectShowdownMove(m.name)}
                        className={`p-2.5 rounded-xl border text-left transition relative flex flex-col justify-between group ${
                          isEquipped
                            ? 'bg-rose-950/40 border-rose-500/80 ring-1 ring-rose-500/50'
                            : isUnlocked
                            ? 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                            : 'bg-slate-950/40 border-slate-900 opacity-60 hover:opacity-90'
                        }`}
                        title={
                          isEquipped
                            ? `${m.name} está no seu moveset. Clique para remover.`
                            : isUnlocked
                            ? `Clique para adicionar ${m.name} ao Slot #${selectedSlotIndex + 1}`
                            : `Desbloqueado no Nível ${m.level} (Nível atual: ${level})`
                        }
                      >
                        {/* Top: Learn Badge + Status / Lock */}
                        <div className="flex items-center justify-between mb-1.5">
                          {methodBadge}

                          <div className="flex items-center gap-1">
                            {isEquipped ? (
                              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-bold">
                                <Check className="w-2.5 h-2.5 text-rose-400" />
                                No Moveset
                              </span>
                            ) : !isUnlocked ? (
                              <span className="flex items-center gap-0.5 text-[9px] font-semibold text-slate-500">
                                <Lock className="w-2.5 h-2.5" />
                                Nv. {m.level}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition font-bold text-rose-400">
                                + Adicionar
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Move Name */}
                        <div className="font-bold text-xs text-white group-hover:text-rose-300 transition truncate mb-1">
                          {m.name}
                        </div>

                        {/* Details: Type, Category, Power, Accuracy */}
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <div className="flex items-center gap-1">
                            <span
                              className={`text-[8px] uppercase font-bold px-1.5 py-0.2 rounded ${
                                typeStyle?.bg || 'bg-slate-800'
                              } ${typeStyle?.text || 'text-white'}`}
                            >
                              {typeStyle?.label || m.type}
                            </span>
                            <span className="text-[9px] text-slate-400">
                              {m.category === 'Physical'
                                ? 'Físico 💥'
                                : m.category === 'Special'
                                ? 'Especial 🔮'
                                : 'Status ⚪'}
                            </span>
                          </div>

                          <span className="font-mono text-[9px] text-slate-400">
                            {m.basePower ? `Poder: ${m.basePower}` : 'Status'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Estatísticas de Batalha no Nível Respectivo (IV 31) & Gráficos Showdown */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl space-y-4">
            {/* Header com resumo do orçamento de EVs e Presets */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    Estatísticas de Batalha (Nível {level} • IV 31)
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                    IV: 31 Máximo
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Gráficos de Base Stat, ajuste de EVs (máx. 66 pontos totais, máx. 32 por atributo) e Natureza com multiplicador ±10%.
                </p>
              </div>

              {/* Presets Rápidos de Distribuição */}
              <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mr-0.5">
                  Presets:
                </span>
                <button
                  type="button"
                  onClick={() => handleApplyEvPreset('offensive_phys')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition whitespace-nowrap"
                  title="+32 Atk, +32 Vel, +2 HP, Jolly"
                >
                  💥 Físico (+32 Atk/Vel)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyEvPreset('offensive_spec')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-purple-950/40 text-slate-300 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition whitespace-nowrap"
                  title="+32 SpA, +32 Vel, +2 HP, Timid"
                >
                  🔮 Especial (+32 SpA/Vel)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyEvPreset('defensive')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-blue-950/40 text-slate-300 hover:text-blue-300 border border-slate-800 hover:border-blue-500/40 transition whitespace-nowrap"
                  title="+32 HP, +32 Def, +2 SpD, Bold"
                >
                  🛡️ Defensivo (+32 HP/Def)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyEvPreset('balanced')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition whitespace-nowrap"
                  title="11 pontos em cada uma das 6 estatísticas, Hardy"
                >
                  ⚖️ Equilibrado (+11)
                </button>
                {totalUsedEvs > 0 && (
                  <button
                    type="button"
                    onClick={handleResetEvs}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 transition"
                    title="Zerar todos os pontos de EV"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Barra de orçamento de EVs (66 pontos) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Orçamento Total de Treinamento (EVs)</span>
                <span className="font-mono">
                  {totalUsedEvs >= MAX_TOTAL_EVS ? 'Limite atingido (66/66 pts)' : `${remainingEvs} pontos restantes para distribuir`}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-300 ${
                    totalUsedEvs >= MAX_TOTAL_EVS
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                      : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                  }`}
                  style={{ width: `${Math.min(100, (totalUsedEvs / MAX_TOTAL_EVS) * 100)}%` }}
                />
              </div>
            </div>

            {/* TABELA DE ESTATÍSTICAS COM GRÁFICOS SEGUINDO O EXEMPLO */}
            <div className="overflow-x-auto pb-1 pt-1">
              <div className="min-w-[540px] px-1 sm:px-2">
                {/* Headers da Tabela: Base | Pontos */}
                <div className="grid grid-cols-[115px_42px_140px_52px_1fr_48px] sm:grid-cols-[130px_46px_180px_60px_1fr_56px] items-center gap-2 sm:gap-3 text-xs mb-1.5">
                  <div />
                  <div className="col-span-2 flex items-center justify-start pl-1">
                    <span className="italic text-slate-400 text-xs font-serif">Base</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-start pl-1">
                    <span className="font-bold text-slate-100 text-xs">Pontos</span>
                  </div>
                  <div />
                </div>

                {/* Linhas das 6 Estatísticas */}
                <div className="space-y-2.5">
                  {[
                    { key: 'hp' as keyof PokemonEvs, label: 'HP', baseVal: member.pokemon.stats.hp },
                    { key: 'attack' as keyof PokemonEvs, label: 'Ataque', baseVal: member.pokemon.stats.attack },
                    { key: 'defense' as keyof PokemonEvs, label: 'Defesa', baseVal: member.pokemon.stats.defense },
                    { key: 'spAttack' as keyof PokemonEvs, label: 'Sp. Atk.', baseVal: member.pokemon.stats.spAttack },
                    { key: 'spDefense' as keyof PokemonEvs, label: 'Defesa Especial', baseVal: member.pokemon.stats.spDefense },
                    { key: 'speed' as keyof PokemonEvs, label: 'Velocidade', baseVal: member.pokemon.stats.speed },
                  ].map((stat) => {
                    const evVal = evs[stat.key] || 0;
                    const calc = calculateStatAtLevel(stat.baseVal, stat.key, level, evVal, member.pokemon.name, nature);

                    return (
                      <div
                        key={stat.key}
                        className="grid grid-cols-[115px_42px_140px_52px_1fr_48px] sm:grid-cols-[130px_46px_180px_60px_1fr_56px] items-center gap-2 sm:gap-3 py-0.5 group"
                      >
                        {/* 1. Nome do Stat (Alinhado à direita, encostado no valor base) */}
                        <div className="text-right font-medium text-xs sm:text-sm text-slate-300 pr-1 truncate">
                          {stat.label}
                        </div>

                        {/* 2. Valor Base (Negrito) */}
                        <div className="text-center font-bold text-xs sm:text-sm text-white font-mono">
                          {stat.baseVal}
                        </div>

                        {/* 3. Gráfico de Barra Horizontal da Base (Cores Showdown) */}
                        <div className="w-full h-2.5 bg-slate-900/90 rounded-full overflow-hidden p-0.5 border border-slate-800">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(100, Math.max(6, Math.round((stat.baseVal / 180) * 100)))}%`,
                              backgroundColor: getBaseStatBarColor(stat.baseVal),
                            }}
                          />
                        </div>

                        {/* 4. Caixa de Input de Pontos de EV */}
                        <div className="flex justify-center">
                          <EvStatInput
                            evVal={evVal}
                            natureEffect={calc.natureEffect}
                            onChange={(newVal) => handleSetDirectEv(stat.key, newVal)}
                          />
                        </div>

                        {/* 5. Slider de Pontos */}
                        <div className="flex items-center px-1">
                          <input
                            type="range"
                            min="0"
                            max="32"
                            value={evVal}
                            onChange={(e) => handleSetDirectEv(stat.key, Number(e.target.value))}
                            className="stat-slider w-full cursor-pointer"
                          />
                        </div>

                        {/* 6. Estatística Final Calculada */}
                        <div
                          className={`text-right font-mono font-bold text-xs sm:text-sm ${
                            calc.natureEffect === 'plus'
                              ? 'text-emerald-400 font-black'
                              : calc.natureEffect === 'minus'
                              ? 'text-rose-400 font-black'
                              : 'text-white'
                          }`}
                        >
                          {calc.finalStat}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Indicador Restantes: 0 (Centralizado / Alinhado como no exemplo) */}
                <div className="text-center py-3">
                  <span className="italic text-slate-400 text-xs sm:text-sm">Restantes:</span>{' '}
                  <strong
                    className={`font-mono text-sm sm:text-base font-bold ml-2 ${
                      remainingEvs === 0 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {remainingEvs}
                  </strong>
                </div>

                {/* Seletor de Natureza com Dropdown */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <label className="text-xs sm:text-sm font-semibold text-slate-300 whitespace-nowrap">
                    Natureza:
                  </label>
                  <div className="relative max-w-xs flex-1 sm:flex-initial sm:w-72">
                    <select
                      value={nature}
                      onChange={(e) => setNature(e.target.value)}
                      className="w-full bg-slate-900 hover:bg-slate-850 text-white text-xs sm:text-sm font-medium rounded-lg px-3 py-1.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer shadow-sm transition"
                    >
                      {POKEMON_NATURES.map((nat) => (
                        <option key={nat.id} value={nat.id}>
                          {nat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onRemoveMember(member.slotId);
              onClose();
            }}
            className="px-3.5 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-transparent hover:border-red-500/20"
          >
            <Trash2 className="w-4 h-4" />
            Remover do Time
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-950/40 transition"
            >
              <Check className="w-4 h-4" />
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
