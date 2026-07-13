import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { SearchStackParamList } from '@/app/navigation/types';
import SearchScreen from '@/domains/search/screens/SearchScreen';

const Stack = createNativeStackNavigator<SearchStackParamList>();

export function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
    </Stack.Navigator>
  );
}
