import vehicles from "@/data/vehicles.json";
import { Vehicle } from "@/types/vehicle";

export async function getVehicles(): Promise<Vehicle[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(vehicles as Vehicle[]);
    }, 1000);
  });
}