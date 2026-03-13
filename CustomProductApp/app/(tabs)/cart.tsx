import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore';
import { PRODUCT_ICONS } from '../../constants/products';
import { CartItem } from '../../constants/types';

function formatPrice(price: number) {
  return `${price.toLocaleString('hu-HU')} Ft`;
}

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <View style={styles.itemCard}>
      <View style={styles.itemEmoji}>
        <Text style={{ fontSize: 36 }}>{PRODUCT_ICONS[item.product.category]}</Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.product.name}</Text>
        <Text style={styles.itemMeta}>
          {item.selectedSize} · {item.selectedColor}
        </Text>
        <Text style={styles.itemPrice}>{formatPrice(item.unitPrice)}</Text>
      </View>
      <View style={styles.itemActions}>
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Ionicons name="remove" size={16} color="#6C3CE1" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Ionicons name="add" size={16} color="#6C3CE1" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeBtn}>
          <Ionicons name="trash-outline" size={16} color="#E53E3E" />
          <Text style={styles.removeBtnText}>Törlés</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CartScreen() {
  const { items, totalPrice, totalItems, clearCart } = useCartStore();
  const tp = totalPrice();
  const shipping = tp >= 15000 ? 0 : 1490;

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={{ fontSize: 72, marginBottom: 16 }}>🛒</Text>
          <Text style={styles.emptyTitle}>A kosarad üres</Text>
          <Text style={styles.emptyText}>
            Tervezz egyedi terméket és add a kosárba!
          </Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.shopBtnText}>Termékek böngészése</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Free shipping banner */}
        {shipping > 0 && (
          <View style={styles.shippingBanner}>
            <Ionicons name="bicycle-outline" size={18} color="#6C3CE1" />
            <Text style={styles.shippingBannerText}>
              Még {formatPrice(15000 - tp)} vásárlás és ingyenes a szállítás!
            </Text>
          </View>
        )}
        {shipping === 0 && (
          <View style={[styles.shippingBanner, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="checkmark-circle" size={18} color="#2E7D32" />
            <Text style={[styles.shippingBannerText, { color: '#2E7D32' }]}>
              Ingyenes szállítás jár a rendelésedhez! 🎉
            </Text>
          </View>
        )}

        {items.map((item) => (
          <CartItemRow key={item.id} item={item} />
        ))}

        {/* Order Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Összesítő</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Termékek ({totalItems()} db)</Text>
            <Text style={styles.summaryValue}>{formatPrice(tp)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Szállítás</Text>
            <Text
              style={[
                styles.summaryValue,
                shipping === 0 && { color: '#2E7D32' },
              ]}
            >
              {shipping === 0 ? 'Ingyenes' : formatPrice(shipping)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.totalLabel}>Összesen</Text>
            <Text style={styles.totalValue}>{formatPrice(tp + shipping)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => router.push('/cart/checkout')}
        >
          <Text style={styles.checkoutBtnText}>
            Megrendelés · {formatPrice(tp + shipping)}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f5f5' },
  scroll: { flex: 1 },
  shippingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3EEFF',
    padding: 12,
    margin: 12,
    borderRadius: 10,
  },
  shippingBannerText: { flex: 1, fontSize: 13, color: '#6C3CE1', fontWeight: '500' },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 10,
    borderRadius: 14,
    padding: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  itemEmoji: {
    width: 60,
    height: 60,
    backgroundColor: '#F3EEFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '600', color: '#222', marginBottom: 2 },
  itemMeta: { fontSize: 12, color: '#888', marginBottom: 4 },
  itemPrice: { fontSize: 15, fontWeight: '700', color: '#6C3CE1' },
  itemActions: { alignItems: 'flex-end', gap: 10 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#6C3CE1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: { fontSize: 15, fontWeight: '700', color: '#222', minWidth: 20, textAlign: 'center' },
  removeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  removeBtnText: { fontSize: 12, color: '#E53E3E' },
  summary: {
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 14,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 14, color: '#666' },
  summaryValue: { fontSize: 14, color: '#333', fontWeight: '500' },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#6C3CE1' },
  bottomBar: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  checkoutBtn: {
    backgroundColor: '#6C3CE1',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  checkoutBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#888', textAlign: 'center', lineHeight: 22 },
  shopBtn: {
    marginTop: 24,
    backgroundColor: '#6C3CE1',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  shopBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
