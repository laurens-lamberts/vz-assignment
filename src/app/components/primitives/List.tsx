import { Ionicons } from '@expo/vector-icons';
import { MenuView } from '@expo/ui/community/menu';
import { Children, cloneElement, ReactElement, ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/app/components/primitives/Text';
import { Spacing } from '@/app/constants/theme';
import { useTheme } from '@/app/hooks/useTheme';
import Animated, { LinearTransition } from 'react-native-reanimated';

type InternalListItemProps = {
  isLast?: boolean;
};

type ListItemMenuAction = {
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

type ListItemTopRightAction = {
  icon: keyof typeof Ionicons.glyphMap;
  accessibilityLabel: string;
  onPress: () => void;
};

type ListItemProps = {
  title: string;
  rightText?: string;
  icon?: ReactNode;
  onPress?: () => void;
  menuActions?: ListItemMenuAction[];
  topRightAction?: ListItemTopRightAction;
};

function ListItem({
  title,
  icon,
  onPress,
  rightText,
  menuActions,
  topRightAction,
  isLast,
}: ListItemProps & InternalListItemProps) {
  const theme = useTheme();
  const hasMenu = !!menuActions && menuActions.length > 0;

  const rowStyle = [
    {
      alignItems: 'flex-start' as const,
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: Spacing.sm,
      flexDirection: 'row' as const,
      gap: Spacing.sm,
      justifyContent: 'space-between' as const,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
    },
    {
      backgroundColor: theme.backgroundElement,
      borderColor: theme.border,
    },
  ];

  const content = (
    <View style={{ flexShrink: 1 }}>
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
    </View>
  );

  const topRightButton = topRightAction && (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={topRightAction.accessibilityLabel}
      onPress={topRightAction.onPress}
      hitSlop={Spacing.sm}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
      <Ionicons name={topRightAction.icon} size={18} color={theme.text} />
    </Pressable>
  );

  const row = hasMenu ? (
    <View style={rowStyle}>
      {content}
      {topRightButton}
    </View>
  ) : (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [...rowStyle, { opacity: pressed && !!onPress ? 0.6 : 1 }]}>
      {content}
      {topRightButton}
    </Pressable>
  );

  return (
    <Animated.View style={{ marginBottom: isLast ? 0 : Spacing.sm }} layout={LinearTransition}>
      {hasMenu ? (
        <MenuView
          actions={menuActions.map((action, index) => ({
            id: String(index),
            title: action.label,
            attributes: { destructive: action.destructive },
          }))}
          shouldOpenOnLongPress
          onPressAction={(event) => {
            menuActions[Number(event.nativeEvent.event)]?.onPress();
          }}>
          {row}
        </MenuView>
      ) : (
        row
      )}
    </Animated.View>
  );
}

type ListItemElement = ReactElement<ListItemProps & InternalListItemProps>;

type ListProps = {
  children: ListItemElement | ListItemElement[];
};

export function List({ children }: ListProps) {
  const childrenArray = Children.toArray(children) as ListItemElement[];

  return (
    <View style={{ width: '100%' }}>
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
