import { useEffect, useState } from 'react';
import Animated, { FadeIn, FadeOut, useReducedMotion } from 'react-native-reanimated';
import { Text } from '@/app/components/primitives/Text';
import { Platform, View } from 'react-native';
import { Spacing } from '@/app/constants/theme';

export const INTERVAL = 50; // milliseconds between each character being rendered

function AnimatedQuote({ quote, author }: { quote: string; author: string }) {
  const reducedMotion = useReducedMotion();
  const [previousQuote, setPreviousQuote] = useState(quote);
  const [numberOfCharactersRendered, setNumberOfCharactersRendered] = useState(
    reducedMotion ? quote.length : 0,
  );

  // TODO; On Android the text does not seem to animate. To be investigated.
  const animationEnabled = Platform.OS !== 'android' && !reducedMotion;

  if (quote !== previousQuote) {
    setPreviousQuote(quote);
    setNumberOfCharactersRendered(animationEnabled ? 0 : quote.length);
  }

  useEffect(() => {
    if (!animationEnabled) return;
    if (numberOfCharactersRendered < quote.length) {
      const timeout = setTimeout(() => {
        setNumberOfCharactersRendered((prev) => prev + 1);
      }, INTERVAL);
      return () => clearTimeout(timeout);
    }
  }, [animationEnabled, numberOfCharactersRendered, previousQuote, quote, reducedMotion]);

  return (
    <View style={{ gap: Spacing.md, alignSelf: 'flex-start' }}>
      <Text size="xxl" bold>
        {quote.split('').map((char, index) => (
          <Animated.Text
            key={index}
            testID={`char-${index}`}
            style={{ opacity: index < numberOfCharactersRendered ? 1 : 0 }}>
            {char}
          </Animated.Text>
        ))}
      </Text>
      {numberOfCharactersRendered === quote.length && (
        <Animated.View
          entering={reducedMotion ? undefined : FadeIn}
          exiting={reducedMotion ? undefined : FadeOut}>
          <Text color="textSecondary" center testID="author">
            — {author}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}
export default AnimatedQuote;
