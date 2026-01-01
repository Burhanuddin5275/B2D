import Header from '@/components/Header';
import { fetchOrderById } from '@/service/order';
import { useAppSelector } from '@/store/useAuth';
import { colors } from '@/theme/colors';
import { ImageBackground } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState, useEffect } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';


const getTimelineStatuses = (status: string) => {
  const now = new Date();
  const timeOptions: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  const timeString = now.toLocaleString('en-US', timeOptions);

  const timelineSteps = [
    { label: 'Order placed!', time: timeString },
    { label: 'Preparing for dispatch', time: '' },
    { label: 'Out for delivery', time: '' },
    { label: 'Order delivered', time: '' },
  ];

  let activeIndex = 0;

  switch (status.toLowerCase()) {
    case 'placed':
      activeIndex = 0;
      break;
    case 'preparing for dispatch':
      activeIndex = 1;
      timelineSteps[1].time = timeString;
      break;
    case 'out for delivery':
      activeIndex = 2;
      timelineSteps[1].time = new Date(now.getTime() - 3600000).toLocaleString('en-US', timeOptions);
      timelineSteps[2].time = timeString;
      break;
    case 'delivered':
      activeIndex = 3;
      timelineSteps[1].time = new Date(now.getTime() - 10800000).toLocaleString('en-US', timeOptions);
      timelineSteps[2].time = new Date(now.getTime() - 14400000).toLocaleString('en-US', timeOptions);
      timelineSteps[3].time = timeString;
      break;
    case 'cancelled by you / store':
      timelineSteps[0].time = timeString;
      return {
        steps: [timelineSteps[0], { label: 'Order cancelled', time: timeString }],
        activeIndex: 1,
        isCancelled: true,
      };
  }

  return {
    steps: timelineSteps,
    activeIndex,
    isCancelled: false,
  };
};

const OrderTracker = () => {
  const params = useLocalSearchParams<{ orderId?: string }>();
  const orderId = params.orderId;

  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Rating modal states
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [ratingItem, setRatingItem] = useState<any>(null);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const token = useAppSelector((s) => s.auth.token);
  useEffect(() => {
    const getOrder = async () => {
      if (!orderId) return;
      const data = await fetchOrderById(orderId, token || '');
      setOrderData(data);
      setLoading(false);
    };
    getOrder();
  }, [orderId]);

  const handleOpenRatingModal = (item: any) => {
    setRatingItem(item);
    setUserRating(0);
    setUserComment('');
    setRatingModalVisible(true);
  };

  const renderStars = useMemo(
    () =>
      Array.from({ length: 5 }, (_, index) => {
        const value = index + 1;
        const isHalfFilled = userRating > value - 0.5 && userRating < value;
        const isFilled = value <= userRating;
        return (
          <TouchableOpacity key={value} onPress={() => setUserRating(value)} activeOpacity={0.8}>
            <Text style={[styles.starIcon, isFilled && styles.starIconFilled]}>★</Text>
          </TouchableOpacity>
        );
      }),
    [userRating]
  );

  if (!orderData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ textAlign: 'center', marginTop: 50 }}>No order data found.</Text>
      </SafeAreaView>
    );
  }

  // Extract order info
  const orderStatus = orderData.order_status || 'placed';
  const { steps, activeIndex, isCancelled } = getTimelineStatuses(orderStatus);

  const deliveryType = orderData.delivery_type ?? 'Express Delivery';
  const schedule_order = orderData.schedule_order
  const deliveryAddress = `${orderData.shipping.address_line1}, ${orderData.shipping.city}, ${orderData.shipping.state}, ${orderData.shipping.country}`;
  const comment = orderData.delivery_instructions ?? 'No comment';
  const paymentMode = orderData.payment_method ?? 'Credit Card';
  const productsTotal = parseFloat(orderData.sub_total_price ?? '0');
  const deliveryCharges = parseFloat(orderData.shipping_price ?? '0');
  const taxAmount = 0; // You can replace with actual tax if available
  const totalAmount = parseFloat(orderData.total_price ?? '0');

  const items = orderData.order_items?.map((item: any) => ({
    id: item.id,
    name: item.product.name,
    qty: item.quantity,
    variant: item.variation?.name,
    price: parseFloat(item.price),
    image: { uri: item.product.product_images[0]?.image },
    ratingLabel: 'Rate product',
  }));
  console.log('items', items);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
        <Header title={`Order ${orderData.order_no}`} showDefaultIcons={false} />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Timeline */}
          <View style={styles.card}>
            {steps.map((entry, index) => {
              const isLast = index === steps.length - 1;
              const isActive = index <= activeIndex;
              const isCancelledStep = isCancelled && index === 1;

              return (
                <View key={`${entry.label}-${index}`} style={styles.timelineRow}>
                  <View style={styles.timelineIndicatorColumn}>
                    <View
                      style={[
                        styles.dotWrapper,
                        {
                          backgroundColor: isCancelledStep ? 'red' : isActive ? '#23B14D' : '#D3D3D3',
                          borderColor: isCancelledStep ? 'red' : isActive ? '#23B14D' : '#D3D3D3',
                        },
                      ]}
                    >
                      <View style={styles.timelineDot} />
                    </View>
                    {!isLast && <View style={[styles.timelineLine, { backgroundColor: isActive ? '#23B14D' : 'white' }]} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineLabel}>{entry.label}</Text>
                    {entry.time && <Text style={styles.timelineTime}>{entry.time}</Text>}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Delivery Info */}
          <View style={styles.card}>
            <Text style={styles.infoLabel}>
              Delivery type:<Text style={styles.infoValueHighlight}> {deliveryType}</Text>
            </Text>
            {deliveryType === 'regular' && (
              <Text style={styles.infoLabel}>
                Delivery Date:<Text style={styles.infoValueText}> {schedule_order}</Text>
              </Text>
            )}
            <Text style={[styles.infoLabel, { marginTop: verticalScale(5) }]}>
              Delivery address: <Text style={styles.infoValueText}>{deliveryAddress}</Text>
            </Text>
            <Text style={[styles.infoLabel, { marginTop: verticalScale(5) }]}>
              Comment by you: <Text style={styles.infoValueText}>{comment}</Text>
            </Text>
          </View>

          {/* Order Items */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Order items</Text>
              <Text style={styles.sectionMeta}>{items.length} products</Text>
            </View>
            {items.map((item: any, index: number) => (
              <View key={item.id} style={[styles.itemRow, index !== items.length - 1 && styles.itemDivider]}>
                <Image source={item.image} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                  {item.variant && (
                    <Text style={[styles.itemName, { color: colors.textPrimary, fontSize: moderateScale(12) }]}
                      numberOfLines={1}>
                      {item.variant}
                    </Text>
                  )}
                  <View style={styles.priceRatingContainer}>
                    <Text style={styles.itemPrice}>
                      ${item.price.toFixed(2)} ({item.qty})
                    </Text>
                    <TouchableOpacity onPress={() => handleOpenRatingModal(item)}>
                      <Text style={styles.itemAction}>{item.ratingLabel}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Payment */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Payment mode</Text>
            <Text style={styles.infoValueText}>{paymentMode}</Text>
          </View>

          {/* Pricing */}
          <View style={{ paddingHorizontal: scale(16) }}>
            <Text style={styles.sectionTitle}>Pricing Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Products ({items.length} items)</Text>
              <Text style={styles.summaryValue}>${productsTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery charges</Text>
              <Text style={styles.summaryValue}>${deliveryCharges.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>${taxAmount.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotalRow]}>
              <Text style={styles.summaryTotalLabel}>Total amount:</Text>
              <Text style={styles.summaryTotalValue}>${totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Rating Modal */}
        <Modal visible={ratingModalVisible} transparent animationType="fade" onRequestClose={() => setRatingModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.ratingModal}>
              <View style={styles.ratingModalHeader}>
                <Text style={styles.ratingModalTitle}>Rate product</Text>
                <TouchableOpacity onPress={() => setRatingModalVisible(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>
              {ratingItem && (
                <>
                  <View style={styles.ratingItemRow}>
                    <Image source={ratingItem.image} style={styles.ratingItemImage} />
                    <View style={styles.ratingItemInfo}>
                      <Text style={styles.ratingItemName} numberOfLines={2}>{ratingItem.name}</Text>
                      {ratingItem.variant && (
                        <Text style={[styles.itemName, { color: colors.textPrimary, fontSize: moderateScale(12) }]}
                          numberOfLines={1}>
                          {ratingItem.variant}
                        </Text>
                      )}
                      <Text style={styles.ratingItemPrice}>
                        ${ratingItem.price.toFixed(2)} ({ratingItem.qty})
                      </Text>
                    </View>
                  </View>
                  <View style={styles.ratingContainer}>
                    <View style={styles.starRow}>{renderStars}</View>
                    <Text style={styles.ratingText}>{userRating > 0 ? `${userRating}` : '0'}</Text>
                  </View>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Write your feedback..."
                    placeholderTextColor="#A7A7A7"
                    multiline
                    value={userComment}
                    onChangeText={setUserComment}
                  />
                  <TouchableOpacity style={styles.submitRatingButton} activeOpacity={0.85} onPress={() => setRatingModalVisible(false)}>
                    <Text style={styles.submitRatingButtonText}>Submit review</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default OrderTracker;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: colors.white
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(24),
    paddingTop: verticalScale(12),
    gap: verticalScale(16),
  },
  card: {
    borderBottomWidth: 1,
    borderBottomColor: '#EDE9D9',
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(12),
  },
  priceRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(4),
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: verticalScale(12),
  },
  timelineIndicatorColumn: {
    width: scale(24),
    alignItems: 'center',
  },
  dotWrapper: {
    width: scale(14),
    height: scale(14),
    borderRadius: scale(8),
    borderWidth: 1.5,
    backgroundColor: 'green',
    borderColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDot: {
    width: scale(7),
    height: scale(7),
    borderRadius: scale(8),
    backgroundColor: colors.white,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#c2edcfff',
    marginTop: verticalScale(4),
  },
  timelineContent: {
    flex: 1,
    paddingLeft: scale(8),
  },
  timelineLabel: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: moderateScale(15),
  },
  timelineTime: {
    fontFamily: 'MontserratMedium',
    fontWeight: 600,
    fontSize: moderateScale(12),
    color: colors.textPrimary,
    marginTop: verticalScale(4),
  },
  infoLabel: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: moderateScale(14),
  },
  infoValueHighlight: {
    color: '#23B14D',
    fontFamily: 'Montserrat',
    fontWeight: 600,
  },
  infoValueText: {
    fontFamily: 'MontserratMedium',
    fontWeight: 600,
    color: colors.textPrimary,
    fontSize: moderateScale(12),
    marginTop: verticalScale(4),
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  sectionTitle: {
    fontFamily: 'Montserrat',
    fontSize: moderateScale(15),
  },
  sectionMeta: {
    fontFamily: 'Montserrat',
    fontSize: moderateScale(12),
  },
  itemRow: {
    flexDirection: 'row',
    paddingVertical: verticalScale(12),
  },
  itemDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EDE9D9',
  },
  itemImage: {
    width: scale(56),
    height: scale(56),
    borderRadius: 12,
    backgroundColor: '#FFF8EC',
    marginRight: scale(12),
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: moderateScale(14),
  },
  itemPrice: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: moderateScale(12),
    marginTop: verticalScale(6),
  },
  itemAction: {
    fontFamily: 'InterSemiBold',
    fontSize: moderateScale(12),
    color: '#23B14D',
    marginTop: verticalScale(8),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  summaryLabel: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: moderateScale(13),
    color: colors.textPrimary,
  },
  summaryValue: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: moderateScale(13),
  },
  summaryTotalRow: {
    marginTop: verticalScale(14),
    borderTopWidth: 1,
    borderTopColor: '#EDE9D9',
    paddingTop: verticalScale(10),
  },
  summaryTotalLabel: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: moderateScale(13),
  },
  summaryTotalValue: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: moderateScale(13),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  ratingModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(18),
  },
  ratingModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingModalTitle: {
    fontFamily: 'Montserrat',
    fontSize: moderateScale(15),
    color: '#1E1E1E',
  },
  modalClose: {
    fontSize: moderateScale(18),
    color: '#7C7754',
  },
  ratingItemRow: {
    flexDirection: 'row',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(12),
  },
  ratingItemImage: {
    width: scale(56),
    height: scale(56),
    borderRadius: 12,
    backgroundColor: '#FFF8EC',
    marginRight: scale(12),
  },
  ratingItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  ratingItemName: {
    fontFamily: 'Montserrat',
    fontSize: moderateScale(14),
  },
  ratingItemPrice: {
    fontFamily: 'InterRegular',
    fontSize: moderateScale(12),
    color: colors.textPrimary,
    marginTop: verticalScale(4),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  starRow: {
    flexDirection: 'row',
    gap: scale(10),
    marginBottom: verticalScale(12),
  },
  ratingText: {
    fontFamily: 'Montserrat',
    fontSize: moderateScale(16),
    marginLeft: scale(12),
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E4DEC6',
    borderRadius: 12,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    minHeight: verticalScale(90),
    textAlignVertical: 'top',
    fontFamily: 'Montserrat',
    fontSize: moderateScale(13),
  },
  submitRatingButton: {
    marginTop: verticalScale(14),
    backgroundColor: colors.primaryDark,
    borderRadius: 14,
    paddingVertical: verticalScale(14),
    alignItems: 'center',
  },
  submitRatingButtonText: {
    fontFamily: 'PoppinsSemi',
    fontSize: moderateScale(14),
    color: colors.white,
  },
  starIcon: {
    fontSize: moderateScale(26),
    color: colors.textSecondary,
  },
  starIconFilled: {
    color: colors.primaryDark,
  },
});