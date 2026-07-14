import { useEffect, useState } from 'react';
import Animated, { FadeIn, FadeOut, useReducedMotion } from 'react-native-reanimated';
import { Text } from '@/app/components/primitives/Text';
import { Text as RNText, View } from 'react-native';
import { Spacing } from '@/app/constants/theme';

const INTERVAL = 50; // milliseconds between each character being rendered

function AnimatedQuote({ quote, author }: { quote: string; author: string }) {
  const reducedMotion = useReducedMotion();
  const [previousQuote, setPreviousQuote] = useState(quote);
  const [numberOfCharactersRendered, setNumberOfCharactersRendered] = useState(
    reducedMotion ? quote.length : 0,
  );

  if (quote !== previousQuote) {
    setPreviousQuote(quote);
    setNumberOfCharactersRendered(reducedMotion ? quote.length : 0);
  }

  useEffect(() => {
    if (reducedMotion) return;
    if (numberOfCharactersRendered < quote.length) {
      const timeout = setTimeout(() => {
        setNumberOfCharactersRendered((prev) => prev + 1);
      }, INTERVAL);
      return () => clearTimeout(timeout);
    }
  }, [numberOfCharactersRendered, previousQuote, quote, reducedMotion]);

  return (
    <View style={{ gap: Spacing.md, alignSelf: 'flex-start' }}>
      <Text size="xxl" bold>
        {quote.split('').map((char, index) => (
          <RNText key={index} style={{ opacity: index < numberOfCharactersRendered ? 1 : 0 }}>
            {char}
          </RNText>
        ))}
      </Text>
      {numberOfCharactersRendered === quote.length && (
        <Animated.View
          entering={reducedMotion ? undefined : FadeIn}
          exiting={reducedMotion ? undefined : FadeOut}>
          <Text color="textSecondary" center>
            — {author}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}
export default AnimatedQuote;
