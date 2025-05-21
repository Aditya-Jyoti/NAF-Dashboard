"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ParameterRangeVisual } from "@/components/parameter-range-visual";
import { parameterRanges } from "@/lib/parameter-ranges";

interface ParameterRangesProps {
  data: {
    sno: number;
    parameter: string;
    unit: string;
    result: number | string;
    testMethod?: string;
    rating?: string;
  }[];
}

// Group parameters into categories based on S.No.
const categories = [
  { id: "primary", name: "Primary Macronutrients" },
  { id: "secondary", name: "Secondary Macronutrients" },
  { id: "micro", name: "Micronutrients" },
  { id: "other", name: "Other Essentials" },
];

// Map Excel parameter names to parameter range names
const parameterMap: Record<string, string> = {
  pH: "pH",
  EC: "Electrical Conductivity",
  "Organic Carbon": "Organic Matter",
  "Available Nitrogen": "Nitrate Nitrogen",
  "Available Phosphorus": "Available Phosphorus",
  "Available Potassium": "Potassium Exchangeable K",
  "Available Calcium": "Calcium Exchangeable Ca",
  "Available Magnesium": "Magnesium Exchangeable Mg",
  "Available Sulphur": "Sulfur Available S",
  "Available Zinc": "Zinc Available Zn",
  "Available Manganese": "Manganese Available Mn",
  "Available Iron": "Iron Available Fe",
  "Available Copper": "Copper Available Cu",
  "Available Boron": "Boron Available B",
  "K Saturation": "K Saturation",
  "Ca Saturation": "Ca Saturation",
  "Mg Saturation": "Mg Saturation",
  "Na Saturation": "Na Saturation",
};

export function ParameterRanges({ data }: ParameterRangesProps) {
  const [activeCategory, setActiveCategory] = useState("primary");

  // Find the pH value from the data
  const pHItem = data.find((item) => item.parameter === "pH");
  const pHValue = pHItem?.result;
  const numericPH =
    typeof pHValue === "number"
      ? pHValue
      : Number.parseFloat(pHValue as string);

  // Filter data to only include parameters that have defined ranges
  // and convert string results to numbers
  const parametersWithRanges = data
    .filter((item) => {
      const mappedParameter = parameterMap[item.parameter] || item.parameter;
      return parameterRanges.some(
        (range) => range.parameter === mappedParameter
      );
    })
    .map((item) => {
      // Convert result to number if it's a string
      const numericResult =
        typeof item.result === "number"
          ? item.result
          : Number.parseFloat(item.result as string);

      return {
        ...item,
        result: isNaN(numericResult) ? 0 : numericResult,
        mappedParameter: parameterMap[item.parameter] || item.parameter,
      };
    });

  // Function to determine which category a parameter belongs to based on S.No.
  const getCategoryForSno = (sno: number): string => {
    if ([4, 5, 6].includes(sno)) return "primary";
    if ([7, 8, 10].includes(sno)) return "secondary";
    if ([11, 12, 13, 14, 15].includes(sno)) return "micro";
    if ([1, 2, 3, 18, 19, 20].includes(sno)) return "other";
    return "other";
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle>Soil Parameters</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <Tabs
          defaultValue="primary"
          onValueChange={setActiveCategory}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-6 bg-gray-100">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parametersWithRanges
                  .filter((item) => getCategoryForSno(item.sno) === category.id)
                  .map((item, index) => (
                    <ParameterRangeVisual
                      key={index}
                      parameter={item.mappedParameter}
                      value={item.result as number}
                      unit={item.unit}
                      pH={!isNaN(numericPH) ? numericPH : undefined}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
