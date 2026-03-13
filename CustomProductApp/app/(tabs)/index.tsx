import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { PRODUCTS, PRODUCT_ICONS } from '../../constants/products';
import { Product, ProductCategory } from '../../constants/types';

const CATEGORIES: { id: ProductCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Összes' },
  { id: 'blanket', label: 'Takaró' },
  { id: 'wall-art', label: 'Fali kép' },
  { id: 'mug', label: 'Bögre' },
  { id: 'pillow', label: 'Párna' },
  { id: 'tshirt', label: 'Póló' },
  { id: 'phone-case', label: 'Telefon tok' },
];

function formatPrice(price: number) {
  return `${price.toLocaleString('hu-HU')} Ft`;
}

function ProductCard({ product }: { product: Product }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/product/${product.id}`)}
      activeOpacity={0.85}
    >
      <View style={styles.cardImage}>
        <Text style={styles.cardEmoji}>{PRODUCT_ICONS[product.category]}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{product.name}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {product.description}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardPrice}>{formatPrice(product.basePrice)}-tól</Text>
          <TouchableOpacity
            style={styles.designButton}
            onPress={() => router.push(`/design/${product.id}`)}
          >
            <Text style={styles.designButtonText}>Tervezés</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ProductsScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');

  const filtered = PRODUCTS.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safe}>
      {/* Hero Banner */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>CustomProduct</Text>
        <Text style={styles.heroSubtitle}>Tervezd meg az egyedi termékedet!</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Keresés..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#999"
        />
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryChip,
              activeCategory === cat.id && styles.categoryChipActive,
            ]}
            onPress={() => setActiveCategory(cat.id)}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === cat.id && styles.categoryTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nem található termék</Text>
          </View>
        ) : (
          filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f5f5' },
  hero: {
    backgroundColor: '#6C3CE1',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  searchContainer: {
    padding: 12,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
  },
  categories: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    maxHeight: 50,
  },
  categoriesContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#6C3CE1',
  },
  categoryText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: 12,
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardImage: {
    backgroundColor: '#F3EEFF',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 72,
  },
  cardContent: {
    padding: 14,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6C3CE1',
  },
  designButton: {
    backgroundColor: '#6C3CE1',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  designButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
