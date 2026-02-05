'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ReadingContextType {
  hasCompletedReading: boolean;
  setHasCompletedReading: (value: boolean) => void;
}

const ReadingContext = createContext<ReadingContextType | undefined>(undefined);

export function ReadingProvider({ children }: { children: ReactNode }) {
  const [hasCompletedReading, setHasCompletedReading] = useState(false);

  return (
    <ReadingContext.Provider value={{ hasCompletedReading, setHasCompletedReading }}>
      {children}
    </ReadingContext.Provider>
  );
}

export function useReading() {
  const context = useContext(ReadingContext);
  if (context === undefined) {
    throw new Error('useReading must be used within a ReadingProvider');
  }
  return context;
}

