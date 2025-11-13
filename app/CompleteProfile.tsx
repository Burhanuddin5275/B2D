import Header from '@/components/Header';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useAppSelector } from '../store/useAuth';

export default function CompleteProfile() {
  const { phone: urlPhone } = useLocalSearchParams();
  const reduxPhone = useAppSelector((s) => s.auth.phone);
  const phone = (urlPhone as string) || reduxPhone || '+1';
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
     try {
      setIsLoading(true);
      const image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('Selected image:', image);

      if (image && !image.canceled && image.assets && image.assets[0]) {
        setImage(image.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = firstName.trim() && lastName.trim() && email.trim()

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/images/background2.png')}
        style={styles.backgroundImage}
      >
        <Header title="Complete profile" showDefaultIcons={false} />
        <ScrollView>
          <View style={styles.content}>
            <TouchableOpacity 
              style={styles.photoWrap} 
              activeOpacity={0.8}
              onPress={pickImage}
            >
              <View style={styles.photoCircle}>
                {image ? (
                  <Image 
                    source={{ uri: image }} 
                    style={styles.profileImage} 
                  />
                ) : (
                  <Ionicons name="add" size={moderateScale(36)} color="#E9B10F" />
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
                placeholder="Type here"
                placeholderTextColor="#A1A1A1"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Last name*</Text>
              <TextInput
                style={styles.input}
                placeholder="Type here"
                placeholderTextColor="#A1A1A1"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email address*</Text>
              <TextInput
                style={styles.input}
                placeholder="Type here"
                placeholderTextColor="#A1A1A1"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <View style={styles.phoneRowHeader}>
                <Text style={styles.label}>Phone number*</Text>
                <Text style={styles.notEditable}>Not editable</Text>
              </View>
              <View style={styles.phoneInputWrap}>
                <View style={styles.flagBox}>
                  <Image source={require('../assets/images/flag.png')} style={{ width: scale(24) }} resizeMode="contain" />
                </View>
                <Text style={styles.prefix}>+1</Text>
                <TextInput style={styles.phoneInput} value={(phone.startsWith('+1') ? phone.slice(2) : phone)} editable={false} />
              </View>
            </View>

            <TouchableOpacity activeOpacity={1} style={[styles.submitBtn, !isValid && styles.disabledBtn]} disabled={!isValid}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  )
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

  content: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(12),
  },
  photoWrap: {
    alignItems: 'center',
    marginTop: verticalScale(8),
    marginBottom: verticalScale(8),
  },
  photoCircle: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(10),
    borderWidth: 1,
    borderColor: '#E9B10F',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadHint: {
    marginTop: verticalScale(10),
    color: '#8A8A8A',
    fontFamily: 'Montserrat',
  },
  formGroup: {
    marginTop: verticalScale(14),
  },
  label: {
    marginBottom: verticalScale(6),
    fontFamily: 'Montserrat',
    color: '#1F1F1F',
  },
  input: {
    height: verticalScale(54),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E9B10F',
    paddingHorizontal: scale(14),
    backgroundColor: '#fff',
  },
  phoneRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(6),
  },
  notEditable: {
    color: '#8A8A8A',
    fontFamily: 'Montserrat',
  },
  phoneInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9B10F',
    borderRadius: 10,
    paddingHorizontal: scale(15),
    height: verticalScale(54),
    backgroundColor: '#fff',
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
    marginLeft: scale(8),
    marginRight: scale(8),
  },
  phoneInput: {
    flex: 1,
    fontSize: moderateScale(14),
    color: '#1F1F1F',
  },
  submitBtn: {
    backgroundColor: '#E9B10F',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(8),
    marginTop: verticalScale(24),
    marginBottom: verticalScale(28),
  },
  disabledBtn: {
    backgroundColor: '#C9C9C9',
  },
  submitText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
})