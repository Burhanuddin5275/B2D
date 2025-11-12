import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { ImageBackground } from 'expo-image'
import React, { useMemo, useState } from 'react'
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { scale, verticalScale } from 'react-native-size-matters'

const { width } = Dimensions.get('window')

type Suggestion = {
  id: string
  title: string
  subtitle: string
  image?: any
  emoji?: string
  bgColor?: string
  type: 'category' | 'product'
  price?: string
  unit?: string
}

const CATEGORIES: Suggestion[] = [
  {
    id: 'cat-spices',
    title: 'Spices & Seasoning',
    subtitle: 'in Food Category',
    emoji: '🌶️',
    bgColor: '#FFD4C4',
    type: 'category'
  },
  {
    id: 'cat-biscuits',
    title: 'Biscuits',
    subtitle: 'Category',
    image: require('../../assets/images/Ritz.png'),
    type: 'category'
  },
]
const PRODUCTS: Suggestion[] = [
  {
    id: 'prod-1',
    title: 'RITZ Fresh Stacks\nOriginal Crackers',
    subtitle: 'Family Size, 17.8 oz',
    price: '4.98',
    image: require('../../assets/images/Ritz.png'),
    type: 'product'
  },
  {
    id: 'prod-2',
    title: 'Great Value Mini\nPretzel Twists',
    subtitle: '16 oz',
    price: '2.24',
    image: require('../../assets/images/Mini.png'),
    type: 'product'
  },
  {
    id: 'prod-3',
    title: 'Loacker Classic Wafers Mix, Variety...',
    subtitle: '45g/1.59oz, Pack of 6',
    price: '10.19',
    image: require('../../assets/images/loacker.png'),
    type: 'product'
  },
  {
    id: 'prod-4',
    title: 'LOVE CORN Variety Pack | Sea Salt, BBQ...',
    subtitle: '0.7oz, 18 Bags',
    price: '15.19',
    image: require('../../assets/images/snack.png'),
    type: 'product'
  },
    {
    id: 'prod-5',
    title: 'Fresh Sweet\nCorn on the Cob',
    subtitle: '1 each',
    price: '4.98',
    image: require('../../assets/images/corn.png'),
    type: 'product'
  },
  {
    id: 'prod-6',
    title: 'Fresh Strawberry',
    subtitle: '12 pieces',
    price: '2.24',
    image: require('../../assets/images/strawberry.png'),
    type: 'product'
  },
  {
    id: 'prod-7',
    title: 'Fresh Roma Tomato',
    subtitle: '1 pieces',
    price: '10.19',
    image: require('../../assets/images/tomatao.png'),
    type: 'product'
  },
  {
    id: 'prod-8',
    title: 'Fresh Hass Avocado',
    subtitle: '1 pieces',
    price: '15.19',
    image: require('../../assets/images/avocados.png'),
    type: 'product'
  }, 

];
const Search = () => {
  const navigation = useNavigation()
  const [query, setQuery] = useState('')
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [wishlist, setWishlist] = useState<string[]>([]);
  const insets = useSafeAreaInsets();

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);


  const increment = (id: string) => {
    setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrement = (id: string) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current - 1);
      const updated = { ...prev, [id]: next };
      if (next === 0) delete updated[id];
      return updated;
    });
  };


  const { categories, products } = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return { categories: [], products: [] }

    return {
      categories: CATEGORIES.filter(s =>
        s.title.toLowerCase().includes(q) || s.subtitle.toLowerCase().includes(q)
      ),
      products: PRODUCTS.filter(s =>
        s.title.toLowerCase().includes(q) || s.subtitle.toLowerCase().includes(q)
      )
    }
  }, [query])

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: Math.max(insets.bottom, verticalScale(1)) }}>
      <ImageBackground
        source={require('../../assets/images/background2.png')}
        style={styles.backgroundImage}
      >
        <ImageBackground
          source={require('../../assets/images/background1.png')}
          style={styles.innerBg}
        >
          <View style={styles.searchBar}>
            <View style={styles.inputWrap}>
              <TextInput
                autoFocus
                value={query}
                onChangeText={setQuery}
                placeholder="Search for category & products"
                placeholderTextColor="gray"
                style={styles.input}
              />
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        {query.trim().length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Start typing to search for products</Text>
          </View>
        ) : categories.length === 0 && products.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Try refining your search or</Text>
            <Text style={styles.emptyTitle}>explore different categories to find</Text>
            <Text style={styles.emptyTitle}>what you're looking for.</Text>
          </View>
        ) : (
          <View style={styles.resultsWrap}>
            {categories.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Category</Text>
                <FlatList
                  data={categories}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.row}>
                      {item.image ? (
                        <Image source={item.image} style={styles.thumbImage} />
                      ) : (
                        <View style={[styles.emojiWrap, { backgroundColor: item.bgColor || '#EEE' }]}>
                          <Text style={styles.emoji}>{item.emoji || '🛒'}</Text>
                        </View>
                      )}
                      <View style={styles.rowText}>
                        <Text style={styles.rowTitle}>{item.title}</Text>
                        <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
                      </View>
                      <TouchableOpacity style={styles.rowAction} onPress={() => setQuery('')}>
                        <Ionicons name="close" size={18} color="#9B9B9B" />
                      </TouchableOpacity>
                    </View>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                  contentContainerStyle={styles.listContent}
                />
              </>
            )}
            {products.length > 0 && (
              <View style={styles.productsSection}>
                <Text style={styles.sectionTitle}>Products</Text>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.productsGrid}>
                    {products.map((item) => {
                      const qty = quantities[item.id] || 0;
                      return (
                        <TouchableOpacity key={item.id} style={styles.productCard}>
                          <View style={styles.productImage}>
                            <Image source={item.image} style={styles.productPic} resizeMode="contain" />
                          </View>
                          <TouchableOpacity
                            style={[styles.favoriteButton, isInWishlist(item.id) && styles.favoriteButtonActive]}
                            onPress={() => toggleWishlist(item.id)}
                          >
                            <Ionicons
                              name={isInWishlist(item.id) ? "heart" : "heart-outline"}
                              size={20}
                              color={isInWishlist(item.id) ? "#cfcdcdff" : "#888"}
                            />
                          </TouchableOpacity>
                          <View style={styles.productInfo}>
                            <Text style={styles.productName}>{item.title}</Text>
                            <Text style={styles.productSubtitle}>{item.subtitle}</Text>
                            <Text style={styles.priceText}>${item.price}</Text>
                            <View style={styles.buttonContainer}>
                              {qty === 0 ? (
                                <TouchableOpacity
                                  style={styles.addButton}
                                  onPress={() => increment(item.id)}
                                >
                                  <Text style={styles.addButtonText}>+ Add</Text>
                                </TouchableOpacity>
                              ) : (
                                <View style={styles.qtyControl}>
                                  <TouchableOpacity
                                    style={styles.qtySideButton}
                                    onPress={() => decrement(item.id)}
                                  >
                                    <Text style={styles.qtySideButtonText}>−</Text>
                                  </TouchableOpacity>
                                  <View style={styles.qtyPill}>
                                    <Text style={styles.qtyText}>{String(qty).padStart(2, '0')}</Text>
                                  </View>
                                  <TouchableOpacity
                                    style={styles.qtySideButtonFilled}
                                    onPress={() => increment(item.id)}
                                  >
                                    <Text style={styles.qtySideButtonFilledText}>+</Text>
                                  </TouchableOpacity>
                                </View>
                              )}
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            )}

          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
  },
  innerBg: {
    height: verticalScale(120),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginTop: verticalScale(25)
  },
  inputWrap: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  leftIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#F4A300',
  },
  cancel: {
    color: '#0A84FF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: '#1E1E1E',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 2,
    fontWeight: '600',
  },
  resultsWrap: {
    flex: 1,
    paddingTop: 12,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    fontSize: 20,
    fontWeight: '700',
    color: '#1E1E1E',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  emojiWrap: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 26,
  },
  thumbImage: {
    width: 56,
    height: 40,
    resizeMode: 'contain',
    marginRight: 12,
    borderRadius: 6,
  },
  rowText: {
    flex: 1,
    marginLeft: 12,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1E1E',
    marginBottom: 2,
  },
  rowSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
  },
  rowAction: {
    padding: 6,
  },
  separator: {
    height: 1,
    backgroundColor: '#E9E9EA',
  },
  productsSection: {
    marginVertical: verticalScale(25)
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    marginBottom: verticalScale(120)
  },
  productCard: {
    width: scale(175),
    borderRightWidth: 1,
    borderColor: '#E0E0E0',
    position: 'relative',
    padding: 10,
    borderRadius: 0,
    borderTopWidth: 1,
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
  productImage: {
    width: scale(150),
    height: verticalScale(140),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  productPic: {
    width: 120,
    height: 120,
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
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 8,
    width: '100%',
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
  addButton: {
    borderColor: '#F4A300',
    borderWidth: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#F4A300',
    fontWeight: '700',
    fontSize: 14,
  },
})

export default Search