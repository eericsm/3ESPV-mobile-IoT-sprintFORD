import { Stack } from "expo-router";

export default function Layout() {
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
      <Stack.Screen name="browse" options={{ title: "Navegar Veículos" }} />
      <Stack.Screen name="compare" options={{ title: "Comparação" }} />
      <Stack.Screen name="vehicle/[id]" options={{ title: "Detalhes do Veículo" }} />
    </Stack>
  );
}
