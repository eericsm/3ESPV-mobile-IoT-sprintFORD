import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import { getVehicleById } from "@/services/vehicleService";
import { Vehicle } from "@/types/vehicle";
import { useCompareStore } from "@/store/compareStore";

export default function VehicleDetails() {
  const { id } = useLocalSearchParams();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  const addVehicle = useCompareStore((state) => state.addVehicle);
  const removeVehicle = useCompareStore((state) => state.removeVehicle);
  const vehiclesToCompare = useCompareStore((state) => state.vehiclesToCompare);

  useEffect(() => {
    loadVehicle();
  }, []);

  async function loadVehicle() {
    const data = await getVehicleById(Number(id));
    setVehicle(data as Vehicle);
  }

  if (!vehicle) {
    return (
      <View style={styles.center}>
        <Text>Carregando detalhes do veículo...</Text>
      </View>
    );
  }

  const isSelected = vehiclesToCompare.some((v) => v.id === vehicle.id);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {vehicle.brand} {vehicle.model}
      </Text>

      <Text style={styles.sectionHeader}>Informações Gerais</Text>
      <View style={styles.infoBox}>
        <Text style={styles.textRow}>Categoria: <Text style={styles.bold}>{vehicle.category}</Text></Text>
        <Text style={styles.textRow}>Ano: <Text style={styles.bold}>{vehicle.year}</Text></Text>
        <Text style={styles.textRow}>Avaliação: <Text style={styles.bold}>{vehicle.rating} / 5.0</Text></Text>
        <Text style={styles.textRow}>Preço: <Text style={styles.bold}>R$ {vehicle.priceBrl.toLocaleString("pt-BR")}</Text></Text>
      </View>

      <Text style={styles.sectionHeader}>Motor e Transmissão</Text>
      <View style={styles.infoBox}>
        <Text style={styles.textRow}>Tipo: <Text style={styles.bold}>{vehicle.engine.type}</Text></Text>
        <Text style={styles.textRow}>Potência: <Text style={styles.bold}>{vehicle.engine.horsepowerCv} cv</Text></Text>
        <Text style={styles.textRow}>Torque: <Text style={styles.bold}>{vehicle.engine.torqueNm} Nm</Text></Text>
        <Text style={styles.textRow}>Transmissão: <Text style={styles.bold}>{vehicle.engine.transmission}</Text></Text>
        <Text style={styles.textRow}>Tração: <Text style={styles.bold}>{vehicle.engine.traction}</Text></Text>
      </View>

      <Text style={styles.sectionHeader}>Performance e Consumo</Text>
      <View style={styles.infoBox}>
        <Text style={styles.textRow}>De 0 a 100 km/h: <Text style={styles.bold}>{vehicle.performance.zeroToHundredS} s</Text></Text>
        <Text style={styles.textRow}>Velocidade Máxima: <Text style={styles.bold}>{vehicle.performance.topSpeedKmh} km/h</Text></Text>
        
        {vehicle.consumption.cityKmL && (
          <Text style={styles.textRow}>Consumo Cidade: <Text style={styles.bold}>{vehicle.consumption.cityKmL} km/l</Text></Text>
        )}
        {vehicle.consumption.highwayKmL && (
          <Text style={styles.textRow}>Consumo Estrada: <Text style={styles.bold}>{vehicle.consumption.highwayKmL} km/l</Text></Text>
        )}
        {vehicle.consumption.rangeKm && (
          <Text style={styles.textRow}>Autonomia Elétrica: <Text style={styles.bold}>{vehicle.consumption.rangeKm} km</Text></Text>
        )}
      </View>

      {vehicle.features && (
        <>
          <Text style={styles.sectionHeader}>Recursos e Tecnologia</Text>
          <View style={styles.infoBox}>
            {vehicle.features.driveModes && (
              <Text style={styles.textRow}>Modos de Direção: <Text style={styles.bold}>{vehicle.features.driveModes.join(", ")}</Text></Text>
            )}
            {vehicle.features.headlights && (
              <Text style={styles.textRow}>Faróis: <Text style={styles.bold}>{vehicle.features.headlights}</Text></Text>
            )}
          </View>
        </>
      )}

      <TouchableOpacity
        style={[styles.button, isSelected && styles.removeButton]}
        onPress={() => {
          if (isSelected) removeVehicle(vehicle.id);
          else addVehicle(vehicle);
        }}
      >
        <Text style={styles.buttonText}>
          {isSelected ? "Remover da Comparação" : "Adicionar à Comparação"}
        </Text>
      </TouchableOpacity>
      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 8,
    color: "#003478",
  },
  infoBox: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  textRow: {
    fontSize: 16,
    marginBottom: 8,
    color: "#444",
  },
  bold: {
    fontWeight: "bold",
    color: "#111",
  },
  button: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  removeButton: {
    backgroundColor: "#d11a2a",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
