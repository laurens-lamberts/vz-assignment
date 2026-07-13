import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/app/constants/theme';
import { useTheme } from '@/app/hooks/useTheme';

export function StickyBottomBar({ children }: PropsWithChildren<{}>) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.backgroundElement,
          paddingBottom: insets.bottom + Spacing.two,
        },
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    bottom: 0,
    left: 0,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    position: 'absolute',
    right: 0,
  },
});
