"use client";

import { ExcelDataProvider } from "@/hooks/use-excel-data";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <ExcelDataProvider>{children}</ExcelDataProvider>;
}
