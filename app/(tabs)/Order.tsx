import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { router } from 'expo-router';
import Header from '@/components/Header';

const orders = [
  { id: '#123456', amount: '$65.00', date: '10/08/04/20/2024, 3:45 PM', status: 'Order placed', color: '#E9B10F' },
  { id: '#789101', amount: '$82.50', date: '09/08/04/20/2024, 10:30 AM', status: 'Preparing for dispatch', color: '#E9B10F' },
  { id: '#991122', amount: '$27.50', date: '12/07/04/20/2024, 09:20 PM', status: 'Out for delivery', color: '#E9B10F' },
  { id: '#112233', amount: '$23.75', date: '15/06/04/20/2024, 7:15 PM', status: 'Delivered', color: 'green' },
  { id: '#654321', amount: '$120.25', date: '12/05/04/20/2024, 11:00 AM', status: 'Cancelled by you / store', color: 'red' },
];

export default function Orders() {
  const insets = useSafeAreaInsets();

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card}>
      <View>
        <Text style={styles.orderId}>{item.id}</Text>
        <Text style={styles.amount}>{item.amount}    {item.date}</Text>
        <Text style={[styles.status, { color: item.color }]}>{item.status}</Text>
      </View>
      <Ionicons name="chevron-forward" size={moderateScale(18)} color="#E9B10F" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: Math.max(insets.bottom, verticalScale(1)) }}>
      <ImageBackground
        source={require('../../assets/images/background2.png')}
        style={styles.backgroundImage}
      >
        <Header title="My orders" showDefaultIcons={false} />
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  listContainer: {
    padding: scale(16),
    paddingBottom: verticalScale(75),
  },
  card: {
    backgroundColor: '#FFF7E8',
    borderRadius: 12,
    padding: scale(14),
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9B10F',
    borderLeftWidth: 1
  },
  orderId: {
    fontSize: moderateScale(20),
    fontFamily: 'PoppinsSemiBold',
    color: '#000',
  },
  amount: {
    fontSize: moderateScale(14),
    fontFamily: 'PoppinsMedium',
    color: '#1E1E1E',
    marginTop: 2,
  },
  date: {
    fontSize: moderateScale(12),
    fontFamily: 'PoppinsRegular',
    color: '#6E6E6E',
    marginVertical: 2,
  },
  status: {
    fontSize: moderateScale(13),
    fontFamily: 'PoppinsMedium',
    marginTop: 4,
  },
});
