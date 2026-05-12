import { create } from "zustand";

import { Vehicle } from "@/types/vehicle";

interface CompareStore {
  vehiclesToCompare: Vehicle[];

  addVehicle: (vehicle: Vehicle) => void;

  removeVehicle: (id: number) => void;

  clearCompare: () => void;
}

export const useCompareStore =
  create<CompareStore>((set, get) => ({
    vehiclesToCompare: [],

    addVehicle: (vehicle) => {
      const current =
        get().vehiclesToCompare;

      const alreadyExists = current.some(
        (v) => v.id === vehicle.id
      );

      if (alreadyExists) return;

      if (current.length >= 3) return;

      set({
        vehiclesToCompare: [
          ...current,
          vehicle,
        ],
      });
    },

    removeVehicle: (id) => {
      set({
        vehiclesToCompare:
          get().vehiclesToCompare.filter(
            (v) => v.id !== id
          ),
      });
    },

    clearCompare: () => {
      set({
        vehiclesToCompare: [],
      });
    },
  }));