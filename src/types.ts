// Interface for a streamer participating in Zevent
export interface ZeventStreamer {
    id: string;
    name: string;
    twitchName: string;
    followersCount: number;
    location: string;
    donationAmountRaw: number;
    donationAmountFormatted: string;
    viewersAmountRaw: number;
    viewersAmountFormatted: string;
    title: string;
    donationUrl: string;
    pictureUrl: string;
    isOnline: boolean;
};

// Type for the sorting key
export type SortKey = "name" | "followers" | "donations" | "viewers" | "title" | "status";

// Interface for the Twitch GraphQL API response
export interface TwitchGqlResponse {
    data: {
        user: {
            followers: {
                totalCount: number;
            };
        } | null;
    };
}

// Interface for the Twitch GraphQL API stream response
export interface TwitchGqlStreamResponse {
    data: {
        user: {
            stream: {
                title: string;
            } | null;
        } | null;
    };
}