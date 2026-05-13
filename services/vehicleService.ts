import { Vehicle } from "@/types/vehicle";
import { db } from "@/src/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function getVehicles(): Promise<Vehicle[]> {
  try {
    const vehiclesCol = collection(db, "vehicles");
    const vehicleSnapshot = await getDocs(vehiclesCol);
    return vehicleSnapshot.docs.map(doc => ({
      ...doc.data(),
      firebaseId: doc.id
    }) as Vehicle);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
}

export async function getVehicleById(id: number) {
  try {
    const vehiclesCol = collection(db, "vehicles");
    const q = query(vehiclesCol, where("id", "==", id));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        ...doc.data(),
        firebaseId: doc.id
      } as Vehicle;
    }
    return undefined;
  } catch (error) {
    console.error(`Error fetching vehicle with id ${id}:`, error);
    return undefined;
  }
}
