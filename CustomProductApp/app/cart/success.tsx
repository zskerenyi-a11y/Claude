import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OrderSuccessScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={60} color="#fff" />
        </View>

        <Text style={styles.title}>Rendelés leadva!</Text>
        <Text style={styles.subtitle}>Köszönjük a rendelésed!</Text>

        <View style={styles.orderIdBox}>
          <Text style={styles.orderIdLabel}>Rendelés azonosító</Text>
          <Text style={styles.orderId}>{orderId}</Text>
        </View>

        <Text style={styles.message}>
          Visszaigazoló e-mailt küldünk a megadott e-mail címre. Az egyedi termékedet
          3-5 munkanapon belül szállítjuk ki.
        </Text>

        <View style={styles.steps}>
          {[
            { icon: 'receipt-outline', label: 'Rendelés visszaigazolva', done: true },
            { icon: 'construct-outline', label: 'Gyártás alatt (1-2 nap)', done: false },
            { icon: 'bicycle-outline', label: 'Kiszállítás (1-2 nap)', done: false },
            { icon: 'home-outline', label: 'Megérkezés', done: false },
          ].map((step, i) => (
            <View key={i} style={styles.step}>
              <View style={[styles.stepIcon, step.done && styles.stepIconDone]}>
                <Ionicons
                  name={step.icon as any}
                  size={18}
                  color={step.done ? '#fff' : '#aaa'}
                />
              </View>
              <Text style={[styles.stepLabel, step.done && styles.stepLabelDone]}>
                {step.label}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.homeBtnText}>Vissza a főoldalra</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ordersBtn}
          onPress={() => router.replace('/(tabs)/orders')}
        >
          <Text style={styles.ordersBtnText}>Rendeléseim megtekintése</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    paddingTop: 48,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6C3CE1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6C3CE1',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#222', marginBottom: 6 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  orderIdBox: {
    backgroundColor: '#F3EEFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  orderIdLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
  orderId: { fontSize: 18, fontWeight: 'bold', color: '#6C3CE1', letterSpacing: 1 },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  steps: { width: '100%', gap: 12, marginBottom: 32 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIconDone: { backgroundColor: '#6C3CE1' },
  stepLabel: { fontSize: 14, color: '#aaa' },
  stepLabelDone: { color: '#333', fontWeight: '600' },
  homeBtn: {
    backgroundColor: '#6C3CE1',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  homeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  ordersBtn: {
    borderWidth: 1.5,
    borderColor: '#6C3CE1',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  ordersBtnText: { color: '#6C3CE1', fontWeight: '600', fontSize: 16 },
});
