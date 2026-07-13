import { Children, cloneElement, ReactElement, ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/app/components/primitives/Text';
import { Spacing } from '@/app/constants/theme';
import { useTheme } from '@/app/hooks/useTheme';

type InternalListItemProps = {
  isLast?: boolean;
};

type ListItemProps = {
  title: string;
  rightText?: string;
  icon?: ReactNode;
  onPress?: () => void;
};

function ListItem({
  title,
  icon,
  onPress,
  rightText,
  isLast,
}: ListItemProps & InternalListItemProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        {
          borderWidth: StyleSheet.hairlineWidth,
          borderRadius: Spacing.sm,
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm,
        },
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
          marginBottom: isLast ? 0 : Spacing.sm,
          opacity: pressed ? 0.6 : 1,
        },
      ]}>
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: Spacing.sm }}>
        {icon}
        <Text size="s" bold style={{ flexShrink: 1 }}>
          {title}
        </Text>
      </View>
      {rightText && (
        <Text size="s" color="textSecondary" style={{ marginTop: Spacing.xxs }}>
          {rightText}
        </Text>
      )}
    </Pressable>
  );
}

type ListItemElement = ReactElement<ListItemProps & InternalListItemProps>;

type ListProps = {
  children: ListItemElement | ListItemElement[];
};

export function List({ children }: ListProps) {
  const childrenArray = Children.toArray(children) as ListItemElement[];

  return (
    <View style={{ borderRadius: Spacing.sm, overflow: 'hidden', width: '100%' }}>
      {childrenArray.map((child, index) =>
        cloneElement(child, {
          key: child.key ?? index,
          isLast: index === childrenArray.length - 1,
        }),
      )}
    </View>
  );
}

List.Item = ListItem;
