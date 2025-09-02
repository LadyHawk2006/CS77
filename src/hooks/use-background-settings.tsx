"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type BackgroundSettingsContextType = {
  opacity: number;
  setOpacity: Dispatch<SetStateAction<number>>;
};

const BackgroundSettingsContext =
  createContext<BackgroundSettingsContextType | undefined>(undefined);

export function BackgroundSettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [opacity, setOpacity] = useState(1);

  const value = useMemo(() => ({ opacity, setOpacity }), [opacity]);

  return (
    <BackgroundSettingsContext.Provider value={value}>
      {children}
    </BackgroundSettingsContext.Provider>
  );
}

export function useBackgroundSettings() {
  const context = useContext(BackgroundSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useBackgroundSettings must be used within a BackgroundSettingsProvider"
    );
  }
  return context;
}
