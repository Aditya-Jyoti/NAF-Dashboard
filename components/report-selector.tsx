"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Database } from "lucide-react";
import { useExcelData } from "@/hooks/use-excel-data";

export function ReportSelector() {
  const { loadReportFromDb, reports, loading } = useExcelData();

  const handleSelectReport = async (reportId: string) => {
    await loadReportFromDb(reportId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="hidden md:flex"
          disabled={loading || reports.length === 0}
        >
          <Database className="mr-2 h-4 w-4" />
          {loading ? "Loading..." : "Saved Reports"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        {reports.length === 0 ? (
          <DropdownMenuItem disabled>No saved reports found</DropdownMenuItem>
        ) : (
          reports.map((report) => (
            <DropdownMenuItem
              key={report.reportId}
              onClick={() => handleSelectReport(report.reportId)}
              className="flex flex-col items-start"
            >
              <span className="font-medium">
                {report.metadata.reportNumber}
              </span>
              <span className="text-xs text-muted-foreground">
                {report.metadata.issuedTo.split("\n")[0]} -{" "}
                {report.metadata.reportDate}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
