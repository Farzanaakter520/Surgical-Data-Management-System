'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Settings {
  theme: string;
  global?:{isLoading:boolean}
 }

interface SettingsProviderProps {
  children: ReactNode;
}

const defaultSettings: Settings = {
  theme: 'light',
  };

export const SettingsContext = createContext<{
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}>({
  settings: defaultSettings,
  setSettings: () => {},
});

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
