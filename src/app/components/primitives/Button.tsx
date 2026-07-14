import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import { Text } from '@/app/components/primitives/Text';
import { Spacing } from '@/app/constants/theme';
import { useTheme } from '@/app/hooks/useTheme';

type ButtonProps = {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  minWidth?: number;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function Button({ text, onPress, disabled, minWidth, icon }: ButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: Spacing.xs,
          minWidth,
          minHeight: 44,
          borderRadius: Spacing.xl,
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.sm,
        },
        { backgroundColor: theme.tint, opacity: disabled ? 0.5 : pressed ? 0.7 : 1 },
      ]}>
      {icon && <Ionicons name={icon} size={16} color={theme.onTint} />}
      <Text size="s" bold style={{ color: theme.onTint }}>
        {text}
      </Text>
    </Pressable>
  );
}
