import React, { createContext, useContext, useState } from 'react';
import { AppState, Track } from '../types';
import { tracks } from '../data/tracks';

interface AppContextType {
  state: AppState;
  togglePlay: () => void;
  setTrack: (track: Track) => void;
  setVolume: (volume: number) => void;
  toggleAdmin: () => void;
}

const initialState: AppState = {
  isPlaying: false,
  currentTrack: tracks[0],
  volume: 70,
  isAdmin: false
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const togglePlay = () => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const setTrack = (track: Track) => {
    setState(prev => ({ ...prev, currentTrack: track, isPlaying: true }));
  };

  const setVolume = (volume: number) => {
    setState(prev => ({ ...prev, volume }));
  };

  const toggleAdmin = () => {
    setState(prev => ({ ...prev, isAdmin: !prev.isAdmin }));
  };

  return (
    <AppContext.Provider value={{ state, togglePlay, setTrack, setVolume, toggleAdmin }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};