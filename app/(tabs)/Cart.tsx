import Header from '@/components/Header';
import { CartItem, removeFromCart, selectCartItems, selectCartTotalPrice, updateQuantity } from '@/store/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/useAuth';
import { colors } from '@/theme/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

type SellerGroup = {
  seller: string;
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
};

export default function Cart() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const cartTotalPrice = useAppSelector(selectCartTotalPrice);
  const [deliveryType, setDeliveryType] = useState<'express' | 'regular'>('express');
  const [scheduled, setScheduled] = useState(false);
  const [selectedTip, setSelectedTip] = useState<'10' | '15' | '20' | 'other'>('10');
  const [customTip, setCustomTip] = useState('');
  const [additionalComments, setAdditionalComments] = useState(
    'Please leave the package at the front door.'
  );

  const sellerGroups = useMemo<SellerGroup[]>(() => {
    const map = new Map<string, SellerGroup>();
    cartItems.forEach((item) => {
      if (!map.has(item.seller)) {
        map.set(item.seller, {
          seller: item.seller,
          items: [],
          totalQuantity: 0,
          totalPrice: 0,
        });
      }
      const group = map.get(item.seller)!;
      group.items.push(item);
      group.totalQuantity += item.quantity;
      group.totalPrice += item.price * item.quantity;
    });
    return Array.from(map.values());
  }, [cartItems]);

  const [activeSellerId, setActiveSellerId] = useState<string>(
    sellerGroups[0]?.seller ?? ''
  );

  useEffect(() => {
    if (sellerGroups.length === 0) {
      setActiveSellerId('');
      return;
    }
    if (!sellerGroups.some((group) => group.seller === activeSellerId)) {
      setActiveSellerId(sellerGroups[0].seller);
    }
  }, [sellerGroups, activeSellerId]);

  const cartIsEmpty = cartItems.length === 0;

  const handleSelectSeller = (sellerId: string) => {
    setActiveSellerId(sellerId);
  };

  const handleAdjustQuantity = (item: CartItem, delta: number) => {
    const nextQuantity = item.quantity + delta;
    if (nextQuantity <= 0) {
      dispatch(removeFromCart(item.id));
    } else {
      dispatch(updateQuantity({ id: item.id, quantity: nextQuantity }));
    }
  };

  const tipSummary = useMemo(() => {
    if (selectedTip === 'other') {
      const value = parseFloat(customTip);
      if (!isNaN(value) && value > 0) {
        return `$${value.toFixed(2)} tip added`;
      }
      return 'No tip added';
    }
    const percentage = Number(selectedTip) / 100;
    const amount = cartTotalPrice * percentage;
    return `$${amount.toFixed(2)} tip added`;
  }, [selectedTip, customTip, cartTotalPrice]);

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <ImageBackground
        source={require('../../assets/images/background2.png')}
        style={styles.backgroundImage}
      >
        <Header title="Cart" showDefaultIcons={false} />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.pageHeader}>
            <Text style={styles.headline}>Multiple sellers&apos; items in cart.</Text>
            <Text style={styles.subHeadline}>
              Checkout is limited to one seller at a time.
            </Text>
          </View>

          {cartIsEmpty ? (
            <View style={styles.emptyState}>
              <Image
                source={require('../../assets/images/bag.png')}
                style={styles.emptyIllustration}
              />
              <Text style={styles.emptyTitle}>Your cart is empty</Text>
              <Text style={styles.emptyText}>
                Browse products and add items from different sellers to see them here.
              </Text>
            </View>
          ) : (
            <>
              {sellerGroups.map((seller) => {
                const isActive = seller.seller === activeSellerId;
                return (
                  <TouchableOpacity
                    key={seller.seller}
                    activeOpacity={0.9}
                    onPress={() => handleSelectSeller(seller.seller)}
                    style={[
                      styles.sellerCard,
                      isActive && styles.sellerCardActive,
                    ]}
                  >
                    <View style={styles.sellerHeader}>
                      <View style={styles.radioWrapper}>
                        <View
                          style={[
                            styles.radioOuter,
                            isActive && styles.radioOuterActive,
                          ]}
                        >
                          <View
                            style={[
                              styles.radioInner,
                              isActive && styles.radioInnerActive,
                            ]}
                          />
                        </View>
                      </View>
                      <View style={styles.sellerInfo}>
                        <Text style={styles.sellerName}>{seller.seller}</Text>
                        {!isActive && (
                          <Text style={styles.sellerMeta}>
                            {seller.items.length} products • {seller.totalQuantity} items
                          </Text>
                        )}
                      </View>
                      <Ionicons
                        name={isActive ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color="#7C7754"
                      />
                    </View>

                    {isActive && (
                      <View style={styles.itemsContainer}>
                        {seller.items.map((item, index) => (
                          <View
                            key={item.id}
                            style={[
                              styles.cartItem,
                              index !== seller.items.length - 1 && styles.cartItemDivider,
                            ]}
                          >
                            <Image source={item.img} style={styles.itemImage} />
                            <View style={styles.itemDetails}>
                              <Text style={styles.itemName}>{item.name}</Text>
                              <Text style={styles.itemPrice}>
                                ${item.price.toFixed(2)}
                              </Text>
                            </View>
                            <View style={styles.quantityControls}>
                              <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => handleAdjustQuantity(item, -1)}
                              >
                                <Text style={styles.quantityButtonText}>-</Text>
                              </TouchableOpacity>
                              <View style={styles.quantityValueWrapper}>
                                <Text style={styles.quantityValue}>
                                  {item.quantity.toString().padStart(2, '0')}
                                </Text>
                              </View>
                              <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => handleAdjustQuantity(item, 1)}
                              >
                                <Text style={styles.quantityButtonText}>+</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}

              <View style={styles.disclaimerCard}>
                <Text style={styles.disclaimerText}>
                  <Text style={styles.disclaimerTitle}>Disclaimer: </Text>
                  Weight of the vegetables will vary based on their packaging which would
                  eventually impact the price of the item
                </Text>
              </View>
            </>
          )}

          {!cartIsEmpty && (
            <>
              <View style={styles.deliverySection}>
                <Text style={styles.sectionHeading}>Delivery type</Text>
                <View style={styles.deliveryTypeRow}>
                  {[
                    { id: 'express', label: 'Express (24 hrs)' },
                    { id: 'regular', label: 'Regular (1-2 days)' },
                  ].map((option) => {
                    const isActive = deliveryType === option.id;
                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={[
                          styles.deliveryChip,
                          isActive ? styles.deliveryChipActive : styles.deliveryChipIdle,
                        ]}
                        activeOpacity={0.85}
                        onPress={() => setDeliveryType(option.id as 'express' | 'regular')}
                      >
                        <Text
                          style={[
                            styles.deliveryChipLabel,
                            isActive && styles.deliveryChipLabelActive,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.scheduleButton}>
                  <Ionicons name="time-outline" size={18} />
                  <Text style={styles.scheduleButtonLabel}>Schedule delivery</Text>
                </View>
              </View>

              <View style={styles.addressSection}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionHeading}>Deliver this order to</Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.linkText}>Change</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.addressLabel}>
                  Home (456 Elm Street, Apt 12B, Los Angeles CA, 90001, United States)
                </Text>
              </View>

              <View style={styles.tipsSection}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionHeading}>Add tip to Driver</Text>
                  <View style={styles.tipInfoRow}>
                    <Text style={styles.tipInfoText}>{tipSummary}</Text>
                    <Ionicons name="information-circle-outline" size={16} color={colors.primaryDark} />
                  </View>
                </View>
                <View style={styles.tipButtonsRow}>
                  {[
                    { id: '10', label: '10%' },
                    { id: '15', label: '15%' },
                    { id: '20', label: '20%' },
                  ].map((option) => {
                    const isActive = selectedTip === option.id;
                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={[
                          styles.tipButton,
                          isActive ? styles.tipButtonActive : styles.tipButtonIdle,
                        ]}
                        activeOpacity={0.85}
                        onPress={() => setSelectedTip(option.id as typeof selectedTip)}
                      >
                        <Text
                          style={[
                            styles.tipButtonLabel,
                            isActive && styles.tipButtonLabelActive,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <View style={[styles.tipButtonsRow, { marginTop: 8, gap: 8 }]}>
                  <TouchableOpacity
                    style={[
                      styles.tipButton,
                      selectedTip === 'other' ? styles.tipButtonActive : styles.tipButtonIdle,
                      { flex: 1, maxWidth: scale(95) }
                    ]}
                    activeOpacity={0.85}
                    onPress={() => setSelectedTip('other')}
                  >
                    <Text
                      style={[
                        styles.tipButtonLabel,
                        selectedTip === 'other' && styles.tipButtonLabelActive,
                      ]}
                    >
                      Others
                    </Text>
                  </TouchableOpacity>
                  {selectedTip === 'other' && (
                    <TextInput
                      value={customTip}
                      onChangeText={setCustomTip}
                      placeholder="Enter amount"
                      placeholderTextColor="#A7A7A7"
                      keyboardType="decimal-pad"
                      style={[styles.customTipInput, { flex: 1 }]}
                    />
                  )}
                </View>
              </View>

              <View style={styles.commentsSection}>
                <Text style={styles.sectionHeading}>Additional delivery comments</Text>
                <TextInput
                  multiline
                  numberOfLines={4}
                  value={additionalComments}
                  onChangeText={setAdditionalComments}
                  placeholder="Add delivery instructions for the driver"
                  placeholderTextColor="#A7A7A7"
                  style={styles.commentsInput}
                  textAlignVertical="top"
                /> 
              </View>
              <View style={styles.orderSummary}> 
                <Text style={styles.sectionPriceDetails}>Price Details</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    Products({sellerGroups.find(s => s.seller === activeSellerId)?.items.reduce((sum, item) => sum + item.quantity, 0) || 0} items)
                  </Text>
                  <Text style={styles.summaryValue}>
                    ${sellerGroups.find(s => s.seller === activeSellerId)?.totalPrice.toFixed(2) || '0.00'}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery Fee</Text>
                  <Text style={styles.summaryValue}>${deliveryType === 'express' ? '49.00' : '29.00'}</Text>
                </View> 
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tax</Text>
                  <Text style={styles.summaryValue}>${(cartTotalPrice * 0.18).toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tip</Text>
                  <Text style={styles.summaryValue}>
                    {selectedTip === 'other' 
                      ? `$${customTip || '0.00'}`
                      : `$${(cartTotalPrice * (parseInt(selectedTip) / 100)).toFixed(2)}`}
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>
                    ${(
                      (sellerGroups.find(s => s.seller === activeSellerId)?.totalPrice || 0) + 
                      (deliveryType === 'express' ? 49 : 29) + 
                      (cartTotalPrice * 0.18) + // Add GST
                      (selectedTip === 'other' 
                        ? parseFloat(customTip) || 0 
                        : cartTotalPrice * (parseInt(selectedTip) / 100))
                    ).toFixed(2)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.placeOrderButton}
                activeOpacity={0.9}
                onPress={() => {
                  // Handle place order logic here
                  console.log('Placing order...');
                }}
              >
                <Text style={styles.placeOrderButtonText}>Place Order</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(140),
    paddingTop: verticalScale(16),
    gap: verticalScale(16),
  },
  pageHeader: {
    gap: verticalScale(6),
  },
  headline: {
    fontFamily: 'Montserrat',
    fontSize: moderateScale(16),
    color: '#2F2D1E',
  },
  subHeadline: {
    fontFamily: 'InterRegular',
    fontSize: moderateScale(12),
    color: '#7C7754',
  },
  sellerCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sellerCardActive: {
    borderColor: '#e0e0e0',
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioWrapper: {
    marginRight: scale(10),
  },
  radioOuter: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: '#D9D5BE',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(10),
    borderColor:colors.white,
    borderWidth:1
  },
  radioOuterActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  radioInnerActive: {
    backgroundColor: '#FFFFFF', 
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontFamily: 'PoppinsSemi',
    fontSize: moderateScale(14),
    color: '#2F2D1E',
  },
  sellerMeta: {
    fontFamily: 'InterRegular',
    fontSize: moderateScale(11),
    color: '#9E9970',
    marginTop: verticalScale(2),
  },
  itemsContainer: {
    marginTop: verticalScale(16),
    gap: verticalScale(12),
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  cartItemDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  itemImage: {
    width: scale(52),
    height: scale(52),
    borderRadius: 12,
    marginRight: scale(12),
  },
  itemDetails: {
    flex: 1,
    gap: verticalScale(6),
  },
  itemName: {
    fontFamily: 'InterRegular',
    fontSize: moderateScale(12),
    color: '#2F2D1E',
    lineHeight: 18,
  },
  itemPrice: {
    fontFamily: 'Montserrat',
    fontSize: moderateScale(13),
    color: '#2F2D1E',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    backgroundColor: colors.primaryDark,
    borderRadius: scale(8),
    paddingHorizontal: scale(4),
    paddingVertical: verticalScale(4),
  }, 
  quantityButton: {
    width: scale(14),
    height: scale(24),
    borderRadius: scale(12), 
    alignItems: 'center',
    justifyContent: 'center', 
  },
  quantityButtonText: {
    fontFamily: 'PoppinsSemi',
    fontSize: moderateScale(14),
    color: colors.white,
  },
  quantityValueWrapper: {
    minWidth: scale(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: {
    fontFamily: 'PoppinsSemi',
    fontSize: moderateScale(12),
    color: colors.white,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(48),
    gap: verticalScale(16),
  },
  emptyIllustration: {
    width: scale(90),
    height: scale(90),
    resizeMode: 'contain',
  },
  emptyTitle: {
    fontFamily: 'Montserrat',
    fontSize: moderateScale(18),
    color: '#2F2D1E',
  },
  emptyText: {
    fontFamily: 'InterRegular',
    fontSize: moderateScale(12),
    color: '#7C7754',
    textAlign: 'center',
    width: scale(240),
  },
  disclaimerCard: {
    paddingHorizontal: scale(16),
  },
  disclaimerTitle: {
    fontFamily: 'Montserrat', 
    fontSize: moderateScale(13),
    color: colors.primaryDark,
  },
  disclaimerText: {
    fontFamily: 'InterRegular',
    fontSize: moderateScale(12),
    color: colors.primaryDark, 
    lineHeight: 18,
  },
  deliverySection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: verticalScale(20),
  },
  sectionHeading: {
    fontFamily: 'Montserrat',
    fontSize: moderateScale(14),
    color: '#2F2D1E',
  },
  deliveryTypeRow: {
    flexDirection: 'row',
    gap: scale(12),
  },
  deliveryChip: {
    flex: 1,
    borderRadius: scale(10),
    paddingVertical: verticalScale(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginTop: verticalScale(8),
  },
  deliveryChipIdle: {
    borderColor: '#D9D5BE',
    backgroundColor: '#FFFFFF',
  },
  deliveryChipActive: {
    borderColor: colors.primaryDark,
    backgroundColor: colors.secondaryLight,
  },
  deliveryChipLabel: {
    fontFamily: 'InterRegular',
    fontSize: moderateScale(13),
  },
  deliveryChipLabelActive: {
    color: colors.black,
    fontFamily: 'InterBold',
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginTop: verticalScale(8),
    paddingVertical: verticalScale(8),
  },

  scheduleButtonLabel: {
    fontFamily: 'InterRegular',
    fontSize: moderateScale(13),
  },
  addressSection: {
    paddingTop: verticalScale(20),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkText: {
    fontFamily: 'InterSemiBold',
    fontSize: moderateScale(12),
    color: colors.primaryDark,
  },
  addressLabel: {
    fontFamily: 'InterRegular',
    fontSize: moderateScale(12),
    color: '#2F2D1E',
    lineHeight: 18,
  },
  tipsSection: {
    marginTop: verticalScale(20),
    paddingTop: verticalScale(20),
    borderTopWidth: 1, 
    borderTopColor: '#f0f0f0',
  },
  tipInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  tipInfoText: {
    fontFamily: 'InterRegular',
    fontSize: moderateScale(12),
    color: colors.primaryDark,
  },
  tipButtonsRow: {
    marginTop: verticalScale(12),
    flexDirection: 'row',
    gap: scale(12),
  },
  tipButton: {
    flex: 1,
    borderRadius: scale(12),
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    borderWidth: 1,
  },
  tipButtonIdle: {
    borderColor: '#D9D5BE',
    backgroundColor: '#FFFFFF',
  },
  tipButtonActive: {
    borderColor: colors.primaryDark,
    backgroundColor: '#FFE49A',
  },
  tipButtonLabel: {
    fontFamily: 'InterRegular',
    fontSize: moderateScale(13),
  },
  tipButtonLabelActive: {
    fontFamily: 'InterBold',
  },
  customTipInput: {
    borderWidth: 1,
    borderColor: '#D9D5BE',
    borderRadius: scale(10),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    fontFamily: 'InterRegular',
    fontSize: moderateScale(13),
    color: '#2F2D1E',
  },
  commentsSection: {
    marginTop: verticalScale(10),
    paddingTop: verticalScale(20),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: verticalScale(10),
    marginBottom: verticalScale(12),
  },
  commentsInput: {
    backgroundColor: '#F9F9F9',
    borderRadius: scale(12), 
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(14) ,
    fontFamily: 'InterRegular',
    fontSize: moderateScale(14),
    minHeight: verticalScale(120),
  },
  orderSummary: { 
    padding: scale(12),
    marginBottom: verticalScale(16),
    borderTopWidth: 1,
  borderTopColor: '#f0f0f0',
    paddingTop: verticalScale(20),
  },
  sectionPriceDetails: {
    fontFamily: 'InterBold',
    fontSize: moderateScale(12),
    color: '#333333',
    marginBottom: verticalScale(12),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
  },
  summaryLabel: { 
    fontFamily: 'InterRegular',
    fontSize: moderateScale(14),
    color: '#666666',
  },
  summaryValue: {
    fontFamily: 'InterMedium',
    fontSize: moderateScale(14),
    color: '#333333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: verticalScale(12),
    marginTop: verticalScale(4),
  },
  totalLabel: {
    fontFamily: 'InterBold',
    fontSize: moderateScale(16),
    color: '#333333',
  },
  totalValue: {
    fontFamily: 'InterBold',
    fontSize: moderateScale(16),
    color: colors.primaryDark,
  },
  placeOrderButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: scale(8),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
    justifyContent: 'center', 
  },
  placeOrderButtonText: {
    color: 'white',
    fontFamily: 'InterSemiBold',
    fontSize: moderateScale(14),
  },
});