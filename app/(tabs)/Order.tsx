import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { router } from 'expo-router';
import Header from '@/components/Header';
import { colors } from '@/theme/colors';
import { fetchOrders, Order } from '@/service/order';
import { useAppSelector } from '@/store/useAuth';


export default function Orders() {
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
    const auth = useAppSelector(s => s.auth);
    const token = auth.token;
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders(token||'');
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const renderItem = ({ item }: { item: Order }) => {
    // Get latest status from status array
    const latestStatus = item.status[item.status.length - 1];
    let color = '#E9B10F';
    if (item.order_status === 'delivered') color = 'green';
    else if (item.order_status === 'cancelled') color = 'red';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push({
          pathname: '/OrderTracker',
          params: {
            orderId: item.id,
            amount: item.total_price,
            date: item.created_at,
            status: latestStatus.status,
            color,
          }
        })}
      >
        <View>
          <Text style={styles.orderId}>{item.order_no}</Text>
          <Text style={styles.amount}>${item.total_price}    {new Date(item.created_at).toLocaleString()}</Text>
          <Text style={[styles.status, { color }]}>{latestStatus.status} order</Text>
        </View>
        <Ionicons name="chevron-forward" size={moderateScale(18)} color={colors.primaryDark} />
      </TouchableOpacity> 
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: Math.max(insets.bottom, verticalScale(1)) }}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.backgroundImage}
      >
        <Header title="My Orders" showDefaultIcons={false} />
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, backgroundColor: colors.white },
  listContainer: { padding: scale(16), paddingBottom: verticalScale(75) },
  card: {
    backgroundColor: colors.secondaryLight,
    borderRadius: 12,
    padding: scale(14),
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryDark,
    borderLeftWidth: 1
  },
  orderId: { fontSize: moderateScale(16), fontWeight: '600', fontFamily: 'Montserrat' },
  amount: { fontSize: moderateScale(14), fontWeight: '500', fontFamily: 'MontserratMedium', marginTop: 2 },
  status: { fontSize: moderateScale(14), fontWeight: '600', fontFamily: 'Montserrat', marginTop: 4 },
});
