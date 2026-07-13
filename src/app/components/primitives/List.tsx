import { Children, cloneElement, ReactElement, ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/app/components/ThemedText';
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
        styles.row,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
          marginBottom: isLast ? 0 : -1,
          borderTopLeftRadius: isFirst ? Spacing.two : 0,
          borderTopRightRadius: isFirst ? Spacing.two : 0,
          borderBottomLeftRadius: isLast ? Spacing.two : 0,
          borderBottomRightRadius: isLast ? Spacing.two : 0,
          opacity: pressed ? 0.6 : 1,
        },
      ]}>
      <View style={styles.left}>
        {icon}
        <ThemedText type="smallBold">{title}</ThemedText>
      </View>
      {rightText && (
        <ThemedText type="small" themeColor="textSecondary">
          {rightText}
        </ThemedText>
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
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.two,
    overflow: 'hidden',
    width: '100%',
  },
  row: {
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  left: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
});
