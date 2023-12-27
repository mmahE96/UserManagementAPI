import { RequestHandler } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import validator from "email-validator";
import {
  passwordAndEmailNotSent,
  emailNotValid,
  userAlreadyExists,
  userDoesNotExist,
  invalidCredentials,
  passwordNotValid,
} from "../validation/index";
import {
  create,
  findUnique,
  findUniqueById,
  removeUserById,
  updateVerificationTokenById,
} from "../services/user.service";
import { verifyEmail } from "./user.controllers";

import PasswordValidator from "password-validator";

import { User } from "../types/user.type";
require("dotenv").config();

const speakeasy = require("speakeasy");

import crypto from "crypto";
import { prisma } from "@prisma/client";
import sendEmail from "../util/sendemail";
import QRCode from "qrcode";

function generateVerificationToken(userId: number) {
  const secretKey = process.env.SECRET_KEY;
  return crypto
    .createHmac("sha256", secretKey)
    .update(userId.toString())
    .digest("hex");
}

const schema = new PasswordValidator();
schema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(2) // Must have at least 2 digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]);

const authLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password, token } = req.body;

    if (!email || !password || !token) {
      return res.status(400).json(passwordAndEmailNotSent);
    }

    const user = (await findUnique(email)) as User;

    if (!user) {
      return res.status(400).json(userDoesNotExist);
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const refreshToken = jwt.sign(
        { email: user.email, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_LIFE }
      );

      const { base32: secret } = user.secret;

      //Validate token for length
      if (token.length !== 6) {
        return res.status(400).json("Token is not valid");
      }

      const verified = speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token: token,
      });

      if (!verified) {
        return res.status(400).json("Token is not valid");
      }

      const accessToken = jwt.sign(
        { email: user.email, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_LIFE }
      );

      const response = {
        username: user.username,
        status: "Logged in",
        accessToken: accessToken,
        refreshToken: refreshToken,
      };

      return res.status(200).json(response);
    } else {
      return res.status(400).json(invalidCredentials);
    }
  } catch (err: any) {
    return res.json({
      error: {
        code: 400,
        message: err.message,
      },
    });
  }
};

const login: RequestHandler = async (req, res) => {
  console.log(req.body);
  console.log(req.headers);
  try {
    const { email, password, token } = req.body;

    if (!email || !password || !token) {
      return res.status(400).json(passwordAndEmailNotSent);
    }

    const user = (await findUnique(email)) as User;

    if (!user) {
      return res.status(400).json(userDoesNotExist);
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const refreshToken = jwt.sign(
        { email: user.email, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_LIFE }
      );

      const { base32: secret } = user.secret;

      //Validate token for length
      if (token.length !== 6) {
        return res.status(400).json("Token is not valid");
      }

      const verified = speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token: token,
      });

      if (!verified) {
        return res.status(400).json("Token is not valid");
      }

      const accessToken = jwt.sign(
        { email: user.email, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_LIFE }
      );

      const response = {
        username: user.username,
        status: "Logged in",
        accessToken: accessToken,
        refreshToken: refreshToken,
      };

      return res.status(200).json(response);
    } else {
      return res.status(400).json(invalidCredentials);
    }
  } catch (err: any) {
    return res.json({
      error: {
        code: 400,
        message: err.message,
      },
    });
  }
};

const register: RequestHandler = async (req, res) => {
  try {
    const { username, email, password } = req.body as {
      username: string;
      email: string;
      password: string;
    };

    if (!email || !password || !username) {
      return res.status(400).json(passwordAndEmailNotSent);
    }

    if (!validator.validate(email)) {
      return res.status(400).json(emailNotValid);
    }

    if (!schema.validate(password)) {
      return res.status(400).json(passwordNotValid);
    }

    const checkUser = (await findUnique(email)) as User;

    if (checkUser) {
      return res.status(400).json(userAlreadyExists);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const secret = speakeasy.generateSecret({ length: 20 });

    const dbUser = (await create(
      username,
      email,
      hashedPassword,
      "user",
      secret
    )) as User;

    const verificationEmailToken = jwt.sign(
      { email: email, id: dbUser.id },
      process.env.ACCESS_TOKEN_SECRET
    );

    //const walletAndAccountResponse = defaultWalletOption(dbUser.id);

    const emailContent = `Hi there,<br><br>Thanks for signing up for our app! To complete your registration, please click the following link to verify your email address:<br><br><a href='http://localhost:3000/api/verifyemailurl/${dbUser.id}/${verificationEmailToken}'>http://localhost:3000/api/verifyemailurl/${dbUser.id}/${verificationEmailToken}</a><br><br>If you did not sign up for our app, you can safely ignore this email.<br><br>Best regards,<br>The MarketSeon Team`;

    const sendingMail = await sendEmail(
      email,
      "Verify your email",
      null,
      emailContent
    );

    if (sendingMail === false) {
      return res.status(400).json("Email not sent");
    }

    return res.status(201).json({
      message:
        "User registered successfully and email sent to your email address",
      user: dbUser,
    });
  } catch (err: any) {
    return res.status(400).json({
      error: {
        code: 400,
        message: err.message,
      },
    });
  }
};
const generateQR: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json(passwordAndEmailNotSent);
    }

    const user = (await findUnique(email)) as User;
    console.log(user, "user");

    if (!user) {
      return res.status(400).json(userDoesNotExist);
    }

    const otpauthUrl = user.secret.otpauth_url;

    QRCode.toDataURL(otpauthUrl, (err, qrCodeData) => {
      if (err) {
        console.error("Error generating QR code:", err);
        return res.status(400).json({ error: "Error generating QR code" });

      }
      

     // return res.status(200).json({ qrCode: qrCodeData });
      return res.status(200).send(`<img src="${qrCodeData}" alt="QR Code" />`);
    });
  } catch (err: any) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const verifyToken: RequestHandler = async (req, res) => {
  try {
    const { token, email } = req.body;

    if (!token || !email) {
      return res.status(400).json(passwordAndEmailNotSent);
    }

    const user = (await findUnique(email)) as User;

    if (!user) {
      return res.status(400).json(userDoesNotExist);
    }

    const { base32: secret } = user.secret;

    //Validate token for length
    if (token.length !== 6) {
      return res.status(400).json("Token is not valid");
    }

    const verified = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token: token,
    });

    if (!verified) {
      return res.status(400).json("Token is not valid");
    }

    return res.status(200).json({ message: "Token verified successfully" });
  } catch (err: any) {
    return res.json({
      error: {
        code: 400,
        message: err.message,
      },
    });
  }
};

const removeUser: RequestHandler = async (req, res) => {
  try {
    // make access token required to hit this endpoint

    const { id } = req.params;

    const user = (await findUniqueById(Number(id))) as User;

    if (!user) {
      return res.status(400).json(userDoesNotExist);
    }

    await removeUserById(Number(id));

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err: any) {
    return res.json({
      error: {
        code: 400,
        message: err.message,
      },
    });
  }
};

export { login, register, removeUser, generateQR, verifyToken };
