import Header from '@/components/Header';
import { addToCart, removeFromCart, selectCartItems, updateQuantity } from '@/store/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/useAuth';
import { colors } from '@/theme/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface Product {
  id: number;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  img: any;
  seller: string;
}

const PACK_OPTIONS = [
  { id: 'single', title: 'Single', price: '$3.88' },
  { id: 'pack6', title: 'Pack of 6', price: '$24.70' },
];

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

const RATING_BREAKDOWN = [
  { id: '5', count: 506 },
  { id: '4', count: 127 },
  { id: '3', count: 316 },
  { id: '2', count: 190 },
  { id: '1', count: 126 },
];

const DEFAULT_PRODUCT: Product = {
  id: 1,
  name: 'RITZ Fresh Stacks Original Crackers,\nFamily Size, 17.8 oz',
  subtitle: '',
  category: '',
  price: 3.88,
  img: require('../assets/images/Ritz.png'),
  seller: 'Fresh Mart',
};

const Product = () => {
  const { product: productParam } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const productString = Array.isArray(productParam) ? productParam[0] : productParam;

  const product: Product = useMemo(() => {
    if (!productString) {
      return DEFAULT_PRODUCT;
    }

    try {
      const parsed = JSON.parse(productString as string);
      return {
        ...DEFAULT_PRODUCT,
        ...parsed,
      };
    } catch (error) {
      console.warn('Failed to parse product param', error);
      return DEFAULT_PRODUCT;
    }
  }, [productString]);

  const [selectedPack, setSelectedPack] = useState('single');
  const [quantity, setQuantity] = useState(1);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);

  const existingCartItem = useMemo(
    () => cartItems.find((item) => item.id === product.id),
    [cartItems, product.id]
  );

  useEffect(() => {
    if (existingCartItem) {
      setQuantity(existingCartItem.quantity);
      setShowQuantitySelector(true);
    } else {
      setQuantity(1);
      setShowQuantitySelector(false);
    }
  }, [existingCartItem]);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        seller: product.seller,
        quantity: 1, 
      })
    );
    setQuantity(1);
    setShowQuantitySelector(true);
  };

  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    dispatch(updateQuantity({ id: product.id, quantity: newQuantity }));
  };

  const decrementQuantity = () => {
    const newQuantity = quantity - 1;
    if (newQuantity <= 0) {
      dispatch(removeFromCart(product.id));
      setQuantity(1);
      setShowQuantitySelector(false);
      return;
    }

    setQuantity(newQuantity);
    dispatch(updateQuantity({ id: product.id, quantity: newQuantity }));
  };
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
            <Image
              source={product?.img || require('../assets/images/Ritz.png')}
              style={styles.productImage}
              resizeMode="contain"
            />
            <View style={styles.carouselDots}>
              {[0, 1, 2, 3, 4].map((dot) => (
                <View
                  key={dot}
                  style={[styles.dot, dot === 1 ? styles.dotActive : undefined]}
                />
              ))}
            </View>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.productTitle}>
              {product.name}
            </Text>
            {!!product.subtitle && (
              <Text style={styles.productSubtitle}>{product.subtitle}</Text>
            )}
            <Text style={styles.sellerText}>Sold by {product.seller}</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.priceText}>${product.price.toFixed(2)}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={18} color={colors.primaryDark} />
                <Text style={styles.ratingScore}>(4.4)</Text>
                <Text style={styles.ratingCount}>1079 reviews</Text>
              </View>
            </View>

            <Text style={styles.packLabel}>Pack Size: Single</Text>
            <View style={styles.packOptionsRow}>
              {PACK_OPTIONS.map((option) => {
                const isActive = option.id === selectedPack;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.packOption,
                      isActive ? styles.packOptionActive : styles.packOptionIdle,
                    ]}
                    activeOpacity={0.85}
                    onPress={() => setSelectedPack(option.id)}
                  >
                    <Text
                      style={[
                        styles.packOptionTitle,
                        isActive && styles.packOptionTitleActive,
                      ]}
                    >
                      {option.title}
                    </Text>
                    <Text
                      style={[
                        styles.packOptionPrice,
                        isActive && styles.packOptionPriceActive,
                      ]}
                    >
                      {option.price}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.disclaimerBadge}>
              <Text style={styles.disclaimerTitle}>
                Disclaimer: Weight of the vegetables will vary based on their
                packaging which would eventually impact the price of the item
              </Text>
            </View>
            <Text style={styles.disclaimerNote}>
              Note: Paid shipping for order weight above 25lb
            </Text>
          </View>

          <View style={styles.highlightCard}>
            <Text style={styles.highlightHeading}>
              Why shop from Buzz 2 Door?
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
                  <Text style={styles.ratingValue}>4.4</Text>
                  <Ionicons name="star" size={28} color={colors.primaryDark} style={{ marginLeft: 4 }} />
                </View>
                <Text style={styles.ratingCustomers}>1267 customers</Text>
              </View>

              <View style={styles.ratingBreakdown}>
                {RATING_BREAKDOWN.map((item) => {
                  const maxReviewCount = Math.max(...RATING_BREAKDOWN.map(r => r.count));
                  const widthPercent = (item.count / maxReviewCount) * 100;
                  return (
                    <View key={item.id} style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>{item.id}</Text>
                      <Ionicons name="star" size={10} color={'gray'} />
                      <View style={styles.progressTrack}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${widthPercent}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.breakdownValue}>{item.count}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.reviewsSection}>
              <Text style={styles.reviewsHeading}>Customer Reviews</Text>

              <View style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewRating}>
                    <Ionicons name="star" size={16} color={colors.primaryDark} />
                    <Text style={styles.reviewRatingText}>5.0</Text>
                  </View>
                  <Text style={styles.reviewerName}>John D.</Text>
                  <Text style={styles.reviewDate}>• 2 days ago</Text>
                </View>
                <Text style={styles.reviewTitle}>Amazing taste and quality!</Text>
                <Text style={styles.reviewText}>
                  These crackers are absolutely delicious! Perfectly crispy and buttery.
                  Will definitely buy again. The family size is perfect for sharing.
                </Text>
              </View>

              <View style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewRating}>
                    <Ionicons name="star" size={16} color={colors.primaryDark} />
                    <Text style={styles.reviewRatingText}>4.0</Text>
                  </View>
                  <Text style={styles.reviewerName}>Sarah M.</Text>
                  <Text style={styles.reviewDate}>• 1 week ago</Text>
                </View>
                <Text style={styles.reviewTitle}>Great value for money</Text>
                <Text style={styles.reviewText}>
                  Good quality crackers at a reasonable price. The pack arrived
                  in perfect condition. The taste is great, though I wish they
                  were a bit less salty.
                </Text>
              </View>

              <TouchableOpacity style={styles.seeAllReviewsButton}>
                <Text style={styles.seeAllReviewsText}>See all 1,079 reviews</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.primaryDark} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Add to Cart Button with Quantity Selector */}
        <View style={styles.addToCartContainer}>
          <View style={styles.addToCartContent}>
            <TouchableOpacity
              style={[styles.addToCartButton, showQuantitySelector && styles.addedButton]}
              onPress={handleAddToCart}
              activeOpacity={0.9}
            >
              <Text style={styles.addToCartText}>
                Add to Cart
              </Text>
            </TouchableOpacity>
            
            {showQuantitySelector && (
              <View style={styles.quantitySelector}>
                <TouchableOpacity
                  onPress={decrementQuantity}
                  style={styles.quantityButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={18} color={colors.white} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  onPress={incrementQuantity}
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

export default Product;

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
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },
  productImage: {
    width: scale(200),
    height: verticalScale(250),
    resizeMode: 'contain',
  },
  carouselDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  dotActive: {
    backgroundColor: colors.primaryDark,
    width: 24,
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
    fontWeight:600,
    fontSize: moderateScale(16),
    lineHeight: 22,
  },
  productSubtitle: {
    marginTop: verticalScale(6),
    fontFamily: 'Montserrat',
    fontWeight:500,
    fontSize: moderateScale(13),
    lineHeight: 20,
  },
  priceText: {
    fontSize: moderateScale(16),
    marginBottom: verticalScale(16),
    fontFamily: 'Montserrat',
    fontWeight:600,
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
  packOptionsRow: {
    flexDirection: 'row',
    gap: scale(12),
    marginTop: verticalScale(12),
  },
  packOption: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: verticalScale(12),
    borderWidth: 1.5,
    alignItems: 'center',
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
    height:1,
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
    fontSize: moderateScale(11),
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