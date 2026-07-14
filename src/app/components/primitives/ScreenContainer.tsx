import { PropsWithChildren, useEffect, useRef } from 'react';
import { AccessibilityInfo, RefreshControl, ScrollView, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/app/constants/theme';
import { useTheme } from '@/app/hooks/useTheme';
import { useBottomTabBarHeight } from 'react-native-bottom-tabs';

type ScreenContainerProps = PropsWithChildren<{
  isRefreshing?: boolean;
  onRefresh?: () => void;
  style?: StyleProp<ViewStyle>;
  /** Set when the screen renders under a native-stack header (e.g. a search bar screen) */
  hasHeader?: boolean;
}>;

export function ScreenContainer({
  children,
  isRefreshing = false,
  onRefresh,
  style,
  hasHeader = false,
}: ScreenContainerProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const tabBarHeight = useBottomTabBarHeight();
  const bottomInset = tabBarHeight + Spacing.md;

  const wasRefreshing = useRef(isRefreshing);
  useEffect(() => {
    if (wasRefreshing.current && !isRefreshing) {
      AccessibilityInfo.announceForAccessibility('Refreshed');
    }
    wasRefreshing.current = isRefreshing;
  }, [isRefreshing]);

  return (
    <ScrollView
      style={[{ flex: 1 }, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        {
          flexGrow: 1,
          paddingTop: hasHeader ? Spacing.md : insets.top + Spacing.md,
          paddingBottom: bottomInset,
        },
        style,
      ]}
      contentInsetAdjustmentBehavior={hasHeader ? 'automatic' : undefined}
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
