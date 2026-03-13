import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import { PRODUCTS, PRODUCT_ICONS } from '../../constants/products';

function formatPrice(price: number) {
  return `${price.toLocaleString('hu-HU')} Ft`;
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = PRODUCTS.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? '');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] ?? '');

  if (!product) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Termék nem található</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Preview */}
        <View style={styles.imageContainer}>
          <Text style={styles.emoji}>{PRODUCT_ICONS[product.category]}</Text>
          <View style={styles.customBadge}>
            <Text style={styles.customBadgeText}>100% Egyedi</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{formatPrice(product.basePrice)}-tól</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Size Selection */}
          <Text style={styles.sectionTitle}>Méret</Text>
          <View style={styles.optionRow}>
            {product.sizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.optionChip,
                  selectedSize === size && styles.optionChipActive,
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedSize === size && styles.optionTextActive,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Color Selection */}
          {product.colors.length > 1 && (
            <>
              <Text style={styles.sectionTitle}>Alap szín</Text>
              <View style={styles.optionRow}>
                {product.colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.optionChip,
                      selectedColor === color && styles.optionChipActive,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedColor === color && styles.optionTextActive,
                      ]}
                    >
                      {color}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Features */}
          <View style={styles.features}>
            {[
              '✅ Prémium minőség',
              '🚚 Gyors kiszállítás (3-5 munkanap)',
              '♻️ Fenntartható anyagok',
              '🔄 30 napos visszaküldési garancia',
            ].map((f) => (
              <Text key={f} style={styles.featureText}>{f}</Text>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() =>
            router.push({
              pathname: '/design/[productId]',
              params: {
                productId: product.id,
                size: selectedSize,
                color: selectedColor,
              },
            })
          }
        >
          <Text style={styles.ctaText}>🎨  Tervezés megkezdése</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  notFound: { textAlign: 'center', marginTop: 40, color: '#999', fontSize: 16 },
  imageContainer: {
    backgroundColor: '#F3EEFF',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: { fontSize: 100 },
  customBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#6C3CE1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  customBadgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  content: { padding: 16 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 6 },
  price: { fontSize: 20, color: '#6C3CE1', fontWeight: '700', marginBottom: 12 },
  description: { fontSize: 15, color: '#555', lineHeight: 22, marginBottom: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 4,
  },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  optionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  optionChipActive: {
    borderColor: '#6C3CE1',
    backgroundColor: '#F3EEFF',
  },
  optionText: { fontSize: 13, color: '#555' },
  optionTextActive: { color: '#6C3CE1', fontWeight: '600' },
  features: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    marginTop: 8,
  },
  featureText: { fontSize: 14, color: '#444', lineHeight: 20 },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  ctaButton: {
    backgroundColor: '#6C3CE1',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
});
