# Favorites Swipe/Tap Unfavorite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a user remove a quote from Favorites either by tapping an always-visible trailing star icon or by swiping the row left to reveal a trash action, on both iOS and Android.

**Architecture:** `List.Item` (`src/app/components/primitives/List.tsx`) gains an optional `trailingAction` prop. When set, the row renders a tappable trailing star icon, and the whole row is wrapped in `react-native-gesture-handler`'s `ReanimatedSwipeable` to reveal a red trash action on left-swipe. `FavoritesScreen` passes `trailingAction` wired to the existing `removeFavorite` from `FavoritesProvider` — no new state or persistence logic.

**Tech Stack:** React Native (Expo SDK 57), `react-native-gesture-handler` 2.32.0 (`ReanimatedSwipeable` subpath, already root-wrapped via `GestureHandlerRootView` in `App.tsx`), `@expo/vector-icons` `Ionicons` (already used elsewhere, e.g. `Button.tsx`).

## Global Constraints

- No new dependencies — `react-native-gesture-handler` and `react-native-reanimated` are already installed.
- No automated test suite exists in this repo (confirmed: no `jest`/test script in `package.json`, no `*.test.*`/`*.spec.*` files). Verification steps below use `npx tsc --noEmit` plus manual run-and-observe in the Expo app, matching how prior features in this repo were verified.
- `List.tsx` stays backward compatible: `trailingAction` is optional, and omitting it must render exactly as before (`FavoritesScreen` is currently the only consumer, but the primitive should not assume it).
- No auto-trigger-on-full-swipe: removal only happens on an explicit tap (trailing icon or revealed trash panel), never from the swipe gesture alone.

---

## File Structure

- Modify `src/app/components/primitives/List.tsx` — add `trailingAction` prop, split row layout into content + trailing icon, wrap row in `Swipeable` when `trailingAction` is set, reveal red trash action on swipe.
- Modify `src/domains/favorites/screens/FavoritesScreen.tsx` — pass `trailingAction` per item, wired to `toggleFavorite`.

---

### Task 1: `List.Item` trailing action + swipe-to-reveal

**Files:**
- Modify: `src/app/components/primitives/List.tsx` (full file, currently 83 lines)

**Interfaces:**
- Produces: `ListItemProps.trailingAction?: { icon: keyof typeof Ionicons.glyphMap; accessibilityLabel: string; onPress: () => void }` — consumed by `FavoritesScreen` in Task 2.
- Consumes: `react-native-gesture-handler/ReanimatedSwipeable` default export (`Swipeable` component) and its `SwipeableMethods` type (`close()` method) — already present in `node_modules/react-native-gesture-handler/src/components/ReanimatedSwipeable/ReanimatedSwipeableProps.ts`.

- [ ] **Step 1: Replace `List.tsx` with the version below**

```tsx
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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/primitives/List.tsx
git commit -m "Add trailing action + swipe-to-reveal to List.Item"
```

---

### Task 2: Wire unfavorite into `FavoritesScreen`

**Files:**
- Modify: `src/domains/favorites/screens/FavoritesScreen.tsx` (full file, currently 19 lines)

**Interfaces:**
- Consumes: `List.Item`'s `trailingAction` prop from Task 1 (`{ icon, accessibilityLabel, onPress }`); `useFavorites()`'s existing `removeFavorite: (id: number) => void` from `src/domains/favorites/context/FavoritesProvider.tsx:20` (more precise than `toggleFavorite` here since every row in this list is already a favorite).

- [ ] **Step 1: Add `trailingAction` to each `List.Item`**

```tsx
import { ScreenContainer } from '@/app/components/primitives/ScreenContainer';
import { Spacing } from '@/app/constants/theme';
import { List } from '@/app/components/primitives/List';
import { useFavorites } from '../context/FavoritesProvider';

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <ScreenContainer style={{ paddingHorizontal: Spacing.md }}>
      <List>
        {favorites.map((quote) => (
          <List.Item
            key={quote.id}
            title={quote.body}
            rightText={`- ${quote.author}`}
            trailingAction={{
              icon: 'star',
              accessibilityLabel: 'Remove from favorites',
              onPress: () => removeFavorite(quote.id),
            }}
          />
        ))}
      </List>
    </ScreenContainer>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual verification in the running app**

Run: `npm run ios` (or `npm run android`)
Then in the Favorites tab (favorite at least 2 quotes from Home first):
- Tap the trailing star icon on a row → row disappears immediately, remaining rows keep correct spacing (no stray bottom margin/gap on the new last row).
- Swipe a row left → red trash panel reveals; tap it → row is removed, panel closes as part of removal.
- Swipe a row left, then swipe back right (or tap the row itself) without tapping trash → panel closes, row stays, nothing removed.
- Remove every favorite → screen renders an empty list without layout error or crash.
- Confirm the same behavior on the other platform (iOS if you tested Android first, or vice versa) — this is the cross-platform payoff of not forking into a SwiftUI-only path.

- [ ] **Step 4: Commit**

```bash
git add src/domains/favorites/screens/FavoritesScreen.tsx
git commit -m "Wire tap/swipe unfavorite into FavoritesScreen"
```
