import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore';
import { ShippingAddress } from '../../constants/types';

function formatPrice(price: number) {
  return `${price.toLocaleString('hu-HU')} Ft`;
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? label}
        placeholderTextColor="#aaa"
        keyboardType={keyboardType ?? 'default'}
      />
    </View>
  );
}

export default function CheckoutScreen() {
  const { totalPrice, items, placeOrder } = useCartStore();
  const tp = totalPrice();
  const shipping = tp >= 15000 ? 0 : 1490;

  const [form, setForm] = useState<ShippingAddress>({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Magyarország',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');

  const update = (key: keyof ShippingAddress) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const isValid =
    form.name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.street.trim() &&
    form.city.trim() &&
    form.postalCode.trim();

  const handleOrder = () => {
    if (!isValid) {
      Alert.alert('Hiányzó adatok', 'Kérjük töltsd ki az összes kötelező mezőt!');
      return;
    }
    const order = placeOrder(form);
    router.replace({
      pathname: '/cart/success',
      params: { orderId: order.id },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Shipping */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="location-outline" size={16} /> Szállítási adatok
          </Text>
          <Field label="Teljes név *" value={form.name} onChangeText={update('name')} />
          <Field
            label="E-mail *"
            value={form.email}
            onChangeText={update('email')}
            keyboardType="email-address"
          />
          <Field
            label="Telefonszám *"
            value={form.phone}
            onChangeText={update('phone')}
            keyboardType="phone-pad"
          />
          <Field label="Utca, házszám *" value={form.street} onChangeText={update('street')} />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Field
                label="Irányítószám *"
                value={form.postalCode}
                onChangeText={update('postalCode')}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 2, marginLeft: 8 }}>
              <Field label="Város *" value={form.city} onChangeText={update('city')} />
            </View>
          </View>
          <Field label="Ország" value={form.country} onChangeText={update('country')} />
        </View>

        {/* Payment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="card-outline" size={16} /> Fizetési mód
          </Text>
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'card' && styles.paymentOptionActive]}
            onPress={() => setPaymentMethod('card')}
          >
            <Ionicons
              name="card-outline"
              size={22}
              color={paymentMethod === 'card' ? '#6C3CE1' : '#555'}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.paymentLabel}>Bankkártyás fizetés</Text>
              <Text style={styles.paymentSub}>Visa, Mastercard, American Express</Text>
            </View>
            {paymentMethod === 'card' && (
              <Ionicons name="checkmark-circle" size={22} color="#6C3CE1" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'cash' && styles.paymentOptionActive]}
            onPress={() => setPaymentMethod('cash')}
          >
            <Ionicons
              name="cash-outline"
              size={22}
              color={paymentMethod === 'cash' ? '#6C3CE1' : '#555'}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.paymentLabel}>Utánvét</Text>
              <Text style={styles.paymentSub}>Fizetés átvételkor</Text>
            </View>
            {paymentMethod === 'cash' && (
              <Ionicons name="checkmark-circle" size={22} color="#6C3CE1" />
            )}
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="receipt-outline" size={16} /> Rendelés összesítő
          </Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Termékek ({items.length} tétel)</Text>
            <Text style={styles.summaryValue}>{formatPrice(tp)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Szállítás</Text>
            <Text style={[styles.summaryValue, shipping === 0 && { color: '#2E7D32' }]}>
              {shipping === 0 ? 'Ingyenes' : formatPrice(shipping)}
            </Text>
          </View>
          <View style={[styles.summaryRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#eee' }]}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#222' }}>Fizetendő</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#6C3CE1' }}>
              {formatPrice(tp + shipping)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.orderBtn, !isValid && styles.orderBtnDisabled]}
          onPress={handleOrder}
          disabled={!isValid}
        >
          <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
          <Text style={styles.orderBtnText}>Rendelés leadása</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f5f5' },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 16, paddingBottom: 24 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  field: { gap: 4 },
  fieldLabel: { fontSize: 13, color: '#555', fontWeight: '500' },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  row: { flexDirection: 'row' },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  paymentOptionActive: {
    borderColor: '#6C3CE1',
    backgroundColor: '#F3EEFF',
  },
  paymentLabel: { fontSize: 15, fontWeight: '600', color: '#333' },
  paymentSub: { fontSize: 12, color: '#888', marginTop: 2 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 14, color: '#666' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#333' },
  bottomBar: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  orderBtn: {
    backgroundColor: '#6C3CE1',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  orderBtnDisabled: { backgroundColor: '#bbb' },
  orderBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
});
