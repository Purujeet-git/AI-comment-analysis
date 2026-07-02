// src/lib/instagram.ts

interface InstagramComment {
  id: string;
  text: string;
  username?: string;
  timestamp?: string;
}

interface InstagramCommentsResponse {
  data: InstagramComment[];

  paging?: {
    cursors?: {
      before: string;
      after: string;
    };
    next?: string;
  };

  error?: {
    message: string;
    type: string;
    code: number;
  };
}

interface InstagramMedia {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  permalink?: string;
  timestamp?: string;
}

export async function fetchMedia(
  mediaId: string,
  accessToken: string
): Promise<InstagramMedia> {
  const url =
    `https://graph.facebook.com/v20.0/${mediaId}` +
    `?fields=id,caption,media_type,media_url,permalink,timestamp` +
    `&access_token=${accessToken}`;

  const response = await fetch(url);

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error?.message || "Failed to fetch media.");
  }

  return data;
}

export async function fetchComments(
  mediaId: string,
  accessToken: string,
  maxComments: number = 2000
): Promise<InstagramComment[]> {

  let comments: InstagramComment[] = [];

  let nextUrl: string | null =
    `https://graph.facebook.com/v20.0/${mediaId}/comments` +
    `?fields=id,text,username,timestamp` +
    `&limit=100` +
    `&access_token=${accessToken}`;

  while (nextUrl) {

    const response = await fetch(nextUrl);

    const data: InstagramCommentsResponse = await response.json();

    if (!response.ok || data.error) {
      throw new Error(
        data.error?.message || "Failed to fetch comments."
      );
    }

    comments.push(...data.data);

    if (comments.length >= maxComments) {
      comments = comments.slice(0, maxComments);
      break;
    }

    nextUrl = data.paging?.next ?? null;
  }

  return comments;
}