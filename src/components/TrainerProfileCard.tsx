import React, { useState, useRef } from 'react';
import {
  Upload,
  Link,
  Sparkles,
  User,
  Shield,
  Award,
  RefreshCw,
  UserPlus,
  Layers,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Package,
} from 'lucide-react';
import { TrainerProfile, TrainerSheet, BagItem } from '../types/pokemon';
import {
  TRAINER_PRESETS,
  TRAINER_BADGES,
} from '../data/trainerPresets';
import { ElementalBadgeIcon } from './ElementalBadgeIcon';

interface TrainerProfileCardProps {
  profile: TrainerProfile;
  onChangeProfile: (updated: TrainerProfile) => void;
  onRandomizeTrainer: () => void;
  onOpenPassport: () => void;
  sheets: TrainerSheet[];
  activeSheetId: string;
  onSelectSheet: (sheetId: string) => void;
  onOpenCreateSheet: () => void;
  onOpenSheetsList: () => void;
  bag?: BagItem[];
  onOpenBag: () => void;
}

export const TrainerProfileCard: React.FC<TrainerProfileCardProps> = ({
  profile,
  onChangeProfile,
  onRandomizeTrainer,
  onOpenPassport,
  sheets,
  activeSheetId,
  onSelectSheet,
  onOpenCreateSheet,
  onOpenSheetsList,
  bag = [],
  onOpenBag,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChangeProfile({
            ...profile,
            avatarUrl: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChangeProfile({
        ...profile,
        avatarUrl: urlInput.trim(),
      });
      setUrlInput('');
    }
  };

  const toggleBadge = (badgeName: string) => {
    const exists = profile.badges.includes(badgeName);
    const updated = exists
      ? profile.badges.filter((b) => b !== badgeName)
      : [...profile.badges, badgeName];
    onChangeProfile({
      ...profile,
      badges: updated,
    });
  };

  const currentSheetIndex = sheets.findIndex((s) => s.id === activeSheetId);
  const currentSheet = sheets[currentSheetIndex];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md flex flex-col justify-between">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -left-24 w-60 h-60 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-52 h-52 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Top Header Card Info */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[11px] font-bold tracking-widest text-rose-400 uppercase">
                Ficha do Personagem
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight mt-0.5">
              Treinador Pokémon
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRandomizeTrainer}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Sortear Treinador Aleatório"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onOpenPassport}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold shadow-md shadow-rose-950/40 flex items-center gap-1.5 transition"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Ficha da Liga</span>
            </button>
          </div>
        </div>

        {/* Gerenciador de Múltiplas Fichas de Treinador */}
        <div className="mb-5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <Layers className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider truncate">
                Ficha Ativa ({currentSheetIndex >= 0 ? currentSheetIndex + 1 : 1} de {sheets.length})
              </span>
            </div>

            {/* Previous / Next Navigation Arrows */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  const prevIndex = (currentSheetIndex - 1 + sheets.length) % sheets.length;
                  onSelectSheet(sheets[prevIndex].id);
                }}
                disabled={sheets.length <= 1}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition"
                title="Ficha anterior"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const nextIndex = (currentSheetIndex + 1) % sheets.length;
                  onSelectSheet(sheets[nextIndex].id);
                }}
                disabled={sheets.length <= 1}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition"
                title="Próxima ficha"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Dropdown Selector */}
          <div className="relative mb-2.5">
            <select
              value={activeSheetId}
              onChange={(e) => onSelectSheet(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-rose-500 appearance-none cursor-pointer truncate"
            >
              {sheets.map((sheet, idx) => (
                <option key={sheet.id} value={sheet.id}>
                  #{idx + 1} - {sheet.name} ({sheet.profile.name || 'Sem nome'})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Action Buttons: "+ Nova Ficha" e "Ver Outras Fichas" */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onOpenCreateSheet}
              className="py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold shadow-md shadow-rose-950/40 flex items-center justify-center gap-1.5 transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Nova Ficha</span>
            </button>

            <button
              type="button"
              onClick={onOpenSheetsList}
              className="py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Ver Outras Fichas ({sheets.length})</span>
            </button>
          </div>
        </div>

        {/* Character Image & Level Showcase */}
        <div className="mb-6">
          <div className="relative group w-full aspect-square max-w-[280px] mx-auto rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 border-2 border-slate-700/80 p-3 shadow-inner flex flex-col items-center justify-center overflow-hidden">
            {/* Holographic lines / scanline texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

            {/* Trainer Image */}
            <div className="w-full h-full flex items-center justify-center relative z-0 py-2">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name || 'Treinador'}
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // fallback if broken image
                    (e.target as HTMLImageElement).src =
                      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/red.png';
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <User className="w-20 h-20 stroke-1 mb-2" />
                  <span className="text-xs">Sem Imagem do Treinador</span>
                </div>
              )}
            </div>

            {/* Trainer Name Banner Overlay on bottom of avatar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 pt-6 text-center">
              <p className="text-lg font-black text-white tracking-wide truncate">
                {profile.name || 'Treinador Sem Nome'}
              </p>
              <p className="text-xs font-semibold text-rose-400 truncate">
                {profile.trainerClass || 'Título do Treinador'}
              </p>
            </div>
          </div>

          {/* Avatar Source Switcher tabs */}
          <div className="mt-4">
            <div className="flex items-center justify-center gap-1 p-1 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition ${
                  activeTab === 'presets'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Presets Clássicos
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1 transition ${
                  activeTab === 'upload'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Foto
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1 transition ${
                  activeTab === 'url'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                Link URL
              </button>
            </div>

            {/* Presets gallery row */}
            {activeTab === 'presets' && (
              <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {TRAINER_PRESETS.map((preset) => {
                  const isSelected = profile.avatarUrl === preset.avatarUrl;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        onChangeProfile({
                          ...profile,
                          avatarUrl: preset.avatarUrl,
                          name: profile.name === 'Red' || !profile.name ? preset.name : profile.name,
                          trainerClass: profile.trainerClass || preset.trainerClass,
                        });
                      }}
                      className={`relative flex-shrink-0 w-12 h-12 rounded-xl p-1 border transition-all ${
                        isSelected
                          ? 'border-rose-500 bg-rose-500/20 ring-2 ring-rose-500/40 scale-105'
                          : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-800'
                      }`}
                      title={preset.name}
                    >
                      <img
                        src={preset.avatarUrl}
                        alt={preset.name}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Upload Area */}
            {activeTab === 'upload' && (
              <div className="mt-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-slate-700 hover:border-rose-500 rounded-xl bg-slate-950/40 text-center transition flex flex-col items-center justify-center gap-1.5"
                >
                  <Upload className="w-5 h-5 text-rose-400" />
                  <span className="text-xs font-semibold text-slate-200">
                    Clique para enviar imagem do seu personagem
                  </span>
                  <span className="text-[10px] text-slate-500">
                    PNG, JPG, WEBP ou GIF (máx 5MB)
                  </span>
                </button>
              </div>
            )}

            {/* URL Input */}
            {activeTab === 'url' && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://exemplo.com/personagem.png"
                  className="flex-1 px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition"
                >
                  Aplicar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Form Fields: Nome, Classe, Nível */}
        <div className="space-y-4">
          {/* Nome do Treinador */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Nome do Treinador
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={profile.name}
                onChange={(e) => onChangeProfile({ ...profile, name: e.target.value })}
                placeholder="Ex: Red, Cynthia, Ash, Lucas..."
                maxLength={30}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
              />
            </div>
          </div>

          {/* Opção da Mochila do Treinador (20 slots) - Logo abaixo de Nome do Jogador */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-800/60 to-rose-500/10 border border-amber-500/30 hover:border-amber-500/50 transition shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-sm flex-shrink-0">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-black text-white tracking-wide flex items-center gap-1.5">
                    Mochila
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                      {bag.length}/20
                    </span>
                  </span>
                  <p className="text-[10px] text-slate-400">
                    20 slots de itens com fotos
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenBag}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-950/40 transition hover:scale-105"
                title="Abrir mochila de 20 slots de itens"
              >
                <span>Abrir Mochila</span>
              </button>
            </div>

            {/* Mini preview row of items in the bag if any */}
            {bag.length > 0 ? (
              <div
                onClick={onOpenBag}
                className="flex items-center gap-1.5 overflow-x-auto py-1 px-1.5 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:border-amber-500/40 transition scrollbar-none"
                title="Clique para abrir e gerenciar os itens da mochila"
              >
                {bag.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-0.5 flex-shrink-0"
                  >
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-4 h-4 object-contain" />
                    ) : (
                      <Package className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span className="text-[10px] font-bold text-slate-200 truncate max-w-[80px]">
                      {item.name.split(' (')[0]}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-amber-400">
                      x{item.quantity}
                    </span>
                  </div>
                ))}
                {bag.length > 5 && (
                  <span className="text-[10px] font-bold text-slate-400 px-1">
                    +{bag.length - 5}
                  </span>
                )}
              </div>
            ) : (
              <div
                onClick={onOpenBag}
                className="py-1 px-2 text-center text-[10px] text-slate-400 bg-slate-950/40 rounded-xl border border-dashed border-slate-800 cursor-pointer hover:border-amber-500/40 transition"
              >
                + Mochila vazia. Clique para abrir e adicionar itens!
              </div>
            )}
          </div>

          {/* Título do Treinador */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Título do Treinador
            </label>
            <div className="relative">
              <Shield className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={profile.trainerClass}
                onChange={(e) =>
                  onChangeProfile({ ...profile, trainerClass: e.target.value })
                }
                placeholder="Ex: Mestre Pokémon, Campeão, Especialista em Dragões..."
                maxLength={40}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
              />
            </div>
          </div>

          {/* Insígnias Elementais (8) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Insígnias Elementais ({profile.badges.length}/8)
              </label>
              <button
                type="button"
                onClick={() => {
                  if (profile.badges.length === TRAINER_BADGES.length) {
                    onChangeProfile({ ...profile, badges: [] });
                  } else {
                    onChangeProfile({
                      ...profile,
                      badges: TRAINER_BADGES.map((b) => b.name),
                    });
                  }
                }}
                className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold"
              >
                {profile.badges.length === TRAINER_BADGES.length
                  ? 'Limpar'
                  : 'Marcar Todas'}
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              {TRAINER_BADGES.map((badge) => {
                const isOwned = profile.badges.includes(badge.name);
                return (
                  <button
                    key={badge.id}
                    type="button"
                    onClick={() => toggleBadge(badge.name)}
                    className="focus:outline-none transition transform active:scale-95 group"
                    title={`Insígnia de ${badge.name} (${badge.element}) - Clique para alternar`}
                  >
                    <ElementalBadgeIcon
                      badge={badge}
                      isOwned={isOwned}
                      size="md"
                      showLabel={true}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
