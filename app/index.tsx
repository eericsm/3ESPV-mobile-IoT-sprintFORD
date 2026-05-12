import { router } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useCompareStore } from "@/store/compareStore";

export default function Home() {
  const vehiclesToCompare = useCompareStore((state) => state.vehiclesToCompare);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ford Compare</Text>
      <Text style={styles.subtitle}>
        Encontre e compare o seu próximo veículo com facilidade.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/browse")}
      >
        <Text style={styles.buttonText}>Navegar Veículos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.compareButton]}
        onPress={() => router.push("/compare")}
      >
        <Text style={styles.buttonText}>
          Comparar Veículos ({vehiclesToCompare.length})
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 48,
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#111",
    padding: 18,
    borderRadius: 12,
    width: "100%",
    marginBottom: 16,
    alignItems: "center",
  },
  compareButton: {
    backgroundColor: "#003478",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
