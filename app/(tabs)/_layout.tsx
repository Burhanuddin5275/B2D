import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions, View } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
   const { width: screenWidth } = Dimensions.get('window');
  const insets = useSafeAreaInsets();
    const getTabBarHeight = () => {
    return screenWidth < 350 ? verticalScale(75) : screenWidth < 400 ? verticalScale(70) : verticalScale(65);
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#F4A300',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
        tabBarStyle: {
          height: verticalScale(65),
          paddingTop: 10,
          backgroundColor: '#FFF6E2',
          borderRadius:25,
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          position: 'absolute',
          bottom: 0,      
          paddingBottom: Math.max(insets.bottom, verticalScale(4)),
          paddingHorizontal: scale(8),
          justifyContent: 'center',
          alignItems: 'center', 
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginBottom: 5,
        },
      }}>
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View >
              <IconSymbol size={24} name="house.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Order"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, focused }) => (
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
          tabBarIcon: ({ color, focused }) => (
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
          tabBarIcon: ({ color, focused }) => (
            <View>
              <IconSymbol size={24} name="person.fill" color={color} />
            </View>
          ),
        }}
      />
     <Tabs.Screen
  name="Search"
  options={{
    title: "Search",
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
    title: "Categories",
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
