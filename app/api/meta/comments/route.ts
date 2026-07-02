import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { getPages } from "@/lib/graph/pages";
import { getInstagramBusinessAccount } from "@/lib/graph/instagram";
import { getMedia } from "@/lib/graph/media";
import { getComments } from "@/lib/graph/comments";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const pages = await getPages(session.accessToken);

    const page = pages.data[0];

    const instagram = await getInstagramBusinessAccount(
      page.id,
      page.access_token
    );

    if (!instagram.instagram_business_account) {
      return NextResponse.json(
        { error: "Instagram account not connected" },
        { status: 404 }
      );
    }

    const media = await getMedia(
      instagram.instagram_business_account.id,
      page.access_token
    );

    if (media.data.length === 0) {
      return NextResponse.json(
        { error: "No media found" },
        { status: 404 }
      );
    }

    // Use the latest reel/post for testing
    const latestMedia = media.data[0];

    const comments = await getComments(
      latestMedia.id,
      page.access_token
    );

    return NextResponse.json({
      media: latestMedia,
      comments,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}