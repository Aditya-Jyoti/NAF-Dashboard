"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const recommendations = getRecommendations(data);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
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
                  <p className="mb-2">{rec.description}</p>
                  <div className="flex items-center justify-between">
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
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
