import { Entypo, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';


export default function Categories() {
  const insets = useSafeAreaInsets();

  const categories = [
    { id: 1, name: 'Restaurants', icon: 'restaurant', iconType: 'ionicons', color: '#FF6B6B' },
    { id: 2, name: 'Grocery', icon: 'shopping-bag', iconType: 'font-awesome-5', color: '#4ECDC4' },
    { id: 3, name: 'Fruits & Vegetables', icon: 'food-apple', iconType: 'material-community', color: '#4CAF50' },
    { id: 4, name: 'Meat & Fish', icon: 'food-steak', iconType: 'material-community', color: '#FF7043' },
    { id: 5, name: 'Bakery', icon: 'bread-slice', iconType: 'font-awesome-5', color: '#FFD54F' },
    { id: 6, name: 'Dairy', icon: 'milk', iconType: 'material-community', color: '#90CAF9' },
    { id: 7, name: 'Beverages', icon: 'local-drink', iconType: 'material', color: '#AB47BC' },
    { id: 8, name: 'Snacks', icon: 'food-variant', iconType: 'material-community', color: '#FF8A65' },
  ];

  const renderIcon = (iconType: string, icon: string, color: string, size: number) => {
    switch (iconType) {
      case 'ionicons':
        return <Ionicons name={icon as any} size={size} color={color} />;
      case 'material':
        return <MaterialIcons name={icon as any} size={size} color={color} />;
      case 'font-awesome-5':
        return <FontAwesome5 name={icon as any} size={size} color={color} />;
      case 'material-community':
        return <MaterialCommunityIcons name={icon as any} size={size} color={color} />;
      default:
        return <Entypo name="shop" size={size} color={color} />;
    }
  };

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
              <Text style={styles.headerTitle}>Categories</Text>
            </View>
          </ImageBackground>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.gridContainer}>
            {categories.map((category) => (
              <TouchableOpacity 
                key={category.id} 
                style={styles.categoryCard}
                onPress={() => {
                  console.log(`Selected category: ${category.name}`);
                }}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  {renderIcon(category.iconType, category.icon, '#fff', 32)}
                </View>
                <Text style={styles.categoryName} numberOfLines={2}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
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
    flex: 1,
    padding: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#000',
    lineHeight: 16,
    fontFamily: 'Montserrat-Medium',
    paddingHorizontal: 4,
  },
});
