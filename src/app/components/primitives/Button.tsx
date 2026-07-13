import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/app/components/ThemedText';
import { Spacing } from '@/app/constants/theme';
import { useTheme } from '@/app/hooks/useTheme';

type ButtonProps = {
  text: string;
  onPress: () => void;
  disabled?: boolean;
};

export function Button({ text, onPress, disabled }: ButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.tint, opacity: disabled ? 0.5 : pressed ? 0.7 : 1 },
      ]}>
      <ThemedText type="smallBold" style={styles.text}>
        {text}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  text: {
    color: '#ffffff',
  },
});
