import { Ionicons } from '@expo/vector-icons';
import { Children, cloneElement, ReactElement, ReactNode, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Swipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';

import { Text } from '@/app/components/primitives/Text';
import { Spacing } from '@/app/constants/theme';
import { useTheme } from '@/app/hooks/useTheme';

type InternalListItemProps = {
  isLast?: boolean;
};

type ListItemTrailingAction = {
  icon: keyof typeof Ionicons.glyphMap;
  accessibilityLabel: string;
  onPress: () => void;
};

type ListItemProps = {
  title: string;
  rightText?: string;
  icon?: ReactNode;
  onPress?: () => void;
  trailingAction?: ListItemTrailingAction;
};

const SWIPE_ACTION_WIDTH = Spacing.xl * 2;
const SWIPE_ACTION_COLOR = '#E74C3C';

function ListItem({
  title,
  icon,
  onPress,
  rightText,
  trailingAction,
  isLast,
}: ListItemProps & InternalListItemProps) {
  const theme = useTheme();
  const swipeableRef = useRef<SwipeableMethods>(null);

  const row = (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        {
          alignItems: 'center',
          borderWidth: StyleSheet.hairlineWidth,
          borderRadius: Spacing.sm,
          flexDirection: 'row',
          gap: Spacing.sm,
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm,
        },
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
          opacity: pressed && !!onPress ? 0.6 : 1,
        },
      ]}>
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
      {trailingAction && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={trailingAction.accessibilityLabel}
          hitSlop={{ top: Spacing.sm, bottom: Spacing.sm, left: Spacing.sm, right: Spacing.sm }}
          onPress={trailingAction.onPress}
          style={{ marginLeft: 'auto', padding: Spacing.xxs }}>
          <Ionicons name={trailingAction.icon} size={20} color={theme.tint} />
        </Pressable>
      )}
    </Pressable>
  );

  if (!trailingAction) {
    return <View style={{ marginBottom: isLast ? 0 : Spacing.sm }}>{row}</View>;
  }

  return (
    <Swipeable
      ref={swipeableRef}
      containerStyle={{
        borderRadius: Spacing.sm,
        marginBottom: isLast ? 0 : Spacing.sm,
        overflow: 'hidden',
      }}
      renderRightActions={() => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={trailingAction.accessibilityLabel}
          onPress={() => {
            trailingAction.onPress();
            swipeableRef.current?.close();
          }}
          style={{
            alignItems: 'center',
            backgroundColor: SWIPE_ACTION_COLOR,
            justifyContent: 'center',
            width: SWIPE_ACTION_WIDTH,
          }}>
          <Ionicons name="trash" size={20} color="#ffffff" />
        </Pressable>
      )}>
      {row}
    </Swipeable>
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
