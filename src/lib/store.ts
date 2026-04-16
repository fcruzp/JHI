import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from './i18n';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  pendingQuoteSelection: {
    commodityCategory: string;
    commodityProduct: string;
  } | null;
  setPendingQuoteSelection: (selection: { commodityCategory: string; commodityProduct: string } | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'es',
      setLanguage: (language: Language) => set({ language }),
      chatOpen: false,
      setChatOpen: (chatOpen: boolean) => set({ chatOpen }),
      pendingQuoteSelection: null,
      setPendingQuoteSelection: (pendingQuoteSelection) => set({ pendingQuoteSelection }),
    }),
    {
      name: 'jhi-app-store',
      partialize: (state) => ({ language: state.language }),
    }
  )
);
