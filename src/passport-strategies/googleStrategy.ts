import GoogleStrategy from "passport-google-oauth20";
import { create, findUnique, findMany } from "../services/user.service";
import { prisma } from "@prisma/client";
const passport = require("passport");
import bcrypt from "bcrypt";

const speakeasy = require("speakeasy");

//GOOGLE STRATEGY

passport.use(
  new GoogleStrategy(
    {
      clientID:
        process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      state: true,
      scope: ["email", "profile"],
    },
    async function verify (_, __, profile, cb) {
      //check if user exists in db
     

      const profileEmail = profile.emails[0].value.toString();
      //remove spacing from username
      const username = profile.displayName.replace(/\s/g, "").toString();
      console.log("profileEmail", profileEmail);
      const user = (await findUnique(profileEmail)) as User;
      console.log("user from db", user);

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Joe12345!", salt);

      const secret = speakeasy.generateSecret({ length: 20 });

      if (user == null) {
        //create user
        const newUser = (await create(
          username,
          profileEmail,
          hashedPassword,
          "user",
          secret
        )) as User;
        console.log("newUser", newUser);
        console.log("2");

        return cb(null, newUser, { message: "User created" });
      } else {
        return cb(null, user, { message: "User already exists" });
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
