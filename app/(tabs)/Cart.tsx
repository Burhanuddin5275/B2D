import Header from '@/components/Header';
import { Address, fetchAddresses } from '@/service/address';
import { addOrUpdateCart, fetchCart, removeFromCartApi } from '@/service/cart';
import { placeOrderApi } from '@/service/order';
import { useAppSelector } from '@/store/useAuth';
import { colors } from '@/theme/colors';
import { API_URL } from '@/url/Api_Url';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
interface CartItem {
  id: number;
  quantity: number;
  price: number;
  store: {
    id: number;
    name: string;
  };
  product: {
    id: number;
    name: string;
    slug: string;
    product_images: {
      id: number;
      image: string;
    }[];
  };
  variation: {
    id: number;
    name: string;
    image: string;
  } | null;
}
type SellerGroup = {
  seller: string;
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
};
export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAppSelector((s) => s.auth);
  const token = auth.token;
  const insets = useSafeAreaInsets();
  const [deliveryType, setDeliveryType] = useState<'express' | 'regular'>('express');
  const [deliverySlots, setDeliverySlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const CUTOFF_TIME = "6:00 PM";
  const [selectedTip, setSelectedTip] = useState<'10' | '15' | '20' | 'other'>('10');
  const [customTip, setCustomTip] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'credit' | 'debit' | 'square'>('credit');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoading(true);
        if (token) {
          const data = await fetchCart(token);
          setCartItems(data);
        }
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, [token]);

  const incrementQuantity = async (item: CartItem) => {
    if (!token) return;

    const newQty = item.quantity + 1;

    try {
      await addOrUpdateCart(token, {
        id: item.id,
        product: item.product.id,
        quantity: newQty,
        variation: item.variation?.id,
      });

      const updatedCart = await fetchCart(token);
      setCartItems(updatedCart);
    } catch (e) {
      console.error('Increment error:', e);
    }
  };
  const decrementQuantity = async (item: CartItem) => {
    if (!token) return;

    const newQty = item.quantity - 1;

    try {
      if (newQty <= 0) {
        await removeFromCartApi(token, item.id);
      } else {
        await addOrUpdateCart(token, {
          id: item.id,
          product: item.product.id,
          quantity: newQty,
          variation: item.variation?.id,
        });
      }

      const updatedCart = await fetchCart(token);
      setCartItems(updatedCart);
    } catch (e) {
      console.error('Decrement error:', e);
    }
  };

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const res = await fetchAddresses(token || '');
        setAddresses(res.data);

        const defaultAddress = res.data.find((addr: any) => addr.is_default);

        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }

        else if (res.data.length > 0) {
          setSelectedAddress(res.data[0]);
        }
      } catch (error) {
        console.log('Address fetch error:', error);
      }
    };

    loadAddresses();
  }, [token]);


  const cartTotalPrice = useMemo(() =>
    cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
    [cartItems]
  );
  const isAuthenticated = !!auth?.token;
  const sellerGroups = useMemo<SellerGroup[]>(() => {
    const map = new Map<string, SellerGroup>();
    cartItems.forEach((item) => {
      const sellerName = item.store?.name || 'Unknown Seller';
      if (!map.has(sellerName)) {
        map.set(sellerName, {
          seller: sellerName,
          items: [],
          totalQuantity: 0,
          totalPrice: 0
        });
      }
      const group = map.get(sellerName)!;
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
  const handleSelectSeller = (sellerId: string) => setActiveSellerId(sellerId);

  useEffect(() => {
    if (deliveryType === 'regular') {
      const slots = [];
      const today = new Date();
      for (let i = 1; i <= 7; i++) {
        const d = new Date();
        d.setDate(today.getDate() + i);
        slots.push(d.toDateString());
      }
      setDeliverySlots(slots);
    } else {
      setDeliverySlots([]);
    }
  }, [deliveryType]);
  const activeSeller = sellerGroups.find((g) => g.seller === activeSellerId);
  const subtotal = activeSeller?.totalPrice ?? 0;
  const deliveryFee = deliveryType === 'express' ? 20 : 12;
  const tipAmount =
    selectedTip === 'other'
      ? parseFloat(customTip) || 0
      : subtotal * (parseInt(selectedTip, 10) / 100);
  const taxAmount = subtotal * 0.18;
  const payableTotal = subtotal + deliveryFee + tipAmount + taxAmount;
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return;

    setIsPlacingOrder(true);
    setOrderError(null);

    const now = new Date();
    const scheduleDate = new Date(now);

    if (deliveryType === 'regular' && selectedSlot) {
      const slotDate = new Date(selectedSlot);
      scheduleDate.setTime(slotDate.getTime());
    } else {
      scheduleDate.setHours(now.getHours() + 1);
    }

    const formattedDate = scheduleDate.toISOString();

    const orderData = {
      cart_ids: activeSeller?.items.map(item => item.id) || [],
      delivery_type: deliveryType,
      schedule_order: formattedDate,
      address_id: selectedAddress?.id,
      driver_tip: selectedTip === 'other' ? customTip : `${selectedTip}%`,
      delivery_instructions: deliveryInstructions,
      payment_type:
        selectedPaymentMethod === 'credit'
          ? 'Credit Card'
          : selectedPaymentMethod === 'debit'
            ? 'Debit Card'
            : 'Marketplace Square Payment',
    };

    try {
      console.log('send order data:', orderData);

      const responseData = await placeOrderApi(token!, orderData);
      alert(responseData.message);
      console.log('Order placed successfully:', responseData);
 
      setIsPaymentModalVisible(false);

      router.push({ 
        pathname: '/(tabs)/Order',
        params: {
          orderPlaced: 'true',
          orderId: responseData.order_id?.toString() || '',
        },
      });
    } catch (error: any) {
      console.error('Error placing order:', error);
      setOrderError(error?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };
  return (
    <SafeAreaView style={[styles.safeArea, { paddingBottom: insets.bottom }]}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.backgroundImage}
      >
        <Header title="Cart" showDefaultIcons={false} />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.pageHeader}>
            <Text style={styles.headline}>Multiple sellers' items in cart.</Text>
            <Text style={styles.subHeadline}>
              Checkout is limited to one seller at a time.
            </Text>
          </View>
          {/* EMPTY STATE */}
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
              {/* SELLERS */}
              {sellerGroups.map((seller) => {
                const isActive = seller.seller === activeSellerId;
                return (
                  <TouchableOpacity
                    key={seller.seller}
                    onPress={() => handleSelectSeller(seller.seller)}
                    style={[styles.sellerCard, isActive && styles.sellerCardActive]}
                  >
                    <View style={styles.sellerHeader}>
                      <View style={styles.radioWrapper}>
                        <View
                          style={[styles.radioOuter, isActive && styles.radioOuterActive]}
                        >
                          {isActive && <View style={styles.radioInner} />}
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
                              index !== seller.items.length - 1 && styles.cartItemDivider
                            ]}
                          >
                            <Image
                              source={{ uri: item.product?.product_images?.[0]?.image || '' }}
                              style={styles.itemImage}
                              resizeMode="contain"
                            />
                            <View style={styles.itemDetails}>
                              <Text style={styles.itemName} numberOfLines={2}>{item.product?.name}</Text>
                              {item.variation?.name && (
                                <Text style={styles.itemName} numberOfLines={1}>{item.variation?.name}</Text>
                              )}
                              <Text style={styles.itemPrice}>
                                ${(item.price * item.quantity).toFixed(2)}
                              </Text>
                            </View>
                            <View style={styles.quantityControls}>
                              <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => decrementQuantity(item)}
                              >
                                <Text style={styles.quantityButtonText}>−</Text>
                              </TouchableOpacity>

                              <View style={styles.quantityValueWrapper}>
                                <Text style={styles.quantityValue}>
                                  {String(item.quantity).padStart(2, '0')}
                                </Text>
                              </View>

                              <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => incrementQuantity(item)}
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

              {/* DISCLAIMER */}
              <View style={styles.disclaimerCard}>
                <Text style={styles.disclaimerText}>
                  <Text style={styles.disclaimerTitle}>Disclaimer: </Text>
                  Weight of the vegetables varies based on packaging which affects price.
                </Text>
              </View>

              {/* DELIVERY SECTION */}
              <View style={styles.deliverySection}>
                <Text style={styles.sectionHeading}>Delivery type</Text>

                <View style={styles.deliveryTypeRow}>
                  <TouchableOpacity
                    style={[
                      styles.deliveryChip,
                      deliveryType === 'express'
                        ? styles.deliveryChipActive
                        : styles.deliveryChipIdle
                    ]}
                    onPress={() => setDeliveryType('express')}
                  >
                    <Text
                      style={[
                        styles.deliveryChipLabel,
                        deliveryType === 'express' && styles.deliveryChipLabelActive
                      ]}
                    >
                      Express
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.deliveryChip,
                      deliveryType === 'regular'
                        ? styles.deliveryChipActive
                        : styles.deliveryChipIdle
                    ]}
                    onPress={() => setDeliveryType('regular')}
                  >
                    <Text
                      style={[
                        styles.deliveryChipLabel,
                        deliveryType === 'regular' && styles.deliveryChipLabelActive
                      ]}
                    >
                      Regular
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* CUTOFF NOTICE */}
                <Text style={{ marginTop: 10, fontFamily: 'PoppinsMedium' }}>
                  Orders after <Text style={{ fontWeight: '600' }}>{CUTOFF_TIME}</Text>{' '}
                  move to the next available day.
                </Text>

                {deliveryType === 'regular' && (
                  <View style={{ marginTop: 12 }}>
                    {deliverySlots.map((slot) => (
                      <TouchableOpacity
                        key={slot}
                        style={[
                          styles.slotItem,
                          selectedSlot === slot && styles.slotItemSelected,
                        ]}
                        onPress={() => setSelectedSlot(slot)}
                      >
                        <Text style={styles.slotLabel}>{slot}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* ADDRESS */}
              <View style={styles.addressSection}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionHeading}>Deliver this order to</Text>

                  <TouchableOpacity onPress={() => setIsAddressModalVisible(true)}>
                    <Text style={styles.linkText}>Change</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.addressLabel}>
                  {selectedAddress?.address_name}: {selectedAddress?.address_line1}
                </Text>
                <Text style={styles.addressLabel}>{selectedAddress?.state}, {selectedAddress?.city}, {selectedAddress?.postal_code}</Text>
              </View>

              {/* TIP */}
              <View style={styles.tipsSection}>
                <Text style={styles.sectionHeading}>Add tip for driver</Text>

                <View style={styles.tipButtonsRow}>
                  {['10', '15', '20'].map((percent) => (
                    <TouchableOpacity
                      key={percent}
                      onPress={() =>
                        setSelectedTip(percent as '10' | '15' | '20')
                      }
                      style={[
                        styles.tipButton,
                        selectedTip === percent
                          ? styles.tipButtonActive
                          : styles.tipButtonIdle
                      ]}
                    >
                      <Text
                        style={[
                          styles.tipButtonLabel,
                          selectedTip === percent && styles.tipButtonLabelActive
                        ]}
                      >
                        {percent}%
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* CUSTOM TIP */}
                <View style={[styles.tipButtonsRow, { marginTop: 8, gap: 8 }]}>
                  <TouchableOpacity
                    onPress={() => setSelectedTip('other')}
                    style={[
                      styles.tipButton,
                      selectedTip === 'other'
                        ? styles.tipButtonActive
                        : styles.tipButtonIdle,
                      { flex: 1, maxWidth: 100 }
                    ]}
                  >
                    <Text
                      style={[
                        styles.tipButtonLabel,
                        selectedTip === 'other' && styles.tipButtonLabelActive
                      ]}
                    >
                      Other
                    </Text>
                  </TouchableOpacity>

                  {selectedTip === 'other' && (
                    <TextInput
                      value={customTip}
                      onChangeText={setCustomTip}
                      keyboardType="decimal-pad"
                      placeholder="Enter amount"
                      style={[styles.customTipInput, { flex: 1 }]}
                    />
                  )}
                </View>
              </View>

              {/* DELIVERY INSTRUCTIONS */}
              <View style={styles.commentsSection}>
                <Text style={styles.sectionHeading}>Delivery Instructions</Text>
                <TextInput
                  multiline
                  numberOfLines={4}
                  value={deliveryInstructions}
                  onChangeText={setDeliveryInstructions}
                  placeholder="Add instructions for the driver"
                  placeholderTextColor={colors.textSecondary}
                  style={styles.commentsInput}
                />
              </View>

              {/* PRICE SUMMARY */}
              <View style={styles.orderSummary}>
                <Text style={styles.sectionPriceDetails}>Price Details</Text>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    Products(
                    {activeSeller?.items.reduce((sum, i) => sum + i.quantity, 0) || 0}{' '}
                    items)
                  </Text>
                  <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery Fee</Text>
                  <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tax</Text>
                  <Text style={styles.summaryValue}>{taxAmount.toFixed(2)}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tip</Text>
                  <Text style={styles.summaryValue}>{tipAmount.toFixed(2)}</Text>
                </View>

                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>{payableTotal.toFixed(2)}</Text>
                </View>
              </View>

              {/* PLACE ORDER */}
              <TouchableOpacity
                style={styles.placeOrderButton}
                onPress={() => {
                  if (!isAuthenticated) {
                    router.push({
                      pathname: '/Login',
                      params: {
                        redirectTo: '/(tabs)/Cart',
                        message: 'Please login to place your order'
                      }
                    });
                    return;
                  }
                  setIsPaymentModalVisible(true);
                }}
              >
                <Text style={styles.placeOrderButtonText}>Place Order</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>

        {/* PAYMENT MODAL */}
        <Modal
          visible={isPaymentModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsPaymentModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalBackground}
              onPress={() => setIsPaymentModalVisible(false)}
            />

            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Payment Method</Text>
                <TouchableOpacity onPress={() => setIsPaymentModalVisible(false)}>
                  <Ionicons name="close" size={22} />
                </TouchableOpacity>
              </View>

              {['credit', 'debit', 'square'].map((method) => (
                <TouchableOpacity
                  key={method}
                  onPress={() =>
                    setSelectedPaymentMethod(method as typeof selectedPaymentMethod)
                  }
                  style={[
                    styles.paymentOption,
                    method === 'square' && styles.paymentOptionLast
                  ]}
                >
                  <View
                    style={[
                      styles.modalRadioOuter,
                      selectedPaymentMethod === method &&
                      styles.modalRadioOuterActive
                    ]}
                  >
                    {selectedPaymentMethod === method && (
                      <View style={styles.modalRadioInner} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.paymentOptionLabel,
                      selectedPaymentMethod === method &&
                      styles.paymentOptionLabelActive
                    ]}
                  >
                    {method === 'square'
                      ? 'Marketplace Square Payment'
                      : method === 'debit'
                        ? 'Debit Card'
                        : 'Credit Card'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {orderError && (
              <Text style={styles.errorText}>
                {orderError}
              </Text>
            )}
            <TouchableOpacity
              style={[
                styles.modalPrimaryButton,
                isPlacingOrder && styles.disabledButton
              ]}
              onPress={handlePlaceOrder}
              disabled={isPlacingOrder}
            >
              <Text style={styles.modalPrimaryButtonText}>
                {isPlacingOrder ? 'Processing...' : `Pay $${payableTotal.toFixed(2)}`}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* ADDRESS MODAL */}
        <Modal
          visible={isAddressModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsAddressModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalBackground}
              onPress={() => setIsAddressModalVisible(false)}
            />

            <View style={[styles.modalContainer, { maxHeight: 400 }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Delivery Address</Text>
                <TouchableOpacity onPress={() => setIsAddressModalVisible(false)}>
                  <Ionicons name="close" size={22} />
                </TouchableOpacity>
              </View>

              <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
              >
                {addresses.map((address) => (
                  <TouchableOpacity
                    key={address.id}
                    onPress={() => {
                      setSelectedAddress(address);
                      setIsAddressModalVisible(false);
                    }}
                    style={[
                      styles.addressOption,
                      selectedAddress?.id === address.id &&
                      styles.selectedAddress
                    ]}
                  >
                    <View style={styles.addressItemContainer}>
                      <View style={styles.addressDetails}>
                        <Text style={styles.addressType}>{address.address_name}</Text>
                        <Text style={styles.addressText}>{address.address_line1}</Text>
                        <Text style={styles.addressText}>{address.state}, {address.city}, {address.postal_code}</Text>
                      </View>

                      <TouchableOpacity style={styles.editButton}>
                        <Ionicons name="create-outline" size={20} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity
              style={styles.modalPrimaryButton}
              onPress={() => {
                router.replace('/AddAddress');
                setIsAddressModalVisible(false);
              }}
            >
              <Text style={styles.modalPrimaryButtonText}>Add New Address</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  disabledButton: {
    opacity: 0.5,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 8,
    fontFamily: 'PoppinsRegular',
  },
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    backgroundColor: colors.white
  },

  scrollContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(100),
    paddingTop: verticalScale(16),
    gap: verticalScale(16),
  },
  scroll: {
    paddingBottom: verticalScale(60),
  },
  pageHeader: {
    gap: verticalScale(6),
  },
  headline: {
    fontFamily: 'PoppinsSemi',
    fontWeight: '600',
    fontSize: moderateScale(16),
  },
  subHeadline: {
    fontFamily: '  PoppinsMedium',
    fontStyle: 'italic',
    fontSize: moderateScale(12),
    color: colors.textPrimary,
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
    borderColor: colors.white,
    borderWidth: 1
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
    fontFamily: 'Montserrat',
    fontSize: moderateScale(14),
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
    fontFamily: 'PoppinsSemi',
    fontWeight: '600',
    fontSize: moderateScale(12),
    lineHeight: 18,
  },
  itemPrice: {
    fontFamily: 'PoppinsSemi',
    fontWeight: '600',
    fontSize: moderateScale(13),
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
    fontFamily: 'PoppinsSemi',
    fontWeight: '600',
    fontSize: moderateScale(18),
    color: '#2F2D1E',
  },
  emptyText: {
    fontFamily: 'PoppinsMedium',
    fontSize: moderateScale(12),
    color: '#7C7754',
    textAlign: 'center',
    width: scale(240),
  },
  disclaimerCard: {
    paddingHorizontal: scale(16),
  },
  disclaimerTitle: {
    fontFamily: 'PoppinsSemi',
    fontWeight: '600',
    fontSize: moderateScale(13),
    color: colors.primaryDark,
  },
  disclaimerText: {
    fontFamily: 'PoppinsMedium',
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
    fontFamily: 'PoppinsSemi',
    fontWeight: '600',
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
    fontFamily: 'PoppinsMedium',
    fontSize: moderateScale(13),
  },
  deliveryChipLabelActive: {
    color: colors.black,
    fontFamily: 'PoppinsSemi',
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginTop: verticalScale(8),
    paddingVertical: verticalScale(8),
  },

  scheduleButtonLabel: {
    fontFamily: 'PoppinsMedium',
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
    fontFamily: 'PoppinsSemi',
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: colors.primaryDark,
  },
  addressLabel: {
    fontFamily: 'PoppinsMedium',
    fontSize: moderateScale(12),
    lineHeight: 18,
  },
  addressOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.primaryDark,
    borderRadius: scale(12),
    marginBottom: verticalScale(8),

  },
  selectedAddress: {
    backgroundColor: colors.secondaryLight,
  },

  addressDetails: {
    flex: 1,
  },
  addressTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressType: {
    fontFamily: 'PoppinsSemi',
    fontSize: moderateScale(14),
    marginRight: 8,
  },
  addressText: {
    fontFamily: 'PoppinsMedium',
    fontSize: 13,
    lineHeight: 18,
  },

  addressItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: verticalScale(16),
  },
  editButton: {
    padding: 8,
    marginLeft: 8,
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
    fontFamily: 'PoppinsMedium',
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
    backgroundColor: colors.secondaryLight,
  },
  tipButtonLabel: {
    fontFamily: 'PoppinsMedium',
    fontSize: moderateScale(13),
  },
  tipButtonLabelActive: {
    fontFamily: 'PoppinsSemi',
  },
  customTipInput: {
    borderWidth: 1,
    borderColor: '#D9D5BE',
    borderRadius: scale(10),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    fontFamily: 'PoppinsMedium',
    fontSize: moderateScale(13),
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
    paddingVertical: verticalScale(14),
    fontFamily: 'PoppinsMedium',
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
    fontFamily: 'PoppinsSemi',
    fontWeight: '600',
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
    fontFamily: 'PoppinsMedium',
    fontSize: moderateScale(14),
    color: '#666666',
  },
  summaryValue: {
    fontFamily: 'PoppinsMedium',
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
    fontFamily: 'PoppinsSemi',
    fontWeight: '600',
    fontSize: moderateScale(16),
    color: '#333333',
  },
  totalValue: {
    fontFamily: 'PoppinsSemi',
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
    fontFamily: 'PoppinsSemi',
    fontWeight: '600',
    fontSize: moderateScale(14),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalBackground: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    backgroundColor: '#FFFFFF',
    paddingTop: verticalScale(18),
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(18),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
  },
  modalTitle: {
    textAlign: 'center',
    fontFamily: 'PoppinsSemi',
    fontWeight: '600',
    fontSize: moderateScale(15),
    color: '#2F2D1E',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE4C6',
  },
  paymentOptionLast: {
    borderBottomWidth: 0,
  },
  modalRadioOuter: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    borderWidth: 1.5,
    borderColor: '#D9D5BE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  modalRadioOuterActive: {
    borderColor: colors.primaryDark,
  },
  modalRadioInner: {
    width: scale(12),
    height: scale(12),
    borderRadius: scale(6),
    backgroundColor: colors.primaryDark,
  },
  paymentOptionLabel: {
    fontFamily: 'PoppinsMedium',
    fontSize: moderateScale(13),
    color: '#4E4A37',
  },
  paymentOptionLabelActive: {
    fontFamily: 'PoppinsSemi',
    color: '#2F2D1E',
  },
  modalPrimaryButton: {
    backgroundColor: colors.primaryDark,
    paddingVertical: verticalScale(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPrimaryButtonText: {
    fontFamily: 'PoppinsSemi',
    fontSize: moderateScale(15),
    color: '#FFFFFF',
  },
  slotItem: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    borderRadius: scale(8),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9D5BE',
    marginBottom: verticalScale(6),
  },
  slotItemSelected: {
    backgroundColor: colors.secondaryLight,
    borderColor: colors.primaryDark,
  },
  slotLabel: {
    fontFamily: 'PoppinsMedium',
    fontSize: moderateScale(13),
    color: '#2F2D1E',
  },
});


