import { Pressable } from 'react-native';

import { Text } from '@/app/components/primitives/Text';
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
        {
          alignItems: 'center',
          borderRadius: Spacing.xl,
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.sm,
        },
        { backgroundColor: theme.tint, opacity: disabled ? 0.5 : pressed ? 0.7 : 1 },
      ]}>
      <Text size="s" bold style={{ color: '#ffffff' }}>
        {text}
      </Text>
    </Pressable>
  );
}
