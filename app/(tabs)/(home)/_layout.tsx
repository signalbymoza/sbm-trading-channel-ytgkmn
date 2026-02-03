
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide header for all platforms - NativeTabs handles iOS navigation
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
