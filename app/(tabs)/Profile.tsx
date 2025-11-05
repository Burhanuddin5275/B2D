import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';


export default function Profile() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background2.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.shadowWrapper}>
          <ImageBackground
            source={require('../../assets/images/background1.png')}
            style={styles.innerBg}
          >
            <View style={styles.headerRow}>
              <TouchableOpacity style={styles.backBtn} onPress={router.back}>
                <Ionicons name="arrow-back" size={moderateScale(24)} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Profile</Text>
            </View>
          </ImageBackground>
        </View>


      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

  },
  shadowWrapper: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 8,
  marginBottom: 8,
  overflow: 'hidden', 
},

innerBg: {
  height: verticalScale(100),
  justifyContent: 'center',
},

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: verticalScale(80),
    position: 'relative',
    paddingHorizontal: scale(18),
    marginTop: verticalScale(20),
  },
  backBtn: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    zIndex: 1,
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: moderateScale(24),
    fontFamily: 'Montserrat',
    letterSpacing: 1,
  },
  
});
