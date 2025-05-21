"use client";

import type React from "react";
import {
  useState,
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import * as XLSX from "xlsx";
import { getRating } from "@/lib/parameter-ranges";

// Interfaces
export interface SoilDataItem {
  sno: number;
  parameter: string;
  unit: string;
  result: number | string;
  testMethod?: string;
  rating?: string;
}

export interface Metadata {
  issuedTo: string;
  sampleDescription: string;
  reportNumber: string;
  reportDate: string;
  labId: string;
  uniqueLabReportNo: string;
  sampleReceivedOn: string;
  analysisStartedOn: string;
  analysisCompletedOn: string;
  sampleId: string;
  discipline: string;
  group: string;
  sampleDrawnBy: string;
}

export interface ExcelData {
  metadata: Metadata;
  categories: {
    available: SoilDataItem[];
    exchangeable: SoilDataItem[];
    misc: SoilDataItem[];
    saturation: SoilDataItem[];
  };
}

interface ExcelDataContextType {
  data: ExcelData;
  hasData: boolean;
  currentFileName: string | null;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  parseExcelFile: (file: File) => Promise<void>;
  resetData: () => void;
  getAllData: () => SoilDataItem[];
  loadReportFromDb: (reportId: string) => Promise<void>;
  loadAllReports: () => Promise<{ reportId: string; metadata: Metadata }[]>;
  reports: { reportId: string; metadata: Metadata }[];
  loading: boolean;
}

// Empty default data
const emptyData: ExcelData = {
  metadata: {
    issuedTo: "",
    sampleDescription: "",
    reportNumber: "",
    reportDate: "",
    labId: "",
    uniqueLabReportNo: "",
    sampleReceivedOn: "",
    analysisStartedOn: "",
    analysisCompletedOn: "",
    sampleId: "",
    discipline: "",
    group: "",
    sampleDrawnBy: "",
  },
  categories: {
    misc: [],
    available: [],
    exchangeable: [],
    saturation: [],
  },
};

// Context
const ExcelDataContext = createContext<ExcelDataContextType | undefined>(
  undefined
);

// Extract metadata from worksheet
function extractMetadata(sheet: XLSX.WorkSheet): Metadata {
  return {
    issuedTo: `${sheet["A11"]?.v}\n${sheet["A12"]?.v}` || "",
    sampleDescription: `${sheet["D11"]?.v || ""} ${
      sheet["D12"]?.v || ""
    }`.trim(),
    reportNumber: sheet["C15"]?.v || "",
    reportDate: sheet["C16"]?.v || "",
    labId: sheet["C18"]?.v || "",
    uniqueLabReportNo: sheet["B17"]?.v || "",
    sampleReceivedOn: sheet["F15"]?.v || "",
    analysisStartedOn: sheet["F16"]?.v || "",
    analysisCompletedOn: sheet["F17"]?.v || "",
    sampleId: sheet["F18"]?.v || "",
    discipline: sheet["B19"]?.v || "",
    group: sheet["F19"]?.v || "",
    sampleDrawnBy: sheet["F13"]?.v || "",
  };
}

// Extract categorized soil data
function extractCategories(sheet: XLSX.WorkSheet): ExcelData["categories"] {
  const categories = {
    misc: [],
    available: [],
    exchangeable: [],
    saturation: [],
  } as ExcelData["categories"];

  for (let i = 23; i <= 42; i++) {
    const snoCell = sheet[`A${i}`];
    if (!snoCell) continue;

    const sno = parseFloat(snoCell.v);
    if (isNaN(sno)) continue;

    let parameter = sheet[`B${i}`]?.v || "";
    parameter = parameter.trim();

    // Skip unwanted parameters
    if (
      parameter === "Sodium Exchangeable Na" ||
      parameter === "Cation Exchange Capacity (by addition)"
    )
      continue;

    const unit = sheet[`D${i}`]?.v || "";
    const resultCell = sheet[`E${i}`];
    const result = resultCell
      ? resultCell.f
        ? resultCell.v
        : resultCell.v
      : "";
    const testMethod = sheet[`F${i}`]?.v || "";

    const numericResult =
      typeof result === "number" ? result : parseFloat(result as string);

    let rating = "";
    if (!isNaN(numericResult)) {
      const parameterMap: Record<string, string> = {
        pH: "pH",
        EC: "Electrical Conductivity",
        "Organic Carbon": "Organic Matter",
        "Available Nitrogen": "Nitrate Nitrogen",
        "Available Phosphorus": "Available Phosphorus",
        "Available Potassium": "Potassium Exchangeable K",
        "Available Calcium": "Calcium Exchangeable Ca",
        "Available Magnesium": "Magnesium Exchangeable Mg",
        "Available Sulphur": "Sulfur Available S",
        "Available Zinc": "Zinc Available Zn",
        "Available Manganese": "Manganese Available Mn",
        "Available Iron": "Iron Available Fe",
        "Available Copper": "Copper Available Cu",
        "Available Boron": "Boron Available B",
        "K Saturation": "K Saturation",
        "Ca Saturation": "Ca Saturation",
        "Mg Saturation": "Mg Saturation",
        "Na Saturation": "Na Saturation",
      };

      const mapped = parameterMap[parameter] || parameter;
      rating = getRating(mapped, numericResult).label;
    }

    const item: SoilDataItem = {
      sno,
      parameter,
      unit,
      result,
      testMethod,
      rating,
    };

    if (sno >= 17 && sno <= 20) {
      categories.saturation.push(item);
    } else if (sno === 5 || (sno >= 10 && sno <= 15)) {
      categories.available.push(item);
    } else if (sno >= 6 && sno <= 8) {
      categories.exchangeable.push(item);
    } else {
      categories.misc.push(item);
    }
  }

  return categories;
}

// Save report to MongoDB
async function saveToMongoDB(data: ExcelData): Promise<string | null> {
  try {
    const reportId = `${data.metadata.reportNumber}-${data.metadata.labId}`;
    const response = await fetch("/api/soil-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to save report");

    return reportId;
  } catch (err) {
    console.error("MongoDB save error:", err);
    return null;
  }
}

// Provider
export function ExcelDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ExcelData>(emptyData);
  const [hasData, setHasData] = useState(false);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [reports, setReports] = useState<
    { reportId: string; metadata: Metadata }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const all = await loadAllReports();
        setReports(all);

        if (all.length) await loadReportFromDb(all[0].reportId);
        else setHasData(false);
      } catch (err) {
        console.error("Initial fetch error:", err);
        setHasData(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resetData = () => {
    setData(emptyData);
    setHasData(false);
    setCurrentFileName(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setCurrentFileName(file.name);
      await parseExcelFile(file);
      const all = await loadAllReports();
      setReports(all);
      e.target.value = "";
    } catch (err) {
      console.error("Excel upload error:", err);
      resetData();
      alert("Error uploading file. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const parseExcelFile = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[1]];

      const metadata = extractMetadata(sheet);
      const categories = extractCategories(sheet);

      const newData = { metadata, categories };
      setData(newData);
      setHasData(true);
      await saveToMongoDB(newData);
    } catch (err) {
      console.error("Parse error:", err);
      throw err;
    }
  };

  const getAllData = () =>
    [
      ...data.categories.misc,
      ...data.categories.available,
      ...data.categories.exchangeable,
      ...data.categories.saturation,
    ].sort((a, b) => a.sno - b.sno);

  const loadReportFromDb = async (reportId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/soil-reports?reportId=${reportId}`);
      if (!res.ok) throw new Error("DB report fetch failed");

      const { report } = await res.json();
      if (report) {
        setData({ metadata: report.metadata, categories: report.categories });
        setHasData(true);
        setCurrentFileName(`Report ${report.metadata.reportNumber}`);
      }
    } catch (err) {
      console.error("DB load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadAllReports = async () => {
    try {
      const res = await fetch("/api/soil-reports");
      if (!res.ok) throw new Error("Failed to load report list");
      const { reports } = await res.json();
      return reports || [];
    } catch (err) {
      console.error("All reports fetch error:", err);
      return [];
    }
  };

  return (
    <ExcelDataContext.Provider
      value={{
        data,
        hasData,
        currentFileName,
        handleFileUpload,
        parseExcelFile,
        resetData,
        getAllData,
        loadReportFromDb,
        loadAllReports,
        reports,
        loading,
      }}
    >
      {children}
    </ExcelDataContext.Provider>
  );
}

// Hook
export function useExcelData() {
  const context = useContext(ExcelDataContext);
  if (!context)
    throw new Error("useExcelData must be used within ExcelDataProvider");
  return context;
}
