import React from 'react';
import { Film, Image as ImageIcon } from 'lucide-react';
import { useSpriteFormat, SpriteFormat } from '../context/SpriteFormatContext';

interface SpriteFormatToggleProps {
  className?: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export const SpriteFormatToggle: React.FC<SpriteFormatToggleProps> = ({
  className = '',
  size = 'md',
  showLabel = true,
}) => {
  const { format, setFormat } = useSpriteFormat();

  const isSmall = size === 'sm';

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-xl bg-slate-950/80 border border-slate-800 ${className}`}
      role="group"
      aria-label="Selecionar formato do sprite Pokémon"
    >
      <button
        type="button"
        onClick={() => setFormat('gif')}
        className={`flex items-center gap-1.5 rounded-lg font-bold transition-all ${
          isSmall ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-xs'
        } ${
          format === 'gif'
            ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400/40'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        title="Exibir Pokémon com sprites animados em GIF (Pokémon Showdown)"
      >
        <Film className={isSmall ? 'w-3 h-3 text-blue-300' : 'w-3.5 h-3.5 text-blue-300'} />
        <span>{showLabel ? 'GIF Animado' : 'GIF'}</span>
      </button>

      <button
        type="button"
        onClick={() => setFormat('png')}
        className={`flex items-center gap-1.5 rounded-lg font-bold transition-all ${
          isSmall ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-xs'
        } ${
          format === 'png'
            ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/40'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        title="Exibir Pokémon em ilustrações estáticas em alta resolução (PNG Oficial)"
      >
        <ImageIcon className={isSmall ? 'w-3 h-3 text-emerald-300' : 'w-3.5 h-3.5 text-emerald-300'} />
        <span>{showLabel ? 'PNG Estático' : 'PNG'}</span>
      </button>
    </div>
  );
};
