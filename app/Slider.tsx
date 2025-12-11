import { colors } from '@/theme/colors';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Explore a Wide\nRange of Products',
    description: 'Browse, search, and filter thousands of products to find exactly what you need.',
    // Add your illustration image here
    image: require('../assets/images/slider1.png'),
  },
  {
    id: 2,
    title: 'Favorite Your\nPreferred Stores',
    description: 'Easily access and store from your favorite stores with just a tap.',
    image: require('../assets/images/slider2.png'),
  },
  {
    id: 3,
    title: 'Seamless Order\nManagement',
    description: 'Track your orders, chat with support, and manage your delivery addresses effortlessly.',
    image: require('../assets/images/slider3.png'),
  },
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < slides.length) {
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }
  };

  const handleGetStarted = () => {
    router.replace('/(tabs)/Home');
  };

  return (
    <SafeAreaView style={{ flex: 1}}>
      <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >

        {/* Next button at top right for first two slides */}
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.7}
          >
            <Text style={styles.nextButtonText}>Skip →</Text>
          </TouchableOpacity>
        )}

        {/* Get Started button on last slide */}
        {currentIndex === slides.length - 1 && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleGetStarted}
            activeOpacity={0.7}
          >
            <Text style={styles.nextButtonText}>NEXT →</Text>
          </TouchableOpacity>
        )}

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          style={styles.scrollView}
        >
          {slides.map((slide) => (
            <View key={slide.id} style={styles.slide}>
              {/* Top illustration area */}
              <View style={styles.illustrationContainer}>
                <View style={styles.logoContainer}>
                  <Image
                    source={require('../assets/images/M2d.png')}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.imageWrapper}>
                  <Image
                    source={slide.image}
                    style={styles.illustration}
                    resizeMode="contain"
                  />
                </View>
              </View>

              <ImageBackground
                source={require('../assets/images/background.png')}
                style={styles.contentContainer}
                resizeMode="cover"
              >
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{slide.title}</Text>
                  <View style={styles.descriptionBox}>
                    <Text style={styles.description}>{slide.description}</Text>
                  </View>

                  {/* Pagination dots */}
                  <View style={[styles.pagination,{ paddingBottom: Math.max(insets.bottom, verticalScale(60))}]}>
                    {slides.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.paginationDot,
                          index === currentIndex && styles.paginationDotActive,
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </ImageBackground>
            </View>
          ))}
        </ScrollView>
      </ImageBackground>
    </View>
    </SafeAreaView>
  );
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width,
    height: height,
  },
  illustrationContainer: {
    flex: 1,
    marginTop: verticalScale(20),
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: scale(200),
    height: verticalScale(130), 
  },
  imageWrapper: {
    width: scale(200),
    height: verticalScale(200),
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 8,
    },
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: verticalScale(20),
    paddingHorizontal: scale(20),
    backgroundColor:colors.primaryLight
  }, 
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(24),
    fontFamily: 'PoppinsBold',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  descriptionBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: scale(275),
    height: verticalScale(120),
    paddingVertical: verticalScale(25),
    paddingHorizontal: scale(15),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  description: {
    fontSize: moderateScale(16),
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'PoppinsMedium',
  },
  pagination: {
    flexDirection: 'row',
    marginTop: verticalScale(15),
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1E1E1E',
    marginHorizontal: 4,
    opacity: 0.8,
  },
  paginationDotActive: {
    width: 20,
    height: 10,
    opacity: 1,
  },
  nextButton: {
    position: 'absolute',
    top: verticalScale(12),
    right: scale(10),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
    borderRadius: 25,
    zIndex: 10,
  },
  nextButtonText: {
    color: colors.primaryDark,
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },

}); 