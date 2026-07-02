// app/api/meta/media/route.ts

import { NextResponse } from "next/server";
import { getMedia } from "@/lib/graph/media";

export async function GET() {
    try {
        const media = await getMedia();

        return NextResponse.json({
            success: true,
            count: media.length,
            data: media,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error",
            },
            { status: 500 }
        );
    }
}