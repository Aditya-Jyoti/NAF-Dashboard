import type { SoilDataItem } from "@/hooks/use-excel-data";

// Define the structure for a recommendation
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  dosage?: string;
  unit?: string;
  value?: number;
  defaultRate: number;
  rateUnit: string;
  rateDescription: string;
  condition: (data: SoilDataItem[]) => boolean;
  calculate: (data: SoilDataItem[], customRate?: number) => number | null;
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
    defaultRate: 200,
    rateUnit: "kg per 0.1 pH unit",
    rateDescription: "Lime rate per 0.1 pH unit deficit",
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
    calculate: (data: SoilDataItem[], customRate = 200) => {
      const ph = findParameter(data, "pH");

      if (!ph) return null;

      const phValue =
        typeof ph.result === "number"
          ? ph.result
          : Number.parseFloat(ph.result as string);

      return Math.round(((6.5 - phValue) * customRate) / 0.1);
    },
  },
  {
    id: "gypsum-application",
    title: "Gypsum Application",
    description:
      "Apply gypsum to improve soil structure and calcium levels in alkaline soils.",
    unit: "kg/ac",
    defaultRate: 250,
    rateUnit: "kg per 0.1 pH unit",
    rateDescription: "Gypsum rate per 0.1 pH unit excess",
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
    calculate: (data: SoilDataItem[], customRate = 250) => {
      const ph = findParameter(data, "pH");

      if (!ph) return null;

      const phValue =
        typeof ph.result === "number"
          ? ph.result
          : Number.parseFloat(ph.result as string);

      return Math.round(((phValue - 7.5) * customRate) / 0.1);
    },
  },
  {
    id: "dap-application-alkali",
    title: "DAP Application",
    description: "Apply DAP",
    unit: "kg/ac",
    defaultRate: 25,
    rateUnit: "kg per unit P deficit",
    rateDescription: "DAP rate per unit phosphorus deficit (alkaline soil)",
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
    calculate: (data: SoilDataItem[], customRate = 25) => {
      const phosphorus = findParameter(data, "Available Phosphorus");

      if (!phosphorus) return null;

      const phosValue =
        typeof phosphorus.result === "number"
          ? phosphorus.result
          : Number.parseFloat(phosphorus.result as string);

      return Math.round((15 - phosValue) * customRate);
    },
  },
  {
    id: "dap-application-acidic",
    title: "DAP Application",
    description: "Apply DAP",
    unit: "kg/ac",
    defaultRate: 25,
    rateUnit: "kg per unit P deficit",
    rateDescription: "DAP rate per unit phosphorus deficit (acidic soil)",
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

      return phValue < 7.5 && phosVal < 15;
    },
    calculate: (data: SoilDataItem[], customRate = 25) => {
      const phosphorus = findParameter(data, "Available Phosphorus");

      if (!phosphorus) return null;

      const phosValue =
        typeof phosphorus.result === "number"
          ? phosphorus.result
          : Number.parseFloat(phosphorus.result as string);

      return Math.round((100 - phosValue) * customRate);
    },
  },
];

// Function to get applicable recommendations for a dataset
export function getRecommendations(
  data: SoilDataItem[],
  customRates?: Record<string, number>
): Recommendation[] {
  return recommendationAlgorithms
    .filter((rec) => rec.condition(data))
    .map((rec) => {
      const rate = customRates?.[rec.id] ?? rec.defaultRate;
      const value = rec.calculate(data, rate);
      return {
        ...rec,
        value: value === null ? undefined : value,
      };
    })
    .filter((rec) => typeof rec.value === "number" && rec.value > 0);
}
