import { getUsersPlayState } from "@/pages/lib/Spotify";
import {getSession} from 'next-auth/react';

const handler = async (req, res) => {
    console.log("playstate handler");
    try {
        const {
            token: {accessToken},
        } = await getSession({req});
        const response = await getUsersPlayState(accessToken);

        const responseData = await response.json();
        const { is_playing, item } = responseData;
        const result = { is_playing, item};
        return res.status(200).json(result);
    } catch (error) {
        console.log("error play state");
        return res.status(204).end();
    }
};

export default handler;