import vehicles from "@/data/vehicles.json";
import { Vehicle } from "@/types/vehicle";

export async function getVehicles(): Promise<Vehicle[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(vehicles as Vehicle[]);
    }, 500);
  });
}

export async function getVehicleById(id: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const vehicle = vehicles.find(
        (v) => v.id === id
      );

      resolve(vehicle);
    }, 300);
  });
}