import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLayoutEffect, useState } from 'react';

import { ScreenContainer } from '@/app/components/primitives/ScreenContainer';
import { Spacing } from '@/app/constants/theme';
import { List } from '@/app/components/primitives/List';
import { Text } from '@/app/components/primitives/Text';
import type { SearchStackParamList } from '@/app/navigation/types';
import { useSearchQuotes } from '../queries/useSearchQuotes';
import { useFavorites } from '@/domains/favorites/context/FavoritesProvider';

export default function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SearchStackParamList, 'Search'>>();
  const [query, setQuery] = useState('');
  const { data, isPending } = useSearchQuotes({ filter: query });
  const searchResults = data?.quotes;
  const { addFavorite } = useFavorites();

  const noQuotesFound =
    !!query && !isPending && searchResults?.length === 1 && searchResults[0].id === 0;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Search quotes',
        onChangeText: (event) => setQuery(event.nativeEvent.text),
        placement: 'integrated',
      },
    });
  }, [navigation]);

  return (
    <ScreenContainer hasHeader style={{ paddingHorizontal: Spacing.md }}>
      {searchResults && searchResults.length > 0 && !noQuotesFound ? (
        <>
          <List>
            {searchResults.map((quote) => (
              <List.Item
                key={quote.id}
                title={quote.body}
                rightText={`- ${quote.author}`}
                menuActions={[
                  {
                    label: 'Favorite',
                    onPress: () => addFavorite(quote),
                  },
                ]}
              />
            ))}
          </List>
          <Text size="s" color="textSecondary" center style={{ marginTop: Spacing.sm }}>
            Long-press a quote to favorite
          </Text>
        </>
      ) : !!query && isPending ? (
        <Text color="textSecondary" center>
          Searching for quotes...
        </Text>
      ) : (
        <Text color="textSecondary" center>
          {query.trim().length > 0 ? 'No search results.' : 'Search for quotes above.'}
        </Text>
      )}
    </ScreenContainer>
  );
}
