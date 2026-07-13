import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import { useColorScheme } from 'react-native';

import { Colors } from '@/app/constants/theme';
import ExploreScreen from '@/domains/explore/screens/ExploreScreen';
import HomeScreen from '@/domains/home/screens/HomeScreen';
import type { TabParamList } from '@/app/navigation/types';

const Tab = createNativeBottomTabNavigator<TabParamList>();

export default function MainTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <Tab.Navigator tabBarActiveTintColor={colors.text}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: () => require('@/assets/images/tabIcons/home.png'),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          title: 'Explore',
          tabBarIcon: () => require('@/assets/images/tabIcons/explore.png'),
        }}
      />
    </Tab.Navigator>
  );
}
