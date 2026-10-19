import React, { useMemo } from 'react';
import {
  Plus,
  Sparkles,
  Trash2,
  Edit3,
  Dices,
  RotateCcw,
  ArrowLeftRight,
  ShieldAlert,
  Zap,
  ChevronLeft,
  ChevronRight,
  Heart,
  Package,
} from 'lucide-react';
import { TeamMember, PokemonData, TYPE_COLORS, PokemonType } from '../types/pokemon';
import { TYPE_CHART } from '../services/pokemonApi';
import { PokemonSpriteImage } from './PokemonSpriteImage';
import { SpriteFormatToggle } from './SpriteFormatToggle';

interface PokemonTeamBuilderProps {
  team: (TeamMember | null)[];
  onOpenPicker: (slotIndex: number) => void;
  onOpenDetail: (slotIndex: number) => void;
  onRemoveMember: (slotIndex: number) => void;
  onToggleShiny: (slotIndex: number) => void;
  onMoveSlot: (fromIndex: number, toIndex: number) => void;
  onRandomizeTeam: () => void;
  onClearTeam: () => void;
  onSendToBox?: (slotIndex: number) => void;
  onBringFromBox?: (slotIndex: number) => void;
  boxCount?: number;
}

export const PokemonTeamBuilder: React.FC<PokemonTeamBuilderProps> = ({
  team,
  onOpenPicker,
  onOpenDetail,
  onRemoveMember,
  onToggleShiny,
  onMoveSlot,
  onRandomizeTeam,
  onClearTeam,
  onSendToBox,
  onBringFromBox,
  boxCount = 0,
}) => {
  const activeCount = team.filter((m) => m !== null).length;

  // Calculate team types present
  const typesInTeam = useMemo(() => {
    const set = new Set<PokemonType>();
    team.forEach((m) => {
      if (m) {
        m.pokemon.types.forEach((t) => set.add(t));
      }
    });
    return Array.from(set);
  }, [team]);

  // Calculate team defensive weaknesses
  const teamWeaknessStats = useMemo(() => {
    const weaknessCounts: Partial<Record<PokemonType, number>> = {};
    const immunityCounts: Partial<Record<PokemonType, number>> = {};

    team.forEach((m) => {
      if (!m) return;
      (Object.keys(TYPE_COLORS) as PokemonType[]).forEach((atkType) => {
        let mult = 1;
        for (const defType of m.pokemon.types) {
          const chart = TYPE_CHART[defType];
          if (chart && chart[atkType] !== undefined) {
            mult *= chart[atkType]!;
          }
        }
        if (mult > 1) {
          weaknessCounts[atkType] = (weaknessCounts[atkType] || 0) + 1;
        } else if (mult === 0) {
          immunityCounts[atkType] = (immunityCounts[atkType] || 0) + 1;
        }
      });
    });

    // top 4 critical weaknesses (highest count of team members weak to it)
    const sortedWeaknesses = Object.entries(weaknessCounts)
      .sort(([, a], [, b]) => b - a)
      .filter(([, count]) => count >= 2)
      .slice(0, 4) as [PokemonType, number][];

    return { sortedWeaknesses, immunityCounts };
  }, [team]);

  // Average team stats
  const avgStats = useMemo(() => {
    const active = team.filter((m): m is TeamMember => m !== null);
    if (active.length === 0) return null;
    const totals = active.reduce(
      (acc, m) => {
        acc.hp += m.pokemon.stats.hp;
        acc.atk += m.pokemon.stats.attack;
        acc.def += m.pokemon.stats.defense;
        acc.spa += m.pokemon.stats.spAttack;
        acc.spd += m.pokemon.stats.spDefense;
        acc.spe += m.pokemon.stats.speed;
        acc.level += m.level;
        return acc;
      },
      { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, level: 0 }
    );
    const n = active.length;
    return {
      hp: Math.round(totals.hp / n),
      atk: Math.round(totals.atk / n),
      def: Math.round(totals.def / n),
      spa: Math.round(totals.spa / n),
      spd: Math.round(totals.spd / n),
      spe: Math.round(totals.spe / n),
      level: Math.round(totals.level / n),
    };
  }, [team]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md flex flex-col justify-between">
      <div>
        {/* Team Builder Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-800 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold tracking-widest text-emerald-400 uppercase">
                Formação da Equipe
              </span>
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <h2 className="text-xl font-black text-white tracking-tight">
                Time Pokémon ({activeCount}/6)
              </h2>
              {/* Pokeball slot indicators */}
              <div className="flex items-center gap-1">
                {team.map((m, idx) => (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full border transition-all ${
                      m
                        ? 'bg-rose-500 border-white shadow-sm ring-1 ring-rose-500/50'
                        : 'bg-slate-800 border-slate-700'
                    }`}
                    title={m ? m.nickname || m.pokemon.displayName : `Slot ${idx + 1} Vazio`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <SpriteFormatToggle size="sm" showLabel={true} />

            <button
              type="button"
              onClick={onRandomizeTeam}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700/60"
              title="Gerar 6 Pokémon aleatórios"
            >
              <Dices className="w-3.5 h-3.5 text-amber-400" />
              <span>Time Aleatório</span>
            </button>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={onClearTeam}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs font-semibold flex items-center gap-1 transition border border-slate-700/60"
                title="Esvaziar equipe"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Limpar</span>
              </button>
            )}
          </div>
        </div>

        {/* 6 Team Slots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
          {team.map((member, slotIndex) => {
            if (!member) {
              // Empty slot
              return (
                <div
                  key={`empty-${slotIndex}`}
                  onClick={() => onOpenPicker(slotIndex)}
                  className="group relative h-48 rounded-2xl border-2 border-dashed border-slate-800 hover:border-rose-500/60 bg-slate-950/40 hover:bg-slate-800/30 p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700/80 group-hover:border-rose-500 flex items-center justify-center text-slate-400 group-hover:text-rose-400 group-hover:scale-110 transition">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="mt-3 text-xs font-bold text-slate-400 group-hover:text-white transition">
                    Slot #{slotIndex + 1} Vazio
                  </span>
                  
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap justify-center">
                    <span className="text-[11px] text-rose-400 font-semibold flex items-center gap-0.5">
                      <Plus className="w-3 h-3" /> Pokédex
                    </span>
                    {boxCount > 0 && onBringFromBox && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onBringFromBox(slotIndex);
                        }}
                        className="text-[10px] text-blue-300 hover:text-white bg-blue-950/80 hover:bg-blue-900 border border-blue-800/60 px-2 py-0.5 rounded-lg flex items-center gap-1 font-bold shadow-sm transition"
                        title="Escolher do Box"
                      >
                        <Package className="w-3 h-3 text-blue-400" />
                        <span>Do Box ({boxCount})</span>
                      </button>
                    )}
                  </div>

                  {/* Slot number badge */}
                  <span className="absolute top-3 left-3 text-[10px] font-mono font-bold text-slate-600 group-hover:text-slate-400">
                    SLOT 0{slotIndex + 1}
                  </span>
                </div>
              );
            }

            // Filled Slot
            const artwork = member.isShiny
              ? member.pokemon.shinyArtwork
              : member.pokemon.artwork;

            return (
              <div
                key={member.slotId || `slot-${slotIndex}`}
                className="group relative rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900 border border-slate-700/80 hover:border-slate-600 p-3.5 shadow-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              >
                {/* Top slot bar */}
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-[10px] text-slate-400 font-bold">
                    #{String(member.pokemon.id).padStart(3, '0')} · SLOT 0{slotIndex + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    {/* Reorder buttons */}
                    {slotIndex > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveSlot(slotIndex, slotIndex - 1);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700/60"
                        title="Mover para esquerda"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {slotIndex < 5 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveSlot(slotIndex, slotIndex + 1);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700/60"
                        title="Mover para direita"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {/* Shiny toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleShiny(slotIndex);
                      }}
                      className={`p-1 rounded transition ${
                        member.isShiny
                          ? 'text-amber-300 bg-amber-500/20'
                          : 'text-slate-400 hover:text-amber-400'
                      }`}
                      title={member.isShiny ? 'Forma Shiny ativa' : 'Alternar Shiny'}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Main pokemon presentation */}
                <div
                  onClick={() => onOpenDetail(slotIndex)}
                  className="flex items-center gap-3 cursor-pointer py-1.5"
                >
                  <div className="w-20 h-20 sm:w-22 sm:h-22 flex-shrink-0 relative flex items-center justify-center bg-slate-950/40 rounded-xl p-1 border border-slate-800 overflow-hidden group-hover:border-rose-500/40 transition">
                    <PokemonSpriteImage
                      id={member.pokemon.id}
                      name={member.pokemon.name}
                      isShiny={member.isShiny}
                      className="max-h-full max-w-full drop-shadow-md group-hover:scale-110"
                      alt={member.pokemon.displayName}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm text-white truncate group-hover:text-rose-400 transition">
                        {member.nickname || member.pokemon.displayName}
                      </p>
                    </div>

                    {member.nickname && (
                      <p className="text-[11px] text-slate-400 truncate">
                        ({member.pokemon.displayName})
                      </p>
                    )}

                    {/* Level */}
                    <p className="text-xs font-mono font-bold text-amber-300 mt-0.5">
                      Nv. {member.level}
                    </p>

                    {/* Types */}
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      {member.pokemon.types.map((type) => {
                        const style = TYPE_COLORS[type];
                        return (
                          <span
                            key={type}
                            className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${style.bg} ${style.text}`}
                          >
                            {style.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Moves / Item summary */}
                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[130px]" title={member.heldItem || 'Sem item'}>
                    🎒 {member.heldItem ? member.heldItem.split(' ')[0] : 'Sem Item'}
                  </span>
                  <div className="flex items-center gap-1">
                    {onSendToBox && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSendToBox(slotIndex);
                        }}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 text-[10px] font-semibold flex items-center gap-1 transition border border-slate-700/60"
                        title="Enviar este Pokémon para o Box"
                      >
                        <Package className="w-3 h-3" />
                        <span>Box</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onOpenDetail(slotIndex)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold flex items-center gap-1 transition"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveMember(slotIndex)}
                      className="p-1 rounded bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
                      title="Remover"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Team Synergy, Type Coverage & Defensive Analysis */}
        {activeCount > 0 && (
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Análise Tática do Time
              </span>
              {avgStats && (
                <span className="text-xs text-slate-400 font-mono">
                  Média do Time: <strong className="text-white">Nv. {avgStats.level}</strong> · Total Médio:{' '}
                  <strong className="text-emerald-400">
                    {avgStats.hp + avgStats.atk + avgStats.def + avgStats.spa + avgStats.spd + avgStats.spe}
                  </strong>
                </span>
              )}
            </div>

            {/* Type coverage badges */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Tipos Representados na Equipe ({typesInTeam.length}/18):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {typesInTeam.map((type) => {
                  const style = TYPE_COLORS[type];
                  return (
                    <span
                      key={type}
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${style.bg} ${style.text}`}
                    >
                      {style.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Critical weaknesses notification */}
            {teamWeaknessStats.sortedWeaknesses.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
                <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-xs text-slate-400">
                  Atenção às fraquezas acumuladas:
                </span>
                {teamWeaknessStats.sortedWeaknesses.map(([type, count]) => (
                  <span
                    key={type}
                    className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-medium"
                  >
                    {count}x fraco a {TYPE_COLORS[type]?.label || type}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
