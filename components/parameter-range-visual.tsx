"use client";

import { useState } from "react";
import {
  getRangeForValue,
  parameterRanges,
  getSoilPHType,
} from "@/lib/parameter-ranges";
import { cn } from "@/lib/utils";

interface ParameterRangeVisualProps {
  parameter: string;
  value: number;
  unit: string;
  pH?: number;
}

export function ParameterRangeVisual({
  parameter,
  value,
  unit,
  pH,
}: ParameterRangeVisualProps) {
  const [showDetails, setShowDetails] = useState(false);
  const currentRange = getRangeForValue(parameter, value, pH);
  const parameterData = parameterRanges.find((p) => p.parameter === parameter);

  if (!parameterData) {
    return null;
  }

  // Determine which ranges to show based on pH for phosphorus
  const visibleRanges =
    parameter === "Available Phosphorus" && pH !== undefined
      ? parameterData.ranges.filter((range) => {
          if (!range.phCondition) return false;
          let phType = getSoilPHType(pH);
          // Treat neutral as alkaline for phosphorus
          if (phType === "neutral") phType = "alkaline";
          return range.phCondition === phType;
        })
      : parameterData.ranges.filter((range) => !range.phCondition);

  return (
    <div
      className="border rounded-md p-4 hover:shadow-md transition-shadow cursor-pointer bg-gray-50 hover:bg-white"
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">{parameter}</h3>
        <div className="flex items-center">
          <span className="font-bold mr-2">
            {value} {unit !== "-" ? unit : ""}
          </span>
          <span
            className={cn(
              "px-2 py-1 rounded-md text-xs font-medium",
              currentRange?.color === "red" &&
                "bg-red-100 text-red-800 border border-red-200",
              currentRange?.color === "yellow" &&
                "bg-yellow-100 text-yellow-800 border border-yellow-200",
              currentRange?.color === "orange" &&
                "bg-orange-100 text-orange-800 border border-orange-200",
              currentRange?.color === "green" &&
                "bg-green-100 text-green-800 border border-green-200",
              currentRange?.color === "gray" &&
                "bg-gray-100 text-gray-800 border border-gray-200",
              currentRange?.color === "amber" &&
                "bg-amber-600/50 text-black border border-amber-950"
            )}
          >
            {currentRange?.label || "Unknown"}
          </span>
        </div>
      </div>

      {visibleRanges.length > 0 && (
        <>
          <div className="flex w-full mb-1">
            {visibleRanges.map((range, index) => {
              const isCurrentRange =
                (range.min !== undefined &&
                  range.max !== undefined &&
                  value >= range.min &&
                  value < range.max) ||
                (range.min !== undefined &&
                  range.max === undefined &&
                  value >= range.min) ||
                (range.min === undefined &&
                  range.max !== undefined &&
                  value < range.max);

              return (
                <div
                  key={index}
                  className={cn(
                    "flex-1 h-8 flex items-center justify-center text-xs font-medium border-r last:border-r-0",
                    isCurrentRange && "ring-2 ring-offset-1",
                    range.color === "red" && "bg-red-200 text-red-800",
                    range.color === "yellow" && "bg-yellow-200 text-yellow-800",
                    range.color === "orange" && "bg-orange-200 text-orange-800",
                    range.color === "green" && "bg-green-200 text-green-800",
                    range.color === "amber" && "bg-amber-600 text-black",
                    range.color === "gray" && "bg-gray-200 text-gray-800"
                  )}
                >
                  {range.label}
                </div>
              );
            })}
          </div>

          <div className="flex w-full text-xs text-gray-600">
            {visibleRanges.map((range, index) => {
              const rangeText = [];
              if (range.min !== undefined) {
                if (range.max !== undefined) {
                  rangeText.push(`${range.min} - ${range.max}`);
                } else {
                  rangeText.push(`> ${range.min}`);
                }
              } else if (range.max !== undefined) {
                rangeText.push(`< ${range.max}`);
              }

              return (
                <div key={index} className="flex-1 text-center">
                  {rangeText}
                </div>
              );
            })}
          </div>
        </>
      )}

      {showDetails && (
        <div className="mt-4 text-xs text-gray-600 bg-white p-3 rounded-md border">
          <p className="font-medium mb-1">
            Current value: {value} {unit}
          </p>
          {pH !== undefined && parameter === "Available Phosphorus" && (
            <p className="mb-1">
              Soil pH: {pH.toFixed(1)} ({getSoilPHType(pH)})
            </p>
          )}
          <p>
            Classification:{" "}
            <span className="font-medium">
              {currentRange?.label || "Unknown"}
            </span>
          </p>
          <div className="mt-2">
            {visibleRanges.map((range, index) => {
              let rangeText = "";
              if (range.min !== undefined && range.max !== undefined) {
                rangeText = `${range.min} - ${range.max}: ${range.label}`;
              } else if (range.min !== undefined) {
                rangeText = `> ${range.min}: ${range.label}`;
              } else if (range.max !== undefined) {
                rangeText = `< ${range.max}: ${range.label}`;
              }

              return (
                <div key={index} className="flex items-center mt-1">
                  <div
                    className={cn(
                      "w-3 h-3 mr-2 rounded-sm",
                      range.color === "red" && "bg-red-200",
                      range.color === "yellow" && "bg-yellow-200",
                      range.color === "orange" && "bg-orange-200",
                      range.color === "green" && "bg-green-200",
                      range.color === "amber" && "bg-amber-800",
                      range.color === "gray" && "bg-gray-200"
                    )}
                  />
                  <span>{rangeText}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
