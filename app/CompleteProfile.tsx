import Header from '@/components/Header';
import { colors } from '@/theme/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useAppDispatch, useAppSelector } from '../store/useAuth';
import { getProfile, updateProfile } from '@/service/profile';
export default function CompleteProfile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  // ================= PARAMS =================
  const { phone: urlPhone, Token } = useLocalSearchParams<{
    phone: string;
    Token: string;
  }>();

  // ================= REDUX =================
  const auth = useAppSelector((s) => s.auth);
  const reduxPhone = auth.phone;
  const reduxToken = auth.token;

  // ================= RESOLVED VALUES =================
  const resolvedPhone =
    typeof urlPhone === 'string' && urlPhone.length > 0
      ? urlPhone
      : reduxPhone;

  const resolvedToken =
    typeof Token === 'string' && Token.length > 0
      ? Token
      : reduxToken;

  const phone = resolvedPhone || '+1';

  // ================= DEBUG =================
  useEffect(() => {
    console.log('CompleteProfile - Phone:', phone);
    console.log('CompleteProfile - Token:', resolvedToken);
  }, [phone, resolvedToken]);

  // ================= FETCH PROFILE =================
useEffect(() => {
  let isMounted = true;

  const loadProfile = async () => {
    try {
      console.log('Fetching profile with token:', resolvedToken);
      const data = await getProfile(resolvedToken||'');

      if (isMounted) {
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setEmail(data.email || '');
        if (data.avatar) setImage(data.avatar);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (isMounted) Alert.alert('Error', 'Failed to load profile data');
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  loadProfile();

  return () => {
    isMounted = false;
  };
}, [resolvedToken]);

  // ================= IMAGE PICKER =================
  const pickImage = async () => {
    try {
      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('Selected image:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ================= SUBMIT =================
  const isValid = firstName.trim() && lastName.trim() && email.trim();

const handleSubmit = async () => {
  if (!isValid || isSubmitting) return;

  try {
    setIsSubmitting(true);

    await updateProfile(resolvedToken||'', {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(), 
      avatar: image || null,
    });

    Alert.alert('Success', 'Profile updated successfully');
    router.replace('/(tabs)/Home');
  } catch (error: any) {
    console.error('Profile update error:', error);
    Alert.alert('Error', error?.message || 'Failed to update profile');
  } finally {
    setIsSubmitting(false);
  }
};
  // ================= UI =================
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/images/background.png')}
        style={styles.backgroundImage}
      >
        <Header title="Complete profile" showDefaultIcons={false} />

        <ScrollView contentContainerStyle={{ paddingBottom: verticalScale(100) }}>
          <View style={styles.content}>
            <TouchableOpacity
              style={styles.photoWrap}
              activeOpacity={0.8}
              onPress={pickImage}
            >
              <View style={styles.photoCircle}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.profileImage} />
                ) : (
                  <Ionicons
                    name="add"
                    size={moderateScale(36)}
                    color={colors.primaryDark}
                  />
                )}
              </View>
              <Text style={styles.uploadHint}>
                {image ? 'Change profile photo' : 'Upload profile photo'}
              </Text>
            </TouchableOpacity>

            <View style={styles.formGroup}>
              <Text style={styles.label}>First name*</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor={'black'}
                placeholder="Type here"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Last name*</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor={'black'}
                placeholder="Type here"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email address*</Text>
              <TextInput
                style={styles.input}
                placeholder="Type here"
                placeholderTextColor={'black'}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.formGroup}>
              <View style={styles.phoneRowHeader}>
                <Text style={styles.label}>Phone number*</Text>
                <Text style={styles.notEditable}>Not editable</Text>
              </View>

              <View style={styles.phoneInputWrap}>
                <Text style={styles.prefix}>+1</Text>
                <TextInput
                  style={styles.phoneInput}
                  value={phone.startsWith('+1') ? phone.slice(2) : phone}
                  editable={false}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.submitBtn,
                (!isValid || isSubmitting) && styles.disabledBtn,
              ]}
              disabled={!isValid || isSubmitting}
              onPress={handleSubmit}
            >
              <Text style={styles.submitText}>
                {isSubmitting ? 'Updating...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1, backgroundColor: colors.white },
  content: { paddingHorizontal: scale(20), paddingTop: verticalScale(12) },

  photoWrap: { alignItems: 'center', marginVertical: verticalScale(8) },
  photoCircle: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    borderWidth: 1,
    borderColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: { width: '100%', height: '100%' },
  uploadHint: { marginTop: 10, fontSize: moderateScale(15) },

  formGroup: { marginTop: verticalScale(14) },
  label: { marginBottom: 6, fontSize: moderateScale(15), fontWeight: '500' },
  input: {
    height: verticalScale(54),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    paddingHorizontal: scale(14),
  },

  phoneRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notEditable: { color: colors.textPrimary },
  phoneInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    height: verticalScale(54),
    paddingHorizontal: scale(15),
    borderColor: colors.primaryDark,
  },
  prefix: { marginRight: 8 },
  phoneInput: { flex: 1 },

  submitBtn: {
    backgroundColor: colors.primaryDark,
    paddingVertical: verticalScale(14),
    borderRadius: 8,
    marginTop: verticalScale(24),
  },
  disabledBtn: { backgroundColor: colors.textSecondary },
  submitText: { color: '#fff', textAlign: 'center' },
});
