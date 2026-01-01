import Header from '@/components/Header';
import { addToCart, removeFromCart, selectCartItems, updateQuantity } from '@/store/cartSlice';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, scale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishlist, selectWishlistItems } from '../store/wishlistSlice';
import { colors } from '@/theme/colors';
import { useEffect, useState } from 'react';
import { addOrUpdateCart, CartItem, fetchCart, removeFromCartApi } from '@/service/cart';
import { useAppSelector } from '@/store/useAuth';
import { getFromWishlistApi, removeFromWishlistApi } from '@/service/wishlist';

export default function Wishlist() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const token = useAppSelector((s) => s.auth.token);
  interface Product {
    id: number;
    name: string;
    subtitle: string;
    image: any;
    price: number;
    quantity?: number;
    weight?: number;
    unit?: string;
    category: string;
    seller: string;
  }
  useEffect(() => {
    if (!token) return;

    const loadWishlist = async () => {
      try {
        const response = await getFromWishlistApi(token);
        const wishlistItems = response?.data || [];

        const products = wishlistItems.map((item: any) => ({
           wishlist_id: item.id,
          id: item.product.id,
          name: item.product.name,
          price: item.product.regular_price,
          image: item.product.product_images?.[0]?.image || '',
          product_images: item.product.product_images || [],
          store: item.store,
          variation: item.variation,
        }));

        setWishlist(products);
      } catch (error) {
        console.error('Failed to load wishlist:', error);
        setWishlist([]);
      }
    };

    loadWishlist();
  }, [token]);

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
    cartItems.find((item) => item.product?.id === productId);
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
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/images/background.png')}
        style={styles.backgroundImage}
      >
        <Header title="Wishlist" showDefaultIcons={false} />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {wishlist.map((item) => {
            const qty = existingCartItem(item.id)?.quantity || 0;
            return (
              <View key={item.id} style={styles.productCard}>
                <View style={styles.productImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.productImage} />
                  <TouchableOpacity
                    style={styles.heartButton}
                    onPress={async () => {
                      if (!token) return;

                      try {
                        await removeFromWishlistApi(token, item.wishlist_id); 
                        setWishlist(wishlist.filter((w) => w.wishlist_id !== item.wishlist_id));
                      } catch (error) {
                        console.error('Failed to remove from wishlist:', error);
                      }
                    }}
                  >
                    <Ionicons name="heart" size={20} color="#FF6B6B" />
                  </TouchableOpacity>

                </View>

                <View style={styles.productInfo}>
                  <View style={styles.productHeader}>
                    <View style={styles.productTextContainer}>
                      <Text style={styles.productName}>{item.name}</Text>
                      <Text style={styles.productSubtitle}>{item.store.name}</Text>
                    </View>
                  </View>

                  <View style={styles.priceRow}>
                    <Text style={styles.productPrice}>${item.price || '0.00'}</Text>
                    {qty > 0 ? (
                      <View style={styles.qtyControl}>
                        <TouchableOpacity
                          style={styles.qtySideButton}
                          onPress={() => decrementQuantity(item)}
                        >
                          <Text style={styles.qtySideButtonText}>−</Text>
                        </TouchableOpacity>
                        <View style={styles.qtyPill}>
                          <Text style={styles.qtyText}>{String(qty).padStart(2, '0')}</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.qtySideButtonFilled}
                          onPress={() => incrementQuantity(item)}
                        >
                          <Text style={styles.qtySideButtonFilledText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddToCart(item)}
                      >
                        <Text style={styles.addButtonText}>+ Add</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.white
  },

  scrollContainer: {
    padding: scale(15),
  },
  productCard: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: scale(10),
  },
  productImageContainer: {
    width: scale(70),
    height: scale(70),
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(15),
    position: 'relative',
    borderColor: '#D9D9D9',
    borderWidth: 1,
  },
  productImage: {
    width: scale(60),
    height: scale(60),
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productTextContainer: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  productName: {
    fontFamily: 'Montserrat',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  productSubtitle: {
    fontFamily: 'Montserrat',
    fontSize: moderateScale(12),
    color: colors.textPrimary,
  },
  productPrice: {
    fontFamily: 'Montserrat',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  addButton: {
    borderColor: colors.primaryDark,
    borderWidth: 1,
    paddingVertical: 8,
    borderRadius: 8,
    width: scale(100),

  },
  addButtonText: {
    color: colors.primaryDark,
    fontWeight: '700',
    textAlign: 'center',
    fontSize: moderateScale(14),
  },
  qtyControl: {
    backgroundColor: colors.primaryDark,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    height: 36,
  },
  qtySideButton: {
    paddingHorizontal: 12,
    height: '100%',
    justifyContent: 'center',
  },
  qtySideButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 22,
  },
  qtyPill: {
    minWidth: 36,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center'
  },
  qtySideButtonFilled: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtySideButtonFilledText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  heartButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 15,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
});