"use client";

import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { useExcelData } from "@/hooks/use-excel-data";

export function EmptyState() {
  const { handleFileUpload } = useExcelData();

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-50 p-4">
      <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-8 text-center">
          National Agro Foundation
        </h1>
        <div className="flex justify-center">
          <input
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            id="excel-upload-main"
            onChange={handleFileUpload}
          />
          <Button
            size="lg"
            onClick={() =>
              document.getElementById("excel-upload-main")?.click()
            }
            className="flex items-center gap-2"
          >
            <UploadIcon className="h-5 w-5" />
            Upload Excel to Visualize
          </Button>
        </div>
      </div>
    </div>
  );
}
