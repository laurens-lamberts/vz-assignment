import { PropsWithChildren } from 'react';
import { RefreshControl, ScrollView, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/app/constants/theme';
import { useTheme } from '@/app/hooks/useTheme';

type ScreenContainerProps = PropsWithChildren<{
  isRefreshing?: boolean;
  onRefresh?: () => void;
  style?: StyleProp<ViewStyle>;
}>;

export function ScreenContainer({
  children,
  isRefreshing = false,
  onRefresh,
  style,
}: ScreenContainerProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[{ flex: 1 }, { backgroundColor: theme.background }]}
      contentContainerStyle={[{ flexGrow: 1, paddingTop: insets.top + Spacing.md }, style]}
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
