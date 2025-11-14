import Header from '@/components/Header'
import { colors } from '@/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { Animated, Image, ImageBackground, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { scale, verticalScale } from 'react-native-size-matters'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist, selectWishlistItems } from '../../store/wishlistSlice'
import { ProductStyle } from '@/assets/css/style'

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
  const [selectedOption, setSelectedOption] = useState('Relevance');
  const insets = useSafeAreaInsets();
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
          <View style={ProductStyle.productsSection}> 
            <View style={ProductStyle.productsGrid}>
              {productsData.length > 0 ? productsData.map((product: Product) => {
                const qty = quantities[product.id] || 0;
                return (
                  <TouchableOpacity 
                    key={product.id} 
                    style={ProductStyle.productCard}
                    onPress={() => {
                      router.push({
                        pathname: '/Product', 
                        params: {
                          product: JSON.stringify(product),
                          categoryName: headerTitle
                        }
                      });
                    }}>
                    <View style={ProductStyle.productImage}>
                      <Image source={product.img} style={ProductStyle.productPic} resizeMode="contain" />
                    </View>
                    <TouchableOpacity
                      style={[ProductStyle.favoriteButton, checkIsInWishlist(product.id) && ProductStyle.favoriteButtonActive]}
                      onPress={() => toggleWishlist(product)}
                    >
                      <Ionicons
                        name={checkIsInWishlist(product.id) ? "heart" : "heart-outline"}
                        size={20}
                        color={checkIsInWishlist(product.id) ? "#b9b7b7ff" : "#888"}
                      />
                    </TouchableOpacity>
                    <View style={ProductStyle.productInfo}>
                      <Text style={ProductStyle.productName}>{product.name}</Text>
                      <Text style={ProductStyle.productSubtitle}>{product.subtitle}</Text>

                      <Text style={ProductStyle.priceText}>${product.price.toFixed(2)}</Text>
                      <View style={ProductStyle.buttonContainer}>
                        {qty === 0 ? (
                          <TouchableOpacity
                            style={ProductStyle.addButton}
                            onPress={() => increment(product.id)}
                          >
                            <Text style={ProductStyle.addButtonText}>+ Add</Text>
                          </TouchableOpacity>
                        ) : (
                          <View style={ProductStyle.qtyControl}>
                            <TouchableOpacity
                              style={ProductStyle.qtySideButton}
                              onPress={() => decrement(product.id)}
                            >
                              <Text style={ProductStyle.qtySideButtonText}>−</Text>
                            </TouchableOpacity>
                            <View style={ProductStyle.qtyPill}>
                              <Text style={ProductStyle.qtyText}>{String(qty).padStart(2, '0')}</Text>
                            </View>
                            <TouchableOpacity
                              style={ProductStyle.qtySideButtonFilled}
                              onPress={() => increment(product.id)}
                            >
                              <Text style={ProductStyle.qtySideButtonFilledText}>+</Text>
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
        <View style={[styles.modalOverlay,{ paddingBottom: Math.max(insets.bottom, verticalScale(1))}]}>
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
              <View style={styles.filterContent}>
                <View style={styles.headerContainer}>
                  <Text style={styles.filterTitle}>Sort products By</Text>
                  <TouchableOpacity 
                    onPress={hideFilterModal}
                    style={{
                      position: 'absolute',
                      right: 0,
                    }}
                  >
                    <Ionicons name="close" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
                
                {/* Sort Options */}
                <View style={styles.optionsContainer}>
                  <TouchableOpacity 
                    style={styles.optionItem}
                    onPress={() => setSelectedOption('Relevance')}
                  >
                    <View style={styles.radioButton}>
                      {selectedOption === 'Relevance' && <View style={styles.radioButtonSelected} />}
                    </View>
                    <Text style={styles.optionText}>Relevance</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.divider} />
                  
                  <TouchableOpacity 
                    style={styles.optionItem}
                    onPress={() => setSelectedOption('Price (low to high)')}
                  >
                    <View style={styles.radioButton}>
                      {selectedOption === 'Price (low to high)' && <View style={styles.radioButtonSelected} />}
                    </View>
                    <Text style={styles.optionText}>Price (low to high)</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.divider} />
                  
                  <TouchableOpacity 
                    style={styles.optionItem}
                    onPress={() => setSelectedOption('Price (high to low)')}
                  >
                    <View style={styles.radioButton}>
                      {selectedOption === 'Price (high to low)' && <View style={styles.radioButtonSelected} />}
                    </View>
                    <Text style={styles.optionText}>Price (high to low)</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.divider} />
                  
                  <TouchableOpacity 
                    style={styles.optionItem}
                    onPress={() => setSelectedOption('Popularity')}
                  >
                    <View style={styles.radioButton}>
                      {selectedOption === 'Popularity' && <View style={styles.radioButtonSelected} />}
                    </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
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
    bottom:0,
    height: verticalScale(320),
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: scale(10),
  },
  filterContent: {
    flex: 1,
    marginTop: verticalScale(20),
  },
  filterTitle: {
    fontSize: scale(15),
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  optionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primaryDark,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primaryDark,
  },
  optionText: {
    fontSize: scale(16),
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: scale(16),
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
})