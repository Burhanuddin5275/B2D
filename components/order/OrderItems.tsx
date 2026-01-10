import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

interface OrderItemProps {
  items: any[];
  latestStatus: string;
  isProductReviewed: (productId: number) => boolean;
  onRateProduct: (item: any) => void;
}

const OrderItems: React.FC<OrderItemProps> = ({ items, latestStatus, isProductReviewed, onRateProduct }) => (
  <View style={styles.card}>
    {items.map((item, index) => (
      <View key={item.orderItemId} style={[styles.itemRow, index !== items.length - 1 && styles.itemDivider]}>
        <Image source={item.image} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
          {item.variant && <Text style={[styles.itemName, { color: colors.textPrimary, fontSize: moderateScale(12) }]} numberOfLines={1}>{item.variant}</Text>}
          <View style={styles.priceRatingContainer}>
            <Text style={styles.itemPrice}>${item.price.toFixed(2)} ({item.qty})</Text>
            {latestStatus === 'delivered' && (
              <TouchableOpacity onPress={() => onRateProduct(item)} disabled={isProductReviewed(item.productId)}>
                <Text style={[styles.itemAction, isProductReviewed(item.productId) && { color: 'gray' }]}>
                  {isProductReviewed(item.productId) ? 'Reviewed' : item.ratingLabel}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    ))}
  </View>
);

export default OrderItems;

const styles = StyleSheet.create({
  card: { borderBottomWidth: 1, borderBottomColor: '#EDE9D9', paddingHorizontal: scale(16), paddingBottom: verticalScale(12) },
  itemRow: { flexDirection: 'row', paddingVertical: verticalScale(12) },
  itemDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#EDE9D9' },
  itemImage: { width: scale(56), height: scale(56), borderRadius: 12, backgroundColor: '#FFF8EC', marginRight: scale(12) },
  itemDetails: { flex: 1 },
  itemName: { fontFamily: 'Montserrat', fontWeight: '600', fontSize: moderateScale(14) },
  itemPrice: { fontFamily: 'Montserrat', fontWeight: '600', fontSize: moderateScale(12), marginTop: verticalScale(6) },
  itemAction: { fontFamily: 'InterSemiBold', fontSize: moderateScale(12), color: '#23B14D', marginTop: verticalScale(8) },
  priceRatingContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: verticalScale(4) },
});
