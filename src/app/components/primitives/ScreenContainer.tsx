import { PropsWithChildren } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';

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
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
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

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});
