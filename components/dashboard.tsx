"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { MetadataSection } from "@/components/metadata-section";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { useExcelData } from "@/hooks/use-excel-data";
import { ParameterRanges } from "@/components/parameter-ranges";
import { RecommendationsSection } from "@/components/recommendations-section";
import { Footer } from "@/components/footer";

export default function Dashboard() {
  const { hasData, getAllData } = useExcelData();

  // If no data has been uploaded, show the empty state
  if (!hasData) {
    return (
      <div className="flex min-h-screen flex-col">
        <EmptyState />
        <Footer />
      </div>
    );
  }

  // Get all data items
  const allData = getAllData();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto p-4 md:p-6 space-y-6">
        <MetadataSection />

        {/* Parameter Ranges */}
        <ParameterRanges data={allData} />

        {/* Recommendations Section */}
        <RecommendationsSection data={allData} />

        {/* Raw Data Table (no categories) */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle>Raw Data</CardTitle>
          </CardHeader>
          <CardContent className="bg-white">
            <DataTable data={allData} />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
