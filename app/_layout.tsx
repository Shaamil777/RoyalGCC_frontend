import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="otp" options={{ headerShown: false }} />
        <Stack.Screen name="kyc" options={{ headerShown: false }} />
        <Stack.Screen name="kyc-documents" options={{ headerShown: false }} />
        <Stack.Screen name="verification-pending" options={{ headerShown: false }} />
        <Stack.Screen name="verification-complete" options={{ headerShown: false }} />
        <Stack.Screen name="deposit" options={{ headerShown: false }} />
        <Stack.Screen name="exchange" options={{ headerShown: false }} />
        <Stack.Screen name="withdraw" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
