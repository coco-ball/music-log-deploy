import { getCurrentUser } from "../lib/Spotify";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  console.log("currentUser handler");
  console.log(accessToken);
  try {
    const {
      token: { accessToken },
    } = await getSession({ req });
    const response = await getCurrentUser(accessToken);
    console.log("currentUser,js response: " + response);
    const responseData = await response.json();

    const { id, images, display_name } = responseData;
    const result = { id, images, display_name };
    return res.status(200).json(result);
  } catch (error) {
    console.log("error current user");
    return res.status(401).end();
  }
};

export default handler;
