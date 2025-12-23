import Header from '@/components/Header';
import { Category, fetchCategories } from '@/service/category';
import { fetchProducts, Product } from '@/service/product';
import { colors } from '@/theme/colors';
import { Entypo, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View,Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale } from 'react-native-size-matters';


export default function Categories() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategory] = useState<Category[]>([]);
   const [Products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const loadCategory = async () => {
      const data = await fetchCategories();
      setCategory(data);
      setLoading(false);
    };

    loadCategory();
  })
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
        <Header title="Categories" showDefaultIcons={false} />
        <ScrollView style={styles.content}>
          <View style={styles.gridContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => {
                  // Filter products by category and pass to the category page
                  const categoryProducts = Products.filter(
                    product => (product.category_name?.name || '').toLowerCase() === category.name.split('\n')[0].toLowerCase()
                  );

                  router.push({
                    pathname: '/Category',
                    params: {
                      categoryName: category.name,
                      products: JSON.stringify(categoryProducts)
                    }
                  });
                }}
              >
                <View style={[styles.categoryIcon]}>
                  <Image
                    src={category.image || ''}
                    style={styles.categoryIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.categoryName} numberOfLines={2}>
                  {category.name}
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
  categoryCard: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryIcon: {
    width: scale(60),
    height: verticalScale(45),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: scale(10),
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
    paddingHorizontal: 4,
  },
});
