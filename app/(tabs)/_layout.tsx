import { IconSymbol } from '@/components/ui/icon-symbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { selectCartUniqueItems } from '@/store/cartSlice';
import { useAppSelector } from '@/store/useAuth';
import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { width: screenWidth } = Dimensions.get('window');
  const insets = useSafeAreaInsets();


  const getTabBarHeight = () => {
    return screenWidth < 350 ? verticalScale(75) : screenWidth < 350 ? verticalScale(70) : verticalScale(65);
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#F4A300',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
        tabBarStyle: {
          marginBottom: verticalScale(6),
          backgroundColor: 'transparent', 
          paddingTop: verticalScale(6), 
          position: 'absolute',
          bottom: 0,
          paddingBottom: Math.max(insets.bottom, verticalScale(2)),
          paddingHorizontal: scale(8),
          height: getTabBarHeight() + (Platform.OS === 'android' ? insets.bottom : 0),
          borderTopLeftRadius: moderateScale(30),
          borderTopRightRadius: moderateScale(30),
          borderTopWidth: 0,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: verticalScale(4),
          marginHorizontal: scale(2)
        },
        tabBarBackground: () => <TabBarBackground />,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          tabBarLabelStyle: styles.text,
          tabBarIcon: ({ color }) => (
            <View>
              <IconSymbol size={scale(28)} name="house.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Order"
        options={{
          title: 'Orders',
          tabBarLabelStyle: styles.text,
          tabBarIcon: ({ color }) => (
            <View>
              <IconSymbol size={scale(28)} name="bag.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Cart"
        options={{
          title: 'Cart',
          tabBarLabelStyle: styles.text,
          tabBarIcon: ({ color }) => {
            const cartItemsCount = useAppSelector(selectCartUniqueItems);
            return (
              <View>
                <IconSymbol size={scale(28)} name="cart.fill" color={color} />
                {cartItemsCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {cartItemsCount > 99 ? '99+' : cartItemsCount}
                    </Text>
                  </View>
                )}
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarLabelStyle: styles.text,
          tabBarIcon: ({ color }) => (
            <View>
              <IconSymbol size={scale(28)} name="person.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          title: 'Search',
          tabBarLabelStyle: styles.text,
          href: null,
          tabBarIcon: ({ color }) => (
            <View>
              <IconSymbol size={scale(28)} name="magnifyingglass" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Categories"
        options={{
          title: 'Categories',
          tabBarLabelStyle: styles.text,
          href: null,
          tabBarIcon: ({ color }) => (
            <View>
              <IconSymbol size={scale(28)} name="magnifyingglass" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Category"
        options={{
          title: 'Category',
          href: null,
          tabBarIcon: ({ color }) => (
            <View>
              <IconSymbol size={scale(28)} name="magnifyingglass" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Store"
        options={{
          title: 'Store',
          href: null,
          tabBarIcon: ({ color }) => (
            <View>
              <IconSymbol size={scale(28)} name="magnifyingglass" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Stores"
        options={{
          title: 'Stores',
          href: null,
          tabBarIcon: ({ color }) => (
            <View>
              <IconSymbol size={scale(28)} name="magnifyingglass" color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    left: scale(15),
    bottom: verticalScale(15),
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: scale(8),
    fontWeight: 'bold',
  },
  text:{
    fontSize: scale(12),
    fontFamily: 'PoppinsMedium',
    fontWeight: '400',
  }
});
