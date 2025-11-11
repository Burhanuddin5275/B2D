import Header from '@/components/Header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';


export default function Cart() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: Math.max(insets.bottom, verticalScale(1)) }}>
      <ImageBackground
        source={require('../../assets/images/background2.png')}
        style={styles.backgroundImage}
      >
        <Header title="Cart" />
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Cart Placed</Text>
          <Text style={styles.emptyText}>
            You haven’t placed any cart yet.
            Explore our products and add
            your items to cart!</Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: '#E9B10F',
    fontSize: moderateScale(24),
    textAlign: 'center',
    marginBottom: 2,
    fontFamily: 'PoppinsBold'
  },
  emptyText: {
    width: scale(250),
    color: '#1E1E1E',
    fontSize: moderateScale(14),
    textAlign: 'center',
    marginBottom: 2,
    fontFamily: 'PoppinsMedium'
  },
});
