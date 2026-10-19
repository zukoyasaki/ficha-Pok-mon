import React from 'react';
import {
  Flame,
  Leaf,
  Skull,
  Ghost,
  Feather,
  Eye,
  Shield,
  Zap,
  Sparkles,
} from 'lucide-react';
import { ElementalBadge } from '../data/trainerPresets';

interface ElementalBadgeIconProps {
  badge: ElementalBadge;
  isOwned: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ElementalBadgeIcon: React.FC<ElementalBadgeIconProps> = ({
  badge,
  isOwned,
  size = 'md',
  showLabel = false,
}) => {
  const iconProps = {
    className: size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4',
  };

  const renderIcon = () => {
    switch (badge.iconName) {
      case 'Flame':
        return <Flame {...iconProps} />;
      case 'Leaf':
        return <Leaf {...iconProps} />;
      case 'Skull':
        return <Skull {...iconProps} />;
      case 'Ghost':
        return <Ghost {...iconProps} />;
      case 'Feather':
        return <Feather {...iconProps} />;
      case 'Eye':
        return <Eye {...iconProps} />;
      case 'Shield':
        return <Shield {...iconProps} />;
      case 'Zap':
        return <Zap {...iconProps} />;
      default:
        return <Sparkles {...iconProps} />;
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`relative flex items-center justify-center rounded-xl transition-all duration-200 ${
          size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9'
        } ${
          isOwned
            ? 'border-2 shadow-md'
            : 'border border-slate-800 bg-slate-950/60 text-slate-600 opacity-40 hover:opacity-75'
        }`}
        style={
          isOwned
            ? {
                backgroundColor: `${badge.color}25`,
                borderColor: badge.color,
                color: badge.color,
                boxShadow: `0 0 14px ${badge.color}35`,
              }
            : undefined
        }
        title={`Insígnia de ${badge.name}`}
      >
        {renderIcon()}
      </div>
      {showLabel && (
        <span
          className={`text-[10px] font-bold truncate max-w-[54px] ${
            isOwned ? 'text-white' : 'text-slate-500'
          }`}
        >
          {badge.name}
        </span>
      )}
    </div>
  );
};
