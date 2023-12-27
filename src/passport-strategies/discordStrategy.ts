import { Strategy as DiscordStrategy } from "passport-discord";

//DISCORD STRATEGY

// Configure the Discord strategy
const discordStrategy = new DiscordStrategy(
  {
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ["identify", "email"],
  },
  function (accessToken, refreshToken, profile, cb) {
    // Save the Discord profile information to the database
    // ...
    return cb(null, profile);
  }
);

export default discordStrategy;
