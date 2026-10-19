import React, { useState, useEffect } from 'react';
import { getPokemonArtwork } from '../services/pokemonApi';
import { useSpriteFormat, SpriteFormat } from '../context/SpriteFormatContext';

interface PokemonSpriteImageProps {
  id: number;
  name: string;
  isShiny?: boolean;
  className?: string;
  alt?: string;
  preferGif?: boolean;
  format?: SpriteFormat; // explicitly override format ('gif' | 'png')
}

export const PokemonSpriteImage: React.FC<PokemonSpriteImageProps> = ({
  id,
  name,
  isShiny = false,
  className = '',
  alt = '',
  preferGif,
  format,
}) => {
  const context = useSpriteFormat();
  
  // Priority: explicit prop format -> preferGif prop -> global context format
  const effectiveFormat: SpriteFormat =
    format !== undefined
      ? format
      : preferGif !== undefined
      ? preferGif
        ? 'gif'
        : 'png'
      : context.format;

  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    setStep(0);
  }, [id, isShiny, effectiveFormat]);

  const cleanName = (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  const getSource = (): string => {
    if (effectiveFormat === 'png') {
      switch (step) {
        case 0:
          // High-resolution Official Artwork PNG
          return getPokemonArtwork(id, isShiny);
        case 1:
          // Default Sprite PNG
          return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
            isShiny ? 'shiny/' : ''
          }${id}.png`;
        default:
          // Showdown static PNG
          return `https://play.pokemonshowdown.com/sprites/gen5/${
            isShiny ? 'shiny/' : ''
          }${cleanName}.png`;
      }
    } else {
      // GIF Mode
      switch (step) {
        case 0:
          // Showdown animated GIF from PokeAPI repository
          return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${
            isShiny ? 'shiny/' : ''
          }${id}.gif`;
        case 1:
          // Pokémon Showdown official animated GIF
          return `https://play.pokemonshowdown.com/sprites/${
            isShiny ? 'ani-shiny' : 'ani'
          }/${cleanName}.gif`;
        case 2:
          // Fallback to high-res official artwork PNG
          return getPokemonArtwork(id, isShiny);
        default:
          // Fallback to default static sprite PNG
          return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
            isShiny ? 'shiny/' : ''
          }${id}.png`;
      }
    }
  };

  const handleError = () => {
    const maxSteps = effectiveFormat === 'png' ? 2 : 3;
    if (step < maxSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const isPixelSprite = effectiveFormat === 'gif' && step <= 1;

  return (
    <img
      src={getSource()}
      alt={alt || name}
      onError={handleError}
      className={`object-contain transition-transform duration-200 ${className}`}
      style={{
        imageRendering: isPixelSprite ? 'pixelated' : 'auto',
      }}
      loading="lazy"
    />
  );
};
