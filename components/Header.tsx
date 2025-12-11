import { colors } from '@/theme/colors';
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

export const handleFilterPress = () => {
  // Add your filter logic here
  console.log('Filter pressed');};

export const handleSearchPress = () => {
  // Add your search logic here
  console.log('Search pressed');};

interface HeaderIcon {
  name: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  backgroundImage?: ImageSourcePropType;
  headerStyle?: object;
  titleStyle?: object;
  rightIcons?: HeaderIcon[];
  showDefaultIcons?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  backgroundImage = require('../assets/images/background.png'),
  headerStyle,
  titleStyle,
  rightIcons,
  showDefaultIcons = true,
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

  const renderRightIcons = () => {
    const defaultIcons: HeaderIcon[] = [
      { name: 'filter', onPress: handleFilterPress },
      { name: 'search-outline', onPress: handleSearchPress },
    ];
    
    const icons = rightIcons || (showDefaultIcons ? defaultIcons : []);

    if (icons.length === 0) return null;

    return (
      <View style={styles.rightIconsContainer}>
        {icons.map((icon, index) => (
          <TouchableOpacity
            key={`header-icon-${index}`}
            style={styles.iconButton}
            onPress={icon.onPress}
            testID={`header-icon-${icon.name}`}
          >
            <Ionicons name={icon.name} size={moderateScale(24)} color="#000" />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderContent = () => (
    <View style={[styles.headerRow, headerStyle]}>
      {renderBackButton()}
      <View style={styles.titleContainer}>
        <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
      </View>
      {renderRightIcons()}
    </View>
  );

  return (
    <View style={[styles.shadowWrapper, headerStyle]}>
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
    height: verticalScale(75),
    justifyContent: 'center',
    backgroundColor:colors.primaryLight
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    height: verticalScale(75),
    position: 'relative',
    marginTop: verticalScale(20),
  },
  backBtn: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily:'Montserrat',
    fontSize: moderateScale(18),
    fontWeight: '600',
    textAlign:'center'
  },
  rightIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  iconButton: {
    padding: scale(4),
  },
});
