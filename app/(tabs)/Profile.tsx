import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';


export default function Profile() {
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
        <View style={styles.content}>
          <TouchableOpacity activeOpacity={0.9} style={styles.loginButton} onPress={() => router.push('/Login')}>
            <Text style={styles.loginButtonText}>Login to place an order!</Text>
          </TouchableOpacity>

          <View style={styles.list}>
            <RowItem
              iconName="send"
              label="Contact us"
              onPress={() => {}}
            />
            <RowItem
              iconName="information-circle"
              label="About us"
              onPress={() => {}}
            />
            <RowItem
              iconName="document-text"
              label="Terms & conditions"
              onPress={() => {}}
            />
            <RowItem
              iconName="shield-checkmark"
              label="Privacy policy"
              onPress={() => {}}
              isLast
            />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

type RowItemProps = {
  iconName:
    | 'send'
    | 'information-circle'
    | 'document-text'
    | 'shield-checkmark';
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
  content: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(16),
  },
  loginButton: {
    backgroundColor: '#F1B90B',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    marginTop: verticalScale(6),
    marginBottom: verticalScale(18),
  },
  loginButtonText: {
    color: '#fff',
    fontSize: moderateScale(14),
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
    paddingHorizontal: scale(14),
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
    fontSize: moderateScale(14),
    fontFamily: 'Montserrat',
  },
  
});
