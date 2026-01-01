import Header from '@/components/Header';
import { colors } from '@/theme/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert, Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
import { API_URL } from '@/url/Api_Url';

const VerifyNumber = () => {
  const { phone } = useLocalSearchParams();
  const [code, setCode] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(15);
  const [isCountdownActive, setIsCountdownActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (text && index < 5) {
      // @ts-ignore - refs are handled by React Native
      const nextInput = inputs.current[index + 1];
      nextInput?.focus();
    }
  };

  const inputs = React.useRef<Array<TextInput | null>>([]);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleVerify = async () => {
    try {
      const enteredCode = code.join('');

      if (enteredCode.length !== 6) {
        Alert.alert('Invalid Code', 'Please enter a 6-digit code.');
        return;
      }
      setIsSubmitting(true);
      const response = await fetch(`${API_URL}/customer-api/auth/validate_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phone,
          otp: enteredCode
        })
      });
      const contentType = response.headers.get('content-type');
      let responseData;
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
        console.log('Response data:', responseData.token);
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned an invalid response');
      }

      if (!response.ok) {
        // Handle API errors
        const errorMessage = responseData.message || 'Failed to verify code';
        throw new Error(errorMessage);
      }

      // Make sure the response contains a token
      if (responseData.has_profile === true) {
        dispatch(loginSuccess({
          phone: phone as string,
          token: responseData.token
        }));
        router.replace({
          pathname: '/(tabs)/Profile',
          params: {
            phone: phone as string,
            token: responseData.token
          }
        });
      }
      else {
        router.replace({
          pathname: '/CompleteProfile',
          params: {
            phone: phone as string,
            Token: responseData.token
          }
        })
      }

    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('An error occurred during verification');
    }
    finally {
      setIsSubmitting(false);
    }
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Header title="" showBackButton={false} showDefaultIcons={false} />
        <View style={styles.logoWrap}>
          <Image
            source={require('../assets/images/M2d.png')}
            style={styles.logo}
          />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <SafeAreaView style={styles.safeArea}>
            <ScrollView
              contentContainerStyle={{ paddingBottom: verticalScale(50) }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.header}>
                <Text style={styles.title}>Verify phone number!</Text>
                <Text style={styles.subtitle}>
                  Please enter the code that we've
                  sent to <Text style={{ color: colors.primaryDark }}>{phone || '+1 234 567 890'}</Text>
                </Text>
              </View>
              <View style={styles.codeContainer}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
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
                style={[styles.verifyButton, {
                  opacity: code.every(c => c) && !isSubmitting ? 1 : 0.5
                }]}
                onPress={handleVerify}
                disabled={!code.every(c => c) || isSubmitting}
              >
                <Text style={styles.verifyButtonText}>
                  {isSubmitting ? 'Verifying...' : 'Verify & proceed'}
                </Text>
              </TouchableOpacity>
              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>
                  {isCountdownActive
                    ? `Resend code in ${countdown}s`
                    : "Didn't receive the code?"}
                </Text>
                {!isCountdownActive && (
                  <TouchableOpacity onPress={() => {
                    // Reset countdown for resend
                    setCode(['', '', '', '', '', '']);
                    setCountdown(15);
                    setIsCountdownActive(true);
                  }}>
                    <Text style={styles.resendButton}>Resend Code</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
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
    backgroundColor: colors.white,
  },
  logoWrap: {
    marginTop: verticalScale(10),
    alignItems: 'center',
  },
  logo: {
    width: scale(200),
    height: scale(140),
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
    width: scale(45),
    height: scale(45),
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