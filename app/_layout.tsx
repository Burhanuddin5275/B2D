import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
         <Stack.Screen name="index" options={{headerShown: false }} />
         <Stack.Screen name='Slider' options={{headerShown:false}}/>
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
