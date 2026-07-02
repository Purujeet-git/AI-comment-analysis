import { graphFetch } from "./client";

export interface InstagramComment {
  id: string;
  text: string;
  username: string;
  timestamp: string;

  like_count?: number;
  replies?: {
    data: InstagramComment[];
  };
}

interface CommentsResponse {
  data: InstagramComment[];

  paging?: {
    cursors: {
      before: string;
      after: string;
    };

    next?: string;
  };
}

/**
 * Fetch all first-level comments for a media item.
 */
export async function getComments(
  mediaId: string,
  pageAccessToken: string
): Promise<CommentsResponse> {
  return graphFetch<CommentsResponse>(
    `/${mediaId}/comments`,
    {
      accessToken: pageAccessToken,

      query: {
        fields: [
          "id",
          "text",
          "username",
          "timestamp",
          "like_count",
        ].join(","),
      },
    }
  );
}