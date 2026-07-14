import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { STORAGE_KEYS } from '@/app/config/storageKeys';
import type { Quote } from '@/domains/home/queries/useQuoteOfTheDay';

type FavoritesContextValue = {
  favorites: Quote[];
  isHydrated: boolean;
  isFavorite: (id: number) => boolean;
  addFavorite: (quote: Quote) => void;
  removeFavorite: (id: number) => void;
  toggleFavorite: (quote: Quote) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: PropsWithChildren<{}>) {
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.FAVORITES)
      .then((stored) => {
        if (stored) setFavorites(JSON.parse(stored));
      })
      .finally(() => setIsHydrated(true));
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites, isHydrated]);

  const isFavorite = useCallback(
    (id: number) => favorites.some((quote) => quote.id === id),
    [favorites],
  );

  const addFavorite = useCallback((quote: Quote) => {
    setFavorites((current) =>
      current.some((existing) => existing.id === quote.id) ? current : [...current, quote],
    );
  }, []);

  const removeFavorite = useCallback((id: number) => {
    setFavorites((current) => current.filter((quote) => quote.id !== id));
  }, []);

  const toggleFavorite = useCallback(
    (quote: Quote) => {
      if (isFavorite(quote.id)) {
        removeFavorite(quote.id);
      } else {
        addFavorite(quote);
      }
    },
    [isFavorite, addFavorite, removeFavorite],
  );

  const value = useMemo(
    () => ({ favorites, isHydrated, isFavorite, addFavorite, removeFavorite, toggleFavorite }),
    [favorites, isHydrated, isFavorite, addFavorite, removeFavorite, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
