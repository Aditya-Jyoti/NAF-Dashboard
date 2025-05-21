import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExcelData } from "@/hooks/use-excel-data";

export function MetadataSection() {
  const { data } = useExcelData();
  const { metadata } = data;

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle>Report Information</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1 p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-muted-foreground">
              Issued To
            </h3>
            <p className="text-sm font-semibold whitespace-pre-line">
              {metadata.issuedTo}
            </p>
          </div>
          <div className="space-y-1 p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-muted-foreground">
              Report Number
            </h3>
            <p className="text-sm font-semibold">{metadata.reportNumber}</p>
          </div>
          <div className="space-y-1 p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-muted-foreground">
              Lab ID
            </h3>
            <p className="text-sm font-semibold">{metadata.labId}</p>
          </div>
          <div className="space-y-1 p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-muted-foreground">
              Sample ID
            </h3>
            <p className="text-sm font-semibold">{metadata.sampleId}</p>
          </div>
          <div className="space-y-1 p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-muted-foreground">
              Sample Received On
            </h3>
            <p className="text-sm font-semibold">{metadata.sampleReceivedOn}</p>
          </div>
          <div className="space-y-1 p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-muted-foreground">
              Analysis Started On
            </h3>
            <p className="text-sm font-semibold">
              {metadata.analysisStartedOn}
            </p>
          </div>
          <div className="space-y-1 p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-muted-foreground">
              Analysis Completed On
            </h3>
            <p className="text-sm font-semibold">
              {metadata.analysisCompletedOn}
            </p>
          </div>
          <div className="space-y-1 p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-muted-foreground">
              Report Date
            </h3>
            <p className="text-sm font-semibold">{metadata.reportDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
