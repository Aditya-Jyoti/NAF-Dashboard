export interface Range {
  min?: number;
  max?: number;
  label: string;
  color: string;
  phCondition?: "acidic" | "alkaline"; // Optional pH condition
}

export interface ParameterRange {
  parameter: string;
  ranges: Range[];
}

// Hardcoded ranges
export const parameterRanges: ParameterRange[] = [
  {
    parameter: "pH",
    ranges: [
      { max: 6.5, label: "Acidic", color: "red" },
      { min: 6.5, max: 7.6, label: "Neutral", color: "green" },
      { min: 7.6, label: "Alkaline", color: "orange" },
    ],
  },
  {
    parameter: "Electrical Conductivity",
    ranges: [
      { max: 1.0, label: "Harmless", color: "green" },
      { min: 1.0, max: 2.0, label: "Tolerable", color: "yellow" },
      { min: 2.0, max: 3.0, label: "Semicritical", color: "orange" },
      { min: 3.0, label: "Critical", color: "red" },
    ],
  },
  {
    parameter: "Organic Matter",
    ranges: [
      { max: 1.5, label: "Low", color: "orange" },
      { min: 1.5, label: "Ideal", color: "green" },
    ],
  },
  {
    parameter: "Nitrate Nitrogen",
    ranges: [
      { max: 30, label: "Low", color: "red" },
      { min: 30, max: 40, label: "Medium", color: "yellow" },
      { min: 40, max: 50, label: "Ideal", color: "green" },
      { min: 50, label: "High", color: "amber" },
    ],
  },
  {
    parameter: "Available Phosphorus",
    ranges: [
      // Acidic soil condition
      { max: 100, label: "Low", color: "red", phCondition: "acidic" },
      {
        min: 100,
        max: 150,
        label: "Medium",
        color: "yellow",
        phCondition: "acidic",
      },
      {
        min: 150,
        max: 200,
        label: "Ideal",
        color: "green",
        phCondition: "acidic",
      },
      { min: 200, label: "High", color: "amber", phCondition: "acidic" },

      // Alkaline soil condition
      { max: 15, label: "Low", color: "red", phCondition: "alkaline" },
      {
        min: 15,
        max: 22,
        label: "Medium",
        color: "yellow",
        phCondition: "alkaline",
      },
      {
        min: 22,
        max: 27,
        label: "Ideal",
        color: "green",
        phCondition: "alkaline",
      },
      { min: 27, label: "High", color: "amber", phCondition: "alkaline" },
    ],
  },
  {
    parameter: "Potassium Exchangeable K",
    ranges: [
      { max: 150, label: "Low", color: "red" },
      { min: 150, max: 200, label: "Medium", color: "yellow" },
      { min: 200, max: 250, label: "Ideal", color: "green" },
      { min: 250, label: "High", color: "amber" },
    ],
  },
  {
    parameter: "Calcium Exchangeable Ca",
    ranges: [
      { max: 1500, label: "Low", color: "red" },
      { min: 1500, max: 2000, label: "Medium", color: "yellow" },
      { min: 2000, max: 2500, label: "Ideal", color: "green" },
      { min: 2500, label: "High", color: "amber" },
    ],
  },
  {
    parameter: "Magnesium Exchangeable Mg",
    ranges: [
      { max: 450, label: "Low", color: "red" },
      { min: 450, max: 550, label: "Medium", color: "yellow" },
      { min: 550, max: 600, label: "Ideal", color: "green" },
      { min: 600, label: "High", color: "amber" },
    ],
  },
  {
    parameter: "Sulfur Available S",
    ranges: [
      { max: 20, label: "Low", color: "red" },
      { min: 20, max: 30, label: "Medium", color: "yellow" },
      { min: 30, max: 40, label: "Ideal", color: "green" },
      { min: 40, label: "High", color: "amber" },
    ],
  },
  {
    parameter: "Zinc Available Zn",
    ranges: [
      { max: 2.0, label: "Low", color: "red" },
      { min: 2.0, max: 2.5, label: "Medium", color: "yellow" },
      { min: 2.5, max: 3.0, label: "Ideal", color: "green" },
      { min: 3.0, label: "High", color: "amber" },
    ],
  },
  {
    parameter: "Manganese Available Mn",
    ranges: [
      { max: 10, label: "Low", color: "red" },
      { min: 10, max: 15, label: "Medium", color: "yellow" },
      { min: 15, max: 20, label: "Ideal", color: "green" },
      { min: 20, label: "High", color: "amber" },
    ],
  },
  {
    parameter: "Iron Available Fe",
    ranges: [
      { max: 9, label: "Low", color: "red" },
      { min: 9, max: 15, label: "Medium", color: "yellow" },
      { min: 15, max: 20, label: "Ideal", color: "green" },
      { min: 20, label: "High", color: "amber" },
    ],
  },
  {
    parameter: "Copper Available  Cu",
    ranges: [
      { max: 2, label: "Low", color: "red" },
      { min: 2, max: 3, label: "Medium", color: "yellow" },
      { min: 3, max: 3.5, label: "Ideal", color: "green" },
      { min: 3.5, label: "High", color: "amber" },
    ],
  },
  {
    parameter: "Boron Available  B",
    ranges: [
      { max: 0.8, label: "Low", color: "red" },
      { min: 0.8, max: 1.2, label: "Medium", color: "yellow" },
      { min: 1.2, max: 1.8, label: "Ideal", color: "green" },
      { min: 1.8, label: "High", color: "amber" },
    ],
  },
  {
    parameter: "K Saturation",
    ranges: [
      { max: 3, label: "Low", color: "red" },
      { min: 3, max: 5, label: "Ideal", color: "green" },
      { min: 5, label: "High", color: "amber" },
    ],
  },
  {
    parameter: "Ca Saturation",
    ranges: [
      { max: 65, label: "Low", color: "red" },
      { min: 65, max: 70, label: "Ideal", color: "green" },
      { min: 70, label: "High", color: "amber" },
    ],
  },
  {
    parameter: "Mg Saturation",
    ranges: [
      { max: 25, label: "Low", color: "red" },
      { min: 25, max: 30, label: "Ideal", color: "green" },
      { min: 30, label: "High", color: "amber" },
    ],
  },
  {
    parameter: "Na Saturation",
    ranges: [
      { max: 2, label: "Ideal", color: "green" },
      { min: 2, max: 7, label: "Tolerable", color: "yellow" },
      { min: 7, label: "High", color: "amber" },
    ],
  },
  // ... (rest of your parameter ranges remain the same)
];

export function getSoilPHType(
  pHValue: number
): "acidic" | "alkaline" | "neutral" {
  if (pHValue < 6.5) return "acidic";
  if (pHValue > 7.6) return "alkaline";
  return "neutral";
}

export function getRating(parameter: string, value: number, pH?: number) {
  const param = parameterRanges.find((p) => p.parameter === parameter.trim());
  if (!param) return { label: "Unknown", color: "gray" };

  let phType = pH !== undefined ? getSoilPHType(pH) : undefined;

  // For phosphorus, treat neutral as alkaline
  if (parameter === "Available Phosphorus" && phType === "neutral") {
    phType = "alkaline";
  }

  for (const range of param.ranges) {
    // If the range is pH-dependent, and doesn't match the current pH type, skip it
    if (range.phCondition && range.phCondition !== phType) continue;

    const inMin = range.min === undefined || value >= range.min;
    const inMax = range.max === undefined || value < range.max;

    if (inMin && inMax) return { label: range.label, color: range.color };
  }

  return { label: "Out of range", color: "gray" };
}

// Helper to get the full Range object
export function getRangeForValue(
  parameter: string,
  value: number,
  pH?: number
): Range | null {
  const param = parameterRanges.find((p) => p.parameter === parameter.trim());
  if (!param) return null;

  let phType = pH !== undefined ? getSoilPHType(pH) : undefined;

  // For phosphorus, treat neutral as alkaline
  if (parameter === "Available Phosphorus" && phType === "neutral") {
    phType = "alkaline";
  }

  // Find the matching range with all properties
  const matchingRange = param.ranges.find((range) => {
    // If the range is pH-dependent, and doesn't match the current pH type, skip it
    if (range.phCondition && range.phCondition !== phType) return false;

    const inMin = range.min === undefined || value >= range.min;
    const inMax = range.max === undefined || value < range.max;
    return inMin && inMax;
  });

  return matchingRange || null;
}

export function getParameterMinMax(parameter: string): {
  min: number;
  max: number;
} {
  const parameterData = parameterRanges.find((p) => p.parameter === parameter);
  if (!parameterData) return { min: 0, max: 100 };

  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;

  parameterData.ranges.forEach((range) => {
    if (range.min !== undefined && range.min < min) min = range.min;
    if (range.max !== undefined && range.max > max) max = range.max;
  });

  if (min === Number.MAX_SAFE_INTEGER) min = 0;
  if (max === Number.MIN_SAFE_INTEGER) max = 100;

  return { min, max };
}

export function getColorForValue(
  parameter: string,
  value: number,
  pH?: number
): string {
  return getRating(parameter, value, pH).color;
}

export function getLabelForValue(
  parameter: string,
  value: number,
  pH?: number
): string {
  return getRating(parameter, value, pH).label;
}
