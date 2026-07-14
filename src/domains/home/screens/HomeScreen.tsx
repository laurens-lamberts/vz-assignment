import { ActivityIndicator, Platform, View } from 'react-native';
import { useBottomTabBarHeight } from 'react-native-bottom-tabs';

import { Button } from '@/app/components/primitives/Button';
import { ScreenContainer } from '@/app/components/primitives/ScreenContainer';
import { Text } from '@/app/components/primitives/Text';
import { Spacing } from '@/app/constants/theme';
import { useTheme } from '@/app/hooks/useTheme';
import { useFavorites } from '@/domains/favorites/context/FavoritesProvider';
import { useQuoteOfTheDay } from '@/domains/home/queries/useQuoteOfTheDay';
import AnimatedQuote from '../components/AnimatedQuote';

export default function HomeScreen() {
  const theme = useTheme();
  const { data, isPending, isError, refetch } = useQuoteOfTheDay();
  const { isFavorite, toggleFavorite } = useFavorites();

  const tabBarHeight = useBottomTabBarHeight();
  const bottomInset = tabBarHeight + Spacing.md;

  const hasData = !isPending && !isError && data;
  const hasError = !isPending && isError;

  return (
    <>
      <ScreenContainer>
        <View
          style={{
            alignItems: 'center',
            flex: 1,
            paddingBottom: bottomInset,
            paddingHorizontal: Spacing.md,
            gap: Spacing.md,
          }}>
          {isPending && <ActivityIndicator color={theme.text} />}
          {hasError && (
            <>
              <Text color="textSecondary" center>
                Couldn&apos;t load today&apos;s quote.
              </Text>
              <Button text="Try again" icon="refresh" onPress={() => refetch()} />
            </>
          )}
          {hasData && <AnimatedQuote quote={data.quote.body} author={data.quote.author} />}
        </View>
      </ScreenContainer>
      {!isPending && !isError && data && (
        <View
          style={{
            position: 'absolute',
            bottom: Platform.OS === 'ios' ? bottomInset : Spacing.lg,
            alignSelf: 'center',
          }}>
          <View style={{ flexDirection: 'row', gap: Spacing.md }}>
            <Button text="New quote" icon="shuffle" onPress={() => refetch()} />
            <Button
              text={isFavorite(data.quote.id) ? 'Unfavorite' : 'Favorite'}
              icon={isFavorite(data.quote.id) ? 'star' : 'star-outline'}
              onPress={() => toggleFavorite(data.quote)}
              minWidth={140}
            />
          </View>
        </View>
      )}
    </>
  );
}
