import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getPages } from "@/lib/graph/pages";

export async function GET() {
  const session = await getServerSession(authOptions);

  console.log(session!.accessToken);

  if (!session?.accessToken) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const pages = await getPages(session.accessToken);

    return NextResponse.json(pages);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
}