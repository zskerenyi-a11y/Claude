import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#6C3CE1' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product/[id]"
          options={{ title: 'Termék részletei' }}
        />
        <Stack.Screen
          name="design/[productId]"
          options={{ title: 'Tervezőasztal', headerBackTitle: 'Vissza' }}
        />
        <Stack.Screen
          name="cart/checkout"
          options={{ title: 'Pénztár' }}
        />
        <Stack.Screen
          name="cart/success"
          options={{ title: 'Rendelés leadva', headerLeft: () => null }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
