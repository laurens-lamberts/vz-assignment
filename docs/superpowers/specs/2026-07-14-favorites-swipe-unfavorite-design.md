# Swipe / tap to unfavorite in the Favorites list

> **Superseded (2026-07-14):** after implementing the swipe-to-reveal approach below, further discussion replaced it with a native cross-platform context menu (`@expo/ui`'s `MenuView`, triggered by a trailing three-dot icon) instead of swipe. Swipe added discoverability risk on Android (no OS-level hint convention) and, once the always-visible trailing affordance existed, was redundant. See the implementation plan doc for the final approach; this doc is kept for the rejected-alternatives record.

## Problem

`FavoritesScreen` lists favorited quotes via the `List` primitive but offers no way to remove a favorite from the list itself (only from the Home screen's toggle button). A gesture-based removal was requested, but a hidden swipe-only affordance is not discoverable on Android (no OS-level swipe hint convention there). The design needs to work identically well on iOS and Android without forking the list implementation.

## Approach

Two affordances on each `List.Item` row, both calling the same removal callback:

1. **Always-visible trailing icon** — a filled `star` icon (matching the icon already used by the Home screen's Favorite/Unfavorite `Button`), tappable, present on both platforms. This is the primary, fully discoverable affordance and is sufficient on its own.
2. **Swipe-to-reveal (bonus)** — wrapping the row in `react-native-gesture-handler`'s `Swipeable` (already installed and root-wrapped via `GestureHandlerRootView` in `App.tsx`). Swiping left reveals a red panel with a trash icon. Tapping the revealed panel triggers removal and closes the swipeable. No auto-trigger-on-full-swipe — the destructive action always requires an explicit tap, on either affordance.

Rejected: `expo-ui` SwiftUI `.swipeActions` — real native-iOS swipe, but iOS-only, would require a second Android-specific row implementation and diverge list styling from the shared `List.tsx`/theme system. Not worth the fork for what the trailing-icon affordance already covers.

## Component changes

### `List.tsx`

`ListItemProps` gains one generic, non-favorites-specific prop so the primitive stays reusable:

```ts
trailingAction?: {
  icon: keyof typeof Ionicons.glyphMap;
  accessibilityLabel: string;
  onPress: () => void;
};
```

Row layout changes from a single flex column to a horizontal split:
- content column (existing icon+title, and rightText beneath): `flexShrink: 1`
- trailing icon button (only rendered when `trailingAction` is set): fixed size, vertically centered, `gap: Spacing.sm` from content

When `trailingAction` is set, the row's `Pressable` is wrapped in `Swipeable` from `react-native-gesture-handler`. `renderRightActions` renders a red-background `Pressable` sized to the row height, containing a `trash` `Ionicons` glyph; its `onPress` calls `trailingAction.onPress` and closes the swipeable via a ref. The wrapper carries `overflow: hidden` and the row's existing `borderRadius: Spacing.sm` so the reveal clips to the row's rounded corners instead of the previously-used borderRadius-per-row escaping during the swipe animation.

### `FavoritesScreen.tsx`

One line added per item:

```tsx
trailingAction={{
  icon: 'star',
  accessibilityLabel: 'Remove from favorites',
  onPress: () => toggleFavorite(quote),
}}
```

Reuses the existing `toggleFavorite` from `FavoritesProvider` (already used identically on `HomeScreen`) — no new state or persistence logic needed, since a favorited quote's `toggleFavorite` call removes it.

## Data flow / error handling

No new data flow: `toggleFavorite` already exists in `FavoritesProvider` and synchronously updates AsyncStorage-backed state. No error states to handle beyond what `FavoritesProvider` already covers — removal is a local state mutation, not a network call.

## Testing

Manual verification in the running app (iOS and Android) per project convention (no existing automated test suite in this repo to extend):
- Tap the trailing star icon on a favorite row → item disappears, list re-numbers `isLast` correctly (no stray bottom margin).
- Swipe a row left → red trash panel reveals; tap it → item removed, panel closes.
- Swipe a row left, then tap elsewhere / swipe back right → panel closes without removing.
- Remove the last remaining favorite → empty list renders without layout error (no dangling `ScreenContainer` padding issue).
- Rows still render correctly when `trailingAction` is omitted (primitive stays backward compatible, though currently `FavoritesScreen` is the only consumer).
