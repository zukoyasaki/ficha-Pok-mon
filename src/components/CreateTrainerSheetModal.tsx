import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Sparkles,
  Shield,
  User,
  Check,
  Package,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  TrainerProfile,
  TeamMember,
  PokemonData,
} from '../types/pokemon';
import { TRAINER_PRESETS, TrainerPreset } from '../data/trainerPresets';
import { INITIAL_POKEMON_LIST } from '../data/pokemonData';

interface CreateTrainerSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSheet: (sheetData: {
    sheetName: string;
    profile: TrainerProfile;
    team: (TeamMember | null)[];
    box: TeamMember[];
  }) => void;
  existingCount: number;
}

export const CreateTrainerSheetModal: React.FC<CreateTrainerSheetModalProps> = ({
  isOpen,
  onClose,
  onCreateSheet,
  existingCount,
}) => {
  const [sheetName, setSheetName] = useState(`Ficha #${existingCount + 1}`);
  const [trainerName, setTrainerName] = useState('Novo Treinador');
  const [trainerClass, setTrainerClass] = useState('Treinador Ace');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(
    'https://play.pokemonshowdown.com/sprites/trainers/red.png'
  );
  const [teamStarterOption, setTeamStarterOption] = useState<'classic' | 'empty' | 'random'>(
    'classic'
  );

  if (!isOpen) return null;

  const handleSelectPreset = (preset: TrainerPreset) => {
    setSelectedPresetId(preset.id);
    setSheetName(`Ficha - ${preset.name}`);
    setTrainerName(preset.name);
    setTrainerClass(preset.trainerClass);
    setAvatarUrl(preset.avatarUrl);
  };

  const handleSelectBlank = () => {
    setSelectedPresetId('blank');
    setSheetName(`Ficha #${existingCount + 1}`);
    setTrainerName('Novo Treinador');
    setTrainerClass('Treinador Ace');
    setAvatarUrl('https://play.pokemonshowdown.com/sprites/trainers/red.png');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    let team: (TeamMember | null)[] = [null, null, null, null, null, null];

    if (teamStarterOption === 'classic') {
      const pikachu = INITIAL_POKEMON_LIST.find((p) => p.name === 'pikachu') || INITIAL_POKEMON_LIST[1];
      const charizard = INITIAL_POKEMON_LIST.find((p) => p.name === 'charizard') || INITIAL_POKEMON_LIST[0];
      const lucario = INITIAL_POKEMON_LIST.find((p) => p.name === 'lucario') || INITIAL_POKEMON_LIST[4];

      team = [
        {
          slotId: 'slot-1-' + Date.now(),
          pokemon: pikachu,
          nickname: pikachu.displayName,
          level: 50,
          isShiny: false,
          heldItem: 'Bola de Luz',
          ability: pikachu.abilities[0] || '',
          moves: [...pikachu.suggestedMoves.slice(0, 6)],
          gender: 'male',
        },
        {
          slotId: 'slot-2-' + Date.now(),
          pokemon: charizard,
          nickname: charizard.displayName,
          level: 50,
          isShiny: false,
          heldItem: 'Restos',
          ability: charizard.abilities[0] || '',
          moves: [...charizard.suggestedMoves.slice(0, 6)],
          gender: 'male',
        },
        {
          slotId: 'slot-3-' + Date.now(),
          pokemon: lucario,
          nickname: lucario.displayName,
          level: 50,
          isShiny: false,
          heldItem: 'Faixa Foco',
          ability: lucario.abilities[0] || '',
          moves: [...lucario.suggestedMoves.slice(0, 6)],
          gender: 'male',
        },
        null,
        null,
        null,
      ];
    } else if (teamStarterOption === 'random') {
      const shuffled = [...INITIAL_POKEMON_LIST].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);
      team = [
        ...selected.map((p, idx) => ({
          slotId: `random-init-${idx}-${Date.now()}`,
          pokemon: p,
          nickname: p.displayName,
          level: 50,
          isShiny: Math.random() < 0.2,
          heldItem: '',
          ability: p.abilities[0] || '',
          moves: [...p.suggestedMoves.slice(0, 6)],
          gender: 'male' as const,
        })),
        null,
        null,
        null,
      ];
    }

    const newProfile: TrainerProfile = {
      name: trainerName.trim() || 'Treinador',
      trainerClass: trainerClass.trim() || 'Treinador Ace',
      avatarUrl: avatarUrl || 'https://play.pokemonshowdown.com/sprites/trainers/red.png',
      badges: ['Fogo', 'Elétrico'],
      favoriteType: 'fire',
    };

    onCreateSheet({
      sheetName: sheetName.trim() || `Ficha #${existingCount + 1}`,
      profile: newProfile,
      team,
      box: [],
    });

    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.6 },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center shadow-lg text-white">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Criar Nova Ficha de Treinador
              </h2>
              <p className="text-xs text-slate-400">
                Monte um novo personagem com sua própria equipe e box independentes
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleCreate} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin">
          {/* Sheet identifier / label */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Identificação / Nome da Ficha
            </label>
            <input
              type="text"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              placeholder="Ex: Ficha de Kanto, Time Competitivo, Ash..."
              maxLength={40}
              className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
              required
            />
          </div>

          {/* Quick presets picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Escolha uma Base ou Personagem Famoso
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-950/60 rounded-2xl border border-slate-800 scrollbar-thin">
              <button
                type="button"
                onClick={handleSelectBlank}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition ${
                  selectedPresetId === 'blank'
                    ? 'border-rose-500 bg-rose-500/20 ring-1 ring-rose-500'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mb-1 text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-white leading-tight">Em Branco</span>
                <span className="text-[9px] text-slate-400">Personalizado</span>
              </button>

              {TRAINER_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition ${
                      isSelected
                        ? 'border-rose-500 bg-rose-500/20 ring-1 ring-rose-500'
                        : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={preset.avatarUrl}
                      alt={preset.name}
                      className="w-8 h-8 object-contain mb-1"
                    />
                    <span className="text-[11px] font-bold text-white truncate w-full">
                      {preset.name}
                    </span>
                    <span className="text-[9px] text-rose-400 truncate w-full">
                      {preset.region}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trainer name & title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Nome do Treinador
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={trainerName}
                  onChange={(e) => setTrainerName(e.target.value)}
                  placeholder="Nome do personagem..."
                  maxLength={30}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Classe / Título
              </label>
              <div className="relative">
                <Shield className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={trainerClass}
                  onChange={(e) => setTrainerClass(e.target.value)}
                  placeholder="Ex: Mestre Pokémon..."
                  maxLength={40}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Initial Team Options */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Equipe Pokémon Inicial
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTeamStarterOption('classic')}
                className={`p-3 rounded-xl border text-left transition ${
                  teamStarterOption === 'classic'
                    ? 'border-rose-500 bg-rose-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">Iniciais Famosos</span>
                  {teamStarterOption === 'classic' && <Check className="w-3.5 h-3.5 text-rose-400" />}
                </div>
                <p className="text-[11px] text-slate-400">
                  Começa com Pikachu, Charizard e Lucario (Nv. 50).
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTeamStarterOption('random')}
                className={`p-3 rounded-xl border text-left transition ${
                  teamStarterOption === 'random'
                    ? 'border-rose-500 bg-rose-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">3 Aleatórios</span>
                  {teamStarterOption === 'random' && <Check className="w-3.5 h-3.5 text-rose-400" />}
                </div>
                <p className="text-[11px] text-slate-400">
                  Sorteia 3 Pokémon surpresa para começar a jornada.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTeamStarterOption('empty')}
                className={`p-3 rounded-xl border text-left transition ${
                  teamStarterOption === 'empty'
                    ? 'border-rose-500 bg-rose-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">Time Vazio</span>
                  {teamStarterOption === 'empty' && <Check className="w-3.5 h-3.5 text-rose-400" />}
                </div>
                <p className="text-[11px] text-slate-400">
                  Começa com 6 slots vazios para montar do zero.
                </p>
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Criar e Começar Ficha</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
