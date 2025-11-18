import { addToCart, removeFromCart, selectCartItems, updateQuantity } from '@/store/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/useAuth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import { ProductStyle } from '../../assets/css/style';
import { addToWishlist, removeFromWishlist, selectWishlistItems } from '../../store/wishlistSlice';
import { colors } from '@/theme/colors';
const { width } = Dimensions.get('window');

const categories = [
  { id: 1, name: 'Snacks', icon: '🍿', color: '#a3b984ff' },
  { id: 2, name: 'Spices Seasoning', icon: '🌶️', color: '#FFD4C4' },
  { id: 3, name: 'Cooking Oil Ghee', icon: '🧴', color: '#C41E3A' },
  { id: 4, name: 'Grains', icon: '🍚', color: '#FFE4A3' },
  { id: 5, name: 'Lentils Beans', icon: '🥜', color: '#8B6F47' },
  { id: 6, name: 'Pulses', icon: '🫘', color: '#4A90E2' },
];

const stores = [
  {
    id: 1,
    name: 'Lisa Mart',
    image: require('../../assets/images/store1.png'),
  },
  {
    id: 2,
    name: 'Fresh',
    image: require('../../assets/images/store2.png'),
  },
  {
    id: 3,
    name: 'Fresh Mart',
    image: require('../../assets/images/store3.png'),
  },

];

const products = [
  {
    id: 1,
    name: 'RITZ Fresh Stacks\nOriginal Crackers',
    subtitle: 'Family Size, 17.8 oz',
    category: 'Snacks',
    seller: 'Fresh Mart',
    price: 4.98,
    img: require('../../assets/images/Ritz.png'),
  },
  {
    id: 2,
    name: 'Great Value Mini\nPretzel Twists',
    subtitle: '16 oz',
    category: 'Snacks',
    seller: 'Lisa Mart',
    price: 2.24,
    img: require('../../assets/images/Mini.png'),
  },
  {
    id: 3,
    name: 'Loacker Classic Wafers Mix, Variety...',
    subtitle: '45g/1.59oz, Pack of 6',
    category: 'Snacks',
    seller: 'Fresh Mart',
    price: 10.19,
    img: require('../../assets/images/loacker.png'),
  },
  {
    id: 4,
    name: 'LOVE CORN Variety Pack | Sea Salt, BBQ...',
    subtitle: '0.7oz, 18 Bags',
    category: 'Snacks',
    seller: 'Lisa Mart',
    price: 15.19,
    img: require('../../assets/images/snack.png'),
  },
  {
    id: 5,
    name: 'Fresh Sweet\nCorn on the Cob',
    subtitle: '1 each',
    category: 'Fresh produce',
    seller: 'Fresh Mart',
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
    seller: 'Fresh Mart',
    price: 10.19,
    img: require('../../assets/images/tomatao.png'),
  },
  {
    id: 8,
    name: 'Fresh Hass Avocado',
    subtitle: '1 pieces',
    category: 'Fresh produce',
    seller: 'Fresh Mart',
    price: 15.19,
    img: require('../../assets/images/avocados.png'),
  },

];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [wishlist, setWishlist] = useState<number[]>([]);
  const wishlistItems = useSelector(selectWishlistItems);
  const [activeStoreIndex, setActiveStoreIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const storeCardWidth = scale(260);
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const checkIsInWishlist = (productId: number) => wishlist.includes(productId);
  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / storeCardWidth);
    if (index >= 0 && index < stores.length) {
      setActiveStoreIndex(index);
    }
  };
  const toggleWishlist = (product: any) => {
    if (checkIsInWishlist(product.id)) {
      dispatch(removeFromWishlist(product.id));
      setWishlist(prev => prev.filter(id => id !== product.id));
    } else {
      dispatch(addToWishlist(product));
      setWishlist(prev => [...prev, product.id]);
    }
  };
  useEffect(() => {
    setWishlist(wishlistItems.map(item => item.id));
  }, [wishlistItems]);
  const [quantity, setQuantity] = useState(1);
  const existingCartItem = (productId: number) => 
    cartItems.find((item) => item.id === productId);
  const handleAddToCart = (product: any) => {
    const currentQty = existingCartItem(product.id)?.quantity || 0;
    const newQuantity = currentQty + 1;
    
    if (currentQty > 0) {
      dispatch(updateQuantity({ id: product.id, quantity: newQuantity }));
    } else {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          img: product.img,
          seller: product.seller || 'Unknown Seller',
          quantity: 1,
        })
      );
    }
    setQuantity(newQuantity);
  };

  const incrementQuantity = (productId: number) => {
    const currentQty = existingCartItem(productId)?.quantity || 0;
    const newQuantity = currentQty + 1;
    dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
  };

  const decrementQuantity = (productId: number) => {
    const currentQty = existingCartItem(productId)?.quantity || 0;
    const newQuantity = currentQty - 1;
    
    if (newQuantity <= 0) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: Math.max(insets.bottom, verticalScale(1)) }}>
      <ImageBackground
        source={require('../../assets/images/background2.png')}
        style={ProductStyle.backgroundImage}  
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.headerShadowWrapper}>
            <ImageBackground
              source={require('../../assets/images/background1.png')}
              style={styles.contentContainer}
            >
              <View style={styles.header}>
                <View style={styles.deliveryInfo}>
                  <Text style={styles.deliveryLabel}>Delivery in</Text>
                  <Text style={styles.deliveryTime}>10 minutes</Text>
                  <Text style={styles.deliveryAddress}>Raleigh St, Houston, TX 77021</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.searchContainer}
                onPress={() => navigation.navigate('Search' as never)}
              >
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for category, store & products"
                  placeholderTextColor="#E9B10F"
                  editable={false}
                  pointerEvents="none"
                />
                <Ionicons name="search" size={24} color="#E9B10F" />
              </TouchableOpacity>
            </ImageBackground>
          </View>

          {/* Categories Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Categories' as never)}>
                <Text style={styles.viewAll}>View all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
            >
              {categories.map((category) => (
                <TouchableOpacity key={category.id} style={styles.categoryCard} onPress={() => {
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
                  })
                }}>
                  <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                    <Text style={styles.categoryEmoji}>{category.icon}</Text>
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Stores Near You Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Stores near you</Text>
              <TouchableOpacity>
                <Text style={styles.viewAll}>View all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.storesScroll}
              pagingEnabled
              onScroll={handleScroll}
              scrollEventThrottle={16}
              snapToInterval={storeCardWidth + 16} // Add spacing to snap interval
              snapToAlignment="center"
              decelerationRate="fast"
              contentContainerStyle={{ paddingRight: scale(10) }} // Add right padding to last item
            >
              {stores.map((store, index) => (
                <TouchableOpacity
                  key={store.id}
                  style={[styles.storeCard, { width: storeCardWidth }]}
                  activeOpacity={0.8}
                  onPress={() => {
                    setActiveStoreIndex(index);
                    scrollViewRef.current?.scrollTo({
                      x: index * storeCardWidth,
                      animated: true
                    });
                          const storeProducts = products.filter(
                    product => product.seller.toLowerCase() === store.name.split('\n')[0].toLowerCase()
                  );

                  router.push({
                    pathname: '/Store',
                    params: {
                      StoreName: store.name,
                      products: JSON.stringify(storeProducts)
                    }
                  })
                  }}
                >
                  <Image source={store.image} style={styles.storeImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.pagination}>
              {stores.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === activeStoreIndex && styles.paginationDotActive
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Products Section */}
          <View style={ProductStyle.productsSection}>
            <View style={ProductStyle.productsGrid}>
              {products.map((product) => {
                const qty = existingCartItem(product.id)?.quantity || 0;
                return (
                  <TouchableOpacity key={product.id} style={ProductStyle.productCard} onPress={() => {
                    router.push({
                      pathname: '/Product',
                      params: {
                        product: JSON.stringify(product)
                      }
                    });
                  }}>
                    <View style={ProductStyle.productImage}>
                      <Image source={product.img} style={ProductStyle.productPic} resizeMode="contain" />
                    </View>
                    <TouchableOpacity
                      style={[ProductStyle.favoriteButton, checkIsInWishlist(product.id) && ProductStyle.favoriteButtonActive]}
                      onPress={() => toggleWishlist(product)}
                    >
                      <Ionicons
                        name={checkIsInWishlist(product.id) ? "heart" : "heart-outline"}
                        size={20}
                        color={checkIsInWishlist(product.id) ? "#b9b7b7ff" : "#888"}
                      />
                    </TouchableOpacity>
                    <View style={ProductStyle.productInfo}>
                      <Text style={ProductStyle.productName}>{product.name}</Text>
                      <Text style={ProductStyle.productSubtitle}>{product.subtitle}</Text>

                      <Text style={ProductStyle.priceText}>${product.price.toFixed(2)}</Text>
                      <View style={ProductStyle.buttonContainer}>
                        {qty === 0 ? (
                          <TouchableOpacity
                            style={ProductStyle.addButton}
                            onPress={() => incrementQuantity(product.id)}
                            onPressIn={() => handleAddToCart(product)}
                          >
                            <Text style={ProductStyle.addButtonText}>Add To Cart</Text>
                          </TouchableOpacity>
                        ) : (
                          <View style={ProductStyle.qtyControl}>
                            <TouchableOpacity
                              style={ProductStyle.qtySideButton}
                              onPress={() => decrementQuantity(product.id)}
                            >
                              <Text style={ProductStyle.qtySideButtonText}>−</Text>
                            </TouchableOpacity>
                            <View style={ProductStyle.qtyPill}>
                              <Text style={ProductStyle.qtyText}>{String(qty).padStart(2, '0')}</Text>
                            </View>
                            <TouchableOpacity
                              style={ProductStyle.qtySideButtonFilled}
                              onPress={() => incrementQuantity(product.id)}
                            >
                              <Text style={ProductStyle.qtySideButtonFilledText}>+</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  scrollView: {
    flex: 1,
  },
  headerShadowWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  contentContainer: {
    height: verticalScale(200),
    justifyContent: 'center',
  },

  header: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(15),
  },
  deliveryInfo: {
    marginTop: verticalScale(10),
  },
  deliveryLabel: {
    fontFamily:'Montserrat',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  deliveryTime: {
    fontSize: moderateScale(28),
    fontWeight: '700',
    fontFamily:'Montserrat',
    color: '#000',
  },
  deliveryAddress: {
    fontFamily:'PoppinsMedium',
    fontWeight:'500',
    fontSize: moderateScale(14),
    color: '#000',
    marginTop: 4,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.primaryDark,
  },
  section: {
    marginTop: verticalScale(20),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontFamily:'Montserrat',
    fontSize: moderateScale(20),
    fontWeight: '600',
  },
  viewAll: {
    fontSize: moderateScale(14), 
    color: '#F4A300',
    fontWeight: '500',
  },
  categoriesScroll: {
    paddingLeft: scale(20),
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
    width: scale(80),
  },
  categoryIcon: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: moderateScale(36),
  },
  categoryName: {
    fontFamily:'MontserratMedium',
    fontWeight:'500',
    fontSize: moderateScale(12),
    textAlign: 'center',
  },
  storesScroll: {
    height: verticalScale(150),
    paddingHorizontal: scale(5),
  },
  storeCard: {
    width: scale(300),
    marginHorizontal: scale(8),
    borderRadius: 16,
    overflow: 'hidden',
  },
  storeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  pagination: {
    marginTop: verticalScale(5),
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D0D0D0',
  },
  paginationDotActive: {
    backgroundColor: '#000',
  },

});
