import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { useCompareStore } from "@/store/compareStore";

export default function Compare() {
  const vehicles = useCompareStore((state) => state.vehiclesToCompare);
  const removeVehicle = useCompareStore((state) => state.removeVehicle);
  const clearCompare = useCompareStore((state) => state.clearCompare);

  if (vehicles.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Nenhum veículo selecionado</Text>
        <Text style={styles.emptyText}>
          Navegue pelos veículos e escolha até 3 opções para comparar.
        </Text>
      </View>
    );
  }

  // Precalculating extremes based on current comparison list
  const powers = vehicles.map((v) => v.engine.horsepowerCv);
  const maxPower = Math.max(...powers);
  const minPower = Math.min(...powers);

  const torques = vehicles.map((v) => v.engine.torqueNm);
  const maxTorque = Math.max(...torques);
  const minTorque = Math.min(...torques);

  const accelerations = vehicles.map((v) => v.performance.zeroToHundredS);
  const bestAcceleration = Math.min(...accelerations);
  const worstAcceleration = Math.max(...accelerations);

  const topSpeeds = vehicles.map((v) => v.performance.topSpeedKmh);
  const maxTopSpeed = Math.max(...topSpeeds);
  const minTopSpeed = Math.min(...topSpeeds);

  const prices = vehicles.map((v) => v.priceBrl);
  const bestPrice = Math.min(...prices);
  const worstPrice = Math.max(...prices);

  const ratings = vehicles.map((v) => v.rating);
  const bestRating = Math.max(...ratings);
  const worstRating = Math.min(...ratings);

  const cityMetrics = vehicles.map(v => v.consumption.cityKmL).filter((v): v is number => v !== undefined);
  const bestCity = cityMetrics.length > 0 ? Math.max(...cityMetrics) : 0;
  const worstCity = cityMetrics.length > 0 ? Math.min(...cityMetrics) : 0;

  const hwyMetrics = vehicles.map(v => v.consumption.highwayKmL).filter((v): v is number => v !== undefined);
  const bestHwy = hwyMetrics.length > 0 ? Math.max(...hwyMetrics) : 0;
  const worstHwy = hwyMetrics.length > 0 ? Math.min(...hwyMetrics) : 0;

  const rangeMetrics = vehicles.map(v => v.consumption.rangeKm).filter((v): v is number => v !== undefined);
  const bestRange = rangeMetrics.length > 0 ? Math.max(...rangeMetrics) : 0;
  const worstRange = rangeMetrics.length > 0 ? Math.min(...rangeMetrics) : 0;

  // Helper function to figure out the color to return
  const getStyleForMetric = (val: number | undefined, best: number, worst: number) => {
    if (val === undefined) return styles.value;
    if (vehicles.length === 1) return styles.value; // No comparison color if only 1 vehicle
    if (best === worst) return [styles.value, styles.tie]; // Everyone tied
    if (val === best) return [styles.value, styles.best];
    if (val === worst) return [styles.value, styles.worst];
    return styles.value; // In between
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Comparação ({vehicles.length}/3)</Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearCompare}>
          <Text style={styles.clearButtonText}>Limpar Tudo</Text>
        </TouchableOpacity>
      </View>

      {/* Exibir cartões lado a lado e scroll horizontal */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {vehicles.map((vehicle) => {
          return (
            <View key={vehicle.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.model}>{vehicle.brand}</Text>
                <Text style={styles.modelName}>{vehicle.model}</Text>
                <Text style={styles.category}>{vehicle.category} • {vehicle.year}</Text>
              </View>

              <View style={styles.detailsContainer}>
                {/* Motor e Performance */}
                <Text style={styles.sectionTitle}>Performance</Text>

                <View style={styles.section}>
                  <Text style={styles.label}>Potência</Text>
                  <Text style={getStyleForMetric(vehicle.engine.horsepowerCv, maxPower, minPower)}>
                    {vehicle.engine.horsepowerCv} cv
                  </Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Torque</Text>
                  <Text style={getStyleForMetric(vehicle.engine.torqueNm, maxTorque, minTorque)}>
                    {vehicle.engine.torqueNm} Nm
                  </Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>0-100 km/h</Text>
                  <Text style={getStyleForMetric(vehicle.performance.zeroToHundredS, bestAcceleration, worstAcceleration)}>
                    {vehicle.performance.zeroToHundredS}s
                  </Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Velocidade Máx.</Text>
                  <Text style={getStyleForMetric(vehicle.performance.topSpeedKmh, maxTopSpeed, minTopSpeed)}>
                    {vehicle.performance.topSpeedKmh} km/h
                  </Text>
                </View>

                {/* Combustível / Avaliação */}
                <Text style={styles.sectionTitle}>Geral</Text>

                {(vehicle.consumption.cityKmL || vehicle.consumption.highwayKmL) ? (
                  <View style={styles.section}>
                    <Text style={styles.label}>Consumo</Text>
                    <Text style={styles.value}>
                      {vehicle.consumption.cityKmL ? (
                        <Text style={getStyleForMetric(vehicle.consumption.cityKmL, bestCity, worstCity)}>
                          {vehicle.consumption.cityKmL} km/l (C)
                        </Text>
                      ) : null}
                      {vehicle.consumption.cityKmL && vehicle.consumption.highwayKmL ? ' • ' : ''}
                      {vehicle.consumption.highwayKmL ? (
                        <Text style={getStyleForMetric(vehicle.consumption.highwayKmL, bestHwy, worstHwy)}>
                          {vehicle.consumption.highwayKmL} km/l (E)
                        </Text>
                      ) : null}
                    </Text>
                  </View>
                ) : null}

                {vehicle.consumption.rangeKm ? (
                  <View style={styles.section}>
                    <Text style={styles.label}>Autonomia</Text>
                    <Text style={[styles.value, getStyleForMetric(vehicle.consumption.rangeKm, bestRange, worstRange)]}>
                      {vehicle.consumption.rangeKm} km
                    </Text>
                  </View>
                ) : null}

                <View style={styles.section}>
                  <Text style={styles.label}>Avaliação</Text>
                  <Text style={getStyleForMetric(vehicle.rating, bestRating, worstRating)}>
                    {vehicle.rating} / 5.0
                  </Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Preço</Text>
                  <Text style={getStyleForMetric(vehicle.priceBrl, bestPrice, worstPrice)}>
                    R$ {vehicle.priceBrl.toLocaleString("pt-BR")}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeVehicle(vehicle.id)}
              >
                <Text style={styles.removeButtonText}>Remover</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#111",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    lineHeight: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
  },
  clearButton: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  clearButtonText: {
    color: "#d11a2a",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#f9f9f9",
    width: 280, // Largura fixa para facilitar alinhamento lateral
    marginRight: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
    justifyContent: "space-between",
  },
  cardHeader: {
    backgroundColor: "#111",
    padding: 16,
  },
  model: {
    fontSize: 18,
    color: "#fff",
    opacity: 0.8,
  },
  modelName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  category: {
    color: "#ccc",
    fontSize: 14,
  },
  detailsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 13,
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#888",
    marginBottom: 12,
    marginTop: 8,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "#555",
    flex: 1,
  },
  value: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111",
    textAlign: "right",
    flex: 1,
  },
  best: {
    color: "#008000", /* Verde para o melhor */
  },
  worst: {
    color: "#d11a2a", /* Vermelho para o pior */
  },
  tie: {
    color: "#d4a017", /* Amarelo ouro para empate */
  },
  removeButton: {
    margin: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d11a2a",
    padding: 14,
    borderRadius: 10,
  },
  removeButtonText: {
    color: "#d11a2a",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
  },
});
