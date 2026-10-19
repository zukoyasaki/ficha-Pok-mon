import React from 'react';
import { Package, X, ArrowRight, Sparkles } from 'lucide-react';
import { TeamMember, TYPE_COLORS } from '../types/pokemon';
import { PokemonSpriteImage } from './PokemonSpriteImage';

interface ChooseFromBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  box: TeamMember[];
  targetSlotIndex: number;
  onSelectFromBox: (boxIndex: number, targetSlotIndex: number) => void;
}

export const ChooseFromBoxModal: React.FC<ChooseFromBoxModalProps> = ({
  isOpen,
  onClose,
  box,
  targetSlotIndex,
  onSelectFromBox,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Escolher Pokémon do Box
              </h2>
              <p className="text-xs text-slate-400">
                Selecione qual Pokémon do Box ocupará o Slot #{targetSlotIndex + 1} da equipe
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5 scrollbar-thin">
          {box.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Package className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">
                Não há Pokémon no seu Box no momento.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Adicione Pokémon na seção Box abaixo para poder transferi-los para a equipe.
              </p>
            </div>
          ) : (
            box.map((member, idx) => {
              const artwork = member.isShiny
                ? member.pokemon.shinyArtwork
                : member.pokemon.artwork;

              return (
                <div
                  key={member.slotId || idx}
                  onClick={() => {
                    onSelectFromBox(idx, targetSlotIndex);
                    onClose();
                  }}
                  className="group flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/60 cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-xl bg-slate-950/60 p-1 border border-slate-700/80 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
                      <PokemonSpriteImage
                        id={member.pokemon.id}
                        name={member.pokemon.name}
                        isShiny={member.isShiny}
                        className="max-h-full max-w-full drop-shadow"
                        alt={member.pokemon.displayName}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-white group-hover:text-blue-300 transition">
                          {member.nickname || member.pokemon.displayName}
                        </p>
                        {member.isShiny && (
                          <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                            <Sparkles className="w-3 h-3" /> Shiny
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono font-bold text-amber-300">
                          Nv. {member.level}
                        </span>
                        <div className="flex gap-1">
                          {member.pokemon.types.map((t) => (
                            <span
                              key={t}
                              className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${TYPE_COLORS[t]?.bg || 'bg-slate-700'} ${TYPE_COLORS[t]?.text || 'text-white'}`}
                            >
                              {TYPE_COLORS[t]?.label || t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        ⚔️ {member.moves.length} golpes · {member.heldItem || 'Sem item'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 group-hover:bg-blue-600 text-blue-400 group-hover:text-white rounded-xl text-xs font-bold transition">
                    <span>Mover</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
