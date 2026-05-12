import { useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";

import { getVehicles } from "@/services/vehicleService";
import { Vehicle } from "@/types/vehicle";
import { useCompareStore } from "@/store/compareStore";

type SortOptions = "Nenhum" | "Menor Preço" | "Maior Preço" | "Maior Potência" | "Maior Velocidade" | "Melhor Aceleração" | "Melhor Avaliação";

export default function Browse() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortBys, setSortBys] = useState<SortOptions[]>([]);

  const addVehicle = useCompareStore((state) => state.addVehicle);
  const vehiclesToCompare = useCompareStore((state) => state.vehiclesToCompare);

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    const data = await getVehicles();
    setVehicles(data);
  }

  const categories = ["Todos", ...new Set(vehicles.map((v) => v.category))];
  const sortOptions: SortOptions[] = ["Nenhum", "Menor Preço", "Maior Preço", "Maior Potência", "Maior Velocidade", "Melhor Aceleração", "Melhor Avaliação"];

  const toggleSortBy = (option: SortOptions) => {
    if (option === "Nenhum") {
      setSortBys([]);
      return;
    }
    
    setSortBys((prev) => {
      let next = [...prev];
      if (option === "Menor Preço") next = next.filter(o => o !== "Maior Preço");
      if (option === "Maior Preço") next = next.filter(o => o !== "Menor Preço");

      if (next.includes(option)) {
        return next.filter((o) => o !== option);
      } else {
        return [...next, option];
      }
    });
  };

  const filteredVehicles = useMemo(() => {
    let result = vehicles.filter((vehicle) => {
      const matchesSearch = `${vehicle.brand} ${vehicle.model}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "Todos" || vehicle.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    if (sortBys.length > 0) {
      result.sort((a, b) => {
        for (const sortOption of sortBys) {
          let diff = 0;
          if (sortOption === "Menor Preço") diff = a.priceBrl - b.priceBrl;
          else if (sortOption === "Maior Preço") diff = b.priceBrl - a.priceBrl;
          else if (sortOption === "Maior Potência") diff = b.engine.horsepowerCv - a.engine.horsepowerCv;
          else if (sortOption === "Maior Velocidade") diff = b.performance.topSpeedKmh - a.performance.topSpeedKmh;
          else if (sortOption === "Melhor Aceleração") diff = a.performance.zeroToHundredS - b.performance.zeroToHundredS;
          else if (sortOption === "Melhor Avaliação") diff = b.rating - a.rating;

          if (diff !== 0) return diff;
        }
        return 0;
      });
    }

    return result;
  }, [vehicles, search, selectedCategory, sortBys]);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredVehicles}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Navegar Veículos</Text>

            <TextInput
              placeholder="Buscar veículo (Marca ou Modelo)..."
              value={search}
              onChangeText={setSearch}
              style={styles.input}
            />

            <Text style={styles.sectionTitle}>Filtrar por Categoria</Text>
            <View style={styles.horizontalListContainer}>
              <FlatList
                horizontal
                data={categories}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.pillButton,
                      selectedCategory === item && styles.pillButtonActive,
                    ]}
                    onPress={() => setSelectedCategory(item)}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        selectedCategory === item && styles.pillTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            <Text style={styles.sectionTitle}>Ordenar por</Text>
            <View style={styles.horizontalListContainer}>
              <FlatList
                horizontal
                data={sortOptions}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.pillButton,
                      sortBys.includes(item as SortOptions) && styles.pillButtonActive,
                    ]}
                    onPress={() => toggleSortBy(item as SortOptions)}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        sortBys.includes(item as SortOptions) && styles.pillTextActive,
                      ]}
                    >
                      {item} {sortBys.includes(item as SortOptions) && item !== "Nenhum" ? `(${sortBys.indexOf(item as SortOptions) + 1})` : ""}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            <TouchableOpacity
              style={styles.compareButton}
              onPress={() => router.push("/compare")}
            >
              <Text style={styles.compareButtonText}>
                Ir para Comparação ({vehiclesToCompare.length})
              </Text>
            </TouchableOpacity>
          </>
        }
        renderItem={({ item }) => {
          const isSelected = vehiclesToCompare.some((v) => v.id === item.id);

          return (
            <TouchableOpacity
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => router.push(`/vehicle/${item.id}`)}
            >
              <Text style={styles.model}>
                {item.brand} {item.model}
              </Text>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoText}>Categoria: {item.category}</Text>
                <Text style={styles.infoText}>Ano: {item.year}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoText}>Potência: {item.engine.horsepowerCv} cv</Text>
                <Text style={styles.infoText}>Max: {item.performance.topSpeedKmh} km/h</Text>
              </View>

              <Text style={styles.price}>R$ {item.priceBrl.toLocaleString("pt-BR")}</Text>

              <TouchableOpacity
                style={[styles.selectButton, isSelected && styles.removeButton]}
                onPress={() => {
                  if (isSelected) {
                    useCompareStore.getState().removeVehicle(item.id);
                  } else {
                    addVehicle(item);
                  }
                }}
              >
                <Text style={styles.selectButtonText}>
                  {isSelected ? "Remover da Comparação" : "Adicionar à Comparação"}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  horizontalListContainer: {
    marginBottom: 20,
  },
  pillButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  pillButtonActive: {
    backgroundColor: "#111",
    borderColor: "#111",
  },
  pillText: {
    color: "#333",
    fontWeight: "500",
  },
  pillTextActive: {
    color: "#fff",
  },
  compareButton: {
    backgroundColor: "#003478",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  compareButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: "#003478",
    backgroundColor: "#f0f7ff",
  },
  model: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#111",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    color: "#111",
  },
  selectButton: {
    backgroundColor: "#111",
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },
  removeButton: {
    backgroundColor: "#d11a2a",
  },
  selectButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
