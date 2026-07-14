import { PropsWithChildren, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import {
  QueryCache,
  QueryClient,
  defaultShouldDehydrateQuery,
  focusManager,
  onlineManager,
} from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { CACHE_KEYS } from '@/app/config/cacheKeys';

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

const queryClient = new QueryClient({
  queryCache: new QueryCache(),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

function onAppStateChange(status: AppStateStatus) {
  focusManager.setFocused(status === 'active');
}

export function QueryProvider({ children }: PropsWithChildren<{}>) {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        dehydrateOptions: {
          // Quote of the day must always be fetched fresh on mount (see useQuoteOfTheDay),
          // so restoring it from disk would only reintroduce a stale-quote flash on startup.
          shouldDehydrateQuery: (query) =>
            defaultShouldDehydrateQuery(query) && query.queryKey[0] !== CACHE_KEYS.QUOTE_OF_THE_DAY,
        },
      }}>
      {children}
    </PersistQueryClientProvider>
  );
}
