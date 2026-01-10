import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

interface Props {
  paymentMode: string;
  productsTotal: number;
  deliveryCharges: number;
  overweightCharge: number;
  taxAmount: number;
  totalAmount: number;
  itemsCount: number;
  latestStatus: string;
  isCancelled: boolean;
  onCancelPress: () => void;
}

const OrderPricing: React.FC<Props> = ({
  paymentMode, productsTotal, deliveryCharges, overweightCharge, taxAmount, totalAmount, itemsCount,
  latestStatus, isCancelled, onCancelPress
}) => (
  <View style={{ paddingHorizontal: scale(16) }}>
    <Text style={styles.sectionTitle}>Payment mode</Text>
    <Text style={styles.infoValueText}>{paymentMode}</Text>

    <Text style={styles.sectionTitle}>Pricing Summary</Text>
    <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Products ({itemsCount} items)</Text><Text style={styles.summaryValue}>${productsTotal.toFixed(2)}</Text></View>
    <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Delivery charges</Text><Text style={styles.summaryValue}>${deliveryCharges.toFixed(2)}</Text></View>
    {overweightCharge != 0 && <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Flat Charges</Text><Text style={styles.summaryValue}>${overweightCharge}</Text></View>}
    <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Tax</Text><Text style={styles.summaryValue}>${taxAmount.toFixed(2)}</Text></View>
    <View style={[styles.summaryRow, styles.summaryTotalRow]}><Text style={styles.summaryTotalLabel}>Total amount:</Text><Text style={styles.summaryTotalValue}>${totalAmount.toFixed(2)}</Text></View>

    {latestStatus === 'placed' && !isCancelled && (
      <TouchableOpacity style={[styles.summaryRow, { marginTop: verticalScale(20), justifyContent: 'center' }]} onPress={onCancelPress}>
        <Text style={{ color: 'red', fontFamily: 'InterRegular', fontSize: moderateScale(14) }}>Cancel Order</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default OrderPricing;

const styles = StyleSheet.create({
  sectionTitle: { fontFamily: 'Montserrat', fontSize: moderateScale(15), marginTop: verticalScale(12) },
  infoValueText: { fontFamily: 'MontserratMedium', fontSize: moderateScale(12), color: colors.textPrimary, marginTop: verticalScale(4), lineHeight: 18 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: verticalScale(10) },
  summaryLabel: { fontFamily: 'Montserrat', fontWeight: '600', fontSize: moderateScale(13), color: colors.textPrimary },
  summaryValue: { fontFamily: 'Montserrat', fontWeight: '600', fontSize: moderateScale(13) },
  summaryTotalRow: { marginTop: verticalScale(14), borderTopWidth: 1, borderTopColor: '#EDE9D9', paddingTop: verticalScale(10) },
  summaryTotalLabel: { fontFamily: 'Montserrat', fontWeight: '600', fontSize: moderateScale(13) },
  summaryTotalValue: { fontFamily: 'Montserrat', fontWeight: '600', fontSize: moderateScale(13) },
});
