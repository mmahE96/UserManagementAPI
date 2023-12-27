import { Strategy as InstagramStrategy } from "passport-instagram";
const passport = require("passport");

//INSTAGRAM STRATEGY

// Configure the Instagram strategy
passport.use(
  new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      callbackURL: process.env.INSTAGRAM_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, cb) {
      // Save the Instagram profile information to the database
      // ...
      return cb(null, profile);
    }
  )
);
