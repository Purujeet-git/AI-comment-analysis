import { graphFetch } from "./client";

export interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  category?: string;
  tasks: string[];
}

interface PagesResponse {
  data: FacebookPage[];
}

export async function getPages(accessToken: string) {
  return graphFetch<PagesResponse>("/me/accounts", {
    accessToken,
    query: {
      fields: [
        "id",
        "name",
        "access_token",
        "category",
        "tasks",
      ].join(","),
    },
  });
}