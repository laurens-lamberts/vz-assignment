import { useQuery } from '@tanstack/react-query';
import { STORAGE_KEYS } from '@/app/config/storageKeys';
import { api } from '@/app/data/api';
import { Quote } from '@/domains/home/queries/useQuoteOfTheDay';

type SearchQuotesResponse = {
  quotes: Quote[];
};

export function useSearchQuotes({ filter }: { filter: string }) {
  const trimmedFilter = filter.trim();

  return useQuery({
    queryKey: [STORAGE_KEYS.SEARCH_RESULTS, trimmedFilter],
    queryFn: async () => {
      const response = await api.get<SearchQuotesResponse>('/quotes', {
        params: {
          filter: trimmedFilter,
        },
      });
      return response.data.quotes.map((quote) => ({
        ...quote,
        body: quote.body.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ''),
      }));
    },
    enabled: trimmedFilter.length > 0,
  });
}
