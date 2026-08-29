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
    game: string;
    donationUrl: string;
    pictureUrl: string;
    isOnline: boolean;
};

// Type for the sorting key
export type SortKey = "name" | "followers" | "donations" | "viewers" | "game" | "status";

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