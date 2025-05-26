"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoIcon, ChevronDown, ChevronUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getRecommendations } from "@/lib/recommendation-algorithms";
import type { SoilDataItem } from "@/hooks/use-excel-data";
import { cn } from "@/lib/utils";

interface RecommendationsSectionProps {
  data: SoilDataItem[];
}

export function RecommendationsSection({ data }: RecommendationsSectionProps) {
  const [customRates, setCustomRates] = useState<Record<string, number>>({});
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const recommendations = getRecommendations(data, customRates);

  // Initialize custom rates with default values
  useEffect(() => {
    const initialRates: Record<string, number> = {};
    recommendations.forEach((rec) => {
      if (!(rec.id in customRates)) {
        initialRates[rec.id] = rec.defaultRate;
      }
    });
    if (Object.keys(initialRates).length > 0) {
      setCustomRates((prev) => ({ ...prev, ...initialRates }));
    }
  }, [recommendations.length]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const updateRate = (id: string, value: number) => {
    setCustomRates((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  if (recommendations.length === 0) {
    return (
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            No recommendations available for the current soil parameters.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle>Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <Collapsible
              key={rec.id}
              open={openItems[rec.id]}
              onOpenChange={() => toggleItem(rec.id)}
              className="border rounded-md overflow-hidden"
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-2 h-10 rounded-sm",
                        rec.value && rec.value > 0
                          ? "bg-orange-500"
                          : "bg-green-500"
                      )}
                    />
                    <div>
                      <h3 className="font-medium">{rec.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {rec.value} {rec.unit}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    {openItems[rec.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-0 border-t bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left side - Recommendation details */}
                    <div className="space-y-2">
                      <p className="text-sm">{rec.description}</p>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                              >
                                <InfoIcon className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                This recommendation is based on the current soil
                                parameters and may need to be adjusted based on
                                specific crop requirements and local conditions.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span className="text-sm text-muted-foreground">
                          Recommended application: {rec.value} {rec.unit}
                        </span>
                      </div>
                    </div>

                    {/* Right side - Input controls */}
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label
                          htmlFor={`rate-${rec.id}`}
                          className="text-sm font-medium"
                        >
                          Application Rate
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id={`rate-${rec.id}`}
                            type="number"
                            value={customRates[rec.id] || rec.defaultRate}
                            onChange={(e) =>
                              updateRate(
                                rec.id,
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-24"
                            step="0.1"
                            min="0"
                          />
                          <span className="text-sm text-muted-foreground">
                            {rec.rateUnit}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {rec.rateDescription}
                        </p>
                      </div>

                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Total Required:
                          </span>
                          <span className="text-sm font-bold">
                            {rec.value} {rec.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
