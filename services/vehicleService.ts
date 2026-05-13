import { Vehicle } from "@/types/vehicle";
import { db } from "@/src/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function getVehicles(): Promise<Vehicle[]> {
  try {
    const vehiclesCol = collection(db, "vehicles");
    const vehicleSnapshot = await getDocs(vehiclesCol);
    return vehicleSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        firebaseId: doc.id
      } as unknown as Vehicle;
    });
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
      const docSnap = querySnapshot.docs[0];
      const data = docSnap.data();
      return {
        ...data,
        firebaseId: docSnap.id
      } as unknown as Vehicle;
    }
    return undefined;
  } catch (error) {
    console.error(`Error fetching vehicle with id ${id}:`, error);
    return undefined;
  }
}
