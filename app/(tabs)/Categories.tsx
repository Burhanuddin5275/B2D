import Header from '@/components/Header';
import { Entypo, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { verticalScale } from 'react-native-size-matters';


export default function Categories() {
  const insets = useSafeAreaInsets();
const categories = [
  { id: 1, name: 'Restaurants', icon: 'restaurant', iconType: 'ionicons', color: '#FF6B6B' },
  { id: 2, name: 'Grocery', icon: 'shopping-bag', iconType: 'font-awesome-5', color: '#4ECDC4' },
  { id: 3, name: 'Fresh produce', icon: 'food-apple', iconType: 'material-community', color: '#4CAF50' },
  { id: 4, name: 'Meat & Fish', icon: 'food-steak', iconType: 'material-community', color: '#FF7043' },
  { id: 5, name: 'Bakery', icon: 'bread-slice', iconType: 'font-awesome-5', color: '#FFD54F' },
  { id: 6, name: 'Dairy', icon: 'cow', iconType: 'material-community', color: '#90CAF9' },
  { id: 7, name: 'Beverages', icon: 'bottle-soda', iconType: 'material-community', color: '#AB47BC' },
  { id: 8, name: 'Snacks', icon: 'food-variant', iconType: 'material-community', color: '#FF8A65' },
  { id: 9, name: 'Spices & Seasoning', icon: 'pepper-hot', iconType: 'font-awesome-5', color: '#FFD4C4' },
  { id: 10, name: 'Cooking Oil & Ghee', icon: 'bottle-tonic', iconType: 'material-community', color: '#C41E3A' },
  { id: 11, name: 'Grains', icon: 'rice', iconType: 'material-community', color: '#FFE4A3' },
  { id: 12, name: 'Lentils Beans', icon: 'peanut', iconType: 'material-community', color: '#8B6F47' },
  { id: 13, name: 'Pulses', icon: 'food-drumstick', iconType: 'material-community', color: '#4A90E2' },
];
const products = [
  {
    id: 1,
    name: 'RITZ Fresh Stacks Original Crackers',
    subtitle: 'Family Size, 17.8 oz',
    category: 'Snacks',
    seller: 'Fresh Mart',
    price: 4.98,
    img: require('../../assets/images/Ritz.png'),
  },
  {
    id: 2,
    name: 'Great Value Mini Pretzel Twists',
    subtitle: '16 oz',
    category: 'Snacks',
    seller: 'Fresh Mart',
    price: 2.24,
    img: require('../../assets/images/Mini.png'),
  },
  {
    id: 3,
    name: 'Loacker Classic Wafers Mix, Variety',
    subtitle: '45g/1.59oz, Pack of 6',
    category: 'Snacks',
    seller: 'Fresh Mart',
    price: 10.19,
    img: require('../../assets/images/loacker.png'),
  },
  {
    id: 4,
    name: 'LOVE CORN Variety Pack',
    subtitle: '0.7oz, 18 Bags',
    category: 'Snacks',
    seller: 'Fresh Mart',
    price: 15.19,
    img: require('../../assets/images/snack.png'),
  },
    { 
    id: 5,
    name: 'Fresh Sweet Corn on the Cob',
    subtitle: '1 each',
    category: 'Fresh produce',
    seller: 'Lisa Mart',
    price: 4.98,
    img: require('../../assets/images/corn.png'),
  },
  {
    id: 6,
    name: 'Fresh Strawberry',
    subtitle: '12 pieces',
    category: 'Fresh produce',
    seller: 'Lisa Mart',
    price: 2.24,
    img: require('../../assets/images/strawberry.png'),
  },
  {
    id: 7,
    name: 'Fresh Roma Tomato',
    subtitle: '1 pieces',
    category: 'Fresh produce',
    seller: 'Lisa Mart',
    price: 10.19,
    img: require('../../assets/images/tomatao.png'),
  },
  {
    id: 8,
    name: 'Fresh Hass Avocado',
    subtitle: '1 pieces',
    category: 'Fresh produce',
    seller: 'Lisa Mart',
    price: 15.19,
    img: require('../../assets/images/avocados.png'),
  }, 

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
    <SafeAreaView style={{ flex: 1, paddingBottom: Math.max(insets.bottom, verticalScale(1)) }}>
      <ImageBackground
        source={require('../../assets/images/background2.png')}
        style={styles.backgroundImage}
      >
        <Header title="Categories" showDefaultIcons={false} />
        <ScrollView style={styles.content}>
          <View style={styles.gridContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => {
                  // Filter products by category and pass to the category page
                  const categoryProducts = products.filter(
                    product => product.category.toLowerCase() === category.name.split('\n')[0].toLowerCase()
                  );
                  
                  router.push({
                    pathname: '/Category',
                    params: {
                      categoryName: category.name,
                      products: JSON.stringify(categoryProducts)
                    }
                  });
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
  backgroundImage: {
    flex: 1,
    width: '100%',
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
