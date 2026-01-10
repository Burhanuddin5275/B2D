import Header from '@/components/Header';
import { fetchProducts, Product } from '@/service/product';
import { fetchStores, Store, image } from '@/service/store';
import { colors } from '@/theme/colors';
import { Entypo, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale } from 'react-native-size-matters';


export default function Stores() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState<boolean>(true);
  const [stores, setStores] = useState<Store[]>([]);
  const [Products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const loadStores = async () => {
      const data = await fetchStores();
      setStores(data);
      setLoading(false);
    };

    loadStores();
  }, [])
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
        // You can set an error state here to show to the user
      } finally {
        setLoading(false);
      }
    };
    console.log("product", Products)
    loadProducts();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: Math.max(insets.bottom, verticalScale(1)) }}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.backgroundImage}
      >
        <Header title="Stores" showDefaultIcons={false} />
        <ScrollView style={styles.content}>
          <View style={styles.gridContainer}>
            {stores.map((store) => (
              <TouchableOpacity
                key={store.id}
                style={styles.storeCard}
                onPress={() => {
                  const storeProducts = Products.filter(
                    product => (product.store_name.name || '').toLowerCase() === store.name.split('\n')[0].toLowerCase()
                  );

                  router.push({
                    pathname: '/Store',
                    params: {
                      storeName: store.name,
                      products: JSON.stringify(storeProducts)
                    }
                  });
                }}
              >
                <View style={[styles.storeIcon]}>
                  <Image
                    src={store.images?.store_logo || ''}
                    style={styles.storeIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.storeName} numberOfLines={2}>
                  {store.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    padding: scale(16),
    marginBottom: verticalScale(50),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  storeCard: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 20,
  },
  storeIcon: {
    width: scale(140),
    height: verticalScale(85),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeName: {
    fontSize: scale(10),
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
    paddingHorizontal: 4,
  },
});
