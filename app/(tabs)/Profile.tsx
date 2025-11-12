import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { logout } from '../../store/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/useAuth';
import Header from '@/components/Header';


export default function Profile() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    dispatch(logout()); 
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: Math.max(insets.bottom, verticalScale(1)) }}>
      <ImageBackground
        source={require('../../assets/images/background2.png')}
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
                    onPress={() => { router.push('/ManageAddress')}}
                  />
                  <RowItem
                    iconName="person"
                    label="Manage Profile"
                    onPress={() => {router.push('/CompleteProfile')}}
                  />
                  <RowItem
                    iconName="call"
                    label="Contact us"
                    onPress={() => {router.push('/ContactUs')}}
                  /> 
                  <RowItem
                    iconName="information-circle"
                    label="About us" 
                    onPress={() => {router.push('/AboutUs')}}
                  />
                  <RowItem
                    iconName="document-text"
                    label="Terms & conditions"
                    onPress={() => { }}
                  />
                  <RowItem
                    iconName="shield-checkmark"
                    label="Privacy policy"
                    onPress={() => { }}
                  />
                  <RowItem
                    iconName="log-out"
                    label="Logout"
                    onPress={handleLogout}
                    isLast={true}
                  />
                  <TouchableOpacity style={styles.deleteAccountWrap} onPress={() => { }}>
                    <Text style={styles.deleteAccountText}>Delete this account</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <RowItem iconName="call" label="Contact us" onPress={() => { router.push('/ContactUs')}} />
                  <RowItem iconName="information-circle" label="About us" onPress={() => {router.push('/AboutUs')}} />
                  <RowItem iconName="document-text" label="Terms & conditions" onPress={() => { }} />
                  <RowItem iconName="shield-checkmark" label="Privacy policy" onPress={() => { }} isLast />
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
            <Ionicons name={iconName as any} size={moderateScale(18)} color="#F1B90B" />
          </View>
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
        <Ionicons name="chevron-forward" size={moderateScale(20)} color="#D9B54A" />
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
  },
 
  content: {
    padding: scale(16),
    paddingBottom: verticalScale(40),
  },
  loginButton: {
    backgroundColor: '#F1B90B',
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
    borderColor: 'gray',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  leftIconInner: {
    width: scale(34),
    height: scale(34),
    borderRadius: scale(17),
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    color: '#F1B90B',
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

});
