import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Platform, useColorScheme, type ImageSourcePropType } from 'react-native';
import type { AppleIcon } from 'react-native-bottom-tabs';
import type { SFSymbol } from 'sf-symbols-typescript';

import { Colors } from '@/app/constants/theme';
import HomeScreen from '@/domains/home/screens/HomeScreen';
import type { TabParamList } from '@/app/navigation/types';
import FavoritesScreen from '@/domains/favorites/screens/FavoritesScreen';

const Tab = createNativeBottomTabNavigator<TabParamList>();

const ANDROID_ICON_SIZE = 24;

/**
 * iOS renders native SF Symbols directly (no image asset needed). Other
 * platforms lack an SF Symbols equivalent, so an @expo/vector-icons glyph is
 * rasterized into an image source instead.
 */
function useTabIcon(
  sfSymbol: SFSymbol,
  androidIconName: keyof typeof Ionicons.glyphMap,
  color: string,
): ImageSourcePropType | AppleIcon | null {
  const [androidSource, setAndroidSource] = useState<ImageSourcePropType | null>(null);

  useEffect(() => {
    if (Platform.OS === 'ios') return;
    Ionicons.getImageSource(androidIconName, ANDROID_ICON_SIZE, color).then(setAndroidSource);
  }, [androidIconName, color]);

  return Platform.OS === 'ios' ? { sfSymbol } : androidSource;
}

export default function MainTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const homeIcon = useTabIcon('house.fill', 'home', colors.text);
  const favoritesIcon = useTabIcon('star.fill', 'star', colors.text);

  if (!homeIcon || !favoritesIcon) {
    return null;
  }

  return (
    <Tab.Navigator tabBarActiveTintColor={colors.text}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: () => homeIcon,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Favorites',
          tabBarIcon: () => favoritesIcon,
        }}
      />
    </Tab.Navigator>
  );
}
