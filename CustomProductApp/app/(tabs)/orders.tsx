import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore';
import { Order } from '../../constants/types';
import { PRODUCT_ICONS } from '../../constants/products';

function formatPrice(price: number) {
  return `${price.toLocaleString('hu-HU')} Ft`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const STATUS_INFO: Record<Order['status'], { label: string; color: string; icon: string }> = {
  pending: { label: 'Feldolgozás alatt', color: '#FF8C00', icon: 'time-outline' },
  processing: { label: 'Gyártás alatt', color: '#4169E1', icon: 'construct-outline' },
  shipped: { label: 'Kiszállítás alatt', color: '#2E8B57', icon: 'bicycle-outline' },
  delivered: { label: 'Kézbesítve', color: '#6C3CE1', icon: 'checkmark-circle-outline' },
};

function OrderCard({ order }: { order: Order }) {
  const status = STATUS_INFO[order.status];
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
          <Ionicons name={status.icon as any} size={14} color={status.color} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        {order.items.map((item) => (
          <View key={item.id} style={styles.orderItem}>
            <Text style={{ fontSize: 24 }}>{PRODUCT_ICONS[item.product.category]}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.orderItemName}>{item.product.name}</Text>
              <Text style={styles.orderItemMeta}>
                {item.selectedSize} · {item.selectedColor} · {item.quantity} db
              </Text>
            </View>
            <Text style={styles.orderItemPrice}>{formatPrice(item.unitPrice * item.quantity)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.shippingTo}>
          📦 {order.shippingAddress.name}, {order.shippingAddress.city}
        </Text>
        <Text style={styles.orderTotal}>{formatPrice(order.totalPrice)}</Text>
      </View>
    </View>
  );
}

export default function OrdersScreen() {
  const { orders } = useCartStore();

  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={{ fontSize: 64, marginBottom: 16 }}>📦</Text>
          <Text style={styles.emptyTitle}>Még nincs rendelésed</Text>
          <Text style={styles.emptyText}>
            Tervezd meg az első egyedi termékedet!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {[...orders].reverse().map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f5f5' },
  scroll: { flex: 1 },
  content: { padding: 12, gap: 12 },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: { fontSize: 15, fontWeight: 'bold', color: '#222' },
  orderDate: { fontSize: 12, color: '#888', marginTop: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: { fontSize: 12, fontWeight: '600' },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    gap: 10,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  orderItemName: { fontSize: 14, fontWeight: '600', color: '#333' },
  orderItemMeta: { fontSize: 12, color: '#888', marginTop: 2 },
  orderItemPrice: { fontSize: 14, fontWeight: '700', color: '#6C3CE1' },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginTop: 12,
  },
  shippingTo: { fontSize: 12, color: '#666', flex: 1 },
  orderTotal: { fontSize: 16, fontWeight: 'bold', color: '#6C3CE1' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#888', textAlign: 'center' },
});
