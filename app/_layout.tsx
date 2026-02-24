import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/contexts/AuthContext';

export const unstable_settings = {
  initialRouteName: 'index',
};

const SCREEN_NAMES = [
  'index',
  'login',
  'otp',
  'kyc',
  'kyc-documents',
  'verification-pending',
  'verification-complete',
  'deposit',
  'exchange',
  'withdraw',
  'referral',
  '(tabs)',
] as const;

const hideHeaderOptions = { headerShown: false } as const;

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {SCREEN_NAMES.map((name) => (
            <Stack.Screen key={name} name={name} options={hideHeaderOptions} />
          ))}
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
