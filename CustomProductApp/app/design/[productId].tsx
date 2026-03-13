import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  SafeAreaView,
  Platform,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { PRODUCTS, PRODUCT_ICONS, COLORS_PALETTE } from '../../constants/products';
import { useDesignStore } from '../../store/designStore';
import { useCartStore } from '../../store/cartStore';
import { TextLayer, ImageLayer } from '../../constants/types';
import DesignCanvas from '../../components/DesignCanvas';
import ColorPicker from '../../components/ColorPicker';

type EditorTab = 'layers' | 'text' | 'image' | 'background';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CANVAS_SIZE = Math.min(SCREEN_WIDTH - 32, 340);

export default function DesignScreen() {
  const { productId, size, color } = useLocalSearchParams<{
    productId: string;
    size: string;
    color: string;
  }>();

  const product = PRODUCTS.find((p) => p.id === productId);
  const {
    design,
    selectedLayerId,
    setBackgroundColor,
    addTextLayer,
    addImageLayer,
    updateLayer,
    removeLayer,
    selectLayer,
    resetDesign,
  } = useDesignStore();
  const addToCart = useCartStore((s) => s.addItem);

  const [activeTab, setActiveTab] = useState<EditorTab>('layers');
  const [textInput, setTextInput] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState('24');

  const selectedLayer = design.layers.find((l) => l.id === selectedLayerId);

  const handleAddText = () => {
    if (!textInput.trim()) return;
    addTextLayer();
    const newId = `text-${Date.now()}`;
    // text added, update content
    setTextInput('');
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Engedély szükséges', 'Kép feltöltéséhez hozzáférés szükséges a galériához.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      addImageLayer(result.assets[0].uri);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (design.layers.length === 0) {
      Alert.alert(
        'Üres terv',
        'Adj hozzá legalább egy elemet a tervhez mielőtt a kosárba teszed!',
        [{ text: 'OK' }]
      );
      return;
    }
    addToCart({
      id: `cart-${Date.now()}`,
      product,
      design: { ...design },
      selectedSize: size ?? product.sizes[0],
      selectedColor: color ?? product.colors[0],
      quantity: 1,
      unitPrice: product.basePrice,
    });
    resetDesign();
    Alert.alert('Kosárba téve! 🛒', 'A tervezett termék sikeresen hozzáadva a kosárhoz.', [
      { text: 'Tovább vásárolok', onPress: () => router.back() },
      { text: 'Kosár megtekintése', onPress: () => router.push('/(tabs)/cart') },
    ]);
  };

  if (!product) return null;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Canvas */}
      <View style={styles.canvasWrapper}>
        <Text style={styles.productLabel}>
          {PRODUCT_ICONS[product.category]} {product.name}
          {size ? ` · ${size}` : ''}
        </Text>
        <DesignCanvas
          design={design}
          canvasSize={CANVAS_SIZE}
          selectedLayerId={selectedLayerId}
          onSelectLayer={selectLayer}
          onUpdateLayer={updateLayer}
        />
      </View>

      {/* Toolbar Tabs */}
      <View style={styles.tabs}>
        {([
          { id: 'layers', label: 'Rétegek', icon: 'layers-outline' },
          { id: 'text', label: 'Szöveg', icon: 'text-outline' },
          { id: 'image', label: 'Kép', icon: 'image-outline' },
          { id: 'background', label: 'Háttér', icon: 'color-palette-outline' },
        ] as { id: EditorTab; label: string; icon: string }[]).map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons
              name={tab.icon as any}
              size={20}
              color={activeTab === tab.id ? '#6C3CE1' : '#888'}
            />
            <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Panel */}
      <View style={styles.panel}>
        {activeTab === 'layers' && (
          <ScrollView contentContainerStyle={styles.panelContent}>
            {design.layers.length === 0 ? (
              <Text style={styles.emptyPanel}>
                Adj hozzá szöveget vagy képet a tervhez!
              </Text>
            ) : (
              [...design.layers].reverse().map((layer) => (
                <TouchableOpacity
                  key={layer.id}
                  style={[
                    styles.layerRow,
                    selectedLayerId === layer.id && styles.layerRowActive,
                  ]}
                  onPress={() => selectLayer(layer.id)}
                >
                  <Ionicons
                    name={layer.type === 'text' ? 'text' : 'image'}
                    size={18}
                    color={selectedLayerId === layer.id ? '#6C3CE1' : '#555'}
                  />
                  <Text style={styles.layerName} numberOfLines={1}>
                    {layer.type === 'text'
                      ? (layer as TextLayer).content
                      : 'Kép'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removeLayer(layer.id)}
                    hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                  >
                    <Ionicons name="trash-outline" size={18} color="#E53E3E" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}

        {activeTab === 'text' && (
          <ScrollView contentContainerStyle={styles.panelContent}>
            <Text style={styles.panelSectionTitle}>Szöveg hozzáadása</Text>
            <TextInput
              style={styles.textInputField}
              placeholder="Írd be a szöveget..."
              value={textInput}
              onChangeText={setTextInput}
              multiline
            />
            <Text style={styles.panelSectionTitle}>Betűméret: {fontSize}px</Text>
            <View style={styles.fontSizeRow}>
              {['16', '20', '24', '32', '40', '48'].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.sizeChip, fontSize === s && styles.sizeChipActive]}
                  onPress={() => setFontSize(s)}
                >
                  <Text style={[styles.sizeChipText, fontSize === s && styles.sizeChipTextActive]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.panelSectionTitle}>Szöveg színe</Text>
            <ColorPicker
              colors={COLORS_PALETTE}
              selected={textColor}
              onSelect={setTextColor}
            />
            <TouchableOpacity
              style={[styles.addBtn, !textInput.trim() && styles.addBtnDisabled]}
              onPress={() => {
                if (!textInput.trim()) return;
                addTextLayer();
                // Update the newly created text layer with our settings
                setTimeout(() => {
                  const layers = useDesignStore.getState().design.layers;
                  const newest = layers[layers.length - 1];
                  if (newest) {
                    updateLayer(newest.id, {
                      content: textInput,
                      color: textColor,
                      fontSize: parseInt(fontSize, 10),
                    });
                    selectLayer(newest.id);
                  }
                }, 0);
                setTextInput('');
              }}
              disabled={!textInput.trim()}
            >
              <Text style={styles.addBtnText}>+ Szöveg hozzáadása</Text>
            </TouchableOpacity>

            {selectedLayer?.type === 'text' && (
              <View style={styles.editSection}>
                <Text style={styles.panelSectionTitle}>Kijelölt szöveg szerkesztése</Text>
                <TextInput
                  style={styles.textInputField}
                  value={(selectedLayer as TextLayer).content}
                  onChangeText={(val) => updateLayer(selectedLayer.id, { content: val })}
                />
              </View>
            )}
          </ScrollView>
        )}

        {activeTab === 'image' && (
          <View style={styles.panelContent}>
            <Text style={styles.panelSectionTitle}>Kép feltöltése</Text>
            <Text style={styles.panelHint}>
              Töltsd fel saját képedet a galériából, amelyet elhelyezhetsz a terven.
            </Text>
            <TouchableOpacity style={styles.uploadBtn} onPress={handlePickImage}>
              <Ionicons name="cloud-upload-outline" size={28} color="#6C3CE1" />
              <Text style={styles.uploadBtnText}>Galéria megnyitása</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'background' && (
          <ScrollView contentContainerStyle={styles.panelContent}>
            <Text style={styles.panelSectionTitle}>Háttér színe</Text>
            <ColorPicker
              colors={['#FFFFFF', '#F3EEFF', '#FFF3E0', '#E8F5E9', '#E3F2FD', '#FCE4EC', '#F3E5F5', '#000000', '#424242', '#757575']}
              selected={design.backgroundColor}
              onSelect={setBackgroundColor}
              large
            />
          </ScrollView>
        )}
      </View>

      {/* Add to Cart */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
          <Ionicons name="cart" size={20} color="#fff" />
          <Text style={styles.cartBtnText}>Kosárba · {product.basePrice.toLocaleString('hu-HU')} Ft</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f5f5' },
  canvasWrapper: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productLabel: {
    fontSize: 13,
    color: '#6C3CE1',
    fontWeight: '600',
    marginBottom: 8,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    gap: 2,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#6C3CE1',
  },
  tabLabel: { fontSize: 10, color: '#888' },
  tabLabelActive: { color: '#6C3CE1', fontWeight: '600' },
  panel: { flex: 1, backgroundColor: '#fff' },
  panelContent: {
    padding: 16,
    gap: 12,
  },
  panelSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  panelHint: { fontSize: 13, color: '#666', lineHeight: 18 },
  emptyPanel: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 14,
  },
  layerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 1.5,
    borderColor: '#eee',
  },
  layerRowActive: {
    borderColor: '#6C3CE1',
    backgroundColor: '#F3EEFF',
  },
  layerName: { flex: 1, fontSize: 14, color: '#333' },
  textInputField: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    minHeight: 44,
    color: '#333',
  },
  fontSizeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  sizeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sizeChipActive: { borderColor: '#6C3CE1', backgroundColor: '#F3EEFF' },
  sizeChipText: { fontSize: 13, color: '#555' },
  sizeChipTextActive: { color: '#6C3CE1', fontWeight: '600' },
  addBtn: {
    backgroundColor: '#6C3CE1',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addBtnDisabled: { backgroundColor: '#ccc' },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  editSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    gap: 8,
  },
  uploadBtn: {
    borderWidth: 2,
    borderColor: '#6C3CE1',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 30,
    alignItems: 'center',
    gap: 8,
  },
  uploadBtnText: { color: '#6C3CE1', fontWeight: '600', fontSize: 15 },
  bottomBar: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cartBtn: {
    backgroundColor: '#6C3CE1',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cartBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
