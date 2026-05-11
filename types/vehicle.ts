export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  category: string;

  engine: {
    type: string;
    horsepowerCv: number;
    torqueNm: number;
    transmission: string;
    traction: string;
  };

  performance: {
    zeroToHundredS: number;
    topSpeedKmh: number;
  };

  consumption: {
    cityKmL?: number;
    highwayKmL?: number;
    rangeKm?: number;
  };

  features?: {
    driveModes?: string[];
    headlights?: string;
  };

  priceBrl: number;
  rating: number;
}