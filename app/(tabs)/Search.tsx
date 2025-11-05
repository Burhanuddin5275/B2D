import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { ImageBackground } from 'expo-image'
import React, { useMemo, useState } from 'react'
import { Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { verticalScale } from 'react-native-size-matters'

const { width } = Dimensions.get('window')

type Suggestion = {
  id: string
  title: string
  subtitle: string
  image?: any
  emoji?: string
  bgColor?: string
}

const ALL_SUGGESTIONS: Suggestion[] = [
  {
    id: 'cat-spices',
    title: 'Spices & Seasoning',
    subtitle: 'in Food Category',
    emoji: '🌶️',
    bgColor: '#FFD4C4',
  },
  {
    id: 'cat-biscuits',
    title: 'Biscuits',
    subtitle: 'Category',
    image: require('../../assets/images/Ritz.png'),
  },
]

const Search = () => {
  const navigation = useNavigation()
  const [query, setQuery] = useState('')

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return ALL_SUGGESTIONS.filter(s =>
      s.title.toLowerCase().includes(q) || s.subtitle.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <SafeAreaView style={styles.container}>
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
        {suggestions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Try refining your search or</Text>
            <Text style={styles.emptyTitle}>explore different categories to find</Text>
            <Text style={styles.emptyTitle}>what you're looking for.</Text>
          </View>
        ) : (
          <View style={styles.resultsWrap}>
            <Text style={styles.sectionTitle}>Category</Text>
            <FlatList
              data={suggestions}
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
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
  },
  innerBg: {
 height:verticalScale(120),
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
  marginTop:verticalScale(25)
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
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E1E1E',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
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
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1E1E',
  },
  rowSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  rowAction: {
    padding: 6,
  },
  separator: {
    height: 1,
    backgroundColor: '#E9E9EA',
    marginLeft: 72,
  },
})

export default Search