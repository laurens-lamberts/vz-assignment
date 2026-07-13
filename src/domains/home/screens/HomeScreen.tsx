import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/app/components/ThemedText';
import { ThemedView } from '@/app/components/ThemedView';
import { Button } from '@/app/components/primitives/Button';
import { ScreenContainer } from '@/app/components/primitives/ScreenContainer';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/app/constants/theme';
import { useTheme } from '@/app/hooks/useTheme';
import { useQuoteOfTheDay } from '@/domains/home/queries/useQuoteOfTheDay';

export default function HomeScreen() {
  const theme = useTheme();
  const { data, isPending, isError, isRefetching, refetch } = useQuoteOfTheDay();

  return (
    <ScreenContainer isRefreshing={isRefetching} onRefresh={refetch}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.card}>
          {isPending && <ActivityIndicator color={theme.text} />}

          {!isPending && isError && (
            <>
              <ThemedText type="default" themeColor="textSecondary" style={styles.centerText}>
                Couldn&apos;t load today&apos;s quote.
              </ThemedText>
              <Button text="Try again" onPress={() => refetch()} />
            </>
          )}

          {!isPending && !isError && data && (
            <>
              <ThemedText type="subtitle" style={styles.centerText}>
                “{data.quote.body}”
              </ThemedText>
              <ThemedText type="default" themeColor="textSecondary" style={styles.centerText}>
                — {data.quote.author}
              </ThemedText>
            </>
          )}
        </ThemedView>
      </SafeAreaView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: BottomTabInset + Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  card: {
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
  },
  centerText: {
    textAlign: 'center',
  },
});
