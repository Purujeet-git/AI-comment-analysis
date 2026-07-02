// src/app/api/analyze/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Analysis from "@/models/Analysis";
import { startAnalysis } from "@/services/analysisService";

interface AnalyzeRequest {
  mediaId: string;
  accessToken: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();

    const { mediaId, accessToken } = body;

    // -------------------------------
    // Validate Request
    // -------------------------------

    if (!mediaId || !accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "mediaId and accessToken are required.",
        },
        { status: 400 }
      );
    }

    // -------------------------------
    // Connect Database
    // -------------------------------

    await connectToDatabase();

    // -------------------------------
    // Create Analysis Job
    // -------------------------------

    const analysis = await Analysis.create({
      mediaId,
      status: "processing",
    });

    // -------------------------------
    // Start Background Processing
    // -------------------------------

    startAnalysis({
      jobId: analysis._id.toString(),
      mediaId,
      accessToken,
    }).catch(async (error) => {
      console.error("Background Analysis Failed:", error);

      await Analysis.findByIdAndUpdate(analysis._id, {
        status: "failed",
        error:
          error instanceof Error
            ? error.message
            : "Unexpected background error",
        completedAt: new Date(),
      });
    });

    // -------------------------------
    // Return Immediately
    // -------------------------------

    return NextResponse.json(
      {
        success: true,
        jobId: analysis._id,
        status: "processing",
      },
      { status: 202 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}