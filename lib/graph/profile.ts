import { graphFetch } from "./client";

export interface FacebookProfile {
  id: string;
  name: string;
  email?: string;
}

export async function getProfile(accessToken: string) {
  return graphFetch<FacebookProfile>("/me", {
    accessToken,
    query: {
      fields: "id,name,email",
    },
  });
}