import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert, Image,
  ImageBackground,
  KeyboardAvoidingView, Linking, Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { loginSuccess } from '../store/authSlice';
import { useAppDispatch } from '../store/useAuth';
import Header from '@/components/Header';
import { colors } from '@/theme/colors';

const VerifyNumber = () => {
  const { phone } = useLocalSearchParams();
  const [code, setCode] = useState(['', '', '', '']);
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(15);
  const [isCountdownActive, setIsCountdownActive] = useState(true);

  const validPhoneNumbers = [
    '+11234567890',
    '+19876543210',
    '+15551234567',
  ];

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto focus next input
    if (text && index < 3) {
      // @ts-ignore - refs are handled by React Native
      const nextInput = inputs.current[index + 1];
      nextInput?.focus();
    }
  };

  const inputs = React.useRef<Array<TextInput | null>>([]);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleVerify = () => {
    const enteredCode = code.join('');

    if (enteredCode === verificationCode) {
      // Check if phone number is in validPhoneNumbers array
      if (validPhoneNumbers.includes(phone as string)) {
        // If valid phone number, login and navigate to profile
        dispatch(loginSuccess({
          phone: phone as string,
          // Add other user data as needed
        }));
        router.replace('/(tabs)/Profile'); // Replace with your profile route
      } else {
        router.replace(`/CompleteProfile?phone=${encodeURIComponent(phone as string)}`);
      }
    } else {
      Alert.alert('Invalid Code', 'The verification code you entered is incorrect.');
    }
  };

  const generateNewCode = () => {
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setVerificationCode(newCode);
    return newCode;
  };

  const sendOtpEmail = (code: string) => {
    console.log('Preparing to send verification code...');

    setTimeout(async () => {
      const emailAddress = 'bhamza4747@gmail.com';
      const emailSubject = 'Your New Verification Code';
      const emailBody = `Your new verification code is: ${code}\n\nPlease use this code to verify your account.`;
      const emailUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

      try {
        await Linking.openURL(emailUrl);
        console.log('New verification code email sent');
        Alert.alert('Code Sent', 'A new verification code has been sent to your email.');
      } catch (error) {
        console.error('Error sending verification email:', error);
      }
    }, 2000); // 2000 milliseconds = 2 seconds
  };

  // Countdown effect
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isCountdownActive && countdown > 0) {
      timer = window.setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setIsCountdownActive(false);
    }

    return () => clearTimeout(timer);
  }, [countdown, isCountdownActive]);

  // Send verification code when component mounts
  useEffect(() => {
    const code = generateNewCode();
    sendOtpEmail(code);

    // Reset countdown when component mounts
    setCountdown(15);
    setIsCountdownActive(true);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/images/background2.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Header title="" showBackButton={false} showDefaultIcons={false} />
        <View style={styles.logoWrap}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <Text style={styles.title}>Verify phone number!</Text>
              <Text style={styles.subtitle}>
                Please enter the code that we've
                sent to <Text style={{color:colors.primaryDark}}>{phone || '+1 234 567 890'}</Text>
              </Text>
            </View>

            <View style={styles.codeContainer}>
              {[0, 1, 2, 3].map((index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    if (ref) {
                      inputs.current[index] = ref;
                    }
                  }}
                  style={styles.codeInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={code[index]}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
                      // @ts-ignore - refs are handled by React Native
                      const prevInput = inputs.current[index - 1];
                      prevInput?.focus();
                    }
                  }}
                  textContentType="oneTimeCode"
                  autoComplete="one-time-code"
                />
              ))}
            </View>
            <TouchableOpacity
              style={[styles.verifyButton, { opacity: code.every(c => c) ? 1 : 0.5 }]}
              onPress={handleVerify}
              disabled={!code.every(c => c)}
            >
              <Text style={styles.verifyButtonText}>Verify & proceed</Text>
            </TouchableOpacity>
            
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>
                {isCountdownActive
                  ? `Resend code in ${countdown}s`
                  : "Didn't receive the code?"}
              </Text>
              {!isCountdownActive && (
                <TouchableOpacity onPress={() => {
                  const newCode = generateNewCode();
                  sendOtpEmail(newCode);
                  setCountdown(15);
                  setIsCountdownActive(true);
                }}>
                  <Text style={styles.resendButton}>Resend Code</Text>
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: scale(25),
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  logoWrap: {
    marginTop: verticalScale(10),
    marginBottom: verticalScale(24),
    alignItems: 'center',
  },
  logo: {
    width: scale(150),
    height: scale(100),
  },
  header: {
    marginBottom: verticalScale(10),
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: '600',
    marginBottom: verticalScale(8),
    fontFamily: 'PoppinsBold',
  },
  subtitle: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'PoppinsMedium',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(24),
  },
  codeInput: {
    width: scale(60),
    height: scale(60),
    borderWidth: 1.5,
    borderColor: colors.primaryDark,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: moderateScale(24),
    backgroundColor: colors.white,
    fontFamily: 'Montserrat',
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalScale(10),
  },
  resendText: {
    fontSize: moderateScale(14),
    color: colors.textPrimary,
    marginRight: 4,
    fontFamily: 'PoppinsMedium',
    fontWeight: '500',
  },
  resendButton: {
    fontSize: moderateScale(14),
    color: colors.primaryDark,
    fontWeight: '500',
    fontFamily: 'PoppinsMedium',
  },
  verifyButton: {
    backgroundColor: colors.primaryDark,
    paddingVertical: verticalScale(16),
    borderRadius: 12,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: colors.white,
    fontSize: moderateScale(14),
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
});

export default VerifyNumber;