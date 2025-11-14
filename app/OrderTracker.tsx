import Header from '@/components/Header';
import { colors } from '@/theme/colors';
import { ImageBackground } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const timelineDefaults = [
  { label: 'Order placed!', time: '04/20/2024, 11:00 AM' },
  { label: 'Preparing for dispatch', time: '04/20/2024, 03:23 PM' },
  { label: 'Out for delivery', time: '04/20/2024, 02:30 PM' },
  { label: 'Order delivered', time: '04/20/2024, 05:40 PM' },
];

const sampleItems = [
  {
    id: 1,
    name: 'Bolthouse Farms 1lb Baby Peeled Carrots',
    price: 1.32,
    qty: 2,
    ratingLabel: 'Rate product',
    image: require('../assets/images/slider1.png'),
  },
  {
    id: 2,
    name: 'Great Value Frozen Sweet Peas, 12 oz Steamable Bag',
    price: 1.12,
    qty: 4,
    ratingLabel: 'Edit rating',
    image: require('../assets/images/store1.png'),
  },
];

const OrderTracker = () => {
  const params = useLocalSearchParams<{
    orderId?: string;
    deliveryType?: string;
    deliveryAddress?: string;
    comment?: string;
    paymentMode?: string;
    productsTotal?: string;
    deliveryCharges?: string;
    tax?: string;
  }>();

  const deliveryType = params.deliveryType ?? 'Express Delivery';
  const deliveryAddress =
    params.deliveryAddress ?? '789 Elm St, Springfield, IL 62704, USA';
  const comment =
    params.comment ?? 'Please leave the package at the front door.';
  const paymentMode =
    params.paymentMode ?? 'Credit Card (Visa **** 1234)';
  const productsTotal = parseFloat(params.productsTotal ?? '57.60');
  const deliveryCharges = parseFloat(params.deliveryCharges ?? '5.00');
  const taxAmount = parseFloat(params.tax ?? '2.40');
  const totalAmount = productsTotal + deliveryCharges + taxAmount;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../assets/images/background2.png')}
        style={styles.background}
      >
        <Header title={`Order ${params.orderId}`} showDefaultIcons={false} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {timelineDefaults.map((entry, index) => {
              const isLast = index === timelineDefaults.length - 1;
              return (
                <View key={entry.label} style={styles.timelineRow}>
                  <View style={styles.timelineIndicatorColumn}>
                    <View style={styles.dotWrapper}>
                      <View style={styles.timelineDot} />
                    </View>
                    {!isLast && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineLabel}>{entry.label}</Text>
                    <Text style={styles.timelineTime}>{entry.time}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.card}>
            <Text style={styles.infoLabel}>
              Delivery type: 
              <Text style={styles.infoValueHighlight}> {deliveryType}</Text>
            </Text>
            <Text style={[styles.infoLabel, { marginTop: verticalScale(5) }]}>
              Delivery address: <Text style={styles.infoValueText}>{deliveryAddress}</Text>
            </Text>           
            <Text style={[styles.infoLabel, { marginTop: verticalScale(5) }]}>
              Comment by you: <Text style={styles.infoValueText}>{comment}</Text>
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Order items</Text>
              <Text style={styles.sectionMeta}>2 products</Text>
            </View>
            {sampleItems.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.itemRow,
                  index !== sampleItems.length - 1 && styles.itemDivider,
                ]}
              >
                <Image source={item.image} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.priceRatingContainer}>
                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}({item.qty})</Text>
                    <TouchableOpacity>
                      <Text style={styles.itemAction}>{item.ratingLabel}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Payment mode</Text>
            <Text style={styles.infoValueText}>{paymentMode}</Text>
          </View>
          <View style={{   paddingHorizontal: scale(16),}}>
            <Text style={styles.sectionTitle}>Pricing Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Products (2 items)</Text>
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
    borderBottomWidth:1,
    borderBottomColor:'#EDE9D9',
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
    backgroundColor: '#D5F2DE',
    marginTop: verticalScale(4),
  },
  timelineContent: {
    flex: 1,
    paddingLeft: scale(8),
  },
  timelineLabel: {
    fontFamily: 'Montserrat',
    fontWeight:600,
    fontSize: moderateScale(15),
  },
  timelineTime: {
    fontFamily: 'MontserratMedium',
    fontWeight:600,
    fontSize: moderateScale(12),
    color:colors.textPrimary,
    marginTop: verticalScale(4),
  },
  infoLabel: {
    fontFamily: 'Montserrat',
    fontWeight:600,
    fontSize: moderateScale(14),
  },
  infoValueHighlight: {
    color: '#23B14D',
    fontFamily: 'Montserrat',
    fontWeight:600,
  },
  infoValueText: {
    fontFamily: 'MontserratMedium',
    fontWeight:600,
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
    fontWeight:600,
    fontSize: moderateScale(14), 
  },
  itemPrice: {
    fontFamily: 'Montserrat',
    fontWeight:600,
    fontSize: moderateScale(12),
    marginTop: verticalScale(6),
  },
  itemAction: {
    fontFamily: 'Montserrat', 
    fontWeight:600,
    fontSize: moderateScale(12),
    fontStyle:'italic',
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
    fontWeight:600,
    fontSize: moderateScale(13),
    color: colors.textPrimary, 
  },
  summaryValue: {
    fontFamily: 'Montserrat',
    fontWeight:600,
    fontSize: moderateScale(13),
  },
  summaryTotalRow: {
    marginTop: verticalScale(14),
    borderTopWidth: 1,
    borderTopColor:'#EDE9D9',
    paddingTop: verticalScale(10),
  },
  summaryTotalLabel: {
    fontFamily: 'Montserrat',
    fontWeight:600,
    fontSize: moderateScale(13),
  },
  summaryTotalValue: {
    fontFamily: 'Montserrat',
    fontWeight:600,
    fontSize: moderateScale(13),
  },
});