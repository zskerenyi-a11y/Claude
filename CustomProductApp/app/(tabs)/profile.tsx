import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore';

function formatPrice(price: number) {
  return `${price.toLocaleString('hu-HU')} Ft`;
}

function MenuItem({
  icon,
  label,
  value,
  onPress,
  danger,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
        <Ionicons name={icon as any} size={20} color={danger ? '#E53E3E' : '#6C3CE1'} />
      </View>
      <Text style={[styles.menuLabel, danger && { color: '#E53E3E' }]}>{label}</Text>
      {value && <Text style={styles.menuValue}>{value}</Text>}
      {!danger && <Ionicons name="chevron-forward" size={16} color="#ccc" />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { orders, totalItems } = useCartStore();
  const [notifications, setNotifications] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  const totalSpent = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 40 }}>👤</Text>
          </View>
          <Text style={styles.name}>Vendég felhasználó</Text>
          <Text style={styles.subtitle}>Üdvözlünk a CustomProduct-ban!</Text>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Rendelés</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalItems()}</Text>
            <Text style={styles.statLabel}>Kosárban</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{orders.length > 0 ? formatPrice(totalSpent) : '—'}</Text>
            <Text style={styles.statLabel}>Összköltés</Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Értesítések</Text>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="notifications-outline" size={20} color="#6C3CE1" />
            </View>
            <Text style={styles.menuLabel}>Push értesítések</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ true: '#6C3CE1' }}
            />
          </View>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="mail-outline" size={20} color="#6C3CE1" />
            </View>
            <Text style={styles.menuLabel}>Hírlevél</Text>
            <Switch
              value={newsletter}
              onValueChange={setNewsletter}
              trackColor={{ true: '#6C3CE1' }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Információk</Text>
          <MenuItem icon="document-text-outline" label="Általános szerződési feltételek" onPress={() => {}} />
          <MenuItem icon="shield-checkmark-outline" label="Adatvédelmi irányelvek" onPress={() => {}} />
          <MenuItem icon="help-circle-outline" label="Súgó és támogatás" onPress={() => {}} />
          <MenuItem icon="star-outline" label="Értékeld az appot" onPress={() => {}} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fiók</Text>
          <MenuItem icon="log-in-outline" label="Bejelentkezés" onPress={() => {}} />
          <MenuItem icon="person-add-outline" label="Regisztráció" onPress={() => {}} />
        </View>

        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>CustomProduct v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2024 CustomProduct. Minden jog fenntartva.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#6C3CE1',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  stats: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#6C3CE1', marginBottom: 2 },
  statLabel: { fontSize: 12, color: '#888' },
  statDivider: { width: 1, backgroundColor: '#eee', marginVertical: 4 },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconDanger: { backgroundColor: '#FFF0F0' },
  menuLabel: { flex: 1, fontSize: 15, color: '#333' },
  menuValue: { fontSize: 14, color: '#999', marginRight: 8 },
  appInfo: { alignItems: 'center', padding: 24, gap: 4 },
  appVersion: { fontSize: 13, color: '#aaa' },
  appCopyright: { fontSize: 12, color: '#bbb' },
});
