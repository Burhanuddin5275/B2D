import { addToCart, removeFromCart, selectCartItems, updateQuantity } from '@/store/cartSlice'
import { addToWishlist, removeFromWishlist, selectWishlistItems } from '@/store/wishlistSlice'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { ImageBackground } from 'expo-image'
import React, { useMemo, useState } from 'react'
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import { useAppDispatch, useAppSelector } from '@/store/useAuth'
import { router } from 'expo-router'
import { ProductStyle } from '@/assets/css/style'
import { colors } from '@/theme/colors'

const { width } = Dimensions.get('window')

type Suggestion = {
  id: string | number
  title: string
  subtitle: string
  image?: any
  emoji?: string
  bgColor?: string
  type: 'category' | 'product'
  price?: string
  unit?: string
  seller?: string
}

const CATEGORIES: Suggestion[] = [
  {
    id: 'cat-spices',
    title: 'Spices & Seasoning',
    subtitle: 'in Food Category',
    emoji: '🌶️',
    bgColor: '#FFD4C4',
    type: 'category'
  },
  {
    id: 'cat-biscuits',
    title: 'Biscuits',
    subtitle: 'Category',
    image: require('../../assets/images/Ritz.png'),
    type: 'category'
  },
]
const PRODUCTS: Suggestion[] = [
  {
    id: 1,
    title: 'RITZ Fresh Stacks\nOriginal Crackers',
    subtitle: 'Family Size, 17.8 oz',
    price: '4.98',
    image: require('../../assets/images/Ritz.png'),
    type: 'product',
    seller: 'Fresh Mart',
  },
  {
    id: 2,
    title: 'Great Value Mini\nPretzel Twists',
    subtitle: '16 oz',
    price: '2.24',
    image: require('../../assets/images/Mini.png'),
    type: 'product',
    seller: 'Fresh Mart',
  },
  {
    id: 3,
    title: 'Loacker Classic Wafers Mix, Variety...',
    subtitle: '45g/1.59oz, Pack of 6',
    price: '10.19',
    image: require('../../assets/images/loacker.png'),
    type: 'product',
    seller: 'Fresh Mart',
  },
  {
    id: 4,
    title: 'LOVE CORN Variety Pack | Sea Salt, BBQ...',
    subtitle: '0.7oz, 18 Bags',
    price: '15.19',
    image: require('../../assets/images/snack.png'),
    type: 'product',
    seller: 'Fresh Mart',
  },
  {
    id: 5,
    title: 'Fresh Sweet\nCorn on the Cob',
    subtitle: '1 each',
    price: '4.98',
    image: require('../../assets/images/corn.png'),
    type: 'product',
    seller: 'Lisa Mart',
  },
  {
    id: 6,
    title: 'Fresh Strawberry',
    subtitle: '12 pieces',
    price: '2.24',
    image: require('../../assets/images/strawberry.png'),
    type: 'product',
    seller: 'Lisa Mart',
  },
  {
    id: 7,
    title: 'Fresh Roma Tomato',
    subtitle: '1 pieces',
    price: '10.19',
    image: require('../../assets/images/tomatao.png'),
    type: 'product',
    seller: 'Lisa Mart',
  },
  {
    id: 8,
    title: 'Fresh Hass Avocado',
    subtitle: '1 pieces',
    price: '15.19',
    image: require('../../assets/images/avocados.png'),
    type: 'product',
    seller: 'Lisa Mart',
  },

];
const Search = () => {
  const navigation = useNavigation()
  const [query, setQuery] = useState('')
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector(selectWishlistItems);
  const cartItems = useAppSelector(selectCartItems);
  const wishlistIds = useMemo(() => wishlistItems.map(item => item.id), [wishlistItems]);
  const checkIsInWishlist = (productId: number) => wishlistIds.includes(productId);
  const insets = useSafeAreaInsets();

  const toggleWishlist = (product: any) => {
    const payload = {
      id: product.id,
      name: product.title,
      subtitle: product.subtitle,
      price: Number(product.price),
      img: product.image,
      seller: product.seller ?? 'Marketplace',
    };
    if (checkIsInWishlist(product.id)) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(payload));
    }
  };

  const { categories, products } = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return { categories: [], products: [] }

    return {
      categories: CATEGORIES.filter(s =>
        s.title.toLowerCase().includes(q) || s.subtitle.toLowerCase().includes(q)
      ),
      products: PRODUCTS.filter(s =>
        s.title.toLowerCase().includes(q) || s.subtitle.toLowerCase().includes(q)
      )
    }
  }, [query])

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
          name: product.title,
          price: Number(product.price),
          img: product.image,
          seller: product.seller ?? 'Marketplace',
          quantity: 1,
        })
      );
    }
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
        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={styles.innerBg}
        >
          <View style={styles.searchBar}>
            <View style={styles.inputWrap}>
              <TextInput
                autoFocus
                value={query}
                onChangeText={setQuery}
                placeholder="Search for category & products"
                placeholderTextColor="gray"
                style={styles.input}
              />
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        {query.trim().length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Start typing to search for products</Text>
          </View>
        ) : categories.length === 0 && products.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Try refining your search or</Text>
            <Text style={styles.emptyTitle}>explore different categories to find</Text>
            <Text style={styles.emptyTitle}>what you're looking for.</Text>
          </View>
        ) : (
          <View style={styles.resultsWrap}>
            {categories.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Category</Text>
                <FlatList
                  data={categories}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={({ item }) => (
                    <View style={styles.row}>
                      {item.image ? (
                        <Image source={item.image} style={styles.thumbImage} />
                      ) : (
                        <View style={[styles.emojiWrap, { backgroundColor: item.bgColor || '#EEE' }]}>
                          <Text style={styles.emoji}>{item.emoji || '🛒'}</Text>
                        </View>
                      )}
                      <View style={styles.rowText}>
                        <Text style={styles.rowTitle}>{item.title}</Text>
                        <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
                      </View>
                      <TouchableOpacity style={styles.rowAction} onPress={() => setQuery('')}>
                        <Ionicons name="close" size={18} color="#9B9B9B" />
                      </TouchableOpacity>
                    </View>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                  contentContainerStyle={styles.listContent}
                />
              </>
            )}
            {products.length > 0 && (
              <View style={ProductStyle.productsSection}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.sectionTitle}>Products</Text>
                  <View style={[ProductStyle.productsGrid,{marginBottom: verticalScale(100)}]}>
                    {products.map((item) => {
                      const productId = item.id as number;
                      const qty = existingCartItem(productId)?.quantity || 0;
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={ProductStyle.productCard}
                          onPress={() => {
                            router.push({
                              pathname: '/Product',
                              params: {
                                product: JSON.stringify({
                                  id: item.id,
                                  name: item.title,
                                  price: parseFloat(item.price || '0'),
                                  img: item.image,
                                  subtitle: item.subtitle,
                                  seller: item.seller || 'Unknown Seller'
                                })
                              }
                            });
                          }}
                        >
                          <View style={ProductStyle.productImage}>
                            <Image source={item.image} style={ProductStyle.productPic} resizeMode="contain" />
                          </View>
                          <TouchableOpacity
                            style={[ProductStyle.favoriteButton, checkIsInWishlist(productId) && ProductStyle.favoriteButtonActive]}
                            onPress={() => toggleWishlist(item)}
                          >
                            <Ionicons
                              name={checkIsInWishlist(productId) ? "heart" : "heart-outline"}
                              size={20}
                              color={checkIsInWishlist(productId) ? "#cfcdcdff" : "#888"}
                            />
                          </TouchableOpacity>
                          <View style={ProductStyle.productInfo}>
                            <Text style={ProductStyle.productName}>{item.title}</Text>
                            <Text style={ProductStyle.productSubtitle}>{item.subtitle}</Text>
                            <Text style={ProductStyle.priceText}>${item.price}</Text>
                            <View style={ProductStyle.buttonContainer}>
                              {qty === 0 ? (
                                <TouchableOpacity
                                  style={ProductStyle.addButton}
                                  onPress={() => incrementQuantity(productId)}
                                  onPressIn={() => handleAddToCart(item)}
                                >
                                  <Text style={ProductStyle.addButtonText}>+ Add</Text>
                                </TouchableOpacity>
                              ) : (
                                <View style={ProductStyle.qtyControl}>
                                  <TouchableOpacity
                                    style={ProductStyle.qtySideButton}
                                    onPress={() => decrementQuantity(productId)}
                                  >
                                    <Text style={ProductStyle.qtySideButtonText}>−</Text>
                                  </TouchableOpacity>
                                  <View style={ProductStyle.qtyPill}>
                                    <Text style={ProductStyle.qtyText}>{String(qty).padStart(2, '0')}</Text>
                                  </View>
                                  <TouchableOpacity
                                    style={ProductStyle.qtySideButtonFilled}
                                    onPress={() => incrementQuantity(productId)}
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
                </ScrollView>
              </View>
            )}

          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    backgroundColor: colors.white,
  },
  innerBg: {
    backgroundColor:colors.primaryLight,
    height: verticalScale(120),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginTop: verticalScale(25)
  },
  inputWrap: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  leftIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.primaryDark,
  },
  cancel: {
    color: '#0A84FF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: '#1E1E1E',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 2,
    fontWeight: '600',
  },
  resultsWrap: {
    flex: 1,
    paddingTop: 12,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    fontSize: 20,
    fontWeight: '700',
    color: '#1E1E1E',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  emojiWrap: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 26,
  },
  thumbImage: {
    width: 56,
    height: 40,
    resizeMode: 'contain',
    marginRight: 12,
    borderRadius: 6,
  },
  rowText: {
    flex: 1,
    marginLeft: 12,
  },
  rowTitle: {
    fontFamily:'Montserrat',
    fontSize: moderateScale(14),
    fontWeight: '600',
    marginBottom: 2,
  },
  rowSubtitle: {
    fontFamily:'Montserrat',
    fontSize: moderateScale(12),
    color: colors.textPrimary,
  },  
  rowAction: {
    padding: 6,
  },
  separator: {
    height: 1,
    backgroundColor: '#E9E9EA',
  },
})

export default Search