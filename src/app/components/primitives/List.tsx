import { Ionicons } from '@expo/vector-icons';
import { MenuView } from '@expo/ui/community/menu';
import { Children, cloneElement, ReactElement, ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/app/components/primitives/Text';
import { Spacing } from '@/app/constants/theme';
import { useTheme } from '@/app/hooks/useTheme';

type InternalListItemProps = {
  isLast?: boolean;
};

type ListItemMenuAction = {
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

type ListItemProps = {
  title: string;
  rightText?: string;
  icon?: ReactNode;
  onPress?: () => void;
  menuAction?: ListItemMenuAction;
};

function ListItem({
  title,
  icon,
  onPress,
  rightText,
  menuAction,
  isLast,
}: ListItemProps & InternalListItemProps) {
  const theme = useTheme();

  return (
    <View style={{ marginBottom: isLast ? 0 : Spacing.sm }}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          {
            alignItems: 'flex-start',
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
        {menuAction && (
          <MenuView
            style={{ marginLeft: 'auto', padding: Spacing.xxs }}
            actions={[
              {
                id: 'menuAction',
                title: menuAction.label,
                attributes: { destructive: menuAction.destructive },
              },
            ]}
            onPressAction={() => menuAction.onPress()}>
            <Ionicons name="ellipsis-vertical" size={18} color={theme.textSecondary} />
          </MenuView>
        )}
      </Pressable>
    </View>
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
