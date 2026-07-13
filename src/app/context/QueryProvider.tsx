import { PropsWithChildren, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryCache, QueryClient, focusManager, onlineManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

const queryClient = new QueryClient({
  queryCache: new QueryCache(),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // quote of the day only changes daily
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
      persistOptions={{ persister: asyncStoragePersister }}>
      {children}
    </PersistQueryClientProvider>
  );
}
