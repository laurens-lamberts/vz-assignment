import { ScreenContainer } from '@/app/components/primitives/ScreenContainer';
import { Spacing } from '@/app/constants/theme';
import { List } from '@/app/components/primitives/List';
import { useFavorites } from '../context/FavoritesProvider';

export default function FavoritesScreen() {
  const { favorites } = useFavorites();

  return (
    <ScreenContainer style={{ paddingHorizontal: Spacing.md }}>
      <List>
        {favorites.map((quote) => (
          <List.Item key={quote.id} title={quote.body} rightText={`- ${quote.author}`} />
        ))}
      </List>
    </ScreenContainer>
  );
}
