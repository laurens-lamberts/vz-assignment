import { ScreenContainer } from '@/app/components/primitives/ScreenContainer';
import { Spacing } from '@/app/constants/theme';
import { List } from '@/app/components/primitives/List';
import { useFavorites } from '../context/FavoritesProvider';
import { Text } from '@/app/components/primitives/Text';

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <ScreenContainer style={{ paddingHorizontal: Spacing.md }}>
      {favorites.length > 0 ? (
        <>
          <List>
            {favorites.map((quote) => (
              <List.Item
                key={quote.id}
                title={quote.body}
                rightText={`- ${quote.author}`}
                menuActions={[
                  {
                    label: 'Unfavorite',
                    destructive: true,
                    onPress: () => removeFavorite(quote.id),
                  },
                ]}
              />
            ))}
          </List>
          <Text size="s" color="textSecondary" center style={{ marginTop: Spacing.sm }}>
            Long-press a quote to unfavorite
          </Text>
        </>
      ) : (
        <Text color="textSecondary" center>
          No favorite quotes yet.
        </Text>
      )}
    </ScreenContainer>
  );
}
