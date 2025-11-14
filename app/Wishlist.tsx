import Header from '@/components/Header';
import { addToCart, removeFromCart, selectCartItems, updateQuantity } from '@/store/cartSlice';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, scale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishlist, selectWishlistItems } from '../store/wishlistSlice';
import { colors } from '@/theme/colors';

export default function Wishlist() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const cartItems = useSelector(selectCartItems);
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
  
const existingCartItem = (productId: number) => 
  cartItems.find((item) => item.id === productId); // This should be cartItems, not wishlistItems

const handleAddToCart = (product: any) => {
  const cartItem = existingCartItem(product.id);
  const currentQty = cartItem?.quantity || 0;
  const newQuantity = currentQty + 1;
  
  if (currentQty > 0) {
    dispatch(updateQuantity({ id: product.id, quantity: newQuantity }));
  } else {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        img: product.img,
        seller: product.seller,
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
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/images/background2.png')}
        style={styles.backgroundImage}
      >
      <Header title="Wishlist" showDefaultIcons={false}/>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {wishlistItems.map((item) => {
            const qty = existingCartItem(item.id)?.quantity || 0;
            return (
              <View key={item.id} style={styles.productCard}>
                <View style={styles.productImageContainer}>
                  <Image source={item.img} style={styles.productImage} resizeMode="contain" />
                  <TouchableOpacity
                    style={styles.heartButton}
                    onPress={() => dispatch(removeFromWishlist(item.id))}
                  >
                    <Ionicons name="heart" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>

                <View style={styles.productInfo}>
                  <View style={styles.productHeader}>
                    <View style={styles.productTextContainer}>
                      <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.productSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                    </View>
                  </View>

                  <View style={styles.priceRow}>
                    <Text style={styles.productPrice}>${item.price}</Text>
                    {qty > 0 ? (
                      <View style={styles.qtyControl}>
                        <TouchableOpacity
                          style={styles.qtySideButton}
                          onPress={() => decrementQuantity(item.id)}
                        >
                          <Text style={styles.qtySideButtonText}>−</Text>
                        </TouchableOpacity>
                        <View style={styles.qtyPill}>
                          <Text style={styles.qtyText}>{String(qty).padStart(2, '0')}</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.qtySideButtonFilled}
                          onPress={() => incrementQuantity(item.id)}
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
    fontFamily:'Montserrat',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  productSubtitle: {
    fontFamily:'Montserrat',
    fontSize: moderateScale(12),
    color: colors.textPrimary,
  },
  productPrice: {
    fontFamily:'Montserrat',
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
    color:  colors.primaryDark,
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
    backgroundColor: '#F4A300',
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