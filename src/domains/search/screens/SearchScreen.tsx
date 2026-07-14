import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useLayoutEffect, useState } from 'react';

import { ScreenContainer } from '@/app/components/primitives/ScreenContainer';
import { Spacing } from '@/app/constants/theme';
import { List } from '@/app/components/primitives/List';
import { Text } from '@/app/components/primitives/Text';
import type { SearchStackParamList } from '@/app/navigation/types';
import { useSearchQuotes } from '../queries/useSearchQuotes';
import { useFavorites } from '@/domains/favorites/context/FavoritesProvider';

export default function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SearchStackParamList, 'SearchRoot'>>();
  const [searchString, setSearchString] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { data: searchResults, isPending, isError } = useSearchQuotes({ filter: debouncedQuery });
  const { addFavorite, removeFavorite, favorites } = useFavorites();

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(searchString), 300);
    return () => clearTimeout(timeout);
  }, [searchString]);

  const noQuotesFound =
    !!searchString && !isPending && searchResults?.length === 1 && searchResults[0].id === 0;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Search quotes',
        onChangeText: (event) => setSearchString(event.nativeEvent.text),
        placement: 'integrated',
      },
    });
  }, [navigation]);

  return (
    <ScreenContainer hasHeader style={{ paddingHorizontal: Spacing.md }}>
      {searchResults && searchResults.length > 0 && !noQuotesFound ? (
        <>
          <List>
            {searchResults.map((quote) => {
              const isFavorite = favorites.some((f) => f.id === quote.id);

              return (
                <List.Item
                  key={quote.id}
                  title={quote.body}
                  rightText={`- ${quote.author}`}
                  topRightAction={{
                    icon: isFavorite ? 'star' : 'star-outline',
                    accessibilityLabel: isFavorite ? 'Remove from favorites' : 'Add to favorites',
                    onPress: () => {
                      if (isFavorite) {
                        removeFavorite(quote.id);
                      } else {
                        addFavorite(quote);
                      }
                    },
                  }}
                />
              );
            })}
          </List>
        </>
      ) : !!searchString && isPending ? (
        <Text color="textSecondary" center>
          Searching for quotes...
        </Text>
      ) : !!searchString && isError ? (
        <Text color="textSecondary" center>
          {"Couldn't load search results."}
        </Text>
      ) : (
        <Text color="textSecondary" center>
          {searchString.trim().length > 0 ? 'No search results.' : 'Search for quotes above.'}
        </Text>
      )}
    </ScreenContainer>
  );
}
