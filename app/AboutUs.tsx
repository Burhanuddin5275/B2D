import Header from '@/components/Header';
import { colors } from '@/theme/colors';
import React from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const AboutUs = () => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={{ flex: 1}}>
      <ImageBackground 
        source={require('../assets/images/background.png')}
        style={styles.backgroundImage}
      >
        <Header title="About Us" showDefaultIcons={false} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoWrap}>
            <Image
              source={require('../assets/images/M2d.png')}
              style={styles.logo}
              resizeMode='contain'
            />
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              Welcome to B2D, your ultimate destination for all your shopping needs. We are committed to providing high-quality products and excellent customer service.
            </Text>
          </View>
        </ScrollView>

      </ImageBackground>
    </SafeAreaView>
  )
}

export default AboutUs

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: scale(20),
  },
  logoWrap: {
    alignItems: 'center',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
  },
  logo: {
    width: scale(180),
    height: scale(180),
  }, 
  descriptionContainer: {
    borderRadius: 12,
    padding: scale(16),
  },
  descriptionText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22),
    color: '#333',
    fontFamily: 'InterRegular',
    textAlign: 'center',
  },
})