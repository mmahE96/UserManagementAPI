import { Strategy as TwitterStrategy } from "passport-twitter";

const passport = require("passport");

//TWITER STRATEGY

// Configure the Twitter strategy
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL:  process.env.TWITTER_CALLBACK_URL,
    },
    function (token, tokenSecret, profile, cb) {
      // Save the Twitter profile information to the database
      console.log("profile", profile);

      // ...
      return cb(null, profile);
    }
  )
);
