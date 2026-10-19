import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TrainerProfile, TeamMember, TYPE_COLORS, BagItem } from '../types/pokemon';
import { TRAINER_BADGES } from '../data/trainerPresets';
import { ElementalBadgeIcon } from './ElementalBadgeIcon';
import { PokemonSpriteImage } from './PokemonSpriteImage';

interface TrainerPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TrainerProfile;
  team: (TeamMember | null)[];
  bag?: BagItem[];
  sheetName?: string;
}

export const TrainerPassportModal: React.FC<TrainerPassportModalProps> = ({
  isOpen,
  onClose,
  profile,
  team,
  bag = [],
  sheetName,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const activeTeam = team.filter((m): m is TeamMember => m !== null);

  const handleCopyShowdown = () => {
    let text = `=== [gen9] Ficha de Treinador: ${profile.name} (${profile.trainerClass}) ===\n\n`;
    activeTeam.forEach((m) => {
      text += `${m.nickname ? `${m.nickname} (${m.pokemon.displayName})` : m.pokemon.displayName} @ ${m.heldItem || 'Sem Item'}\n`;
      text += `Ability: ${m.ability || m.pokemon.abilities[0] || 'Unknown'}\n`;
      text += `Level: ${m.level}\n`;
      if (m.nature) text += `Nature: ${m.nature.charAt(0).toUpperCase() + m.nature.slice(1)}\n`;
      if (m.isShiny) text += `Shiny: Yes\n`;
      if (m.evs) {
        const evParts: string[] = [];
        if (m.evs.hp) evParts.push(`${m.evs.hp} HP`);
        if (m.evs.attack) evParts.push(`${m.evs.attack} Atk`);
        if (m.evs.defense) evParts.push(`${m.evs.defense} Def`);
        if (m.evs.spAttack) evParts.push(`${m.evs.spAttack} SpA`);
        if (m.evs.spDefense) evParts.push(`${m.evs.spDefense} SpD`);
        if (m.evs.speed) evParts.push(`${m.evs.speed} Spe`);
        if (evParts.length > 0) text += `EVs: ${evParts.join(' / ')}\n`;
      }
      m.moves.forEach((move) => {
        text += `- ${move}\n`;
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Ficha Oficial da Liga Pokémon
              </h2>
              <p className="text-xs text-slate-400">
                Cartão de Identificação de Treinador & Equipe Registrada
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyShowdown}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Equipe'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-md shadow-rose-900/30"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin bg-slate-950/80">
          <div
            id="trainer-passport-card"
            className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl overflow-hidden"
          >
            {/* Holographic metallic card foil effect */}
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.03)_25%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.03)_75%)] pointer-events-none" />
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* League Card Header */}
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-lg text-white font-black">
                  P
                </div>
                <div>
                  <h3 className="text-xl font-black text-amber-300 tracking-wider uppercase">
                    POKÉMON TRAINER PASSPORT
                  </h3>
                  <p className="text-xs text-slate-400">
                    Confederação Internacional da Liga Pokémon
                  </p>
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-1">
                {sheetName && (
                  <span className="text-[11px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg max-w-[200px] truncate">
                    {sheetName}
                  </span>
                )}
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Status: </span>
                  <span className="text-xs font-bold text-emerald-400">Registrado</span>
                </div>
              </div>
            </div>

            {/* Card Content Grid: Trainer at Left, Pokemon at Right */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Column: Trainer Portrait & Bio */}
              <div className="md:col-span-4 flex flex-col items-center text-center p-4 rounded-2xl bg-slate-950/60 border border-slate-700/60">
                <div className="relative w-44 h-44 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 p-2 border border-slate-700 flex items-center justify-center overflow-hidden mb-3">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-xl"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-slate-800 rounded-full" />
                  )}
                </div>

                <h4 className="text-lg font-black text-white">{profile.name || 'Treinador'}</h4>
                <p className="text-xs font-semibold text-rose-400">
                  {profile.trainerClass || 'Título do Treinador'}
                </p>
              </div>

              {/* Right Column: 6 Pokémon Grid */}
              <div className="md:col-span-8">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Equipe de Batalha Registrada ({activeTeam.length}/6)
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {team.map((m, idx) => {
                    if (!m) {
                      return (
                        <div
                          key={idx}
                          className="h-28 rounded-xl border border-dashed border-slate-800 bg-slate-950/30 flex flex-col items-center justify-center text-slate-600 text-xs"
                        >
                          <span>Slot #{idx + 1} Vazio</span>
                        </div>
                      );
                    }
                    const artwork = m.isShiny ? m.pokemon.shinyArtwork : m.pokemon.artwork;
                    return (
                      <div
                        key={m.slotId || idx}
                        className="rounded-xl bg-slate-950/70 border border-slate-700/60 p-2.5 flex flex-col items-center text-center relative"
                      >
                        <div className="w-14 h-14 flex items-center justify-center mb-1 overflow-hidden">
                          <PokemonSpriteImage
                            id={m.pokemon.id}
                            name={m.pokemon.name}
                            isShiny={m.isShiny}
                            className="max-h-full max-w-full drop-shadow"
                            alt={m.pokemon.displayName}
                          />
                        </div>
                        <p className="font-bold text-xs text-white truncate w-full">
                          {m.nickname || m.pokemon.displayName}
                        </p>
                        <p className="text-[10px] text-amber-300 font-mono">
                          Nv. {m.level} {m.isShiny && '✨'}
                        </p>
                        <div className="flex gap-1 mt-1">
                          {m.pokemon.types.map((t) => (
                            <span
                              key={t}
                              className={`text-[8px] uppercase font-bold px-1.5 py-0.2 rounded ${TYPE_COLORS[t]?.bg} ${TYPE_COLORS[t]?.text}`}
                            >
                              {TYPE_COLORS[t]?.label || t}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mochila (Bag) Section if has items */}
            {bag.length > 0 && (
              <div className="mt-5 pt-3.5 border-t border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Itens da Mochila do Treinador ({bag.length}/20 Slots):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {bag.map((item) => (
                    <div
                      key={item.id}
                      className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2"
                      title={item.description || item.name}
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center p-0.5 flex-shrink-0">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="max-h-full max-w-full object-contain" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-amber-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-white truncate leading-tight">
                          {item.name.split(' (')[0]}
                        </p>
                        <span className="text-[9px] font-mono font-bold text-amber-400">
                          x{item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Badges footer section */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Insígnias Elementais Registradas ({profile.badges.length}/8):
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {TRAINER_BADGES.map((badge) => {
                    const has = profile.badges.includes(badge.name);
                    return (
                      <ElementalBadgeIcon
                        key={badge.id}
                        badge={badge}
                        isOwned={has}
                        size="sm"
                      />
                    );
                  })}
                </div>
              </div>

              {/* Official Stamp */}
              <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl px-4 py-2 text-right">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                    SELO DE AUTENTICIDADE
                  </span>
                  <span className="text-xs font-bold text-white">LIGA POKÉMON OFICIAL</span>
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-dashed border-amber-400 flex items-center justify-center text-amber-400 font-bold text-xs">
                  ✓
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            Fechar Visualização
          </button>
        </div>
      </div>
    </div>
  );
};
