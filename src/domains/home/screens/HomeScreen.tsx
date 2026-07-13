import { ActivityIndicator, View } from 'react-native';
import { useBottomTabBarHeight } from 'react-native-bottom-tabs';

import { Button } from '@/app/components/primitives/Button';
import { ScreenContainer } from '@/app/components/primitives/ScreenContainer';
import { Text } from '@/app/components/primitives/Text';
import { Spacing } from '@/app/constants/theme';
import { useTheme } from '@/app/hooks/useTheme';
import { useQuoteOfTheDay } from '@/domains/home/queries/useQuoteOfTheDay';

export default function HomeScreen() {
  const theme = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const { data, isPending, isError, refetch } = useQuoteOfTheDay();

  const bottomInset = tabBarHeight + Spacing.md;

  return (
    <>
      <ScreenContainer>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            paddingBottom: bottomInset,
            paddingHorizontal: Spacing.md,
          }}>
          {isPending && <ActivityIndicator color={theme.text} />}

          {!isPending && isError && (
            <>
              <Text color="textSecondary" center>
                Couldn&apos;t load today&apos;s quote.
              </Text>
              <Button text="Try again" onPress={() => refetch()} />
            </>
          )}

          {!isPending && !isError && data && (
            <View style={{ gap: Spacing.md }}>
              <Text size="xxl" bold center>
                “{data.quote.body}”
              </Text>
              <Text color="textSecondary" center>
                — {data.quote.author}
              </Text>
            </View>
          )}
        </View>
      </ScreenContainer>
      {!isPending && !isError && data && (
        <View
          style={{
            position: 'absolute',
            bottom: bottomInset,
            alignSelf: 'center',
          }}>
          <Button text="Get another one" onPress={() => refetch()} />
        </View>
      )}
    </>
  );
}
