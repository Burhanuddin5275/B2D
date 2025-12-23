import { ProductStyle } from '@/assets/css/style'
import Header from '@/components/Header'
import { addToCart, removeFromCart, selectCartItems, updateQuantity } from '@/store/cartSlice'
import { useAppSelector } from '@/store/useAuth'
import { colors } from '@/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { Animated, Image, ImageBackground, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { scale, verticalScale } from 'react-native-size-matters'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist, selectWishlistItems } from '../../store/wishlistSlice'

interface Product {
  id: number;
  name: string;
  description: string;
  regular_price: string;
  product_images: { id: number; image: string }[];
  product_variations: {
    id: number;
    name: string;
    price: string;
    unit_quantity: string;
    image: string;
    stock: number;
  }[];
  image: string | null;
  category_name: { name: string };
  store_name: { name: string };
}

const Category = () => {
  const [selectedOption, setSelectedOption] = useState('Relevance');
  const insets = useSafeAreaInsets();
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [wishlist, setWishlist] = useState<number[]>([]);
  const checkIsInWishlist = (productId: number) => wishlist.includes(productId);
  const dispatch = useDispatch(); 
  const { categoryName, products } = useLocalSearchParams();
  const productsData: Product[] = products ? JSON.parse(products as string) : [];
  const wishlistItems = useSelector(selectWishlistItems);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const cartItems = useAppSelector(selectCartItems);

  // Set header title to the category name
  const headerTitle = typeof categoryName === 'string' ? categoryName : 'Category';

  const toggleWishlist = (product: any) => {
    if (checkIsInWishlist(product.id)) {
      dispatch(removeFromWishlist(product.id));
      setWishlist(prev => prev.filter(id => id !== product.id));
    } else {
      dispatch(addToWishlist(product));
      setWishlist(prev => [...prev, product.id]);
    }
  };

  const showFilterModal = () => {
    setIsFilterVisible(true);
  };

  const hideFilterModal = () => {
    setIsFilterVisible(false);
  };

  const handleFilterPress = showFilterModal;

  const handleSearchPress = () => {
   router.push('/Search');
  };
const [quantity, setQuantity] = useState(1);
  const existingCartItem = (productId: number) => 
    cartItems.find((item) => item.id === productId);
  const handleAddToCart = (product: Product) => {
    const currentQty = existingCartItem(product.id)?.quantity || 0;
    const newQuantity = currentQty + 1;
    const price = parseFloat(product.product_variations?.[0]?.price || '0');
    
    if (currentQty > 0) {
      dispatch(updateQuantity({ id: product.id, quantity: newQuantity }));
    } else {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: parseFloat(product.regular_price),
          img: product.product_images?.[0]?.image || '',
          seller: product.store_name?.name || 'Unknown Seller',
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
        source={require('../../assets/images/background.png')}
        style={styles.backgroundImage}
      >
        <Header title={headerTitle} showDefaultIcons={true} rightIcons={[
          { name: 'filter', onPress: handleFilterPress },
          { name: 'search-outline', onPress: handleSearchPress },
        ]}/>
        <ScrollView style={{flex: 1}}>
          {/* Products Section */}
          <View style={ProductStyle.productsSection}> 
            <View style={ProductStyle.productsGrid}>
              {productsData.length > 0 ? productsData.map((product: Product) => {
                const qty = existingCartItem(product.id)?.quantity || 0;
                return (
                  <TouchableOpacity 
                    key={product.id} 
                    style={ProductStyle.productCard}
                    onPress={() => {
                      router.push({
                        pathname: '/Product', 
                        params: {
                          product: JSON.stringify(product),
                          categoryName: headerTitle
                        }
                      });
                    }}>
                    <View style={ProductStyle.productImage}>
                      {product.product_images && product.product_images.length > 0 ? (
                        <Image 
                          source={{ uri: product.product_images[0].image }} 
                          style={ProductStyle.productPic} 
                          resizeMode="contain" 
                        />
                      ) : (
                        <View style={[ProductStyle.productPic, {backgroundColor: '#f0f0f0'}]} />
                      )}
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
                      <Text style={ProductStyle.productSubtitle} numberOfLines={2}>
                        {product.category_name.name}
                      </Text>
                      <Text style={ProductStyle.priceText}>
                        ${product.regular_price|| '0.00'}
                      </Text>
                      <View style={ProductStyle.buttonContainer}>
                        {qty === 0 ? (
                          <TouchableOpacity
                            style={ProductStyle.addButton}
                            onPress={() => handleAddToCart(product)}
                          >
                            <Text style={ProductStyle.addButtonText}>+ Add</Text>
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
              }) : (
                null
              )}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
      <Modal
        visible={isFilterVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideFilterModal}
      >
        <View style={[styles.modalOverlay,{ paddingBottom: Math.max(insets.bottom, verticalScale(1))}]}>
          <TouchableOpacity 
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={hideFilterModal}
          >
            <Animated.View 
              style={[
                styles.bottomSheet,
              ]}
            >
              <View style={styles.filterContent}>
                <View style={styles.headerContainer}>
                  <Text style={styles.filterTitle}>Sort products By</Text>
                  <TouchableOpacity 
                    onPress={hideFilterModal}
                    style={{
                      position: 'absolute',
                      right: 5,
                      backgroundColor: colors.textSecondary,
                      padding: 4,
                      borderRadius: 50,
                    }}
                  >
                    <Ionicons name="close" size={14} color={colors.textPrimary} />
                  </TouchableOpacity>
                </View>
                
                {/* Sort Options */}
                <View style={styles.optionsContainer}>
                  <TouchableOpacity 
                    style={styles.optionItem}
                    onPress={() => setSelectedOption('Relevance')}
                  >
                    <View style={styles.radioButton}>
                      {selectedOption === 'Relevance' && <View style={styles.radioButtonSelected} />}
                    </View>
                    <Text style={styles.optionText}>Relevance</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.divider} />
                  
                  <TouchableOpacity 
                    style={styles.optionItem}
                    onPress={() => setSelectedOption('Price (low to high)')}
                  >
                    <View style={styles.radioButton}>
                      {selectedOption === 'Price (low to high)' && <View style={styles.radioButtonSelected} />}
                    </View>
                    <Text style={styles.optionText}>Price (low to high)</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.divider} />
                  
                  <TouchableOpacity 
                    style={styles.optionItem}
                    onPress={() => setSelectedOption('Price (high to low)')}
                  >
                    <View style={styles.radioButton}>
                      {selectedOption === 'Price (high to low)' && <View style={styles.radioButtonSelected} />}
                    </View>
                    <Text style={styles.optionText}>Price (high to low)</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.divider} />
                  
                  <TouchableOpacity 
                    style={styles.optionItem}
                    onPress={() => setSelectedOption('Popularity')}
                  >
                    <View style={styles.radioButton}>
                      {selectedOption === 'Popularity' && <View style={styles.radioButtonSelected} />}
                    </View>
                    <Text style={styles.optionText}>Popularity</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default Category

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackground: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom:0,
    height: verticalScale(320),
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: scale(10),
  },
  filterContent: {
    flex: 1,
    marginTop: verticalScale(10),
  },
  filterTitle: {
    fontFamily: 'PoppinsBold',
    fontSize: scale(15),
    fontWeight: '600',
    textAlign: 'center',
  },
  optionsContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primaryDark,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primaryDark,
  },
  optionText: {
    fontSize: scale(14),
    fontFamily: 'Montserrat',
    fontWeight: '600',
  },
  divider: { 
    height: 1,
    backgroundColor: colors.textSecondary,
    marginLeft: scale(16),
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    backgroundColor:colors.white
  },
})