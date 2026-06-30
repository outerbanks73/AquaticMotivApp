export interface TankSize {
  id: string;
  label: string;
  gallons: number;
  dimensions: string;
}

export const TANK_SIZES: TankSize[] = [
  { id: "5g", label: "5 Gallon Nano", gallons: 5, dimensions: '16" x 8" x 10"' },
  { id: "10g", label: "10 Gallon", gallons: 10, dimensions: '20" x 10" x 12"' },
  { id: "20g", label: "20 Gallon Long", gallons: 20, dimensions: '30" x 12" x 12"' },
  { id: "29g", label: "29 Gallon", gallons: 29, dimensions: '30" x 12" x 18"' },
  { id: "40g", label: "40 Gallon Breeder", gallons: 40, dimensions: '36" x 18" x 16"' },
  { id: "55g", label: "55 Gallon", gallons: 55, dimensions: '48" x 13" x 21"' },
  { id: "75g", label: "75 Gallon", gallons: 75, dimensions: '48" x 18" x 21"' },
  { id: "90g", label: "90 Gallon", gallons: 90, dimensions: '48" x 18" x 24"' },
  { id: "125g", label: "125 Gallon", gallons: 125, dimensions: '72" x 18" x 21"' },
  { id: "custom", label: "Custom Size", gallons: 0, dimensions: "Custom" },
];
