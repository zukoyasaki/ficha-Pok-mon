import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Swords,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Shield,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { PokemonType, TYPE_COLORS } from '../types/pokemon';
import { fetchAllShowdownMoves, MoveDexEntry } from '../services/movesApi';

interface MoveDexModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMove?: (moveName: string) => void;
}

const ITEMS_PER_PAGE = 60;

export const MoveDexModal: React.FC<MoveDexModalProps> = ({
  isOpen,
  onClose,
  onSelectMove,
}) => {
  const [moves, setMoves] = useState<MoveDexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<PokemonType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Physical' | 'Special' | 'Status'>('all');
  const [sortBy, setSortBy] = useState<'name_asc' | 'power_desc' | 'acc_desc' | 'pp_desc' | 'priority_desc'>('name_asc');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [copiedMoveId, setCopiedMoveId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoading(true);

    fetchAllShowdownMoves()
      .then((data) => {
        if (isMounted) {
          setMoves(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load MoveDex:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Reset pagination when filter changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [search, selectedType, selectedCategory, sortBy]);

  // Filtered & Sorted moves
  const filteredMoves = useMemo(() => {
    let list = moves;

    if (selectedType !== 'all') {
      list = list.filter((m) => m.type === selectedType);
    }

    if (selectedCategory !== 'all') {
      list = list.filter((m) => m.category === selectedCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.type.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.desc.toLowerCase().includes(q)
      );
    }

    // Sort
    const sorted = [...list];
    switch (sortBy) {
      case 'name_asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'power_desc':
        sorted.sort((a, b) => b.basePower - a.basePower || a.name.localeCompare(b.name));
        break;
      case 'acc_desc':
        sorted.sort((a, b) => {
          const accA = a.accuracy === true ? 101 : a.accuracy;
          const accB = b.accuracy === true ? 101 : b.accuracy;
          return accB - accA || a.name.localeCompare(b.name);
        });
        break;
      case 'pp_desc':
        sorted.sort((a, b) => b.pp - a.pp || a.name.localeCompare(b.name));
        break;
      case 'priority_desc':
        sorted.sort((a, b) => b.priority - a.priority || b.basePower - a.basePower);
        break;
    }

    return sorted;
  }, [moves, search, selectedType, selectedCategory, sortBy]);

  const displayedMoves = useMemo(() => {
    return filteredMoves.slice(0, visibleCount);
  }, [filteredMoves, visibleCount]);

  const handleCopy = (m: MoveDexEntry) => {
    navigator.clipboard.writeText(m.name);
    setCopiedMoveId(m.id);
    setTimeout(() => setCopiedMoveId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-6xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-amber-950/40">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-white tracking-wide flex items-center gap-1.5">
                  MoveDex — Catálogo Oficial de Movimentos
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {filteredMoves.length} Golpes Encontrados
                </span>
                <a
                  href="https://dex.pokemonshowdown.com/moves"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-400 hover:text-sky-300 bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded-md transition"
                >
                  <span>dex.pokemonshowdown.com</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Consulte poder base (BP), precisão, categoria (físico/especial/status), prioridade e efeitos oficiais de batalha
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-800/80 bg-slate-950/60 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, tipo, categoria ou efeito (ex: thunderbolt, terremoto, paralisia, prioridade)..."
                className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills: Physical, Special, Status */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs flex-shrink-0">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  selectedCategory === 'all'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Todas
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('Physical')}
                className={`px-2 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                  selectedCategory === 'Physical'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Movimentos Físicos"
              >
                <span>Físico 💥</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('Special')}
                className={`px-2 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                  selectedCategory === 'Special'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Movimentos Especiais"
              >
                <span>Especial 🔮</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('Status')}
                className={`px-2 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                  selectedCategory === 'Status'
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Movimentos de Status / Efeito"
              >
                <span>Status ⚪</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="name_asc">Nome (A - Z)</option>
                <option value="power_desc">Maior Poder (BP)</option>
                <option value="acc_desc">Maior Precisão</option>
                <option value="pp_desc">Mais PP</option>
                <option value="priority_desc">Maior Prioridade</option>
              </select>
            </div>
          </div>

          {/* Elemental Types Filter Horizontal Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => setSelectedType('all')}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition ${
                selectedType === 'all'
                  ? 'bg-white text-slate-950 font-black'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Todos Tipos
            </button>

            {(Object.keys(TYPE_COLORS) as PokemonType[]).map((type) => {
              const isSelected = selectedType === type;
              const style = TYPE_COLORS[type];
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`px-2.5 py-1 rounded-lg font-bold uppercase text-[10px] tracking-wider whitespace-nowrap transition flex items-center gap-1 border ${
                    isSelected
                      ? `${style.bg} ${style.text} ${style.border} ring-2 ring-white/30 scale-105`
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span>{style.label || type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Moves Cards Grid / Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-thin">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              <p className="text-sm font-semibold">Carregando catálogo de movimentos de dex.pokemonshowdown.com...</p>
            </div>
          ) : displayedMoves.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <p className="text-base font-bold text-white mb-1">Nenhum movimento encontrado</p>
              <p className="text-xs text-slate-500">
                Tente ajustar os filtros de tipo, categoria ou termo de busca.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {displayedMoves.map((m) => {
                  const typeStyle = TYPE_COLORS[m.type];
                  const isCopied = copiedMoveId === m.id;

                  return (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-amber-500/50 hover:bg-slate-900 transition flex flex-col justify-between group shadow-sm"
                    >
                      <div>
                        {/* Top: Name & Badges */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-black text-sm text-white group-hover:text-amber-300 transition truncate">
                              {m.name}
                            </h3>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            {/* Type badge */}
                            <span
                              className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-md border ${
                                typeStyle?.bg || 'bg-slate-800'
                              } ${typeStyle?.text || 'text-white'} ${typeStyle?.border || 'border-slate-700'}`}
                            >
                              {typeStyle?.label || m.type}
                            </span>

                            {/* Category badge */}
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                                m.category === 'Physical'
                                  ? 'bg-orange-950/60 text-orange-300 border border-orange-800/60'
                                  : m.category === 'Special'
                                  ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/60'
                                  : 'bg-slate-800 text-slate-300 border border-slate-700'
                              }`}
                            >
                              {m.category === 'Physical'
                                ? 'Físico 💥'
                                : m.category === 'Special'
                                ? 'Especial 🔮'
                                : 'Status ⚪'}
                            </span>
                          </div>
                        </div>

                        {/* Stats Row: Power, Accuracy, PP, Priority */}
                        <div className="grid grid-cols-4 gap-1.5 py-2 px-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-center mb-2.5 text-[11px]">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">
                              Poder
                            </span>
                            <span className="font-mono font-black text-white">
                              {m.basePower > 0 ? m.basePower : '—'}
                            </span>
                          </div>

                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">
                              Precisão
                            </span>
                            <span className="font-mono font-black text-white">
                              {m.accuracy === true ? '—' : `${m.accuracy}%`}
                            </span>
                          </div>

                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">
                              PP
                            </span>
                            <span className="font-mono font-black text-white">
                              {m.pp}
                            </span>
                          </div>

                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">
                              Priorid.
                            </span>
                            <span
                              className={`font-mono font-black ${
                                m.priority > 0
                                  ? 'text-emerald-400'
                                  : m.priority < 0
                                  ? 'text-rose-400'
                                  : 'text-slate-400'
                              }`}
                            >
                              {m.priority > 0 ? `+${m.priority}` : m.priority}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-3">
                          {m.desc}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => handleCopy(m)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                            isCopied
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                          title="Copiar nome do golpe"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-1.5">
                          {onSelectMove && (
                            <button
                              type="button"
                              onClick={() => {
                                onSelectMove(m.name);
                                onClose();
                              }}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[11px] font-bold transition shadow-sm"
                            >
                              Usar Golpe
                            </button>
                          )}

                          <a
                            href={`https://dex.pokemonshowdown.com/moves/${m.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 text-slate-500 hover:text-sky-400 transition"
                            title="Ver detalhes oficiais no Pokémon Showdown Dex"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More Button */}
              {visibleCount < filteredMoves.length && (
                <div className="pt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition shadow-md border border-slate-700"
                  >
                    Carregar Mais Golpes (+{Math.min(ITEMS_PER_PAGE, filteredMoves.length - visibleCount)} de {filteredMoves.length - visibleCount} restantes)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>
            Mostrando {displayedMoves.length} de {filteredMoves.length} movimentos do banco de dados oficial Showdown.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            Fechar MoveDex
          </button>
        </div>
      </div>
    </div>
  );
};
