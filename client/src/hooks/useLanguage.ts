import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'es' | 'en';

// Helper function to detect browser language
const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  return browserLang === 'es' ? 'es' : 'en'; // Default to English if not Spanish
};

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: detectBrowserLanguage(), // Detect browser language by default
      setLanguage: (language: Language) => set({ language }),
    }),
    {
      name: 'procurus-language', // Local storage key
    }
  )
);

export default useLanguageStore;