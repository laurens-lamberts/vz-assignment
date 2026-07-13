import { useQuery } from '@tanstack/react-query';
import { STORAGE_KEYS } from '@/app/config/storageKeys';
import { api } from '@/app/data/api';

export type Quote = {
  id: number;
  author: string;
  body: string;
  tags: string[];
  url: string;
};

type QuoteOfTheDayResponse = {
  qotd_date: string;
  quote: Quote;
};

export function useQuoteOfTheDay() {
  return useQuery({
    queryKey: [STORAGE_KEYS.QUOTE_OF_THE_DAY],
    queryFn: async () => {
      const response = await api.get<QuoteOfTheDayResponse>('/qotd');
      return response.data;
    },
  });
}
