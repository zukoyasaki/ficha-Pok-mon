import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  Sparkles,
  X,
  Plus,
  Loader2,
  ArrowUpDown,
  Hash,
  Layers,
  Film,
  Image as ImageIcon,
  Globe,
  Grid,
  Check,
  ChevronDown,
  BookOpen,
} from 'lucide-react';
import { PokemonData, PokemonSummary, PokemonType, TYPE_COLORS } from '../types/pokemon';
import {
  ALL_POKEMON_LIST,
  fetchPokemonDetails,
  getPokemonArtwork,
} from '../services/pokemonApi';
import {
  REGIONS_LIST,
  RegionDefinition,
  getPokemonRegionInfo,
} from '../data/regionalPokemon';
import { PokemonSpriteImage } from './PokemonSpriteImage';
import { useSpriteFormat } from '../context/SpriteFormatContext';

interface PokemonPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPokemon: (pokemon: PokemonData, asShiny: boolean) => void;
  targetSlotIndex: number;
  mode?: 'picker' | 'pokedex';
}

const DEFAULT_ITEMS_PER_PAGE = 72;

export const PokemonPickerModal: React.FC<PokemonPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectPokemon,
  targetSlotIndex,
  mode = 'picker',
}) => {
  const { format, setFormat } = useSpriteFormat();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<PokemonType | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'grouped'>('grid');
  const [previewShiny, setPreviewShiny] = useState(false);
  const [sortBy, setSortBy] = useState<'id_asc' | 'id_desc' | 'name_asc'>('id_asc');
  const [showAllAtOnce, setShowAllAtOnce] = useState(false);
  const [visibleCount, setVisibleCount] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [loadingPokemonId, setLoadingPokemonId] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Reset pagination when search, type or region filters change
  useEffect(() => {
    if (selectedRegion !== 'all' || showAllAtOnce) {
      // If a specific region is chosen or user toggled show all, display all matching items
      setVisibleCount(ALL_POKEMON_LIST.length);
    } else {
      setVisibleCount(DEFAULT_ITEMS_PER_PAGE);
    }

    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [search, selectedType, selectedRegion, sortBy, showAllAtOnce]);

  // Full filter for all Pokémon + regional variants
  const filteredList = useMemo(() => {
    const query = search.trim().toLowerCase();
    const isNumSearch = /^\d+$/.test(query);
    const numSearchVal = isNumSearch ? parseInt(query, 10) : null;

    let result = ALL_POKEMON_LIST.filter((p) => {
      // Search matching
      if (query) {
        if (numSearchVal !== null) {
          if (p.id !== numSearchVal && !String(p.id).includes(query)) return false;
        } else {
          const matchName = p.name.toLowerCase().includes(query);
          const matchDisplay = p.displayName.toLowerCase().includes(query);
          const matchRegion = p.region?.toLowerCase().includes(query);
          if (!matchName && !matchDisplay && !matchRegion) return false;
        }
      }

      // Type matching
      if (selectedType !== 'all') {
        if (!p.types.includes(selectedType)) return false;
      }

      // Region matching
      if (selectedRegion !== 'all') {
        if (selectedRegion === 'regional_forms') {
          if (!p.isRegional) return false;
        } else {
          const regDef = REGIONS_LIST.find((r) => r.id === selectedRegion);
          if (regDef) {
            if (p.isRegional) {
              // Check if regional form belongs to this region
              const regionNameLower = p.region?.toLowerCase() || '';
              if (regionNameLower !== regDef.name.toLowerCase() && p.gen !== regDef.gen) {
                return false;
              }
            } else {
              if (p.id < regDef.startId || p.id > regDef.endId) return false;
            }
          }
        }
      }

      return true;
    });

    // Sorting
    if (sortBy === 'id_asc') {
      result.sort((a, b) => a.id - b.id);
    } else if (sortBy === 'id_desc') {
      result.sort((a, b) => b.id - a.id);
    } else if (sortBy === 'name_asc') {
      result.sort((a, b) => a.displayName.localeCompare(b.displayName));
    }

    return result;
  }, [search, selectedType, selectedRegion, sortBy]);

  // Items currently rendered
  const visibleList = useMemo(() => {
    if (showAllAtOnce || selectedRegion !== 'all') {
      return filteredList;
    }
    return filteredList.slice(0, visibleCount);
  }, [filteredList, visibleCount, showAllAtOnce, selectedRegion]);

  // Grouped by region for "Modo Regional Agrupado"
  const groupedList = useMemo(() => {
    if (viewMode !== 'grouped') return [];

    return REGIONS_LIST.map((region) => {
      const pokesInRegion = filteredList.filter((p) => {
        if (region.id === 'regional_forms') {
          return p.isRegional;
        }
        if (p.isRegional) {
          return p.region?.toLowerCase() === region.name.toLowerCase();
        }
        return p.id >= region.startId && p.id <= region.endId;
      });

      return {
        region,
        pokemonList: pokesInRegion,
      };
    }).filter((g) => g.pokemonList.length > 0);
  }, [filteredList, viewMode]);

  const handleSelect = async (pokemonSummary: PokemonSummary) => {
    setLoadingPokemonId(pokemonSummary.id);
    try {
      const fullData = await fetchPokemonDetails(pokemonSummary.id);
      onSelectPokemon(fullData, previewShiny);
    } catch (e) {
      console.error('Failed to load pokemon details', e);
    } finally {
      setLoadingPokemonId(null);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (showAllAtOnce || selectedRegion !== 'all') return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 350) {
      if (visibleCount < filteredList.length) {
        setVisibleCount((prev) => Math.min(prev + DEFAULT_ITEMS_PER_PAGE, filteredList.length));
      }
    }
  };

  if (!isOpen) return null;

  const currentRegionDef = REGIONS_LIST.find((r) => r.id === selectedRegion);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-6xl h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg text-white font-black text-base flex-shrink-0">
              {mode === 'pokedex' ? (
                <BookOpen className="w-5 h-5 text-white" />
              ) : (
                `#${targetSlotIndex + 1}`
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                  {mode === 'pokedex'
                    ? 'Pokédex Nacional Oficial'
                    : 'Pokédex Nacional & Regional'}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {ALL_POKEMON_LIST.length} Pokémon
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hidden sm:inline-block">
                  9 Regiões + Formas Regionais
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {mode === 'pokedex'
                  ? 'Navegue por todos os Pokémon registrados de Kanto a Paldea ou escolha para sua equipe'
                  : `Escolha o Pokémon para o Slot #${targetSlotIndex + 1} da sua equipe ou navegue pelas regiões`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle: Grid vs Grouped by Region */}
            {selectedRegion === 'all' && (
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'grid' ? 'grouped' : 'grid')}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  viewMode === 'grouped'
                    ? 'bg-rose-600/25 text-rose-300 border-rose-500/40 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
                title="Alternar entre Grade Única ou Agrupado por Região"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{viewMode === 'grouped' ? 'Agrupado por Região' : 'Grade Única'}</span>
              </button>
            )}

            {/* GIF vs PNG Toggle */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800" role="group" aria-label="Formato do Sprite">
              <button
                type="button"
                onClick={() => setFormat('gif')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  format === 'gif'
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Exibir sprites animados em GIF (Pokémon Showdown)"
              >
                <Film className="w-3.5 h-3.5 text-blue-300" />
                <span className="hidden sm:inline">GIF Animado</span>
                <span className="sm:hidden">GIF</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('png')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  format === 'png'
                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Exibir ilustrações oficiais estáticas em PNG"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-300" />
                <span className="hidden sm:inline">PNG Oficial</span>
                <span className="sm:hidden">PNG</span>
              </button>
            </div>

            {/* Shiny Mode */}
            <button
              type="button"
              onClick={() => setPreviewShiny(!previewShiny)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                previewShiny
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Alternar modo Shiny"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{previewShiny ? 'Shiny' : 'Normal'}</span>
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-900/95 space-y-3">
          {/* Top row: Search input + Sort + "Mostrar Todos" Toggle */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Busque por nome, número ou região (ex: Pikachu, 1025, Alola, Charizard, Greninja, Hisui)..."
                autoFocus
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Actions: "Mostrar Todos" e Ordenação */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAllAtOnce(!showAllAtOnce);
                  if (!showAllAtOnce) {
                    setVisibleCount(filteredList.length);
                  }
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 whitespace-nowrap ${
                  showAllAtOnce
                    ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                    : 'bg-slate-950 text-slate-300 border-slate-700/80 hover:text-white hover:border-slate-600'
                }`}
                title="Mostrar todos os Pokémon da lista sem paradas de paginação"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>{showAllAtOnce ? 'Todos Visíveis ✓' : 'Mostrar Todos'}</span>
              </button>

              {/* Sort selector */}
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-2 text-xs text-slate-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="id_asc" className="bg-slate-900">
                    Número (1 → 1025)
                  </option>
                  <option value="id_desc" className="bg-slate-900">
                    Número (1025 → 1)
                  </option>
                  <option value="name_asc" className="bg-slate-900">
                    Nome (A → Z)
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Regional Selector Bar (The Core Request: Mostrar Pokémon de forma Regional!) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 mr-1 flex items-center gap-1 flex-shrink-0">
              <Globe className="w-3.5 h-3.5" /> Regiões:
            </span>

            {/* "Todas as Regiões" button */}
            <button
              type="button"
              onClick={() => setSelectedRegion('all')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedRegion === 'all'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>Todas (Nacional)</span>
              <span className="text-[10px] opacity-80 font-mono">1076</span>
            </button>

            {/* All 9 Regions + Regional Forms */}
            {REGIONS_LIST.map((reg) => {
              const isSelected = selectedRegion === reg.id;
              return (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => setSelectedRegion(reg.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                    isSelected
                      ? `bg-gradient-to-r ${reg.color} text-white shadow-md ring-1 ring-white/30`
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                  }`}
                  title={`${reg.name} (${reg.generationLabel}) - ${reg.rangeLabel}: ${reg.description}`}
                >
                  <span>{reg.name}</span>
                  <span className="text-[10px] opacity-80 font-mono">
                    {reg.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Type filter bar */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1 flex-shrink-0">
              Tipos:
            </span>
            <button
              type="button"
              onClick={() => setSelectedType('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                selectedType === 'all'
                  ? 'bg-white text-slate-900 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            {(Object.keys(TYPE_COLORS) as PokemonType[]).map((type) => {
              const info = TYPE_COLORS[type];
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(isSelected ? 'all' : type)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1 ${
                    isSelected
                      ? `${info.bg} ${info.text} font-bold shadow-md ring-1 ring-white/40`
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {info.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Region Banner (when a specific region is active) */}
        {currentRegionDef && (
          <div className="px-4 py-2.5 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] border ${currentRegionDef.bgBadge}`}>
                Região de {currentRegionDef.name}
              </span>
              <span className="text-slate-300 font-medium">
                {currentRegionDef.generationLabel} · {currentRegionDef.rangeLabel}
              </span>
              <span className="text-slate-500 hidden sm:inline">
                ({currentRegionDef.description})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">
                Total na região: <strong className="text-white">{filteredList.length}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Results summary bar */}
        <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 flex-wrap">
            <Hash className="w-3.5 h-3.5 text-slate-500" />
            <span>
              Encontrados: <strong className="text-white">{filteredList.length}</strong> Pokémon
            </span>
            {search && (
              <span className="text-rose-400">
                para &ldquo;{search}&rdquo;
              </span>
            )}
            {selectedRegion !== 'all' && (
              <span className="text-amber-400">
                · Filtro: {currentRegionDef?.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span>
              Mostrando <strong className="text-white">{visibleList.length}</strong> de {filteredList.length}
            </span>
            {!showAllAtOnce && visibleCount < filteredList.length && (
              <button
                type="button"
                onClick={() => {
                  setShowAllAtOnce(true);
                  setVisibleCount(filteredList.length);
                }}
                className="text-rose-400 hover:text-rose-300 font-bold underline"
              >
                Carregar Todos
              </button>
            )}
          </div>
        </div>

        {/* Pokémon Grid or Grouped Regional View */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-3 sm:p-5 scrollbar-thin"
        >
          {filteredList.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <p className="text-base text-slate-300 font-bold">
                Nenhum Pokémon encontrado.
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Tente buscar por nome (ex: Charizard, Raichu de Alola), número ou selecione outra região.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedType('all');
                  setSelectedRegion('all');
                  setShowAllAtOnce(false);
                }}
                className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-xl text-xs font-semibold transition"
              >
                Limpar Filtros e Ver Todos
              </button>
            </div>
          ) : viewMode === 'grouped' && selectedRegion === 'all' ? (
            /* Regional Grouped Sections */
            <div className="space-y-8">
              {groupedList.map(({ region, pokemonList }) => (
                <div key={region.id} className="space-y-3">
                  {/* Region Group Header */}
                  <div className="sticky top-0 z-10 py-2 bg-slate-900/90 backdrop-blur-md flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3 h-3 rounded-full bg-gradient-to-tr ${region.color}`} />
                      <h3 className="text-sm font-black text-white tracking-wide uppercase">
                        Região de {region.name} ({region.generationLabel})
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400">
                        {region.rangeLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        {pokemonList.length} Pokémon
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedRegion(region.id)}
                        className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold px-2 py-0.5 rounded bg-slate-800 border border-slate-700"
                      >
                        Filtrar só {region.name}
                      </button>
                    </div>
                  </div>

                  {/* Pokémon cards for this region */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {pokemonList.map((pokemon) => renderPokemonCard(pokemon))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Continuous Grid */
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {visibleList.map((pokemon) => renderPokemonCard(pokemon))}
              </div>

              {/* Load more button if there are remaining items */}
              {!showAllAtOnce && visibleCount < filteredList.length && (
                <div className="py-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleCount((prev) =>
                        Math.min(prev + DEFAULT_ITEMS_PER_PAGE, filteredList.length)
                      )
                    }
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition border border-slate-700 hover:border-slate-600 shadow-lg"
                  >
                    Carregar Mais ({filteredList.length - visibleCount} restantes)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowAllAtOnce(true);
                      setVisibleCount(filteredList.length);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-rose-950/40"
                  >
                    Mostrar Todos de Uma Vez ({filteredList.length} Pokémon)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>
            Pokédex Oficial Completa: Todos os 1025 Pokémon nacionais + 51 formas regionais ilustradas.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );

  function renderPokemonCard(pokemon: PokemonSummary) {
    const isLoading = loadingPokemonId === pokemon.id;
    const artworkUrl = getPokemonArtwork(pokemon.id, previewShiny);
    const regInfo = getPokemonRegionInfo(pokemon.id);

    return (
      <div
        key={pokemon.id}
        onClick={() => !isLoading && handleSelect(pokemon)}
        className="group relative bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 hover:border-rose-500/60 rounded-2xl p-3 flex flex-col items-center justify-between cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-950/20"
      >
        {/* Top: Number and Region Badge */}
        <div className="w-full flex items-center justify-between text-[10px] text-slate-400">
          <span className="font-mono font-bold text-slate-400 group-hover:text-slate-200">
            #{pokemon.id >= 10000 ? String(pokemon.id) : String(pokemon.id).padStart(3, '0')}
          </span>
          <span
            className={`px-1.5 py-0.2 rounded font-semibold text-[9px] border ${regInfo.badgeStyle}`}
            title={`Região: ${regInfo.regionName} (${regInfo.generationLabel})`}
          >
            {regInfo.regionName}
          </span>
        </div>

        {/* Pokemon Visual */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 my-2 relative flex items-center justify-center overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-1 text-rose-400">
              <Loader2 className="w-7 h-7 animate-spin" />
              <span className="text-[10px] font-semibold">Adicionando...</span>
            </div>
          ) : (
            <PokemonSpriteImage
              id={pokemon.id}
              name={pokemon.name}
              isShiny={previewShiny}
              format={format}
              className="max-h-full max-w-full drop-shadow-md group-hover:scale-110"
              alt={pokemon.displayName}
            />
          )}
        </div>

        {/* Name */}
        <div className="w-full text-center">
          <p className="font-bold text-xs sm:text-sm text-white group-hover:text-rose-400 transition truncate">
            {pokemon.displayName}
          </p>

          {/* Types */}
          <div className="flex items-center justify-center gap-1 mt-1.5 flex-wrap">
            {pokemon.types.map((type) => {
              const style = TYPE_COLORS[type];
              return (
                <span
                  key={type}
                  className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded ${
                    style?.bg || 'bg-slate-700'
                  } ${style?.text || 'text-white'}`}
                >
                  {style?.label || type}
                </span>
              );
            })}
          </div>
        </div>

        {/* Action Bar */}
        <div className="w-full mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-center gap-1 text-[11px] font-bold text-rose-400 group-hover:text-rose-300">
          <Plus className="w-3.5 h-3.5" />
          <span>Escolher</span>
        </div>
      </div>
    );
  }
};
