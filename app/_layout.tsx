// _layout.tsx
import { Stack, useLocalSearchParams } from "expo-router";
import { Provider } from 'react-redux';
import store from '../stores/index';
import Header from "@/components/Header";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <Stack
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#eceae4',
            },
            contentStyle: {
              backgroundColor: '#eceae4',
            }
          }}
        >
          <Stack.Screen name="index" options={{title:"Flashcards", headerTitle: (props) => <Header />}}/>
          <Stack.Screen name="create-list" options={{ title: "" }} />
          <Stack.Screen name="list/[id]/edit" options={{ title: "" }} />
          <Stack.Screen name="list/[id]/create-card" options={{ title: "" }} />
          <Stack.Screen name="list/[id]/index" options={{ title: ""}} />
        </Stack>
      </PaperProvider>
    </Provider>
  );
}