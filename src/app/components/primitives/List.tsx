import { Children, cloneElement, ReactElement, ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/app/components/primitives/Text';
import { Spacing } from '@/app/constants/theme';
import { useTheme } from '@/app/hooks/useTheme';

type InternalListItemProps = {
  isFirst?: boolean;
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
  isFirst,
  isLast,
}: ListItemProps & InternalListItemProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        {
          alignItems: 'center',
          borderWidth: StyleSheet.hairlineWidth,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm,
        },
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
          marginBottom: isLast ? 0 : -1,
          borderTopLeftRadius: isFirst ? Spacing.sm : 0,
          borderTopRightRadius: isFirst ? Spacing.sm : 0,
          borderBottomLeftRadius: isLast ? Spacing.sm : 0,
          borderBottomRightRadius: isLast ? Spacing.sm : 0,
          opacity: pressed ? 0.6 : 1,
        },
      ]}>
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: Spacing.sm }}>
        {icon}
        <Text size="s" bold>
          {title}
        </Text>
      </View>
      {rightText && (
        <Text size="s" color="textSecondary">
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
          isFirst: index === 0,
          isLast: index === childrenArray.length - 1,
        }),
      )}
    </View>
  );
}

List.Item = ListItem;
