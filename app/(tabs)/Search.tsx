import { addToWishlist, removeFromWishlist, selectWishlistItems } from '@/store/wishlistSlice'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { ImageBackground } from 'expo-image'
import React, { useEffect, useMemo, useState } from 'react'
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { ProductStyle } from '@/assets/css/style'
import { Category, fetchCategories } from '@/service/category'
import { fetchProducts, Product } from '@/service/product'
import { useAppDispatch, useAppSelector } from '@/store/useAuth'
import { colors } from '@/theme/colors'
import { router } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import { addOrUpdateCart, CartItem, fetchCart, removeFromCartApi } from '@/service/cart'
import { addToWishlistApi, getFromWishlistApi, removeFromWishlistApi } from '@/service/wishlist'

const { width } = Dimensions.get('window')

const Search = () => {
  const navigation = useNavigation()
  const [query, setQuery] = useState('')
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const token = useAppSelector((s) => s.auth.token);
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [apiCategories, setApiCategories] = useState<Category[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [wishlist, setWishlist] = useState<any>([]);
  const checkIsInWishlist = (productId: number) =>
    wishlist.some((item: any) => item.product_id === productId);
  const insets = useSafeAreaInsets();

  const toggleWishlist = async (product: Product) => {
    if (!token || !isAuthenticated) {
      alert('Please login to use wishlist');
      return;
    }

    const variationId = product.product_variations?.[0]?.id;

    try {
      const existingItem = wishlist.find(
        (item: any) => item.product_id === product.id
      );

      if (existingItem) {
        await removeFromWishlistApi(token, existingItem.wishlist_id);

        setWishlist((prev: any[]) =>
          prev.filter(item => item.product_id !== product.id)
        );
      } else {
        const payload: any = {
          product: product.id,
        };

        if (variationId) {
          payload.variation = variationId;
        }

        const newItem = await addToWishlistApi(token, payload);

        if (newItem?.id) {
          setWishlist((prev: any[]) => [
            ...prev,
            {
              wishlist_id: newItem.id,
              product_id: product.id,
            },
          ]);
        } else {
          const wishlistRes = await getFromWishlistApi(token);

          setWishlist(
            wishlistRes.data.map((item: any) => ({
              wishlist_id: item.id,
              product_id: item.product.id,
            }))
          );
        }
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      alert('Failed to update wishlist');
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      try {
        if (token) {
          const data = await fetchCart(token);
          setCartItems(data);
        }
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    };
    loadCart();
  }, [token]);
  const existingCartItem = (productId: number) =>
    cartItems.find((item) => item.product.id === productId);
  const handleAddToCart = async (product: any) => {
    if (!token || !isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      await addOrUpdateCart(token, {
        product: product.id,
        quantity: 1,
        variation: product.product_variations?.[0]?.id,
      });

      const updatedCart = await fetchCart(token);
      setCartItems(updatedCart);
    } catch (e) {
      console.error(e);
      alert('Failed to add item');
    }
  };

  const incrementQuantity = async (product: any) => {
    const item = cartItems.find((item) => item.product.id === product.id);
    if (!item || !token) return;

    const newQty = item.quantity + 1;

    try {
      await addOrUpdateCart(token, {
        id: item.id,
        product: product.id,
        quantity: newQty,
        variation: item.variation?.id,
      });

      const updatedCart = await fetchCart(token);
      setCartItems(updatedCart);
    } catch (e) {
      console.error(e);
    }
  };

  const decrementQuantity = async (product: any) => {
    const item = cartItems.find((item) => item.product.id === product.id);
    if (!item || !token) return;

    const newQty = item.quantity - 1;

    try {
      if (newQty <= 0) {
        // 🔥 DELETE API
        await removeFromCartApi(token, item.id);
      } else {
        // 🔁 UPDATE API
        await addOrUpdateCart(token, {
          id: item.id,
          product: product.id,
          quantity: newQty,
          variation: item.variation?.id,
        });
      }

      const updatedCart = await fetchCart(token);
      setCartItems(updatedCart);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load products and categories in parallel
        const productsData = await (fetchProducts());

        setApiProducts(productsData);
      } catch (error) {
        console.error('Failed to load data:', error);
        // You can set an error state here to show to the user
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  const productsToShow = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return []; // nothing shown if search is empty

    return apiProducts.filter(product =>
      product.name.toLowerCase().includes(q)
    );
  }, [query, apiProducts]);

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

        <View style={styles.resultsWrap}>
          {/* Category Section */}
          {productsToShow.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Category</Text>
              <ScrollView
                style={styles.categoryScrollView}
                contentContainerStyle={styles.categoryList}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                <View style={styles.categoryList}>
                  {productsToShow.map((category) => (
                    <View key={`category-${category.id}`} style={styles.categoryItem}>
                      <View style={styles.categoryLeft}>
                        {category.product_images?.length > 0 ? (
                            <Image
                              source={{ uri: category.product_images[0].image }}
                              style={styles.emoji}
                              resizeMode="contain"
                            />
                        ) : (
                          <View style={styles.categoryIcon}>
                            <Ionicons name="pricetag-outline" size={20} color="#666" />
                          </View>
                        )}
                        <View>
                          <Text style={styles.categoryName}>{category.name}</Text>
                          <Text style={styles.categorySubtitle}>{category.category_name?.name}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
          {/* Products Section */}
          {productsToShow.length > 0 && (
            <View style={ProductStyle.productsSection}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Products</Text>
                <View style={[ProductStyle.productsGrid, { marginBottom: verticalScale(100) }]}>
                  {productsToShow.map((item) => {
                    const productId = Number(item.id);
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
                                name: item.name,
                                description: item.description || '',
                                price: item.regular_price,
                                images: item.product_images?.map((img) => img.image) || [],
                                variations: item.product_variations?.map((v) => ({
                                  id: v.id,
                                  name: v.name,
                                  price: v.price,
                                  unit_quantity: v.unit_quantity,
                                  stock: v.stock,
                                })) || [],
                                category: item.category_name?.name || '',
                                seller: item.store_name?.name || 'Fresh Mart',
                              }),
                            },
                          });
                        }}
                      >
                        <View style={ProductStyle.productImage}>
                          {item.product_images?.length > 0 ? (
                            <Image
                              source={{ uri: item.product_images[0].image }}
                              style={ProductStyle.productPic}
                              resizeMode="contain"
                            />
                          ) : (
                            <View style={[ProductStyle.productPic, { backgroundColor: '#EEE', justifyContent: 'center', alignItems: 'center' }]}>
                              <Text style={{ fontSize: 24 }}>🛒</Text>
                            </View>
                          )}
                        </View>

                        <TouchableOpacity
                          style={[ProductStyle.favoriteButton, checkIsInWishlist(productId) && ProductStyle.favoriteButtonActive]}
                          onPress={() => toggleWishlist(item)}
                        >
                          <Ionicons
                            name={checkIsInWishlist(productId) ? 'heart' : 'heart-outline'}
                            size={20}
                            color={checkIsInWishlist(productId) ? '#cfcdcdff' : '#888'}
                          />
                        </TouchableOpacity>

                        <View style={ProductStyle.productInfo}>
                          <Text style={ProductStyle.productName}>{item.name}</Text>
                          <Text style={ProductStyle.productSubtitle}>{item.category_name?.name}</Text>
                          <Text style={ProductStyle.priceText}>${item.regular_price}</Text>

                          <View style={ProductStyle.buttonContainer}>
                            {qty === 0 ? (
                              <TouchableOpacity
                                style={ProductStyle.addButton}
                                onPress={() => handleAddToCart(item)}
                              >
                                <Text style={ProductStyle.addButtonText}>Add To Cart</Text>
                              </TouchableOpacity>
                            ) : (
                              <View style={ProductStyle.qtyControl}>
                                <TouchableOpacity
                                  style={ProductStyle.qtySideButton}
                                  onPress={() => decrementQuantity(item)}
                                >
                                  <Text style={ProductStyle.qtySideButtonText}>−</Text>
                                </TouchableOpacity>

                                <View style={ProductStyle.qtyPill}>
                                  <Text style={ProductStyle.qtyText}>{String(qty).padStart(2, '0')}</Text>
                                </View>

                                <TouchableOpacity
                                  style={ProductStyle.qtySideButtonFilled}
                                  onPress={() => incrementQuantity(item)}
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
      </ImageBackground>
    </SafeAreaView>
  );

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
    backgroundColor: colors.primaryLight,
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
  sectionContainer: {
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(20),
  },
  categoryScrollView: {
    maxHeight: verticalScale(100),
    borderRadius: 8,
    marginTop: 8,
  },
  categoryList: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: moderateScale(12),
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
  },
  categoryName: {
    fontSize: moderateScale(14),
    fontFamily: 'InterMedium',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  categorySubtitle: {
    fontSize: moderateScale(12),
    color: '#999',
    fontFamily: 'InterRegular',
  },
  closeButton: {
    padding: moderateScale(4),
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
    width: scale(40),
    height: verticalScale(40),
  },
  thumbImage: {
    width: scale(56),
    height: scale(40),
    marginRight: 12,
    borderRadius: 6,
  },
  rowText: {
    flex: 1,
    marginLeft: 12,
  },
  rowTitle: {
    fontFamily: 'Montserrat',
    fontSize: moderateScale(14),
    fontWeight: '600',
    marginBottom: 2,
  },
  rowSubtitle: {
    fontFamily: 'Montserrat',
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