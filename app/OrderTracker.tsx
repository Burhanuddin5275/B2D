import React, { useEffect, useMemo, useState } from 'react';
import { View, ActivityIndicator, ImageBackground, ScrollView, Text } from 'react-native';
import { useAppSelector } from '@/store/useAuth';
import { router, useLocalSearchParams } from 'expo-router';
import { scale, verticalScale } from 'react-native-size-matters';
import { colors } from '@/theme/colors';
import Header from '@/components/Header';
import { CancelOrderModal } from '@/components/modal';
import StatusModal from '@/components/success';
import { fetchOrderById } from '@/service/order';
import { fetchReview, reviewApi, ProductReview } from '@/service/review';
import { getTimelineStatuses } from '@/components/utilities/TimelineStatuses';
import OrderTimeline from '@/components/order/OrderTimeline';
import OrderDeliveryInfo from '@/components/order/OrderDeliveryInfo';
import OrderItems from '@/components/order/OrderItems';
import OrderPricing from '@/components/order/OrderPricing';
import RatingModal from '@/components/order/RatingModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import OrderOtpModal from '@/components/order/OrderOtpModal';

const OrderTracker = () => {
  const params = useLocalSearchParams<{ orderId?: string }>();
  const orderId = params.orderId;
  const token = useAppSelector(s => s.auth.token);

  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ProductReview[]>([]);

  // Modals
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [ratingItem, setRatingItem] = useState<any>(null);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch Reviews
  useEffect(() => {
    if (!token) return;
    const getReviews = async () => {
      try {
        const allReviews = await fetchReview(token);
        setReviews(allReviews);
      } catch (err) { console.error(err); }
    };
    getReviews();
  }, [token]);

  const isProductReviewed = (productId: number) =>
    reviews.some(r => r.order?.toString() === orderId?.toString() && r.product === productId);

  // Fetch Order
  useEffect(() => {
    if (!orderId) return;
    const getOrder = async () => {
      try {
        const data = await fetchOrderById(orderId, token || '');
        setOrderData({
          ...data,
          status: Array.isArray(data.status) ? data.status : [{ status: 'processing', created_at: new Date().toISOString() }],
        });
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    getOrder();
  }, [orderId, token]);

  // Rating Modal Stars
  const renderStars = useMemo(() =>
    Array.from({ length: 5 }, (_, index) => {
      const value = index + 1;
      const isFilled = value <= userRating;
      return (
        <Text key={value} onPress={() => setUserRating(value)} style={{ fontSize: 26, color: isFilled ? colors.primaryDark : colors.textSecondary }}>★</Text>
      );
    }),
    [userRating]
  );

  // Submit Product Review
  const handleSubmitReview = async () => {
    if (!ratingItem) return;
    const payload = { order: orderId, product: ratingItem.productId, stars: Number(userRating), comment: userComment.trim() };
    const response = await reviewApi(token || '', payload);
    setMessage(response.message);
    setShowSuccess(true);
    setRatingModalVisible(false);
  };

  // Cancel Order
  const handleCancelOrder = async (reason: string) => {
    if (!token || !orderId) return;
    try {
      const { cancelOrderApi } = await import('@/service/order');
      const json = await cancelOrderApi(token, orderId, reason);
      setMessage(json.message);
      setShowSuccess(true);
      setIsCancelModalVisible(false);
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
      <ActivityIndicator size="large" color={colors.primaryDark} />
    </View>
  );

  if (!orderData) return <Text>Order not found</Text>;

  // Timeline
  const { steps, activeIndex, isCancelled } = getTimelineStatuses(orderData.status || [], orderData.updated_at || new Date().toISOString(), orderData);
  const latestStatus = orderData.status[orderData.status.length - 1]?.status?.toLowerCase();

  // Order Items
  const items = orderData.order_items?.map((item: any) => ({
    orderItemId: item.id,
    productId: item.product.id,
    name: item.product.name,
    qty: item.quantity,
    variant: item.variation?.name,
    price: parseFloat(item.price),
    image: { uri: item.product.product_images[0]?.image },
    ratingLabel: 'Rate product',
  }));

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusModal
        visible={showSuccess}
        type="success"
        title="Success!"
        message={message}
        onClose={() => { setShowSuccess(false); router.back(); }}
        dismissAfter={2000}
        showButton={false}
      />

      <ImageBackground source={require('../assets/images/background.png')} style={{ flex: 1, backgroundColor: colors.white }}>
        <Header title={`Order ${orderData.order_no}`} showDefaultIcons={false} />
        <ScrollView contentContainerStyle={{ paddingHorizontal: scale(16), paddingBottom: verticalScale(24) }} showsVerticalScrollIndicator={false}>

          {/* Timeline */}
          <OrderTimeline steps={steps} activeIndex={activeIndex} isCancelled={isCancelled} />

          {/* Delivery Info */}
          <OrderDeliveryInfo
            deliveryType={orderData.delivery_type ?? 'Express Delivery'}
            schedule_order={orderData.schedule_order}
            deliveryAddress={`${orderData.shipping.address_line1}, ${orderData.shipping.city}, ${orderData.shipping.state}, ${orderData.shipping.country}`}
            comment={orderData.delivery_instructions ?? 'No comment'}
          />

          {/* Order Items */}
          <OrderItems items={items} latestStatus={latestStatus} isProductReviewed={isProductReviewed} onRateProduct={(item) => { setRatingItem(item); setUserRating(0); setUserComment(''); setRatingModalVisible(true); }} />

          {/* Pricing */}
          <OrderPricing
            paymentMode={orderData.payment_method ?? 'Credit Card'}
            productsTotal={parseFloat(orderData.sub_total_price ?? '0')}
            deliveryCharges={parseFloat(orderData.shipping_price ?? '0')}
            overweightCharge={orderData.flat_charge}
            taxAmount={0}
            totalAmount={parseFloat(orderData.total_price ?? '0')}
            itemsCount={items.length}
            latestStatus={latestStatus}
            isCancelled={isCancelled}
            onCancelPress={() => setIsCancelModalVisible(true)}
          />

          <CancelOrderModal
            isVisible={isCancelModalVisible}
            onClose={() => setIsCancelModalVisible(false)}
            onSubmit={handleCancelOrder}
            title="Cancel Order"
            subtitle="We're sorry to see you go. Please let us know why you're canceling."
            cancelButtonText="Don't Cancel"
            submitButtonText="Confirm Cancellation"
          />
        </ScrollView>

        {/* Rating Modal */}
        <RatingModal
          visible={ratingModalVisible}
          item={ratingItem}
          userRating={userRating}
          userComment={userComment}
          setUserRating={setUserRating}
          setUserComment={setUserComment}
          onClose={() => setRatingModalVisible(false)}
          onSubmit={handleSubmitReview}
          renderStars={renderStars}
        />
        <OrderOtpModal
          orderId={orderData.id}
          token={token || ''}
          visible={latestStatus === 'out for delivery'}
          onClose={() => { setOtpModalVisible(false) }}
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default OrderTracker;
