import { Request, Response } from "express";
import express from "express";
import routes from "./routes/index";
import cors from "cors";
import logger from "./util/logger";
import notFoundError from "./middlewares/not-found.handler";
import genericErrorHandler from "./middlewares/generic-error.handler";
import nodeErrorHandler from "./middlewares/node-error.handler";
const speakeasy = require("speakeasy");
import passport from "passport";
require("./passport-strategies/googleStrategy");
require("./passport-strategies/twitterStrategy");
require("./passport-strategies/instagramStrategy");

import { fetchData } from "./services/fetchingData";
import session from "express-session";

//Strategies

import googleStrategy from "./passport-strategies/googleStrategy";
import twitterStrategy from "./passport-strategies/twitterStrategy";
import instagramStrategy from "./passport-strategies/instagramStrategy";
import telegramStrategy from "./passport-strategies/telegramStrategy";
import discordStrategy from "./passport-strategies/discordStrategy";

require("dotenv").config();

const app = express();

function isLoggedIn(req: Request, res: Response, next: any) {
  req.user ? next() : res.sendStatus(401);
}

app.use(express.json());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(
  cors({
    origin: "*",
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/profile", express.static("/uploads/images"));

const INTERVAL = 0.2 * 60 * 1000; // 0.2 minutes in milliseconds

//setInterval(fetchData, INTERVAL);

app.get("/", async (req: Request, res: Response) => {
  // const result=await sendMail();
  res.send("Hello World!");

  console.log("req.user", req.user);
});

//STRATEGY TEST ROUTES

//create random get route
app.get("/auth/random", async (req: Request, res: Response) => {
  //get simple responsehttp://localhost:3000/auth/googl
  res.send("Random route");
});
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/google/success",
    failureRedirect: "/auth/google/failure",
  })
);

app.get("/auth/google/success", async (req: Request, res: Response) => {
  //get simple responsehttp://localhost:3000/auth/googl
  res.send(req.user);
});

app.get("/auth/google/failure", async (req: Request, res: Response) => {
  res.send("Failed to authenticate..");
});

app.get("/auth/google/protected", isLoggedIn, async (req: Request, res: Response) => {
  res.send("Protected route");
});

app.get("/auth/google/logout", async (req: Request, res: Response) => {
  //req.logout();
  req.session.destroy();
  res.send("Logged out");
});




// Define the route to start the Twitter authentication process
app.get("/auth/twitter", passport.authenticate("twitter"));

// Define the callback route
app.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

// Define the route to start the Instagram authentication process
app.get("/auth/instagram", passport.authenticate("instagram"));

// Define the callback route
app.get(
  "/auth/instagram/callback",
  passport.authenticate("instagram", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);
//How to uncommetn selected code on Mac
//Select the code you want to uncomment

// Define the route to start the Telegram authentication process
app.get("/auth/telegram", passport.authenticate("telegram"));

// Define the callback route
app.get(
  "/auth/telegram/callback",
  passport.authenticate("telegram", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

// Define the route to start the Discord authentication process
app.get("/auth/discord", passport.authenticate("discord"));

// Define the callback route
app.get(
  "/auth/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

app.use("/api", routes);

//Error handling

app.use("*", notFoundError);
app.use(genericErrorHandler);
app.use(nodeErrorHandler);

app.listen(process.env.PORT || 3000, () => {
  logger.info("Listening on port " + 3000);
});
