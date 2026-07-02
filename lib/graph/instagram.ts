import { graphFetch } from "./client";

export interface InstagramBusinessAccount {
  id: string;
}

export interface InstagramPageResponse {
  id: string;
  instagram_business_account?: InstagramBusinessAccount;
}

export async function getInstagramBusinessAccount(
  pageId: string,
  pageAccessToken: string
): Promise<InstagramPageResponse> {
  return graphFetch<InstagramPageResponse>(`/${pageId}`, {
    accessToken: pageAccessToken,
    query: {
      fields: "instagram_business_account",
    },
  });
}