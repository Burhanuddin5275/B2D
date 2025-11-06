import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';



export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(false);
  // const dispatch = useAppDispatch();

  const handlePhoneChange = (text: string) => {
    // Remove any non-digit characters and add +1 prefix
    const cleaned = text.replace(/\D/g, '');
    setPhoneNumber(cleaned);
    // Enable continue button if number is 10 digits
    setIsValid(cleaned.length === 10);
  };

  const handleContinue = () => {
    const fullNumber = `+1${phoneNumber}`;
  router.replace({
  pathname: '/VerifyNumber',
  params: { phone: fullNumber }
});

  }; 

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/images/background2.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.shadowWrapper}>
          <ImageBackground
            source={require('../assets/images/background1.png')}
            style={styles.innerBg}
          >
          </ImageBackground>
        </View>

    <View style={styles.logoWrap}>
          <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          />
        </View>

        <View style={styles.titleWrap}>
          <Text style={styles.title}>Welcome! Login to your</Text>
          <Text style={styles.title}>customer account!</Text>
        </View>

        <View style={styles.phoneInputWrap}>
          <View style={styles.flagBox}>
          <Image
          source={require('../assets/images/flag.png')}
          style={{width: scale(24)}}
          resizeMode="contain"
          />
          </View>
          <Text style={styles.prefix}>+1</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            keyboardType="phone-pad"
            placeholderTextColor="#A1A1A1"
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            maxLength={10}
          />
        </View>

        <TouchableOpacity 
          activeOpacity={1} 
          style={[styles.continueBtn, !isValid && styles.disabledBtn]} 
          onPress={handleContinue}
          disabled={!isValid}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>

        <Text style={styles.agreeText}>
          By continuing, you agree to
        </Text>
        <View style={styles.linksRow}>
          <TouchableOpacity>
            <Text style={styles.link}>Terms & conditions</Text>
          </TouchableOpacity>
          <Text style={styles.andText}> and </Text>
          <TouchableOpacity>
            <Text style={styles.link}>Privacy policy</Text>
          </TouchableOpacity>
          <Text style={styles.dot}>.</Text>
        </View>

      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    alignItems: 'center',
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
  width: '100%',
  },

innerBg: {
  height: verticalScale(100),
  justifyContent: 'center',
},
 logoWrap: {
    marginTop: verticalScale(10),
    marginBottom: verticalScale(24),
  },
  logo: {
    width: scale(100),
    height: scale(100),
  },
  titleWrap: {
    alignItems: 'center',
    marginBottom: verticalScale(30),
    width: '100%',
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: '#1F1F1F',
  },
  phoneInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9B10F',
    borderRadius: 10,
    paddingHorizontal: scale(15),
    height: verticalScale(50),
    marginBottom: verticalScale(20),
    backgroundColor: '#fff',
    width: '85%',
    alignSelf: 'center',
  },
  flagBox: {
    width: scale(28),
    height: scale(20),
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefix: {
    fontSize: moderateScale(14),
    color: '#1F1F1F',
    marginRight: scale(8),
  },
  input: {
    flex: 1,
    fontSize: moderateScale(14),
    color: '#1F1F1F',
  },
  continueBtn: {
    width: '88%',
    backgroundColor: '#E9B10F',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(18),
    alignSelf: 'center',
  },
  disabledBtn: {
    backgroundColor: '#C9C9C9',
  },
  continueText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  agreeText: {
    textAlign: 'center',
    color: '#A1A1A1',
    fontSize: moderateScale(12),
    marginBottom: 5,
    width: '100%',
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(30),
    flexWrap: 'wrap',
    width: '100%',
    paddingHorizontal: 20,
  },
  link: {
    color: '#F1B90B',
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  andText: {
    color: '#3F3F3F',
    fontSize: moderateScale(12),
  },
  dot: {
    color: '#3F3F3F',
    fontSize: moderateScale(12),
  },
});
