import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/data/api';
import { sanitizeQuote } from '@/app/utils/sanitizeQuote';
import { CACHE_KEYS } from '@/app/config/cacheKeys';

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
    queryKey: [CACHE_KEYS.QUOTE_OF_THE_DAY],
    // Very short garbage collection time to ensure the quote is refreshed daily,
    // but still leave a bit of time for app startup to keep the same quote during rendering of the text.
    gcTime: 2000,
    refetchOnMount: 'always',
    queryFn: async () => {
      const response = await api.get<QuoteOfTheDayResponse>('/qotd');
      return {
        ...response.data,
        quote: {
          ...response.data.quote,
          body: sanitizeQuote(response.data.quote.body),
        },
      };
    },
  });
}
