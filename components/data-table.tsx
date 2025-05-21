import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps {
  data: {
    sno: number;
    parameter: string;
    unit: string;
    result: number | string;
    rating?: string;
    testMethod?: string;
  }[];
}

export function DataTable({ data }: DataTableProps) {
  return (
    <div className="rounded-md border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[80px] font-semibold">S.No</TableHead>
            <TableHead className="font-semibold">Parameter</TableHead>
            <TableHead className="font-semibold">Unit</TableHead>
            <TableHead className="text-right font-semibold">Result</TableHead>
            <TableHead className="font-semibold">Rating</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{item.parameter}</TableCell>
              <TableCell>{item.unit}</TableCell>
              <TableCell className="text-right font-semibold">
                {item.result}
              </TableCell>
              <TableCell>
                {item.rating && (
                  <span
                    className={cn(
                      "px-2 py-1 rounded-md text-xs font-medium",
                      item.rating === "Low" &&
                        "bg-red-100 text-red-800 border border-red-200",
                      item.rating === "Medium" &&
                        "bg-yellow-100 text-yellow-800 border border-yellow-200",
                      item.rating === "Tolerable" &&
                        "bg-yellow-100 text-yellow-800 border border-yellow-200",
                      item.rating === "Semicritical" &&
                        "bg-orange-100 text-orange-800 border border-orange-200",
                      item.rating === "Critical" &&
                        "bg-red-100 text-red-800 border border-red-200",
                      item.rating === "Acidic" &&
                        "bg-red-100 text-red-800 border border-red-200",
                      item.rating === "Neutral" &&
                        "bg-green-100 text-green-800 border border-green-200",
                      item.rating === "Alkaline" &&
                        "bg-orange-100 text-orange-800 border border-orange-200",
                      item.rating === "Ideal" &&
                        "bg-green-100 text-green-800 border border-green-200",
                      item.rating === "High" &&
                        "bg-amber-600/50 text-black border border-amber-800",
                      item.rating === "Harmless" &&
                        "bg-green-100 text-green-800 border border-green-200"
                    )}
                  >
                    {item.rating}
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
