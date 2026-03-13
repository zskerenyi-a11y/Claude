import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  useRef,
} from 'react-native';
import { useRef as useReactRef } from 'react';
import { Design, DesignLayer, TextLayer, ImageLayer } from '../constants/types';

interface Props {
  design: Design;
  canvasSize: number;
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<DesignLayer>) => void;
}

function DraggableLayer({
  layer,
  isSelected,
  onSelect,
  onUpdate,
  canvasSize,
}: {
  layer: DesignLayer;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<DesignLayer>) => void;
  canvasSize: number;
}) {
  const offsetRef = useReactRef({ x: 0, y: 0 });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      onSelect();
      offsetRef.current = { x: layer.x, y: layer.y };
    },
    onPanResponderMove: (_, gestureState) => {
      const newX = Math.max(0, Math.min(canvasSize - 40, offsetRef.current.x + gestureState.dx));
      const newY = Math.max(0, Math.min(canvasSize - 40, offsetRef.current.y + gestureState.dy));
      onUpdate({ x: newX, y: newY });
    },
  });

  if (layer.type === 'text') {
    const textLayer = layer as TextLayer;
    return (
      <View
        {...panResponder.panHandlers}
        style={[
          styles.layerContainer,
          { left: textLayer.x, top: textLayer.y },
          isSelected && styles.layerSelected,
        ]}
      >
        <Text
          style={{
            fontSize: textLayer.fontSize,
            color: textLayer.color,
            fontFamily: textLayer.fontFamily === 'System' ? undefined : textLayer.fontFamily,
          }}
        >
          {textLayer.content}
        </Text>
      </View>
    );
  }

  const imageLayer = layer as ImageLayer;
  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.layerContainer,
        {
          left: imageLayer.x,
          top: imageLayer.y,
          width: imageLayer.width,
          height: imageLayer.height,
        },
        isSelected && styles.layerSelected,
      ]}
    >
      <Image
        source={{ uri: imageLayer.uri }}
        style={{ width: imageLayer.width, height: imageLayer.height, borderRadius: 4 }}
        resizeMode="contain"
      />
    </View>
  );
}

export default function DesignCanvas({
  design,
  canvasSize,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => onSelectLayer(null)}
      style={[
        styles.canvas,
        {
          width: canvasSize,
          height: canvasSize,
          backgroundColor: design.backgroundColor,
        },
      ]}
    >
      {design.layers.map((layer) => (
        <DraggableLayer
          key={layer.id}
          layer={layer}
          isSelected={selectedLayerId === layer.id}
          onSelect={() => onSelectLayer(layer.id)}
          onUpdate={(updates) => onUpdateLayer(layer.id, updates)}
          canvasSize={canvasSize}
        />
      ))}
      {design.layers.length === 0 && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Tervezd meg itt!</Text>
          <Text style={styles.placeholderSub}>Adj hozzá szöveget vagy képet</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  canvas: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    overflow: 'hidden',
    position: 'relative',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#bbb',
    fontWeight: '600',
  },
  placeholderSub: {
    fontSize: 13,
    color: '#ccc',
    marginTop: 4,
  },
  layerContainer: {
    position: 'absolute',
  },
  layerSelected: {
    borderWidth: 1.5,
    borderColor: '#6C3CE1',
    borderStyle: 'dashed',
    borderRadius: 4,
    padding: 2,
  },
});
