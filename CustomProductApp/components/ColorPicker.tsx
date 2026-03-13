import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  colors: string[];
  selected: string;
  onSelect: (color: string) => void;
  large?: boolean;
}

export default function ColorPicker({ colors, selected, onSelect, large }: Props) {
  const size = large ? 40 : 32;
  return (
    <View style={styles.row}>
      {colors.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.swatch,
            { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
            selected === color && styles.swatchSelected,
            color === '#FFFFFF' && styles.swatchBorder,
          ]}
          onPress={() => onSelect(color)}
        >
          {selected === color && (
            <Ionicons
              name="checkmark"
              size={size * 0.5}
              color={color === '#FFFFFF' || color === '#FFFF00' ? '#333' : '#fff'}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  swatch: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  swatchSelected: {
    transform: [{ scale: 1.15 }],
    shadowOpacity: 0.3,
  },
  swatchBorder: {
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
