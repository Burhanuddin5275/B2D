import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { store } from '../store/useAuth';
import { persistor } from '../store/useAuth';
import { PersistGate } from 'redux-persist/integration/react';
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Sigmar: require('../assets/fonts/Sigmar-Regular.ttf'),
    PoppinsMedium: require('../assets/fonts/Poppins-Medium.ttf'),
    PoppinsSemi: require('../assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
    InterRegular: require('../assets/fonts/Inter-Regular.ttf'),
    InterBold: require('../assets/fonts/Inter-Bold.ttf'),
    Sacramento: require('../assets/fonts/Sacramento-Regular.ttf'),
    RussoOne: require('../assets/fonts/RussoOne-Regular.ttf'),
    Montserrat: require('../assets/fonts/Montserrat-SemiBold.ttf'),
    MontserratMedium: require('../assets/fonts/Montserrat-Medium.ttf'),

  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name='Slider' options={{ headerShown: false }} />
            <Stack.Screen name='Login' options={{ headerShown: false }} />
            <Stack.Screen name='VerifyNumber' options={{ headerShown: false }} />
            <Stack.Screen name='Wishlist' options={{ headerShown: false }} />
            <Stack.Screen name='CompleteProfile' options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
