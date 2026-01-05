import Header from '@/components/Header';
import { fetchOrders, Order } from '@/service/order';
import { useAppSelector } from '@/store/useAuth';
import { colors } from '@/theme/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, ImageBackground, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');


export default function Orders() {
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const auth = useAppSelector(s => s.auth);
  const token = auth.token;
  const loadOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);

      const data = await fetchOrders(token || '');
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => {
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


  if (orders.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, paddingBottom: Math.max(insets.bottom, verticalScale(1)) }}>
        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={styles.backgroundImage}
        >
          <Header title="My Orders" showDefaultIcons={false} />
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={width * 0.3} color={colors.primary} />
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptyText}>You haven't placed any orders yet</Text>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadOrders}
              colors={[colors.primaryDark]}
            />
          }
        />

      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, backgroundColor: colors.white },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },
  emptyTitle: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: verticalScale(20),
    fontFamily: 'MontserratBold',
  },
  emptyText: {
    fontSize: moderateScale(14),
    color: colors.textSecondary,
    marginTop: verticalScale(8),
    textAlign: 'center',
    fontFamily: 'MontserratMedium',
  },
  listContainer: {
    padding: scale(16),
    paddingBottom: verticalScale(75),
    flexGrow: 1,

  },
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
