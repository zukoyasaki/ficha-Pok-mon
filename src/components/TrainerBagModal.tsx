import React, { useState, useRef } from 'react';
import {
  X,
  Briefcase,
  Plus,
  Trash2,
  Edit3,
  Upload,
  Link,
  Check,
  Package,
  Sparkles,
  ShoppingBag,
  Search,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { BagItem } from '../types/pokemon';
import { PRESET_ITEMS_CATALOG, PresetItemDefinition } from '../data/bagPresets';

interface TrainerBagModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainerName: string;
  bag: BagItem[];
  onSaveBag: (updatedBag: BagItem[]) => void;
}

const TOTAL_BAG_SLOTS = 20;

export const TrainerBagModal: React.FC<TrainerBagModalProps> = ({
  isOpen,
  onClose,
  trainerName,
  bag,
  onSaveBag,
}) => {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [isEditingSlot, setIsEditingSlot] = useState(false);

  // Form state for editing/adding item in slot
  const [formName, setFormName] = useState('');
  const [formQuantity, setFormQuantity] = useState(1);
  const [formCategory, setFormCategory] = useState<BagItem['category']>('general');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [imageTab, setImageTab] = useState<'catalog' | 'upload' | 'url'>('catalog');
  const [catalogSearch, setCatalogSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Build an array of 20 slots
  const slots: (BagItem | null)[] = Array.from({ length: TOTAL_BAG_SLOTS }, (_, idx) => {
    return bag.find((item) => item.slotIndex === idx) || null;
  });

  const occupiedCount = slots.filter(Boolean).length;

  const handleOpenAddOrEdit = (slotIdx: number) => {
    setSelectedSlotIndex(slotIdx);
    const existing = slots[slotIdx];

    if (existing) {
      setFormName(existing.name);
      setFormQuantity(existing.quantity);
      setFormCategory(existing.category || 'general');
      setFormImageUrl(existing.imageUrl || '');
      setFormDescription(existing.description || '');
      setImageTab('catalog');
    } else {
      // Empty slot defaults
      setFormName('');
      setFormQuantity(1);
      setFormCategory('general');
      setFormImageUrl('');
      setFormDescription('');
      setImageTab('catalog');
    }

    setIsEditingSlot(true);
  };

  const handleSaveSlot = () => {
    if (selectedSlotIndex === null) return;
    if (!formName.trim()) return;

    const newItem: BagItem = {
      id: `bag-item-${selectedSlotIndex}-${Date.now()}`,
      slotIndex: selectedSlotIndex,
      name: formName.trim(),
      quantity: Math.max(1, Math.min(999, Number(formQuantity) || 1)),
      category: formCategory,
      imageUrl: formImageUrl.trim() || undefined,
      description: formDescription.trim() || undefined,
    };

    // Replace or add item at slotIndex
    const updatedBag = bag.filter((item) => item.slotIndex !== selectedSlotIndex);
    updatedBag.push(newItem);
    updatedBag.sort((a, b) => a.slotIndex - b.slotIndex);

    onSaveBag(updatedBag);
    setIsEditingSlot(false);
    setSelectedSlotIndex(null);
  };

  const handleDeleteSlot = (slotIdx: number) => {
    const updatedBag = bag.filter((item) => item.slotIndex !== slotIdx);
    onSaveBag(updatedBag);
    if (selectedSlotIndex === slotIdx) {
      setIsEditingSlot(false);
      setSelectedSlotIndex(null);
    }
  };

  const handleClearBag = () => {
    if (window.confirm('Tem certeza de que deseja esvaziar todos os itens da mochila?')) {
      onSaveBag([]);
      setIsEditingSlot(false);
      setSelectedSlotIndex(null);
    }
  };

  const handleSelectPreset = (preset: PresetItemDefinition) => {
    setFormName(preset.name);
    setFormImageUrl(preset.imageUrl);
    setFormCategory(preset.category);
    setFormQuantity(preset.defaultQuantity);
    setFormDescription(preset.description);
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter catalog
  const filteredCatalog = PRESET_ITEMS_CATALOG.filter((item) => {
    if (!catalogSearch.trim()) return true;
    const q = catalogSearch.toLowerCase().trim();
    return (
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-amber-950/40">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                  Mochila de {trainerName || 'Treinador'}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {occupiedCount} / {TOTAL_BAG_SLOTS} Slots Ocupados
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 hidden sm:inline-block">
                  Capacidade: 20 Slots
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Guarde Pokébolas, poções, itens de batalha e berrys com fotos e quantidades personalizadas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {occupiedCount > 0 && (
              <button
                type="button"
                onClick={handleClearBag}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-300 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
                title="Esvaziar todos os itens da mochila"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Esvaziar</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
          {/* Main 20 Slots Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-amber-400" />
                  Compartimentos da Mochila (20 Slots)
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Clique em qualquer slot para adicionar ou personalizar o item
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {slots.map((item, idx) => {
                const isSelected = selectedSlotIndex === idx && isEditingSlot;

                if (!item) {
                  // Empty slot
                  return (
                    <div
                      key={`empty-slot-${idx}`}
                      onClick={() => handleOpenAddOrEdit(idx)}
                      className={`group relative h-32 rounded-2xl border-2 border-dashed p-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                          : 'border-slate-800 bg-slate-950/40 hover:border-amber-500/60 hover:bg-slate-850'
                      }`}
                    >
                      <span className="absolute top-2 left-2 text-[10px] font-mono font-bold text-slate-600 group-hover:text-slate-400">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>

                      <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-amber-500/50 flex items-center justify-center text-slate-500 group-hover:text-amber-400 group-hover:scale-110 transition">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span className="mt-2 text-[11px] font-semibold text-slate-500 group-hover:text-slate-300 transition">
                        Slot Vazio
                      </span>
                    </div>
                  );
                }

                // Filled slot
                return (
                  <div
                    key={item.id}
                    onClick={() => handleOpenAddOrEdit(idx)}
                    className={`group relative h-32 rounded-2xl border p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-md ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/50'
                        : 'border-slate-800 bg-slate-900/90 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    {/* Top: Slot number and quantity badge */}
                    <div className="w-full flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>

                      <span className="px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-black">
                        x{item.quantity}
                      </span>
                    </div>

                    {/* Item Image Visual */}
                    <div className="w-full flex items-center justify-center my-1 relative h-12">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow group-hover:scale-110 transition-transform duration-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                          <Package className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Item Name */}
                    <div className="w-full text-center">
                      <p
                        className="text-xs font-bold text-white group-hover:text-amber-300 transition truncate"
                        title={item.name}
                      >
                        {item.name}
                      </p>
                    </div>

                    {/* Hover delete quick action */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSlot(idx);
                      }}
                      className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-slate-950/80 hover:bg-red-500 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition shadow-sm"
                      title="Remover item do slot"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Edit/Add Slot Drawer / Section */}
          {isEditingSlot && selectedSlotIndex !== null && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-amber-500/40 shadow-xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs flex items-center justify-center">
                    #{selectedSlotIndex + 1}
                  </span>
                  <h3 className="text-sm font-black text-white">
                    {slots[selectedSlotIndex]
                      ? `Editar Item no Slot #${selectedSlotIndex + 1}`
                      : `Adicionar Novo Item no Slot #${selectedSlotIndex + 1}`}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {slots[selectedSlotIndex] && (
                    <button
                      type="button"
                      onClick={() => handleDeleteSlot(selectedSlotIndex)}
                      className="px-2.5 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                    >
                      Remover Slot
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsEditingSlot(false)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Form inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Item Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Nome do Item *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Ultra Bola, Poção Máxima, Restos, Doce Raro..."
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Quantidade (1 a 999)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(Math.max(1, Math.min(999, Number(e.target.value) || 1)))}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono font-bold text-white focus:outline-none focus:border-amber-500 text-center"
                  />
                </div>
              </div>

              {/* Image & Appearance Section */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Imagem do Item (Como o item é visualizado)
                  </label>

                  {/* Tabs: Catalog vs Upload vs URL */}
                  <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setImageTab('catalog')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition ${
                        imageTab === 'catalog'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Catálogo Oficial
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('upload')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                        imageTab === 'upload'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('url')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                        imageTab === 'url'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Link className="w-3 h-3" />
                      URL
                    </button>
                  </div>
                </div>

                {/* Preview Box */}
                <div className="flex items-center gap-4 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center p-1.5 flex-shrink-0 shadow-inner">
                    {formImageUrl ? (
                      <img
                        src={formImageUrl}
                        alt="Preview do item"
                        className="max-h-full max-w-full object-contain filter drop-shadow"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-slate-600" />
                    )}
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-white">
                      {formName || 'Nome do Item'} {formQuantity > 1 && `(x${formQuantity})`}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {formImageUrl ? 'Imagem vinculada com sucesso.' : 'Escolha um item do catálogo ou adicione sua imagem.'}
                    </p>
                  </div>
                </div>

                {/* Catalog tab */}
                {imageTab === 'catalog' && (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={catalogSearch}
                        onChange={(e) => setCatalogSearch(e.target.value)}
                        placeholder="Buscar item clássico (ex: master ball, poção, restos, doce raro, sitrus)..."
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
                      {filteredCatalog.map((preset) => {
                        const isChosen = formImageUrl === preset.imageUrl;
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => handleSelectPreset(preset)}
                            className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-between gap-1 group ${
                              isChosen
                                ? 'bg-amber-500/20 border-amber-500 ring-1 ring-amber-500'
                                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                            }`}
                            title={preset.description}
                          >
                            <img
                              src={preset.imageUrl}
                              alt={preset.name}
                              className="w-8 h-8 object-contain group-hover:scale-110 transition"
                            />
                            <span className="text-[10px] font-bold text-slate-300 group-hover:text-white truncate w-full">
                              {preset.name.split(' (')[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Upload tab */}
                {imageTab === 'upload' && (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-4 border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-xl bg-slate-950/60 text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-5 h-5 text-amber-400" />
                      <span className="text-xs font-bold text-slate-200">
                        Clique para enviar imagem do seu item
                      </span>
                      <span className="text-[10px] text-slate-500">
                        PNG, JPG, WEBP ou GIF (máx 3MB)
                      </span>
                    </button>
                  </div>
                )}

                {/* URL tab */}
                {imageTab === 'url' && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      placeholder="https://exemplo.com/item.png"
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    {formImageUrl && (
                      <button
                        type="button"
                        onClick={() => setFormImageUrl('')}
                        className="px-2.5 py-1 text-slate-400 hover:text-white text-xs bg-slate-800 rounded-lg"
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Item Description (Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Descrição / Efeito do Item (Opcional)
                </label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ex: Restaura 20 HP, item de captura, aumenta ataque..."
                  maxLength={120}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingSlot(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveSlot}
                  disabled={!formName.trim()}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-950/40 transition disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  Salvar no Slot #{selectedSlotIndex + 1}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>
            Todos os 20 slots da mochila são salvos na ficha atual do treinador.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            Fechar Mochila
          </button>
        </div>
      </div>
    </div>
  );
};
