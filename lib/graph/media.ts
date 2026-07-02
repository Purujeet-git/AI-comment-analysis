import { graphFetch } from "./client";

export interface InstagramMedia {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_product_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

interface MediaResponse {
  data: InstagramMedia[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

export async function getMedia(
  instagramBusinessId: string,
  pageAccessToken: string
): Promise<MediaResponse> {
  return graphFetch<MediaResponse>(
    `/${instagramBusinessId}/media`,
    {
      accessToken: pageAccessToken,
      query: {
        fields: [
          "id",
          "caption",
          "media_type",
          "media_product_type",
          "media_url",
          "thumbnail_url",
          "permalink",
          "timestamp",
          "like_count",
          "comments_count",
        ].join(","),
      },
    }
  );
}

export async function getMediaById(
  mediaId: string,
  pageAccessToken: string
): Promise<InstagramMedia> {
  return graphFetch<InstagramMedia>(
    `/${mediaId}`,
    {
      accessToken: pageAccessToken,
      query: {
        fields: [
          "id",
          "caption",
          "media_type",
          "media_product_type",
          "media_url",
          "thumbnail_url",
          "permalink",
          "timestamp",
          "like_count",
          "comments_count",
        ].join(","),
      },
    }
  );
}

export async function getReels(
  instagramBusinessId: string,
  pageAccessToken: string
): Promise<InstagramMedia[]> {
  const media = await getMedia(
    instagramBusinessId,
    pageAccessToken
  );

  return media.data.filter(
    (item) => item.media_product_type === "REELS"
  );
}