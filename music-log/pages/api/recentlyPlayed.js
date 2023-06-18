import { getRecentlyPlayed } from "@/pages/lib/Spotify";
import {getSession} from 'next-auth/react';

const handler = async (req, res) => {
    console.log("recently played handler");
    try {
        const {
            token: {accessToken},
        } = await getSession({req});
        const response = await getRecentlyPlayed(accessToken);
        console.log("check");
        console.log(response.status);

        const responseData = await response.json();
        const {total, items} = responseData;

        const result = {total, items};

        console.log("recently played: ", result);
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);

        console.log("error recently played");
        return res.status(204).end();
    }
};

export default handler;