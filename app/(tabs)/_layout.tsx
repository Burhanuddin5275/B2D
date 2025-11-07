import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { width: screenWidth } = Dimensions.get('window');
  const insets = useSafeAreaInsets();

const hasSystemNavigation = insets.bottom > 0; // If bottom inset is greater than 0, system navigation is present
const tabBarHeight = hasSystemNavigation 
  ? verticalScale(40)  // Smaller height when system navigation is present
  : verticalScale(50); // Slightly larger height when no system navigation

const getTabBarHeight = () => {
  return screenWidth < 350
    ? tabBarHeight - verticalScale(5)  // Slightly smaller for very small screens
    : screenWidth < 400
    ? tabBarHeight
    : tabBarHeight + verticalScale(5); // Slightly larger for larger screens
};

  // 👇 Dynamically calculate bottom spacing
  const bottomInset = insets.bottom > 0 ? insets.bottom : verticalScale(16);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#F4A300',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
        tabBarStyle: {
          height: getTabBarHeight() + bottomInset, 
          paddingTop: 6,
          backgroundColor: '#FFF6E2',
          borderRadius: 25,
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          position: 'absolute',
          bottom: bottomInset > 20 ? bottomInset - 1 : 0,
          paddingBottom: bottomInset,
          paddingHorizontal: scale(8),
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: {
          fontSize: moderateScale(12),
          fontWeight: '500',
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <View>
              <IconSymbol size={24} name="house.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Order"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => (
            <View>
              <IconSymbol size={24} name="bag.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => (
            <View>
              <IconSymbol size={24} name="cart.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <View>
              <IconSymbol size={24} name="person.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          title: 'Search',
          href: null,
          tabBarIcon: ({ color }) => (
            <View>
              <IconSymbol size={24} name="magnifyingglass" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Categories"
        options={{
          title: 'Categories',
          href: null,
          tabBarIcon: ({ color }) => (
            <View>
              <IconSymbol size={24} name="magnifyingglass" color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
