import { Stack, router, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/src/config/firebase";
import { ActivityIndicator, View } from "react-native";

export default function Layout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const segments = useSegments();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup) {
      // Redirect to the login page.
      router.replace("/auth");
    } else if (user && inAuthGroup) {
      // Redirect away from the login page.
      router.replace("/");
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#003478" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#111",
        },
        headerTintColor: "#fff",
        contentStyle: {
          backgroundColor: "#fff",
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Início" }} />
      <Stack.Screen name="auth" options={{ title: "Login", headerShown: false }} />
      <Stack.Screen name="browse" options={{ title: "Navegar Veículos" }} />
      <Stack.Screen name="compare" options={{ title: "Comparação" }} />
      <Stack.Screen name="vehicle/[id]" options={{ title: "Detalhes do Veículo" }} />    
    </Stack>
  );
}
