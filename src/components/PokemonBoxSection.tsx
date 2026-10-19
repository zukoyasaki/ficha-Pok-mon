import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Sparkles,
  Edit3,
  Trash2,
  ArrowLeftRight,
  Search,
  Zap,
  Check,
  X,
  Send,
  Download,
} from 'lucide-react';
import { TeamMember, TYPE_COLORS, PokemonType } from '../types/pokemon';
import { PokemonSpriteImage } from './PokemonSpriteImage';
import { SpriteFormatToggle } from './SpriteFormatToggle';

interface PokemonBoxSectionProps {
  box: TeamMember[];
  team: (TeamMember | null)[];
  onOpenPickerForBox: () => void;
  onEditBoxMember: (index: number) => void;
  onRemoveBoxMember: (index: number) => void;
  onMoveToTeam: (boxIndex: number, targetSlotIndex?: number) => void;
}

export const PokemonBoxSection: React.FC<PokemonBoxSectionProps> = ({
  box,
  team,
  onOpenPickerForBox,
  onEditBoxMember,
  onRemoveBoxMember,
  onMoveToTeam,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [swapModalBoxIndex, setSwapModalBoxIndex] = useState<number | null>(null);

  const filteredBox = useMemo(() => {
    if (!searchTerm.trim()) return box;
    const q = searchTerm.toLowerCase();
    return box.filter(
      (m) =>
        m.pokemon.displayName.toLowerCase().includes(q) ||
        m.nickname.toLowerCase().includes(q) ||
        String(m.pokemon.id).includes(q) ||
        m.pokemon.types.some((t) => t.toLowerCase().includes(q))
    );
  }, [box, searchTerm]);

  const firstEmptyTeamSlot = team.findIndex((m) => m === null);
  const teamIsFull = firstEmptyTeamSlot === -1;

  const handleQuickMove = (boxIndex: number) => {
    if (!teamIsFull) {
      // Direct move to first empty slot
      onMoveToTeam(boxIndex, firstEmptyTeamSlot);
    } else {
      // Team is full, prompt user to select which slot to swap with
      setSwapModalBoxIndex(boxIndex);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[11px] font-bold tracking-widest text-blue-400 uppercase">
              Armazenamento PC
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-400" />
              Box Pokémon ({box.length})
            </h2>
            <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
              Prontos para troca
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Guarde Pokémon já editados com golpes e itens para alternar livremente com seu time de 6.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <SpriteFormatToggle size="sm" showLabel={true} />

          {/* Quick Search inside box */}
          {box.length > 3 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar Box..."
                className="pl-8 pr-2.5 py-1.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-32 sm:w-40"
              />
            </div>
          )}

          <button
            type="button"
            onClick={onOpenPickerForBox}
            className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-950/40 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar ao Box</span>
          </button>
        </div>
      </div>

      {/* Empty Box State */}
      {box.length === 0 ? (
        <div className="py-12 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-slate-950/40">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3 shadow-inner">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            Seu Box de Pokémon está vazio
          </h3>
          <p className="text-xs text-slate-400 max-w-md mb-4">
            Adicione outros Pokémon aqui para personalizá-los com níveis, apelidos e seus 6 golpes. Eles ficarão salvos e disponíveis para trocar com a sua equipe a qualquer hora!
          </p>
          <button
            type="button"
            onClick={onOpenPickerForBox}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-900/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Escolher Pokémon para o Box</span>
          </button>
        </div>
      ) : (
        /* Box Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredBox.map((member, index) => {
            const artwork = member.isShiny
              ? member.pokemon.shinyArtwork
              : member.pokemon.artwork;

            return (
              <div
                key={member.slotId || `box-${index}`}
                className="group relative rounded-2xl bg-gradient-to-b from-slate-800/70 to-slate-900/90 border border-slate-700/80 hover:border-blue-500/60 p-3.5 shadow-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              >
                {/* Header tag */}
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-[10px] text-blue-400 font-bold bg-blue-950/60 border border-blue-800/50 px-2 py-0.5 rounded-md">
                    BOX #{index + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {member.isShiny && (
                      <span className="text-amber-400 flex items-center gap-0.5 text-[10px] font-bold">
                        <Sparkles className="w-3 h-3" /> Shiny
                      </span>
                    )}
                    <span className="font-mono text-[11px] font-bold text-amber-300">
                      Nv. {member.level}
                    </span>
                  </div>
                </div>

                {/* Pokemon Visual & Details */}
                <div
                  onClick={() => onEditBoxMember(index)}
                  className="flex items-center gap-3 cursor-pointer py-1.5"
                  title="Clique para editar este Pokémon"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 relative flex items-center justify-center bg-slate-950/50 rounded-xl p-1 border border-slate-800 group-hover:border-blue-500/40 transition overflow-hidden">
                    <PokemonSpriteImage
                      id={member.pokemon.id}
                      name={member.pokemon.name}
                      isShiny={member.isShiny}
                      className="max-h-full max-w-full drop-shadow-md group-hover:scale-110"
                      alt={member.pokemon.displayName}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-white truncate group-hover:text-blue-300 transition">
                      {member.nickname || member.pokemon.displayName}
                    </p>
                    {member.nickname && (
                      <p className="text-[11px] text-slate-400 truncate">
                        ({member.pokemon.displayName})
                      </p>
                    )}

                    {/* Types */}
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      {member.pokemon.types.map((type) => {
                        const style = TYPE_COLORS[type];
                        return (
                          <span
                            key={type}
                            className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded ${style?.bg || 'bg-slate-700'} ${style?.text || 'text-white'}`}
                          >
                            {style?.label || type}
                          </span>
                        );
                      })}
                    </div>

                    {/* Moves count & Held item */}
                    <div className="mt-1 text-[10px] text-slate-400 flex items-center gap-2">
                      <span>⚔️ {member.moves.length}/6 golpes</span>
                      {member.heldItem && (
                        <span className="truncate max-w-[80px]" title={member.heldItem}>
                          🎒 {member.heldItem.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions: Trocar com o Time / Editar / Remover */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                  <button
                    type="button"
                    onClick={() => handleQuickMove(index)}
                    className="flex-1 py-1.5 px-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 transition"
                    title={
                      !teamIsFull
                        ? 'Adicionar ao primeiro slot vazio da equipe'
                        : 'Trocar com um Pokémon da equipe'
                    }
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>
                      {!teamIsFull ? 'Colocar no Time' : 'Trocar com Time'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onEditBoxMember(index)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="Editar Pokémon"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveBoxMember(index)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
                    title="Remover do Box"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal to choose which team slot to swap with when team is 6/6 */}
      {swapModalBoxIndex !== null && box[swapModalBoxIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-5 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  Trocar com qual Pokémon do time?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSwapModalBoxIndex(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Escolha quem sairá da equipe e irá para o Box para dar lugar a{' '}
              <strong className="text-blue-300">
                {box[swapModalBoxIndex].nickname ||
                  box[swapModalBoxIndex].pokemon.displayName}
              </strong>
              :
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin">
              {team.map((member, slotIdx) => {
                if (!member) {
                  return (
                    <button
                      key={slotIdx}
                      type="button"
                      onClick={() => {
                        onMoveToTeam(swapModalBoxIndex, slotIdx);
                        setSwapModalBoxIndex(null);
                      }}
                      className="w-full p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-dashed border-slate-700 flex items-center justify-between text-left text-xs font-semibold text-slate-300 hover:text-white transition"
                    >
                      <span>Slot #{slotIdx + 1} Vazio</span>
                      <span className="text-emerald-400">+ Ocupar este slot</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={member.slotId || slotIdx}
                    type="button"
                    onClick={() => {
                      onMoveToTeam(swapModalBoxIndex, slotIdx);
                      setSwapModalBoxIndex(null);
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 hover:border-blue-500/60 flex items-center justify-between gap-3 text-left transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] font-bold text-slate-400">
                        #{slotIdx + 1}
                      </span>
                      <div className="w-10 h-10 flex items-center justify-center">
                        <PokemonSpriteImage
                          id={member.pokemon.id}
                          name={member.pokemon.name}
                          isShiny={member.isShiny}
                          className="max-h-full max-w-full"
                          alt={member.pokemon.displayName}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-white">
                          {member.nickname || member.pokemon.displayName}
                        </p>
                        <p className="text-[10px] text-amber-300 font-mono">
                          Nv. {member.level}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-blue-400 font-semibold">
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>Trocar</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSwapModalBoxIndex(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
