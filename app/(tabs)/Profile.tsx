import Header from '@/components/Header';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageBackground, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { logout } from '../../store/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/useAuth';
import { colors } from '@/theme/colors';
import { API_URL } from '@/url/Api_Url';
import { logoutApi } from '@/service/profile';


export default function Profile() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const token = useAppSelector((s) => s.auth.token);
  const phone = useAppSelector((s) => s.auth.phone);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    console.log('Profile - Token:', token);
    console.log('Profile - Phone:', phone);
  }, [token, phone]);
const handleLogout = async () => {
  try {
    await logoutApi(token||'');
    alert('Logout successfully');
    dispatch(logout());
    router.replace({
      pathname: '/Login',
      params: {
        token: undefined,
        phone: undefined,
      },
    });

    router.navigate('/(tabs)/Home');
  } catch (error) {
    console.error('Error during logout:', error);

    dispatch(logout());
    router.replace('/(tabs)/Home');
  }
};

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: Math.max(insets.bottom, verticalScale(1)) }}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.backgroundImage}
      >
        <Header title="Profile" showDefaultIcons={false} />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {!isAuthenticated && (
              <TouchableOpacity activeOpacity={0.9} style={styles.loginButton} onPress={() => router.push('/Login')}>
                <Text style={styles.loginButtonText}>Login to place an order!</Text>
              </TouchableOpacity>
            )}

            <View style={styles.list}>
              {isAuthenticated ? (
                <>
                  <RowItem
                    iconName="cart"
                    label="My orders"
                    onPress={() => router.push('/(tabs)/Order')}
                  />
                  <RowItem
                    iconName="heart"
                    label="Wishlist"
                    onPress={() => { router.push('/Wishlist') }}
                  />
                  <RowItem
                    iconName="location"
                    label="Manage addresses"
                    onPress={() => { router.push('/ManageAddress') }}
                  />
                  <RowItem
                    iconName="person"
                    label="Manage Profile"
                    onPress={() => { router.push('/CompleteProfile') }}
                  />
                  <RowItem
                    iconName="call"
                    label="Contact us"
                    onPress={() => { router.push('/ContactUs') }}
                  />
                  <RowItem
                    iconName="information-circle"
                    label="About us"
                    onPress={() => { router.push('/AboutUs') }}
                  />
                  <RowItem
                    iconName="document-text"
                    label="Terms & conditions"
                    onPress={() => { router.push('/Terms') }}
                  />
                  <RowItem
                    iconName="shield-checkmark"
                    label="Privacy policy"
                    onPress={() => { router.push('/Privacy') }}
                  />
                  <RowItem
                    iconName="log-out"
                    label="Logout"
                    onPress={handleLogout}
                    isLast={true}
                  />
                  <TouchableOpacity
                    style={styles.deleteAccountWrap}
                    onPress={() => setShowDeleteModal(true)}
                  >
                    <Text style={styles.deleteAccountText}>Delete this account</Text>
                  </TouchableOpacity>

                  {/* Delete Account Confirmation Modal */}
                  <Modal
                    visible={showDeleteModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowDeleteModal(false)}
                  >
                    <View style={styles.modalOverlay}>
                      <TouchableOpacity
                        style={styles.modalBackground}
                        activeOpacity={1}
                        onPress={() => setShowDeleteModal(false)}
                      />
                      <View style={styles.modalContainer}>
                        <View style={styles.actionSheet}>
                          <Text style={styles.modalTitle}>Delete this Account</Text>
                          <Text style={styles.modalMessage}>Are you sure you want to delete this customer account? By proceeding,
                            all the data will be removed permanently.</Text>
                          <TouchableOpacity 
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={() => setShowDeleteModal(false)}
                          >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.modalButton, styles.destructiveButton]}
                            onPress={() => {
                              // Handle account deletion
                              setShowDeleteModal(false);
                            }}
                          >
                            <Text style={styles.destructiveButtonText}>Delete My Account</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>
                </>
              ) : (
                <>
                  <RowItem iconName="call" label="Contact us" onPress={() => { router.push('/ContactUs') }} />
                  <RowItem iconName="information-circle" label="About us" onPress={() => { router.push('/AboutUs') }} />
                  <RowItem iconName="document-text" label="Terms & conditions" onPress={() => { router.push('/Terms') }} />
                  <RowItem iconName="shield-checkmark" label="Privacy policy" onPress={() => { router.push('/Privacy') }} isLast />
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

type RowItemProps = {
  iconName: any; // Ionicons glyph name
  label: string;
  onPress: () => void;
  isLast?: boolean;
};

function RowItem({ iconName, label, onPress, isLast }: RowItemProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.row, !isLast && styles.rowDivider]}>
        <View style={styles.leftIconWrap}>
          <View style={styles.leftIconInner}>
            <Ionicons name={iconName as any} size={moderateScale(18)} color={colors.primaryDark} />
          </View>
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
        <Ionicons name="chevron-forward" size={moderateScale(20)} color={colors.primaryDark} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: verticalScale(20),
  },
  backgroundImage: {
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
  },

  content: {
    padding: scale(16),
    paddingBottom: verticalScale(40),
  },
  loginButton: {
    backgroundColor: colors.primaryDark,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(8),
    marginTop: verticalScale(6),
    marginBottom: verticalScale(18),
  },
  loginButtonText: {
    color: '#fff',
    fontSize: moderateScale(14),
    textAlign: 'center',
    fontFamily: 'Montserrat',
  },
  list: {
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: verticalScale(58),
    backgroundColor: 'transparent',
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  leftIconWrap: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(50),
    borderColor: colors.textPrimary,
    borderWidth: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  leftIconInner: {
    width: scale(34),
    height: scale(34),
    borderRadius: scale(17),
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    color: colors.primaryDark,
    fontSize: moderateScale(14),
    fontFamily: 'Montserrat',
  },
  deleteAccountWrap: {
    paddingVertical: verticalScale(16),
    alignItems: 'center',
  },
  deleteAccountText: {
    color: '#E44C4C',
    fontSize: moderateScale(14),
    fontFamily: 'Montserrat',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    paddingTop: verticalScale(16),
    width: scale(250),
    backgroundColor: 'rgba(245, 245, 245, 0.95)',
    borderRadius: 14,
    padding: 0,
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  modalMessage: {
    paddingHorizontal: verticalScale(10),
    paddingVertical: verticalScale(10),
    textAlign: 'center',
    fontFamily: 'MontserratMedium',
    fontSize: moderateScale(10),
  },
  modalButton: { 
    paddingVertical: verticalScale(10),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  destructiveButton: {
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: colors.textSecondary,
  },
  destructiveButtonText: {
    color: '#FF3B30',
    fontFamily: 'Montserrat',
    fontSize: moderateScale(14),
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: colors.textSecondary,
    marginTop: verticalScale(8),
  },
  cancelButtonText: {
    color: '#007AFF',
    fontFamily: 'Montserrat',
    fontSize: moderateScale(14),
    textAlign: 'center',
  },
  actionSheet: {
    width: '100%',
  },
});
