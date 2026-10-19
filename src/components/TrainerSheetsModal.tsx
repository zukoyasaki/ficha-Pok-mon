import React, { useState } from 'react';
import {
  X,
  Plus,
  Copy,
  Trash2,
  CheckCircle,
  Search,
  Sparkles,
  Award,
  Package,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TrainerSheet } from '../types/pokemon';
import { PokemonSpriteImage } from './PokemonSpriteImage';

interface TrainerSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheets: TrainerSheet[];
  activeSheetId: string;
  onSelectSheet: (sheetId: string) => void;
  onOpenCreateNew: () => void;
  onDuplicateSheet: (sheetId: string) => void;
  onDeleteSheet: (sheetId: string) => void;
  onRenameSheet: (sheetId: string, newName: string) => void;
}

export const TrainerSheetsModal: React.FC<TrainerSheetsModalProps> = ({
  isOpen,
  onClose,
  sheets,
  activeSheetId,
  onSelectSheet,
  onOpenCreateNew,
  onDuplicateSheet,
  onDeleteSheet,
  onRenameSheet,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSheetId, setEditingSheetId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredSheets = sheets.filter((sheet) => {
    const q = searchTerm.toLowerCase();
    const sheetNameMatch = sheet.name.toLowerCase().includes(q);
    const trainerNameMatch = sheet.profile.name.toLowerCase().includes(q);
    const classMatch = sheet.profile.trainerClass.toLowerCase().includes(q);
    const pokemonMatch = sheet.team.some(
      (m) =>
        m &&
        (m.pokemon.displayName.toLowerCase().includes(q) ||
          m.nickname.toLowerCase().includes(q))
    );
    return sheetNameMatch || trainerNameMatch || classMatch || pokemonMatch;
  });

  const handleStartRename = (sheet: TrainerSheet, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSheetId(sheet.id);
    setEditingName(sheet.name);
  };

  const handleSaveRename = (sheetId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (editingName.trim()) {
      onRenameSheet(sheetId, editingName.trim());
    }
    setEditingSheetId(null);
  };

  const handleSelect = (sheetId: string) => {
    onSelectSheet(sheetId);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center shadow-lg text-white font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">
                  Fichas de Treinador Criadas
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30">
                  {sheets.length} {sheets.length === 1 ? 'ficha' : 'fichas'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Selecione, alterne ou gerencie seus personagens e equipes independentes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onOpenCreateNew();
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold shadow-md shadow-rose-950/40 flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Nova Ficha</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search bar & Filter */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome da ficha, treinador, classe ou Pokémon..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Sheets List / Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin bg-slate-950/40">
          {filteredSheets.length === 0 ? (
            <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center">
              <Layers className="w-12 h-12 stroke-1 mb-3 text-slate-600" />
              <p className="text-base font-bold text-slate-300">
                Nenhuma ficha encontrada
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Tente buscar outro termo ou crie uma nova ficha agora.
              </p>
              <button
                type="button"
                onClick={onOpenCreateNew}
                className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Criar Nova Ficha
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSheets.map((sheet) => {
                const isActive = sheet.id === activeSheetId;
                const activeTeam = sheet.team.filter((m) => m !== null);
                const isEditingThis = editingSheetId === sheet.id;

                return (
                  <div
                    key={sheet.id}
                    onClick={() => !isActive && handleSelect(sheet.id)}
                    className={`rounded-2xl border p-4 transition-all relative flex flex-col justify-between cursor-pointer group ${
                      isActive
                        ? 'bg-slate-900 border-rose-500 shadow-xl shadow-rose-950/30 ring-1 ring-rose-500/50'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    {/* Top row: Avatar, Info, Badges */}
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* Avatar Thumbnail */}
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-700 p-1 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner">
                            <img
                              src={
                                sheet.profile.avatarUrl ||
                                'https://play.pokemonshowdown.com/sprites/trainers/red.png'
                              }
                              alt={sheet.profile.name}
                              className="max-h-full max-w-full object-contain filter drop-shadow"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/red.png';
                              }}
                            />
                          </div>

                          {/* Titles */}
                          <div className="min-w-0">
                            {isEditingThis ? (
                              <form
                                onSubmit={(e) => handleSaveRename(sheet.id, e)}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 mb-1"
                              >
                                <input
                                  type="text"
                                  value={editingName}
                                  onChange={(e) => setEditingName(e.target.value)}
                                  className="px-2 py-0.5 bg-slate-800 border border-rose-500 rounded text-xs text-white"
                                  autoFocus
                                />
                                <button
                                  type="submit"
                                  className="px-2 py-0.5 bg-rose-600 text-white rounded text-xs"
                                >
                                  Salvar
                                </button>
                              </form>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <h3 className="text-sm font-black text-white truncate">
                                  {sheet.name}
                                </h3>
                                <button
                                  type="button"
                                  onClick={(e) => handleStartRename(sheet, e)}
                                  className="text-[10px] text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition"
                                  title="Renomear identificador"
                                >
                                  ✏️
                                </button>
                              </div>
                            )}

                            <p className="text-xs font-bold text-rose-400 truncate">
                              {sheet.profile.name || 'Treinador'}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {sheet.profile.trainerClass || 'Classe'}
                            </p>
                          </div>
                        </div>

                        {/* Active badge indicator or switch button */}
                        <div className="flex flex-col items-end gap-1">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                              <CheckCircle className="w-3 h-3 text-emerald-400" />
                              Ficha Ativa
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelect(sheet.id);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 text-[11px] font-semibold border border-slate-700 transition flex items-center gap-1"
                            >
                              <span>Usar Ficha</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Stats & counters */}
                      <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-400" />
                          {sheet.profile.badges.length}/8 Insígnias
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-rose-400" />
                          Time: {activeTeam.length}/6
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Package className="w-3 h-3 text-blue-400" />
                          Box: {sheet.box.length}
                        </span>
                      </div>

                      {/* Pokémon Team Preview Grid */}
                      <div className="mt-3 p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        <div className="grid grid-cols-6 gap-1.5 items-center">
                          {sheet.team.map((member, idx) => {
                            if (!member) {
                              return (
                                <div
                                  key={idx}
                                  className="h-11 rounded-lg border border-dashed border-slate-800 bg-slate-900/40 flex items-center justify-center text-[9px] text-slate-600"
                                  title={`Slot #${idx + 1} Vazio`}
                                >
                                  -
                                </div>
                              );
                            }
                            return (
                              <div
                                key={member.slotId || idx}
                                className="h-11 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-0.5 relative group/poke overflow-hidden"
                                title={`${member.nickname || member.pokemon.displayName} (Nv. ${member.level})`}
                              >
                                <div className="w-7 h-7 flex items-center justify-center">
                                  <PokemonSpriteImage
                                    id={member.pokemon.id}
                                    name={member.pokemon.name}
                                    isShiny={member.isShiny}
                                    className="max-h-full max-w-full drop-shadow"
                                    alt={member.pokemon.displayName}
                                  />
                                </div>
                                <span className="text-[8px] font-mono text-slate-300 truncate w-full text-center leading-none">
                                  {member.level}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions on Card */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(sheet.updatedAt).toLocaleDateString('pt-BR')}
                      </span>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => onDuplicateSheet(sheet.id)}
                          className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-[11px]"
                          title="Duplicar esta ficha"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Duplicar</span>
                        </button>

                        {deleteConfirmId === sheet.id ? (
                          <div className="flex items-center gap-1 bg-red-950/80 border border-red-500/50 p-0.5 rounded-lg">
                            <span className="text-[10px] text-red-300 px-1 font-semibold">
                              Excluir?
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteSheet(sheet.id);
                                setDeleteConfirmId(null);
                              }}
                              className="px-1.5 py-0.5 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold"
                            >
                              Sim
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px]"
                            >
                              Não
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={sheets.length <= 1}
                            onClick={() => setDeleteConfirmId(sheet.id)}
                            className={`p-1.5 rounded-lg transition ${
                              sheets.length <= 1
                                ? 'opacity-30 cursor-not-allowed text-slate-600'
                                : 'text-slate-400 hover:text-red-400 hover:bg-red-950/30'
                            }`}
                            title={
                              sheets.length <= 1
                                ? 'Não é possível excluir a única ficha'
                                : 'Excluir esta ficha'
                            }
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>
            {sheets.length} {sheets.length === 1 ? 'ficha armazenada' : 'fichas armazenadas'} com seus respectivos times e boxes
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
