import { create } from 'zustand';
import { AppSettings } from '../../shared/types';

interface SettingsState {
  settings: AppSettings | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useSettingsStore = create<SettingsState>((set, _get) => ({
  settings: null,
  isLoading: false,
  error: null,

  loadSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const settings = await window.electronAPI.getSettings();
      set({ settings, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load settings';
      set({ error: errorMessage, isLoading: false });
    }
  },

  updateSettings: async (newSettings: Partial<AppSettings>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedSettings = await window.electronAPI.updateSettings(newSettings);
      set({ settings: updatedSettings, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update settings';
      set({ error: errorMessage, isLoading: false });
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
