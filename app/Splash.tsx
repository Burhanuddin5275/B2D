import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
const Splash = () => {
  const insets = useSafeAreaInsets();
  useEffect(() => {
    // You can add any initialization logic here
  }, []);

  return (
   <SafeAreaView style={{ flex: 1}}>
     <ImageBackground
      source={require('@/assets/images/background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.bottomContent}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => router.replace('/Slider')}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
          <Text style={styles.subText}>
            Get fresh groceries delivered to your
            door with just a few taps!
          </Text>
        </View>
      </View>
    </ImageBackground>
   </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: scale(200),
    height: verticalScale(200),  
  },
  logo: {
    width: scale(200),
    height: verticalScale(200)
  },
  bottomContent: {
    position: 'absolute',
    bottom: verticalScale(100),
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  getStartedButton: { 
    backgroundColor: colors.primaryDark,
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(8),  
    borderRadius: 25,
    width: scale(150),
  },
  buttonText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    fontFamily:' Montserrat',
    textAlign: 'center',
    color: colors.white, 
  },
  subText: {
    marginTop: verticalScale(8), 
    width: scale(240),
    fontSize: moderateScale(14),
    fontWeight: '400', 
    fontFamily:' MontserratMedium',
    textAlign: 'center',
  },
});

export default Splash;