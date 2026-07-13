import { PropsWithChildren } from 'react';
import { RefreshControl, ScrollView } from 'react-native';

import { useTheme } from '@/app/hooks/useTheme';

type ScreenContainerProps = PropsWithChildren<{
  isRefreshing?: boolean;
  onRefresh?: () => void;
}>;

export function ScreenContainer({
  children,
  isRefreshing = false,
  onRefresh,
}: ScreenContainerProps) {
  const theme = useTheme();

  return (
    <ScrollView
      style={[{ flex: 1 }, { backgroundColor: theme.background }]}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={theme.text}
            titleColor={theme.text}
          />
        ) : undefined
      }>
      {children}
    </ScrollView>
  );
}
