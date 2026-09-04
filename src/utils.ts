import type { TwitchGqlResponse, TwitchGqlStreamResponse } from "./types";

// Function to fetch the number of followers for a given Twitch username using the Twitch GraphQL API
export async function getFollowers(username: string): Promise<number> {
  const response = await fetch("https://gql.twitch.tv/gql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko",
    },
    body: JSON.stringify({
      query: `
        query {
          user(login: "${username}") {
            followers {
              totalCount
            }
          }
        }
      `,
    }),
  });

  if (!response.ok) {
    throw new Error(`Twitch error: ${response.status}`);
  }

  const json = (await response.json()) as TwitchGqlResponse;

  return json.data.user?.followers.totalCount ?? 0;
}

// Function to fetch the stream title for a given Twitch username using the Twitch GraphQL API
export async function getStreamTitle(username: string): Promise<string> {
  const response = await fetch("https://gql.twitch.tv/gql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko",
    },
    body: JSON.stringify({
      query: `
        query {
          user(login: "${username}") {
            stream {
              title
            }
          }
        }
      `,
    }),
  });

  if (!response.ok) {
    throw new Error(`Twitch error: ${response.status}`);
  }

  const json = (await response.json()) as TwitchGqlStreamResponse;

  return json.data.user?.stream?.title ?? "Hors ligne";
}