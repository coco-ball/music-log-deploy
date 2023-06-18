import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

export default NextAuth({
  providers: [
    SpotifyProvider({
      // TODO: 후에 이 부분을 추가로 수정하면 될 듯!
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-email,user-read-playback-state,user-read-currently-playing,user-read-recently-played",
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      //console.log("jwt activated");
      if (account) {
        token.accessToken = account.refresh_token;
      }
      return token;
    },
    async session(session, user) {
      console.log("nextauth file session activated");
      session.user = user;
      //console.log(session);
      return session;
    },
  },
});
