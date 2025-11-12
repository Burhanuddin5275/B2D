import Header from '@/components/Header'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { Animated, Image, ImageBackground, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { scale, verticalScale } from 'react-native-size-matters'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist, selectWishlistItems } from '../../store/wishlistSlice'

interface Product {
  id: number;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  img: any;
  seller: string;
}


const Category = () => {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { category } = params;
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [wishlist, setWishlist] = useState<number[]>([]);
  const checkIsInWishlist = (productId: number) => wishlist.includes(productId);
  const dispatch = useDispatch(); 
  const { categoryName, products } = useLocalSearchParams();
  const productsData: Product[] = products ? JSON.parse(products as string) : [];
  const wishlistItems = useSelector(selectWishlistItems);
  const [isFilterVisible, setIsFilterVisible] = useState(false);


  // Set header title to the category name
  const headerTitle = typeof categoryName === 'string' ? categoryName : 'Category';

  const toggleWishlist = (product: any) => {
    if (checkIsInWishlist(product.id)) {
      dispatch(removeFromWishlist(product.id));
      setWishlist(prev => prev.filter(id => id !== product.id));
    } else {
      dispatch(addToWishlist(product));
      setWishlist(prev => [...prev, product.id]);
    }
  };

  const increment = (id: number) => {
    setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrement = (id: number) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current - 1);
      const updated = { ...prev, [id]: next };
      if (next === 0) delete updated[id];
      return updated;
    });
  };

  const showFilterModal = () => {
    setIsFilterVisible(true);
  };

  const hideFilterModal = () => {
    setIsFilterVisible(false);
  };

  const handleFilterPress = showFilterModal;

  const handleSearchPress = () => {
   router.push('/Search');
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: Math.max(insets.bottom, verticalScale(1)) }}>
      <ImageBackground
        source={require('../../assets/images/background2.png')}
        style={styles.backgroundImage}
      >
        <Header title={headerTitle} showDefaultIcons={true} rightIcons={[
          { name: 'filter', onPress: handleFilterPress },
          { name: 'search-outline', onPress: handleSearchPress },
        ]}/>
        <ScrollView style={{flex: 1}}>
          {/* Products Section */}
          <View style={styles.productsSection}>
            <View style={styles.productsGrid}>
              {productsData.length > 0 ? productsData.map((product: Product) => {
                const qty = quantities[product.id] || 0;
                return (
                  <TouchableOpacity 
                    key={product.id} 
                    style={styles.productCard}
                    onPress={() => {
                      router.push({
                        pathname: '/Product', 
                        params: {
                          product: JSON.stringify(product),
                          categoryName: headerTitle
                        }
                      });
                    }}>
                    <View style={styles.productImage}>
                      <Image source={product.img} style={styles.productPic} resizeMode="contain" />
                    </View>
                    <TouchableOpacity
                      style={[styles.favoriteButton, checkIsInWishlist(product.id) && styles.favoriteButtonActive]}
                      onPress={() => toggleWishlist(product)}
                    >
                      <Ionicons
                        name={checkIsInWishlist(product.id) ? "heart" : "heart-outline"}
                        size={20}
                        color={checkIsInWishlist(product.id) ? "#b9b7b7ff" : "#888"}
                      />
                    </TouchableOpacity>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productSubtitle}>{product.subtitle}</Text>

                      <Text style={styles.priceText}>${product.price.toFixed(2)}</Text>
                      <View style={styles.buttonContainer}>
                        {qty === 0 ? (
                          <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => increment(product.id)}
                          >
                            <Text style={styles.addButtonText}>+ Add</Text>
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.qtyControl}>
                            <TouchableOpacity
                              style={styles.qtySideButton}
                              onPress={() => decrement(product.id)}
                            >
                              <Text style={styles.qtySideButtonText}>−</Text>
                            </TouchableOpacity>
                            <View style={styles.qtyPill}>
                              <Text style={styles.qtyText}>{String(qty).padStart(2, '0')}</Text>
                            </View>
                            <TouchableOpacity
                              style={styles.qtySideButtonFilled}
                              onPress={() => increment(product.id)}
                            >
                              <Text style={styles.qtySideButtonFilledText}>+</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }) : (
                null
              )}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>

      {/* Filter Modal */}
      <Modal
        visible={isFilterVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideFilterModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={hideFilterModal}
          >
            <Animated.View 
              style={[
                styles.bottomSheet,
              ]}
            >
              <View style={styles.dragHandle} />
              <View style={styles.filterContent}>
                <View style={styles.headerContainer}>
                  <Text style={styles.filterTitle}>Sort By</Text>
                  <TouchableOpacity onPress={hideFilterModal}>
                    <Ionicons name="close" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
                
                {/* Sort Options */}
                <View style={styles.optionsContainer}>
                  <TouchableOpacity style={styles.optionItem}>
                    <Text style={styles.optionText}>Relevance</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.divider} />
                  
                  <TouchableOpacity style={styles.optionItem}>
                    <Text style={styles.optionText}>Price (low to high)</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.divider} />
                  
                  <TouchableOpacity style={styles.optionItem}>
                    <Text style={styles.optionText}>Price (high to low)</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.divider} />
                  
                  <TouchableOpacity style={styles.optionItem}>
                    <Text style={styles.optionText}>Popularity</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default Category

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackground: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: verticalScale(47),
    height: verticalScale(350),
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
  filterContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  optionsContainer: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 16,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  productsSection: {
    marginTop: verticalScale(20),
    flexDirection: 'row'
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: verticalScale(80)
  },
  productCard: {
    width: scale(175),
    borderRightWidth: 1,
    borderColor: '#E0E0E0',
    position: 'relative',
    padding: 10,
    borderRadius: 0,
    borderTopWidth: 1,
    justifyContent:'space-between',  
  },
  productImage: {
    width: scale(150),
    height: verticalScale(140),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  productEmoji: {
    fontSize: 60,
  },
  productPic: {
    width: 120,
    height: 120,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: 'rgba(163, 161, 161, 0.1)',
  },

  productInfo: {
    paddingHorizontal: 4,
  },
  productName: {
    color: '#1E1E1E',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  productSubtitle: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  buttonContainer: {
    marginTop: 8,
    width: '100%',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  addButton: {
    borderColor: '#f5a607ff',
    borderWidth: 1,
    paddingVertical: 8,
    borderRadius: 8,

  },
  addButtonText: {
    color: '#F4A300',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 14,
  },
  qtyControl: {
    backgroundColor: '#F4A300',
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    height: 36,
  },
  qtySideButton: {
    paddingHorizontal: 12,
    height: '100%',
    justifyContent: 'center',
  },
  qtySideButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 22,
  },
  qtyPill: {
    minWidth: 36,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center'
  },
  qtySideButtonFilled: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4A300',
  },
  qtySideButtonFilledText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
})