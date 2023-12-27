import { RequestHandler } from "express";
import checkrefreshtoken from "../util/checkrefreshtoken";
import sendEmail from "../util/sendemail";
import notFoundError from "./middlewares/not-found.handler";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import {
  findMany,
  findUnique,
  findByUserName,
  findManyProfile,
  pagination,
  updatePassword,
  updateProfile,
  createProfileData,
  findUniqueById,
  updateEmailVerifiedById,
  updateEmailById,
  updateHasProfileById,
  connectUserAndProfile,
} from "../services/user.service";

import validator from "email-validator";

import PasswordValidator from "password-validator";

import {
  passwordAndEmailNotSent,
  emailNotSent,
  passwordNotSent,
  emailNotValid,
  passwordNotValid,
  userDoesNotExist,
  emailFailedToSend,
  tokenNotFound,
  tokenIsNotValid,
  refreshTokenNotFound,
  refreshTokenIsNotValid,
} from "../validation";

import { User } from "../types/user.type";
import { Profile } from "../types/profile.type";

const generator = require("generate-password");

const pdfkit = require("pdfkit");
const fs = require("fs");

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

require("dotenv").config();

/*

Temporarily disabled, to stop turning on docker.

const Minio = require("minio");

const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "minioadmin",
  secretKey: "minioadmin",
});

const filePath = "/testbucket";
const bucketName = "testbucket";
const objectName = "image.jpg";
const speakeasy = require("speakeasy");

minioClient.bucketExists("testbucket", function (error) {
  if (error) {
    console.log("bucket exist error");
    return console.log(error);
  }

  console.log("Bucket exists");
});

*/

const createProfilePicture = async (req: Request, res: Response) => {
  console.log(req.file);
  //console.log(minioClient)

  try {
    minioClient.putObject(
      bucketName,
      req.file.originalname,
      req.file.path,
      "application/octet-stream",
      (err, etag) => {
        if (err) {
          console.error(err);
        } else {
          console.log(
            `Successfully uploaded image to ${bucketName}/${objectName} with ETag ${etag}`
          );

          return res.status(200).send({
            message: `Successfully uploaded image to ${bucketName}/${objectName} with ETag ${etag}`,
          });
        }
      }
    );
  } catch (error) {
    return console.log(error);
  }
};

const updateProfilePicture = async (req: Request, res: Response) => {
  console.log(req.file);
  //console.log(minioClient)

  try {
    minioClient.putObject(
      bucketName,
      req.file.originalname,
      req.file.path,
      "application/octet-stream",
      (err, etag) => {
        if (err) {
          console.error(err);
        } else {
          console.log(
            `Successfully updated image to ${bucketName}/${objectName} with ETag ${etag}`
          );

          return res.status(200).send({
            message: `Successfully updated image to ${bucketName}/${objectName} with ETag ${etag}`,
          });
        }
      }
    );
  } catch (error) {
    return console.log(error);
  }
};

const removeProfilePicture = async (req: Request, res: Response) => {
  console.log(req.file);
  //console.log(minioClient)

  try {
    minioClient.removeObject(bucketName, req.file.originalname, (err, etag) => {
      if (err) {
        console.error(err);
      } else {
        console.log(
          `Successfully removed image from ${bucketName}/${objectName}`
        );

        return res.status(200).send({
          message: `Successfully removed image from ${bucketName}/${objectName}`,
        });
      }
    });
  } catch (error) {
    return console.log(error);
  }
};

const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const users = (await findMany()) as User[];
    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

const getAllProfiles: RequestHandler = async (req, res) => {
  try {
    const profiles = (await findManyProfile()) as Profile[];

    return res.status(200).json(profiles);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

const refresh_token: RequestHandler = async (req, res) => {
  const refreshToken = req.headers["refresh-token"] as string;
  if (!refreshToken) {
    return res.status(400).json(refreshTokenNotFound);
  }

  try {
    const refreshTokenPayload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    ) as { email: string; id: string };

    if (!refreshTokenPayload) {
      return res.status(400).json(refreshTokenIsNotValid);
    }

    const user = (await findUnique(refreshTokenPayload.email)) as User;

    if (!user) {
      return res.status(400).json(userDoesNotExist);
    }

    if (user) {
      const accessToken = jwt.sign(
        { email: user.email, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_LIFE }
      );

      const refreshToken = jwt.sign(
        { email: user.email, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_LIFE }
      );

      const response = {
        status: "Logged in, new token generated",
        "access-token": accessToken,
        "refresh-token": refreshToken,
      };

      return res.status(201).json(response);
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

const dashboard: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params.id;
    const refreshToken = req.headers["refresh-token"];

    console.log("refresh", refreshToken);

    if (!refreshToken) {
      return res.status(400).json(tokenNotFound);
    }

    const newAccessToken = checkrefreshtoken(refreshToken) as string;

    if (!newAccessToken) {
      return res.status(400).json(tokenIsNotValid);
    }

    return res.status(201).json({
      message: "New access-token generated",
      token: newAccessToken,
      id,
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

const paginationResults: RequestHandler<{
  page: string;
  limit: string;
}> = async (req, res) => {
  try {
    const { page, limit } = req.params;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const users = (await pagination(pageNumber, limitNumber)) as User[];
    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

//User and Profile Management

const changePassword: RequestHandler = async (req, res) => {
  try {
    const { email, newpassword, oldpassword } = req.body as {
      email: string;
      newpassword: string;
      oldpassword: string;
    };

    if (!email || !newpassword || !oldpassword) {
      return res.status(400).json(passwordAndEmailNotSent);
    }

    if (!validator.validate(email)) {
      return res.status(400).json(emailNotValid);
    }

    if (!schema.validate(oldpassword)) {
      return res.status(400).json(passwordNotValid);
    }

    if (!schema.validate(newpassword)) {
      return res.status(400).json(passwordNotValid);
    }

    const checkUser = (await findUnique(email)) as User;

    if (!checkUser) {
      return res.status(400).json(userDoesNotExist);
    }

    const checkPassword = await bcrypt.compare(oldpassword, checkUser.password);

    if (!checkPassword) {
      return res.status(400).json({ message: "Password does not match" });
    }

    console.log("checkpassword", checkPassword);

    const TOKEN = jwt.sign(
      { email: checkUser.email, id: checkUser.id, newpassword: newpassword },
      process.env.ACCESS_TOKEN_SECRET
    );

    const link = `${process.env.BASE_URL}/resetpassword/${checkUser.id}/${TOKEN}`;

    const emailResponse = await sendEmail(email, "Password Change", link);

    if (emailResponse) {
      return res.status(200).json({
        message:
          "Email sent successfully, click on the link to verify your action.",
      });
    } else {
      return res.status(400).json(emailFailedToSend);
    }
  } catch (error: any) {
    return res.status(400).json(error);
  }
};

const forgotPassword: RequestHandler = async (req, res) => {
  console.log(req.body.newpassword);
  try {
    const { email, newpassword } = req.body as {
      email: string;
      newpassword: string;
    };

    if (!email) {
      return res.status(400).json(emailNotSent);
    }

    if (!newpassword) {
      return res.status(400).json(passwordNotSent);
    }

    if (!validator.validate(email)) {
      return res.status(400).json(emailNotValid);
    }

    if (!schema.validate(newpassword)) {
      return res.status(400).json(passwordNotValid);
    }

    const checkUser = (await findUnique(email)) as User;

    if (!checkUser) {
      return res.status(400).json(userDoesNotExist);
    }

    const resetPasswordToken = jwt.sign(
      { email: checkUser.email, id: checkUser.id, newpassword: newpassword },
      process.env.ACCESS_TOKEN_SECRET
    );

    const link = `${process.env.BASE_URL}/resetpassword/${checkUser.id}/${resetPasswordToken}`;

    const emailResponse = await sendEmail(email, "Password Reset", link);

    if (emailResponse) {
      return res.status(200).json({
        message: "Email sent successfully, please confirm your new password",
      });
    } else {
      return res.status(400).json(emailFailedToSend);
    }
  } catch (err: any) {
    res.json({
      error: {
        code: 400,
        message: err.message,
      },
    });
  }
};

function randomPassword() {
  //password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character

  const password = generator.generate({
    length: 10,
    numbers: 1,
    symbols: 1,
    uppercase: 1,
    lowercase: true,
    strict: true,
  });

  return password;
}

const resetPassword: RequestHandler = async (req, res) => {
  try {
    //destructure userId as id from req.params

    const { id, token } = req.params;

    if (!token) {
      return res.status(400).json(tokenNotFound);
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded) {
      return res.status(400).json(tokenIsNotValid);
    }

    if (decoded) {
      const user = (await findUniqueById(Number(id))) as User;

      if (!user) {
        return res.status(400).json(userDoesNotExist);
      }

      const { newpassword } = decoded as { newpassword: string };

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newpassword, salt);

      const updatedUser = (await updatePassword(
        user.email,
        hashedPassword
      )) as User;

      console.log(updatedUser);
      if (updatedUser) {
        const emailResponse = await sendEmail(
          user.email,
          "Password Reset",
          `Your new password is ${newpassword}`
        );

        return res
          .status(200)
          .json({ message: "Password changed successfuly" });
      } else {
        return res.status(400).json(emailFailedToSend);
      }
    } else {
      return res.status(400).json(tokenIsNotValid);
    }
  } catch (err: any) {
    return res.status(400).json({
      error: {
        code: 400,
        message: err.message,
      },
    });
  }
};

const changePasswordUrl = async (req, res) => {
  try {
    const { id, token } = req.params;

    if (!id || !token) {
      return res.status(400).json(tokenNotFound);
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as {
      id: string;
      email: string;
      password: string;
    };

    if (!decoded) {
      return res.status(400).json(tokenIsNotValid);
    }

    if (decoded) {
      const user = (await updatePassword(
        decoded.email,
        decoded.password
      )) as User;

      if (user) {
        return res
          .status(200)
          .json({ message: "Password changed successfully" });
      }
    }
  } catch (err: any) {
    return res.status(400).json({
      error: {
        code: 400,
        message: err.message,
      },
    });
  }
};

//1
const updateEmail: RequestHandler = async (req, res) => {
  //this option allows the user to change their email address associated with their account
  try {
    const { email, password } = req.body as { email: string };
    const { id } = req.params;

    const myId = Number(id);

    if (!email) {
      return res.status(400).json(emailNotSent);
    }

    if (!password) {
      return res.status(400).json(passwordNotSent);
    }

    if (!validator.validate(email)) {
      return res.status(400).json(emailNotValid);
    }

    if (!schema.validate(password)) {
      return res.status(400).json({ message: "Password is not valid" });
    }

    const checkUser = (await findUniqueById(myId)) as User;

    if (!checkUser) {
      return res.status(400).json(userDoesNotExist);
    }

    if (checkUser.email === email) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const validPassword = await bcrypt.compare(password, checkUser.password);

    if (!validPassword) {
      return res.status(400).json(invalidPassword);
    }

    //verify if the email is already in use
    const TOKEN = jwt.sign(
      { email: email, id: myId },
      process.env.ACCESS_TOKEN_SECRET
    );

    const link = `${process.env.BASE_URL}/updateemailurl/${myId}/${TOKEN}`;

    const userEmail = checkUser.email;

    const emailResponse1 = await sendEmail(
      email,
      "Update Email",
      `Click on this link to update your email ${link}`
    );

    const emailResponse2 = await sendEmail(
      userEmail,
      "Warning",
      `Your email has been changed, your new email is ${email}`
    );

    if (emailResponse1 && emailResponse2) {
      return res.status(200).json({
        message: `Email sent successfully, your new email address is ${email}, you can not use your old email ${userEmail} anymore!`,
      });
    } else {
      return res.status(400).json(emailFailedToSend);
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

const updateEmailUrl: RequestHandler<{ id: string }> = async (req, res) => {
  //this option allows the user to change their email address associated with their account

  try {
    const { id, token } = req.params;

    if (!id || !token) {
      return res.status(400).json({ message: "Token not found" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as {
      id: string;
      email: string;
    };

    if (!decoded) {
      return res.status(400).json(tokenIsNotValid);
    }

    if (decoded) {
      const user = (await updateEmailById(Number(id), decoded.email)) as User;

      if (user) {
        return res.status(200).json({
          message: `Email changed successfully, your new email is ${decoded.email}`,
        });
      }
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};
//2
const verifyUserTwoFactor: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  //this option allows the user to verify their email address associated with their account
  try {
    const { id, token } = req.params;

    const user = (await findUniqueById(id)) as User;

    if (!user) {
      return res.status(400).json(userDoesNotExist);
    }
    const { base32: secret } = user.secret;

    //tootp token verification
    const verifyToken = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token: token,
    });

    if (!verifyToken) {
      return res.status(400).json({ message: "Token is not valid" });
    }

    return res.status(200).json({ message: "Token is valid" });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

//router.post("/verifyemail/:id", verifyEmail);
const verifyEmail: RequestHandler<{ id: string }> = async (req, res) => {
  //this option allows the user to verify their email address associated with their account
  try {
    const { id, token } = req.params;

    const user = (await findUniqueById(Number(id))) as User;

    if (!user) {
      return res.status(400).json(userDoesNotExist);
    }

    if (user.emailVerified === true) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const verificationToken = jwt.sign(
      { email: user.email, id: user.id },
      process.env.ACCESS_TOKEN_SECRET
    );

    const link = `${process.env.BASE_URL}/verifyemailurl/${user.id}/${verificationToken}`;

    const emailResponse = await sendEmail(
      user.email,
      "E-mail verification",
      `Click on this link to verify your email ${link}`
    );

    if (emailResponse) {
      return res.status(200).json({ message: "Email sent successfully" });
    }

    if (!emailResponse) {
      return res.status(400).json(emailFailedToSend);
    }

    if (user) {
      const updatedUser = (await updateEmailVerifiedById(id, true)) as User;

      if (!updatedUser) {
        return res.status(400).json(userDoesNotExist);
      }

      if (updatedUser) {
        return res.status(200).json({ message: "Email verified successfully" });
      }
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

const verifyEmailUrl: RequestHandler<{ id: string }> = async (req, res) => {
  //this option allows the user to verify their email address associated with their account
  try {
    const { id, token } = req.params;

    const user = (await findUniqueById(Number(id))) as User;

    if (!user) {
      return res.status(400).json(userDoesNotExist);
    }

    if (user) {
      const updatedUser = (await updateEmailVerifiedById(id, true)) as User;

      if (!updatedUser) {
        return res.status(400).json(userDoesNotExist);
      }

      if (updatedUser) {
        return res.status(200).json({ message: "Email verified successfully" });
      }
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

//3

const createProfileData: RequestHandler = async (req, res) => {
  const {
    id,
    lastname,
    firstname,
    phonenumber,
    country,
    state,
    city,
    address,
    zipcode,
  } = req.body as any;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    //check if user has profile already
    const userProfile = user.hasProfile;

    if (userProfile == true) {
      return res.status(400).json({ message: "User already has a profile" });
    }

    console.log("userProfile", userProfile);

    const profile = await prisma.userProfile.create({
      data: {
        firstname: firstname,
        lastname: lastname,
        phoneNumber: phonenumber,
        country: country,
        state: state,
        city: city,
        address: address,
        zipCode: zipcode,
        profileOwner: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    if (!profile) {
      return res.status(400).json({ message: "Profile not created" });
    }

    //change hasProfile to true

    const updatedUser = await updateHasProfileById(id);

    if (!updatedUser) {
      return res.status(400).json({ message: "User not updated" });
    }

    return res
      .status(201)
      .json({ message: "Profile created successfully", profile });
  } catch (error) {
    res.status(500).json(error);
  }
};
const updatePersonalInfo = async (req: Request, res: Response) => {
  // this function updates the user's personal information
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(400).json(userDoesNotExist);
    }

    const profile = await prisma.userProfile.findUnique({
      where: {
        profileId: user?.id,
      },
    });

    if (!profile) {
      return res
        .status(400)
        .json({ message: "Error updating personal information" });
    }

    const updateData = await prisma.userProfile.update({
      where: {
        profileId: user?.id,
      },
      data: req.body,
    });

    if (!updateData) {
      return res
        .status(400)
        .json({ message: "Error updating personal information" });
    }

    return res.json({
      message: "Personal information updated successfully",
      user,
      profile,
    });
  } catch (err) {
    // handle error
    return res.json({ message: "Error updating personal information" });
  }
};

//4

const disableAccount = async (req: Request, res: Response) => {
  // this function disables the user's account

  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.json({ message: "User does not exist" });
    }

    // check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.json({ message: "Incorrect password" });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        profileStatus: "disabled",
      },
    });

    if (!updatedUser) {
      return res.json({ message: "Error disabling account" });
    }

    return res.json({ message: "Account disabled successfully", updatedUser });
  } catch (err) {
    return res.json({ message: "Error disabling account" });
    // handle error
  }
};

//5

const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // find the user in the database
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.json({ message: "User does not exist" });
    }

    // check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.json({ message: "Incorrect password" });
    }

    const deleteProfile = await prisma.userProfile.delete({
      where: {
        profileId: user.id,
      },
    });

    if (!deleteProfile) {
      return res.json({ message: "Error deleting account" });
    }

    return res.json({ message: "Account deleted successfully", deleteProfile });
  } catch (err) {
    return res.json({ message: "Error deleting account" });
    // handle error
  }
};

//6

const downloadUserData = async (req: Request, res: Response) => {
  // this function downloads the user's data
  const id = Number(req.params.id);

  try {
    // find the user in the database
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.json({ message: "User does not exist" });
    }

    //find me user profile
    const userProfile = await prisma.userProfile.findUnique({
      where: {
        id: 1,
      },
    });

    // convert the user's data to JSON
    const userData = JSON.stringify(user);
    // write the user's data to a file
    const userProfileData = JSON.stringify(userProfile);

    //combine two objects
    const data = { ...user, ...userProfile };

    // Create a new PDF document
    const doc = new pdfkit();

    res.setHeader("Content-disposition", "attachment; filename=user-data.pdf");
    res.setHeader("Content-type", "application/pdf");

    //combine user data and profile data into one pdf

    doc.text(`Username: ${data.username}`, 100, 100);
    doc.text(`Email: ${data.email}`, 100, 150);
    doc.text(`First name: ${data.firstname}`, 100, 200);
    doc.text(`Last name: ${data.lastname}`, 100, 250);
    doc.text(`Phone number: ${data.phoneNumber}`, 100, 300);
    doc.text(`Country: ${data.country}`, 100, 350);
    doc.text(`State: ${data.state}`, 100, 400);
    doc.text(`City: ${data.city}`, 100, 450);
    doc.text(`Address: ${data.address}`, 100, 500);
    doc.text(`Zip code: ${data.zipCode}`, 100, 550);

    // Stream the PDF to the response
    doc.pipe(res);
    doc.end();

    // return the file to the user
    return res.download("user-data.json");
  } catch (err) {
    return res.json({ message: "Error downloading user data" });
    // handle error
  }
};

const getUserWithWallet = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  console.log(id)

  try {
    // find the user in the database
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

  

    if (!user) {
      return res.json({ message: "User does not exist" });
    }

    //find me user profile

    const userWithWallet = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        wallet: {
          include: {
            accounts: true,
        },
      },
    }});

    

   
    return res.json({ userWithWallet });
  } catch (err) {
    return res.json({ message: "Error getting user data" });
  }
};

//7
/*
const updateProfilePicture = async (req: Request, res: Response) => {
  // this function updates the user's profile picture
  try {
    // get the user's profile picture from the request body
    const { profilePicture } = req.body;
    // find the user in the database
    const user
    // update the user's profile picture
    user.profilePicture = profilePicture;
    // save the updated user to the database
    await user.save();
    // return a success message
    return res.json({ message: "Profile picture updated successfully" });
  } catch (err) {
    // handle error
  }
};
*/

export {
  changePassword,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getAllProfiles,
  refresh_token,
  dashboard,
  paginationResults,
  //User and Profile Management
  updateEmail,
  verifyUserTwoFactor,
  updatePersonalInfo,
  disableAccount,
  deleteAccount,
  downloadUserData,
  createProfileData,
  verifyEmail,
  verifyEmailUrl,
  changePasswordUrl,
  updateEmailUrl,
  updateProfilePicture,
  createProfilePicture,
  removeProfilePicture,
  getUserWithWallet,
  //updateProfilePicture,
};
