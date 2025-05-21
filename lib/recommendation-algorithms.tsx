import type { SoilDataItem } from "@/hooks/use-excel-data";

// Define the structure for a recommendation
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  dosage?: string;
  unit?: string;
  value?: number | null;
  condition: (data: SoilDataItem[]) => boolean;
  calculate: (data: SoilDataItem[]) => number | null;
}

// Helper function to find a parameter by name
export function findParameter(
  data: SoilDataItem[],
  paramName: string
): SoilDataItem | undefined {
  return data.find(
    (item) =>
      item.parameter.toLowerCase() === paramName.toLowerCase() ||
      item.parameter.toLowerCase().includes(paramName.toLowerCase())
  );
}

// Define the recommendation algorithms
export const recommendationAlgorithms: Recommendation[] = [
  {
    id: "lime-application",
    title: "Lime Application",
    description:
      "Apply agricultural lime to correct soil acidity and improve calcium levels.",
    unit: "kg/ac",
    condition: (data: SoilDataItem[]) => {
      const ph = findParameter(data, "pH");
      const caSaturation = findParameter(data, "Ca Saturation");

      if (!ph || !caSaturation) return false;

      const phValue =
        typeof ph.result === "number"
          ? ph.result
          : Number.parseFloat(ph.result as string);
      const caValue =
        typeof caSaturation.result === "number"
          ? caSaturation.result
          : Number.parseFloat(caSaturation.result as string);

      return phValue < 6.5 && caValue < 65;
    },
    calculate: (data: SoilDataItem[]) => {
      const caSaturation = findParameter(data, "Ca Saturation");

      if (!caSaturation) return null;

      const caValue =
        typeof caSaturation.result === "number"
          ? caSaturation.result
          : Number.parseFloat(caSaturation.result as string);

      return Math.round((65 - caValue) * 0.1 * 200);
    },
  },
  {
    id: "gypsum-application",
    title: "Gypsum Application",
    description:
      "Apply gypsum to improve soil structure and calcium levels in alkaline soils.",
    unit: "kg/ac",
    condition: (data: SoilDataItem[]) => {
      const ph = findParameter(data, "pH");
      const caSaturation = findParameter(data, "Ca Saturation");

      if (!ph || !caSaturation) return false;

      const phValue =
        typeof ph.result === "number"
          ? ph.result
          : Number.parseFloat(ph.result as string);
      const caValue =
        typeof caSaturation.result === "number"
          ? caSaturation.result
          : Number.parseFloat(caSaturation.result as string);

      return phValue > 7.6 && caValue < 65;
    },
    calculate: (data: SoilDataItem[]) => {
      const caSaturation = findParameter(data, "Ca Saturation");

      if (!caSaturation) return null;

      const caValue =
        typeof caSaturation.result === "number"
          ? caSaturation.result
          : Number.parseFloat(caSaturation.result as string);

      return Math.round((65 - caValue) * 0.1 * 250);
    },
  },
  {
    id: "dap-application-alkali",
    title: "DAP Application",
    description: "Apply DAP",
    unit: "kg/ac",
    condition: (data: SoilDataItem[]) => {
      const ph = findParameter(data, "pH");
      const phosphorus = findParameter(data, "Available Phosphorus");

      if (!ph || !phosphorus) return false;

      const phValue =
        typeof ph.result === "number"
          ? ph.result
          : Number.parseFloat(ph.result as string);
      const phosVal =
        typeof phosphorus.result === "number"
          ? phosphorus.result
          : Number.parseFloat(phosphorus.result as string);

      return phValue < 7.6 && phosVal < 15;
    },
    calculate: (data: SoilDataItem[]) => {
      const phosphorus = findParameter(data, "Available Phosphorus");

      if (!phosphorus) return null;

      const phosValue =
        typeof phosphorus.result === "number"
          ? phosphorus.result
          : Number.parseFloat(phosphorus.result as string);

      return Math.round((100 - phosValue) * 25);
    },
  },
  {
    id: "dap-application-acidic",
    title: "DAP Application",
    description: "Apply DAP",
    unit: "kg/ac",
    condition: (data: SoilDataItem[]) => {
      const ph = findParameter(data, "pH");
      const phosphorus = findParameter(data, "Available Phosphorus");

      if (!ph || !phosphorus) return false;

      const phValue =
        typeof ph.result === "number"
          ? ph.result
          : Number.parseFloat(ph.result as string);
      const phosVal =
        typeof phosphorus.result === "number"
          ? phosphorus.result
          : Number.parseFloat(phosphorus.result as string);

      return phValue > 7.6 && phosVal < 15;
    },
    calculate: (data: SoilDataItem[]) => {
      const phosphorus = findParameter(data, "Available Phosphorus");

      if (!phosphorus) return null;

      const phosValue =
        typeof phosphorus.result === "number"
          ? phosphorus.result
          : Number.parseFloat(phosphorus.result as string);

      return Math.round((15 - phosValue) * 25);
    },
  },
];

// Function to get applicable recommendations for a dataset
export function getRecommendations(data: SoilDataItem[]): Recommendation[] {
  return recommendationAlgorithms
    .filter((rec) => rec.condition(data))
    .map((rec) => {
      const value = rec.calculate(data);
      return {
        ...rec,
        value: value,
      };
    })
    .filter((rec) => rec.value !== null && rec.value > 0);
}
