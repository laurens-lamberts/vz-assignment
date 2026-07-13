import { useQuery } from '@tanstack/react-query';
import { STORAGE_KEYS } from '@/app/config/storageKeys';
import { api } from '@/app/data/api';

type QuoteOfTheDayResponse = {
  qotd_date: string;
  quote: {
    id: number;
    author: string;
    body: string;
    tags: string[];
    url: string;
  };
};

export function useQuoteOfTheDay() {
  return useQuery({
    queryKey: [STORAGE_KEYS.QUOTES],
    queryFn: async () => {
      const response = await api.get<QuoteOfTheDayResponse>('/qotd');
      return response.data;
    },
  });
}
