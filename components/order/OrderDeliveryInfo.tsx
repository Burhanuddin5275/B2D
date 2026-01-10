import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatDateUS } from '@/components/utilities/date_formate';
import { colors } from '@/theme/colors';
import { scale, verticalScale } from 'react-native-size-matters';

interface Props {
  deliveryType: string;
  schedule_order: string;
  deliveryAddress: string;
  comment: string;
}

const OrderDeliveryInfo: React.FC<Props> = ({ deliveryType, schedule_order, deliveryAddress, comment }) => (
  <View style={styles.card}>
    <Text style={styles.infoLabel}>
      Delivery type: <Text style={styles.infoValueHighlight}>{deliveryType}</Text>
    </Text>
    <Text style={styles.infoLabel}>
      Delivery Date: <Text style={styles.infoValueText}>{formatDateUS(schedule_order)}</Text>
    </Text>
    <Text style={styles.infoLabel}>
      Delivery address: <Text style={styles.infoValueText}>{deliveryAddress}</Text>
    </Text>
    <Text style={styles.infoLabel}>
      Comment by you: <Text style={styles.infoValueText}>{comment || 'none'}</Text>
    </Text>
  </View>
);

export default OrderDeliveryInfo;

const styles = StyleSheet.create({
  card: { borderBottomWidth: 1, borderBottomColor: '#EDE9D9', paddingHorizontal: scale(16), paddingBottom: verticalScale(12) },
  infoLabel: { fontFamily: 'Montserrat', fontWeight: '600', fontSize: 14, marginTop: verticalScale(5) },
  infoValueHighlight: { color: '#23B14D', fontFamily: 'Montserrat', fontWeight: '600' },
  infoValueText: { fontFamily: 'MontserratMedium', fontWeight: '600', color: colors.textPrimary, fontSize: 12, marginTop: verticalScale(4), lineHeight: 18 },
});
