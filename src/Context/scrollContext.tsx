// src/context/ScrollContext.tsx
import React, { createContext, useContext } from 'react';

type ScrollContextType = {
  scrollToSection: (id: string) => void;
};

export const ScrollContext = createContext<ScrollContextType | null>(null);

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) throw new Error('useScroll must be used within ScrollProvider');
  return context;
};
