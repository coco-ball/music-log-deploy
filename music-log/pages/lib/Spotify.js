const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";
const PLAYBACKSTATE_ENDPOINT = "https://api.spotify.com/v1/me/player";
const CURRENTUSER_ENDPOINT = "https://api.spotify.com/v1/me";
const RECENT_ENDPOINT = "https://api.spotify.com/v1/me/player/recently-played";

const getAccessToken = async (refresh_token) => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  return response.json();
};

export const getUsersPlaylists = async (refresh_token) => {
  console.log("getUsersPlaylists in lib activated");
  const { access_token } = await getAccessToken(refresh_token);
  const response = await fetch(PLAYLISTS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch playLists");
  }
  return response;
};

export const getUsersPlayState = async (refresh_token) => {
  console.log("getUsersPlayState in lib activated");
  const { access_token } = await getAccessToken(refresh_token);
  const response = await fetch(PLAYBACKSTATE_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch playback state");
  }
  return response;
};

export const getCurrentUser = async (refresh_token) => {
  console.log("getCurrentUser in lib activated");
  const { access_token } = await getAccessToken(refresh_token);
  const response = await fetch(CURRENTUSER_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  console.log("Spotify.js response: " + response);

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }
  return response;
};

export const getRecentlyPlayed = async (refresh_token) => {
  console.log("getRecentlyPlayed in lib activated");
  const { access_token } = await getAccessToken(refresh_token);
  const response = await fetch(RECENT_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = `${response.status} (${response.statusText})`;
    throw new Error(`Failed to fetch recently played: ${errorMessage}`);
  }

  return response;
};

export default function Spotify() {
  return console.log(1);
}
