import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  backgroundImage?: ImageSourcePropType;
  headerStyle?: object;
  titleStyle?: object;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  backgroundImage = require('../assets/images/background1.png'),
  headerStyle,
  titleStyle,
}) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) onBackPress();
    else router.back();
  };

  const renderBackButton = () => {
    if (!showBackButton) return null;

    return (
      <TouchableOpacity
        style={styles.backBtn}
        onPress={handleBackPress}
        testID="header-back-button"
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={moderateScale(24)} color="#000" />
      </TouchableOpacity>
    );
  };

  const renderContent = () => (
    <View style={[styles.headerRow, headerStyle]}>
      {renderBackButton()}
      <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.shadowWrapper}>
      {backgroundImage ? (
        <ImageBackground
          source={backgroundImage}
          style={styles.innerBg}
          resizeMode="cover"
          testID="header-background"
        >
          {renderContent()}
        </ImageBackground>
      ) : (
        <View style={[styles.innerBg, { backgroundColor: '#FFF' }]}>
          {renderContent()}
        </View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  shadowWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 8,
    overflow: 'hidden',
    backgroundColor: '#FFF',
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
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: moderateScale(22),
    fontFamily: 'Montserrat',
    letterSpacing: 0.5,
    color: '#000',
  },
});
