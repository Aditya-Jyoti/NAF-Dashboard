import { type NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import type { ExcelData } from "@/hooks/use-excel-data";

// GET all reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get("reportId");

    const client = await clientPromise;
    const db = client.db("soil-analysis");

    if (reportId) {
      // Get a specific report by ID
      const report = await db.collection("reports").findOne({ reportId });

      if (!report) {
        return NextResponse.json(
          { error: "Report not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ report });
    } else {
      // Get all reports (just metadata for listing)
      const reports = await db
        .collection("reports")
        .find({})
        .project({ reportId: 1, metadata: 1 })
        .toArray();

      return NextResponse.json({ reports });
    }
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}

// POST a new report
export async function POST(request: NextRequest) {
  try {
    const data: ExcelData = await request.json();

    // Create a unique identifier for the report
    const reportId = `${data.metadata.reportNumber}-${data.metadata.labId}`;

    const client = await clientPromise;
    const db = client.db("soil-analysis");

    // Check if report already exists
    const existingReport = await db.collection("reports").findOne({ reportId });

    if (existingReport) {
      return NextResponse.json(
        { message: "Report already exists", reportId },
        { status: 200 }
      );
    }

    // Insert new report
    const result = await db.collection("reports").insertOne({
      reportId,
      metadata: data.metadata,
      categories: data.categories,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Report saved successfully", reportId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving report:", error);
    return NextResponse.json(
      { error: "Failed to save report" },
      { status: 500 }
    );
  }
}
