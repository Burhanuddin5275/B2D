import Header from '@/components/Header';
import { CartItem, fetchCart, overweight, removeFromCartApi, weight } from '@/service/cart';
import { Product } from '@/service/product';
import { removeFromCart, updateQuantity } from '@/store/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/useAuth';
import { colors } from '@/theme/colors';
import { API_URL } from '@/url/Api_Url';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';



const HIGHLIGHTS = [
  {
    id: 'delivery',
    icon: 'flash',
    title: 'Superfast Delivery',
    description:
      'Get your order delivered to your doorstep at the earliest from dark stores near you.\nWe offer 3 types of delivery Free Shipping, Chargeable Delivery, Curb side pick up.',
  },
  {
    id: 'offers',
    icon: 'pricetag',
    title: 'Best Prices & Offers',
    description:
      'Best price destination with offers directly from the manufacturers.',
  },
  {
    id: 'assortment',
    icon: 'cube',
    title: 'Wide Assortment',
    description:
      'Choose from 5000+ products across food personal care, household & other categories.',
  },
];

const ProductScreen = () => {
  const { product } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const token = useAppSelector((s) => s.auth.token);
  const [isLoading, setIsLoading] = useState(false);
    const [overweightConfig, setOverweightConfig] = useState< weight| null>(null);
  
    useEffect(() => {
      const loadOverweight = async () => {
        if (!token) return;
        try {
          const data = await overweight(token);
          setOverweightConfig(data);
        } catch (error) {
          console.error('Overweight load failed', error);
        }
      };
      loadOverweight();
    }, [token]);
  useEffect(() => {
    console.log('Token:', cartItems);
    const loadCart = async () => {
      try {
        setIsLoading(true);
        if (token) {
          const data = await fetchCart(token);
          const cartdata = data.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            store: {
              id: item.store.id,
              name: item.store.name
            },
            product: {
              id: item.product.id,
              name: item.product.name,
              slug: item.product.slug,
              product_images: item.product.product_images,
              weight: item.product.weight
            },
            variation: {
              id: item.variation?.id || 0,
              name: item.variation?.name || 'Default',
              // Add any other required variation properties
              image: item.variation?.image || item.product.product_images[0]?.image,
            }
          }));
          setCartItems(cartdata);
        }
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, [token]);
  const parsedProduct: Product = useMemo(() => {
    try {
      return JSON.parse(
        Array.isArray(product) ? product[0] : product
      );
    } catch {
      return null;
    }
  }, [product]);

  const [selectedVariant, setSelectedVariant] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { width: screenWidth } = Dimensions.get('window');

  const existingCartItem = useMemo(
    () => cartItems.find((item) =>
      item.product.id === parsedProduct.id &&
      (!item.variation || item.variation.id === (parsedProduct.product_variations?.[selectedVariant]?.id || 0))
    ),
    [cartItems, parsedProduct.id, selectedVariant, parsedProduct.product_variations]
  );

  useEffect(() => {
    if (existingCartItem) {
      setQuantity(existingCartItem.quantity);
      setShowQuantitySelector(true);
    } else {
      setQuantity(1);
      setShowQuantitySelector(false);
    }
  }, [existingCartItem, selectedVariant]);


  useEffect(() => {
    if (parsedProduct.product_variations && parsedProduct.product_variations.length > 0) {
      const selected = parsedProduct.product_variations[selectedVariant];
      console.log('Selected variant:', {
        index: selectedVariant,
        id: selected?.id,
        product: parsedProduct.id,
        name: selected?.name,
        price: selected?.price
      });
    }
  }, [selectedVariant, parsedProduct.product_variations]);
  /* ================= ADD TO CART ================= */

  const handleAddToCart = async () => {
    if (!token || !isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      await addOrUpdateCart(token, {
        product: parsedProduct.id,
        quantity,
        variation:
          parsedProduct.product_variations?.[selectedVariant]?.id,
      });

      const updatedCart = await fetchCart(token);
      setCartItems(updatedCart);
      setShowQuantitySelector(true);
    } catch {
      alert('Failed to add item');
    }
  };
  /* ================= UPDATE CART ================= */
  const addOrUpdateCart = async (
    token: string,
    payload: {
      id?: number;
      product: number;
      quantity: number;
      variation?: number;
    }
  ) => {
    const response = await fetch(`${API_URL}customer-api/cart`, {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json = await response.json();

    if (!response.ok) {
      throw json;
    }

    return json;
  };
  const handleRemoveFromCart = async () => {
    if (!existingCartItem || !token) return;

    try {
      await removeFromCartApi(token, existingCartItem.id);

      setQuantity(1);
      setShowQuantitySelector(false);

      const updatedCart = await fetchCart(token);
      setCartItems(updatedCart);
    } catch {
      alert('Failed to remove item');
    }
  };

  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    dispatch(updateQuantity({ id: parsedProduct.id, quantity: newQuantity }));
  };

  const decrementQuantity = () => {
    const newQuantity = quantity - 1;
    if (newQuantity <= 0) {
      dispatch(removeFromCart(parsedProduct.id));
      setQuantity(1);
      setShowQuantitySelector(false);
      return;
    }

    setQuantity(newQuantity);
    dispatch(updateQuantity({ id: parsedProduct.id, quantity: newQuantity }));
  };
  const updateCartQuantity = async (newQuantity: number) => {
    // Don't allow quantity less than 1
    if (newQuantity < 1) return;

    // Update local state immediately for better UX
    setQuantity(newQuantity);

    if (!isAuthenticated || !token || !existingCartItem) return;

    try {
      const selectedVar = parsedProduct.product_variations?.[selectedVariant];
      const payload: any = {
        id: existingCartItem.id, // Important: Include the cart item ID
        product: parsedProduct.id,
        quantity: newQuantity,
      };

      if (selectedVar?.id) {
        payload.variation = selectedVar.id;
      }

      const response = await fetch(
        `${API_URL}customer-api/cart`,
        {
          method: 'POST',
          headers: {
            Authorization: `token ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Update quantity failed:', error);
        // Revert quantity on error
        setQuantity(quantity);
        alert('Failed to update quantity');
        return;
      }

      // Update local cart state
      const updatedCart = await fetchCart(token);
      setCartItems(updatedCart);
    } catch (err) {
      console.error('Update quantity failed:', err);
      // Revert quantity on error
      setQuantity(quantity);
      alert('Failed to update quantity. Please try again.');
    }
  };
  //Total Rating Caculation
  const overallRating = useMemo(() => {
    if (!parsedProduct?.reviews || parsedProduct.reviews.length === 0) return 0;
    const totalStars = parsedProduct.reviews.reduce((sum, r) => sum + r.stars, 0);
    return (totalStars / parsedProduct.reviews.length).toFixed(1);
  }, [parsedProduct]);
  const ratingBreakdown = useMemo(() => {
    if (!parsedProduct?.reviews) return [];
    const breakdown = [5, 4, 3, 2, 1].map((star) => {
      const count = parsedProduct.reviews.filter(r => r.stars === star).length;
      return { id: star.toString(), count };
    });
    return breakdown;
  }, [parsedProduct]);
  const reviewCount = parsedProduct?.reviews?.length || 0;
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../assets/images/background.png')}
        style={styles.backgroundImage}
      >
        <Header title="Product" showDefaultIcons={false} />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageContainer}>
            <FlatList
              ref={flatListRef}
              data={parsedProduct.image || []} // 
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const newIndex = Math.round(
                  event.nativeEvent.contentOffset.x / screenWidth
                );
                setCurrentImageIndex(newIndex);
              }}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={{ width: screenWidth, height: 300 }}>
                  <Image
                    src={item}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                </View>
              )}
            />

            <View style={styles.carouselDots}>
              {(parsedProduct.product_images || []).map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    flatListRef.current?.scrollToIndex({ index, animated: true });
                    setCurrentImageIndex(index);
                  }}
                >
                  <View
                    style={[
                      styles.dot,
                      index === currentImageIndex && styles.dotActive,
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.productTitle}>
              {parsedProduct.name}
            </Text>
            {/* {!!product.subtitle && (
              <Text style={styles.productSubtitle}>{product.subtitle}</Text>
            )} */}
            <Text style={styles.sellerText}>Sold by {typeof parsedProduct.store_name === 'object' ? parsedProduct.store_name.name : parsedProduct.store_name}</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.priceText}>${parsedProduct.regular_price}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={18} color={colors.primaryDark} />
                <Text style={styles.ratingScore}>({overallRating})</Text>
                <Text style={styles.ratingCount}>{reviewCount} reviews</Text>
              </View>
            </View>
            {parsedProduct.product_variations && parsedProduct.product_variations.length > 0 && (
              <>
                <Text style={styles.packLabel}>Available Variants</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={parsedProduct.product_variations}
                  keyExtractor={(_, index) => index.toString()}
                  contentContainerStyle={styles.variantsContainer}
                  renderItem={({ item: variant, index }) => {
                    const isActive = index === selectedVariant;
                    const price = typeof variant.price === 'number'
                      ? `$${variant.price}`
                      : variant.price;

                    return (
                      <TouchableOpacity
                        key={`${variant.id}-${index}`}
                        style={[
                          styles.packOption,
                          isActive ? styles.packOptionActive : styles.packOptionIdle,
                        ]}
                        activeOpacity={0.85}
                        onPress={() => {
                          setSelectedVariant(index);
                          console.log('Variant selected:', {
                            index,
                            variantId: variant.id,
                            variantName: variant.name
                          });
                        }}
                      >
                        <Text
                          style={[
                            styles.packOptionTitle,
                            isActive && styles.packOptionTitleActive,
                          ]}
                          numberOfLines={1}
                        >
                          {variant.name}
                        </Text>
                        <Text
                          style={[
                            styles.packOptionPrice,
                            isActive && styles.packOptionPriceActive,
                          ]}
                        >
                          {price}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </>
            )}
            <View>
              <Text style={styles.descriptionTitle}>Description:</Text>
              <RenderHTML
                contentWidth={scale(80)}
                source={{ html: parsedProduct.full_description || 'No description available' }}
              />
            </View>
            <View style={styles.disclaimerBadge}>
              <Text style={styles.disclaimerTitle}>
                Disclaimer: Weight of the vegetables will vary based on their
                packaging which would eventually impact the price of the item
              </Text>
            </View>
            <Text style={styles.disclaimerNote}>
              Note: Paid shipping for order weight above {overweightConfig?.weight}lb
            </Text>
          </View>

          <View style={styles.highlightCard}>
            <Text style={styles.highlightHeading}>
              Why shop from Mart 2 Door?
            </Text>
            {HIGHLIGHTS.map((item, index) => (
              <View key={item.id} style={styles.highlightBlock}>
                <View style={styles.highlightRow}>
                  <View style={styles.highlightIcon}>
                    <Ionicons name={item.icon as any} size={20} color={colors.primaryDark} />
                  </View>
                  <View style={styles.highlightContent}>
                    <Text style={styles.highlightTitle}>{item.title}</Text>
                    <Text style={styles.highlightDescription}>{item.description}</Text>
                  </View>
                </View>
                {index !== HIGHLIGHTS.length - 1 && <View style={styles.highlightDivider} />}
              </View>
            ))}

            <View style={styles.sectionDivider} />

            <Text style={styles.ratingsHeading}>Ratings & Reviews</Text>
            <View style={styles.ratingsContent}>
              <View style={styles.ratingSummary}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.ratingValue}>{overallRating}</Text>
                  <Ionicons name="star" size={28} color={colors.primaryDark} style={{ marginLeft: 4 }} />
                </View>
                <Text style={styles.ratingCustomers}>
                  {parsedProduct.reviews?.length || 0} customers
                </Text>
              </View>

              <View style={styles.ratingBreakdown}>
                {ratingBreakdown.map((item) => {
                  const maxCount = Math.max(...ratingBreakdown.map(r => r.count)) || 1; // avoid division by 0
                  const widthPercent = (item.count / maxCount) * 100;
                  return (
                    <View key={item.id} style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>{item.id}</Text>
                      <Ionicons name="star" size={10} color={'gray'} />
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${widthPercent}%` }]} />
                      </View>
                      <Text style={styles.breakdownValue}>{item.count}</Text>
                    </View>
                  );
                })}
              </View>
            </View>


            <View style={styles.reviewsSection}>
              <Text style={styles.reviewsHeading}>Customer Reviews</Text>

              {parsedProduct.reviews && parsedProduct.reviews.length > 0 ? (
                parsedProduct.reviews.map((review: any, index: number) => (
                  <View key={index} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.reviewRating}>
                        {/* Show stars */}
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Ionicons
                            key={i}
                            name={i < review.stars ? 'star' : 'star-outline'}
                            size={16}
                            color={colors.primaryDark}
                          />
                        ))}
                        <Text style={styles.reviewRatingText}>{review.stars.toFixed(1)}</Text>
                      </View>

                      <Text style={styles.reviewerName}>
                        {review.user?.first_name} {review.user?.last_name}
                      </Text>

                      <Text style={styles.reviewDate}>
                        {/* If you have a date, format it nicely */}
                        {review.date ? `• ${new Date(review.date).toLocaleDateString()}` : ''}
                      </Text>
                    </View>

                    <Text style={styles.reviewTitle}>
                      {review.title || 'Comment'}
                    </Text>

                    <Text style={styles.reviewText}>{review.comment}</Text>
                  </View>
                ))
              ) : (
                <Text style={{ fontFamily: 'MontserratMedium', marginTop: verticalScale(12) }}>
                  No reviews yet.
                </Text>
              )}

              {parsedProduct.reviews && parsedProduct.reviews.length > 0 && (
                <TouchableOpacity style={styles.seeAllReviewsButton}>
                  <Text style={styles.seeAllReviewsText}>
                    See all {parsedProduct.reviews.length} reviews
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.primaryDark} />
                </TouchableOpacity>
              )}
            </View>

          </View>
        </ScrollView>

        {/* Add to Cart Button with Quantity Selector */}
        <View style={styles.addToCartContainer}>
          <View style={styles.addToCartContent}>
            {existingCartItem ? (
              <TouchableOpacity
                style={[styles.addToCartButton, styles.removeButton]}
                onPress={handleRemoveFromCart}
                activeOpacity={0.9}
              >
                <Text style={styles.addToCartText}>
                  Remove from Cart
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.addToCartButton, showQuantitySelector && styles.addedButton]}
                onPress={handleAddToCart}
                activeOpacity={0.9}
              >
                <Text style={styles.addToCartText}>
                  Add to Cart
                </Text>
              </TouchableOpacity>
            )}
            {showQuantitySelector && existingCartItem && (
              <View style={styles.quantitySelector}>
                <TouchableOpacity
                  onPress={() => updateCartQuantity(quantity - 1)}
                  style={[styles.quantityButton, quantity <= 1 && styles.disabledButton]}
                  activeOpacity={0.7}
                  disabled={quantity <= 1}
                >
                  <Ionicons
                    name="remove"
                    size={18}
                    color={quantity <= 1 ? colors.black : colors.white}
                  />
                </TouchableOpacity>

                <Text style={styles.quantityText}>{quantity}</Text>

                <TouchableOpacity
                  onPress={() => updateCartQuantity(quantity + 1)}
                  style={styles.quantityButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={18} color={colors.white} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  seeAllReviewsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 8,
  },
  seeAllReviewsText: {
    color: colors.primaryDark,
    fontFamily: 'InterSemiBold',
    fontSize: moderateScale(14),
    marginRight: 4,
  },
  backgroundImage: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: verticalScale(60),
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#fff',
    marginBottom: 16,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  carouselDots: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: '25%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,

  },
  dotActive: {
    backgroundColor: colors.primaryDark,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  addToCartContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'flex-end',
  },
  addToCartContent: {
    width: '100%',
  },
  quantitySelector: {
    position: 'absolute',
    bottom: verticalScale(70),
    right: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: scale(10),
    paddingHorizontal: scale(8),
    height: scale(36),
    minWidth: scale(80),
    justifyContent: 'space-between',
    zIndex: 1,
  },
  quantityButton: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontFamily: 'InterBold',
    fontSize: moderateScale(12),
    color: colors.white,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: 'gray',
  },
  removeButton: {
    backgroundColor: '#ff4444',
    flex: 1,
    height: verticalScale(50),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addToCartButton: {
    width: '100%',
    backgroundColor: colors.primaryDark,
    borderRadius: scale(12),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(10),
  },
  addedButton: {
    backgroundColor: colors.primaryDark,
  },
  addToCartText: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontFamily: 'PoppinsSemi',
  },
  infoCard: {
    borderRadius: 18,
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(18),
  },
  productTitle: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: moderateScale(16),
    lineHeight: 22,
  },
  descriptionTitle: {
    marginTop: verticalScale(6),
    fontFamily: 'PoppinsMedium',
    fontWeight: 400,
    fontSize: moderateScale(15),
  },
  productSubtitle: {
    marginTop: verticalScale(6),
    fontFamily: 'Montserrat',
    fontWeight: 500,
    fontSize: moderateScale(13),
    lineHeight: 20,
  },
  priceText: {
    fontSize: moderateScale(16),
    marginBottom: verticalScale(16),
    fontFamily: 'Montserrat',
    fontWeight: 600,
  },
  sellerText: {
    marginTop: verticalScale(8),
    fontFamily: ' MontserratMedium',
    fontSize: moderateScale(13),
    color: colors.textPrimary,
  },

  ratingRow: {
    flexDirection: 'row',
    gap: scale(6),
    marginBottom: verticalScale(12),
  },
  ratingScore: {
    fontFamily: 'MontserratMedium',
    fontSize: moderateScale(13),
    color: colors.textPrimary,
  },
  ratingCount: {
    fontFamily: 'InterRegular',
    fontSize: moderateScale(13),
    color: colors.textPrimary,
  },
  packLabel: {
    fontFamily: 'Montserrat',
    fontSize: moderateScale(14),
  },
  variantsContainer: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(4),
    paddingRight: scale(16),
  },
  packOptionsRow: {
    marginTop: verticalScale(12),
  },
  packOption: {
    width: scale(120),
    borderRadius: 12,
    paddingVertical: verticalScale(12),
    borderWidth: 1.5,
    alignItems: 'center',
    marginRight: scale(12),
  },
  packOptionIdle: {
    borderColor: colors.secondaryLight,
  },
  packOptionActive: {
    backgroundColor: colors.secondaryLight,
    borderColor: colors.primaryDark,
  },
  packOptionTitle: {
    fontFamily: 'Montserrat',
    fontSize: moderateScale(14),
    color: '#5F5830',
  },
  packOptionTitleActive: {
    color: '#2F290B',
  },
  packOptionPrice: {
    marginTop: verticalScale(4),
    fontFamily: 'Montserrat',
    fontSize: moderateScale(12),
  },
  packOptionPriceActive: {
    color: '#2F290B',
  },
  disclaimerBadge: {
    marginTop: verticalScale(18),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(12),
  },
  disclaimerTitle: {
    fontFamily: 'MontserratMedium',
    fontSize: moderateScale(12),
    color: colors.primaryDark,
    lineHeight: 18,
  },
  disclaimerNote: {
    marginTop: verticalScale(8),
    fontFamily: 'MontserratMedium',
    fontSize: moderateScale(12),
    color: colors.textPrimary,
  },
  highlightCard: {
    borderRadius: 18,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(18),
  },
  highlightHeading: {
    fontFamily: 'Montserrat',
    fontSize: moderateScale(14),
    marginBottom: verticalScale(12),
  },
  highlightRow: {
    flexDirection: 'row',
  },
  highlightIcon: {
    width: scale(40),
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: verticalScale(2),
  },
  highlightContent: {
    flex: 1,
  },
  highlightTitle: {
    fontFamily: 'Montserrat',
    fontSize: moderateScale(13),
    color: colors.primaryDark,
  },
  highlightDescription: {
    marginTop: verticalScale(6),
    fontFamily: 'MontserratMedium',
    fontSize: moderateScale(12),
    lineHeight: 18,
    color: colors.textPrimary,
  },
  highlightBlock: {
    marginBottom: verticalScale(14),
  },
  highlightDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.12)',
    marginTop: verticalScale(12),
  },
  sectionDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.16)',
    marginVertical: verticalScale(18),
  },
  ratingsHeading: {
    fontFamily: 'Montserrat',
    fontSize: moderateScale(14),
  },
  ratingsContent: {
    flexDirection: 'row',
    marginTop: verticalScale(16),
    gap: scale(18),
  },
  ratingSummary: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: scale(90),
  },
  ratingValue: {
    fontFamily: 'Montserrat',
    fontSize: moderateScale(32),
  },
  ratingCustomers: {
    marginTop: verticalScale(6),
    fontFamily: 'MontserratMedium',
    fontSize: moderateScale(12),
    color: colors.textPrimary,
    textAlign: 'center',
  },
  ratingBreakdown: {
    flex: 1,
    gap: verticalScale(10),
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  breakdownLabel: {
    fontFamily: 'MontserratMedium',
    fontSize: moderateScale(12),
    color: colors.textPrimary,
  },
  progressTrack: {
    flex: 1,
    height: verticalScale(6),
    borderRadius: 6,
    backgroundColor: '#E6E6E6',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#45BF55',
  },
  breakdownValue: {
    width: scale(42),
    textAlign: 'right',
    fontFamily: 'MontserratMedium',
    fontSize: moderateScale(12),
    color: colors.textPrimary,
  },
  reviewsSection: {
    marginTop: verticalScale(24),
    paddingHorizontal: scale(10),
  },
  reviewsHeading: {
    fontFamily: 'Montserrat',
    fontSize: moderateScale(14),
  },
  reviewItem: {
    marginTop: verticalScale(12),
    paddingBottom: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: scale(8),
  },
  reviewRatingText: {
    marginLeft: scale(4),
    fontFamily: 'MontserratMedium',
    fontSize: moderateScale(12),
    color: '#2F2D1E',
  },
  reviewerName: {
    fontFamily: 'MontserratMedium',
    fontSize: moderateScale(12),
    color: '#2F2D1E',
    marginRight: scale(8),
  },
  reviewDate: {
    fontFamily: 'MontserratMedium',
    fontSize: moderateScale(12),
    color: '#7C7754',
  },
  reviewTitle: {
    fontFamily: 'Montserrat',
    fontSize: moderateScale(14),
  },
  reviewText: {
    fontFamily: 'MontserratMedium',
    fontSize: moderateScale(12),
    color: '#2F2D1E',
    lineHeight: moderateScale(16),
  },
});