// src/lib/graph/client.ts

const GRAPH_API_VERSION = "v23.0";

const GRAPH_BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

export class GraphAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: number,
    public type?: string
  ) {
    super(message);
    this.name = "GraphAPIError";
  }
}

interface GraphRequestOptions {
  accessToken: string;
  method?: "GET" | "POST" | "DELETE";
  query?: Record<string, string | number | boolean>;
  body?: Record<string, unknown>;
}

export async function graphFetch<T>(
  endpoint: string,
  {
    accessToken,
    method = "GET",
    query = {},
    body,
  }: GraphRequestOptions
): Promise<T> {
  const url = new URL(`${GRAPH_BASE_URL}${endpoint}`);

  Object.entries(query).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  url.searchParams.append("access_token", accessToken);

  const response = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    ...(body && {
      body: JSON.stringify(body),
    }),
    cache: "no-store",
  });

  const json = await response.json();

  if (!response.ok) {
    throw new GraphAPIError(
      json.error?.message ?? "Unknown Graph API Error",
      response.status,
      json.error?.code,
      json.error?.type
    );
  }

  return json as T;
}