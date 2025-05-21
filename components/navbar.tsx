"use client";

import { useState, useEffect } from "react";
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExcelData } from "@/hooks/use-excel-data";
import { ReportSelector } from "@/components/report-selector";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { handleFileUpload } = useExcelData();

  // Only show the theme toggle after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-white shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <img src="/logo.jpg" alt="Logo" className="h-12 w-12 rounded-full" />

          <div className="font-semibold text-lg md:text-2xl">
            Soil Report Dashboard
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* File Upload Button */}
          <div className="relative">
            <Input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              id="excel-upload"
              onChange={handleFileUpload}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("excel-upload")?.click()}
              className="hidden sm:flex"
            >
              <UploadIcon className="mr-2 h-4 w-4" />
              Upload Excel File
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => document.getElementById("excel-upload")?.click()}
              className="sm:hidden"
            >
              <UploadIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Report Selector */}
          <ReportSelector />
        </div>
      </div>
    </header>
  );
}
