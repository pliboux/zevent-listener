import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import SortableHeader from "./components/SortableHeader";
import { REFRESH_INTERVAL } from "./constants";
import type { SortKey, ZeventStreamer } from "./types";
import { getFollowers, getStreamTitle } from "./utils";

function App() {
    // Fetch the Zevent data from the API with React Query
    const { data, isLoading } = useQuery({
        queryKey: ["zevent"],
        queryFn: () => axios.get("/api").then((res) => res.data),
        refetchInterval: REFRESH_INTERVAL,
        staleTime: Infinity,
    });

    // State to hold the total donation amount
    const [donationAmount, setDonationAmount] = useState("");

    // State to hold the viewers count
    const [viewersCount, setViewersCount] = useState("");

    // State to hold the list of streamers
    const [streamers, setStreamers] = useState<ZeventStreamer[]>([]);

    // Set default sort to "donations"
    const [sortBy, setSortBy] = useState<SortKey>("donations");

    useEffect(() => {
        if (!data) return;

        setDonationAmount(data.donationAmount.formatted);
        setViewersCount(data.viewersCount.formatted);

        const mappedStreamers: ZeventStreamer[] = data.live.map(
            ({
                twitch_id,
                display,
                twitch,
                location,
                donationAmount,
                viewersAmount,
                donationUrl,
                profileUrl,
                online,
            }: any) => ({
                id: twitch_id,
                name: display,
                twitchName: twitch,
                followersCount: -1,
                location,
                donationAmountRaw: donationAmount.number,
                donationAmountFormatted: donationAmount.formatted,
                viewersAmountRaw: viewersAmount.number,
                viewersAmountFormatted: viewersAmount.formatted,
                title: "Chargement...",
                donationUrl,
                pictureUrl: profileUrl,
                isOnline: online,
            })
        );

        setStreamers(mappedStreamers);

        // Fetch followers and title for each streamer and update the state
        const loadAdditionalData = async () => {
            const streamersWithData = await Promise.all(
                mappedStreamers.map(async (streamer) => {
                    try {
                        const [followersCount, title] = await Promise.all([
                            getFollowers(streamer.twitchName),
                            streamer.isOnline
                                ? getStreamTitle(streamer.twitchName)
                                : Promise.resolve("Hors ligne")
                        ]);

                        return {
                            ...streamer,
                            followersCount,
                            title,
                        };
                    } catch (error) {
                        console.error(
                            `Failed to fetch additional data for ${streamer.twitchName}:`,
                            error
                        );

                        return streamer;
                    }
                })
            );

            setStreamers(streamersWithData);
        };

        loadAdditionalData();
    }, [data]);

    // Copy the array to avoid mutating state, then sort descending
    const sortedStreamers = [...streamers].sort((a, b) => {
        switch (sortBy) {
            case "viewers":
                return b.viewersAmountRaw - a.viewersAmountRaw;
            case "name":
                return a.name.localeCompare(b.name);
            case "followers":
                return b.followersCount - a.followersCount;
            case "title":
                return a.title.localeCompare(b.title);
            case "status":
                return Number(b.isOnline) - Number(a.isOnline);
            case "donations":
            default:
                return b.donationAmountRaw - a.donationAmountRaw;
        }
    });

    if (isLoading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin'></div>
            </div>
        );
    }

    const onlineCount = streamers.filter(s => s.isOnline).length;

    return (
        <section className='p-8 bg-gray-900 text-gray-200 min-h-screen'>
            {/* Header stats */}
            <div className='grid mb-6 grid-cols-1 sm:grid-cols-2 gap-4 flex-1'>
                <div className='bg-gray-800 shadow rounded-xl px-6 py-4 text-center'>
                    <h2 className='text-gray-400 font-medium mb-1'>💸 Total des donations 💸</h2>
                    <p className='text-3xl md:text-6xl font-bold text-purple-400'>
                        {donationAmount}
                    </p>
                </div>
                <div className='bg-gray-800 shadow rounded-xl px-6 py-4 text-center'>
                    <h2 className='text-gray-400 font-medium mb-1'>👥 Total de spectateurs 👥</h2>
                    <p className='text-3xl md:text-6xl font-bold text-indigo-400'>{viewersCount}</p>
                </div>
            </div>

            {/* Streamers list */}
            <div className='overflow-x-auto bg-gray-800 rounded-xl shadow border border-gray-700'>
                <table className='w-full text-left text-lg'>
                    <thead className='bg-gray-700 text-gray-300 text-xs uppercase'>
                        <tr>
                            <th className='text-center px-4 py-3'>#</th>
                            <SortableHeader keyName="name" label="Streamer" sortBy={sortBy} onSort={setSortBy} />
                            <SortableHeader keyName="followers" label="Followers" sortBy={sortBy} onSort={setSortBy} />
                            <SortableHeader keyName="donations" label="Donations" sortBy={sortBy} onSort={setSortBy} />
                            <SortableHeader keyName="viewers" label="Viewers" sortBy={sortBy} onSort={setSortBy} />
                            <SortableHeader keyName="title" label="Title" sortBy={sortBy} onSort={setSortBy} />
                            <SortableHeader keyName="status" alignCenter sortBy={sortBy} onSort={setSortBy}>
                                <p className='text-base font-medium'>({onlineCount}/{streamers.length})</p>
                            </SortableHeader>
                            <th className='text-center px-4 py-3'>Don</th>
                        </tr>
                    </thead>

                    <tbody className='divide-y divide-gray-700'>
                        {sortedStreamers.map((streamer, index) => (
                            <tr key={streamer.id} className='hover:bg-gray-700 transition'>
                                {/* Classement */}
                                <td className='text-center px-4 py-3 font-bold text-yellow-400'>
                                    {index + 1}
                                </td>

                                {/* Avatar + Name */}
                                <td>
                                    <div className='px-4 py-3 flex items-center gap-3'>
                                        <img
                                            src={streamer.pictureUrl}
                                            alt={streamer.name}
                                            className='w-8 h-8 rounded-full object-cover'
                                        />
                                        <a
                                            href={`https://www.twitch.tv/${streamer.twitchName}`}
                                            className='font-medium text-purple-400 hover:underline'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                        >
                                            {streamer.name}
                                        </a>
                                    </div>
                                </td>

                                {/* Followers */}
                                <td className='px-4 py-3 text-yellow-400'>
                                    {streamer.followersCount === -1 ?
                                        "-" :
                                        streamer.followersCount.toLocaleString()}
                                </td>

                                {/* Donations */}
                                <td className='px-4 py-3 font-medium text-green-400'>
                                    {streamer.donationAmountFormatted}
                                </td>

                                {/* Viewers */}
                                <td className='px-4 py-3 text-indigo-300'>
                                    {streamer.viewersAmountFormatted}
                                </td>

                                {/* Title */}
                                <td
                                    className='px-4 py-3 max-w-[200px] truncate text-gray-400 italic'
                                    title={streamer.title}
                                >
                                    {streamer.title}
                                </td>

                                {/* Status */}
                                <td
                                    className={`text-center px-4 py-3 font-semibold 
                                        ${streamer.isOnline ? "text-green-500" : "text-red-500"}`}
                                >
                                    {streamer.isOnline ? "En ligne" : "Hors ligne"}
                                </td>

                                {/* Donation button */}
                                <td className='text-center px-4 py-3'>
                                    <a
                                        href={streamer.donationUrl}
                                        className='inline-block text-center text-base px-3 py-1 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        Faire un don
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default App;