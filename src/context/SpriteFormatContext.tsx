import React, { createContext, useContext, useState, useEffect } from 'react';

export type SpriteFormat = 'gif' | 'png';

interface SpriteFormatContextType {
  format: SpriteFormat;
  setFormat: (format: SpriteFormat) => void;
  toggleFormat: () => void;
}

const SpriteFormatContext = createContext<SpriteFormatContextType>({
  format: 'gif',
  setFormat: () => {},
  toggleFormat: () => {},
});

export const SpriteFormatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [format, setFormatState] = useState<SpriteFormat>(() => {
    try {
      const saved = localStorage.getItem('pokebuilder_sprite_format');
      return saved === 'png' ? 'png' : 'gif';
    } catch {
      return 'gif';
    }
  });

  const setFormat = (newFormat: SpriteFormat) => {
    setFormatState(newFormat);
    try {
      localStorage.setItem('pokebuilder_sprite_format', newFormat);
    } catch (e) {
      console.warn('Could not save sprite format preference:', e);
    }
  };

  const toggleFormat = () => {
    setFormat(format === 'gif' ? 'png' : 'gif');
  };

  return (
    <SpriteFormatContext.Provider value={{ format, setFormat, toggleFormat }}>
      {children}
    </SpriteFormatContext.Provider>
  );
};

export const useSpriteFormat = () => useContext(SpriteFormatContext);
