// app/api/analyze/status/route.ts

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Analysis from "@/models/Analysis";

export async function GET(request: Request) {
    try {

        const { searchParams } = new URL(request.url);

        const jobId = searchParams.get("jobId");

        if (!jobId) {
            return NextResponse.json(
                { error: "Missing Job ID" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const job = await Analysis.findById(jobId);

        if (!job) {
            return NextResponse.json(
                { error: "Job not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(job);

    } catch (err: any) {

        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );

    }
}