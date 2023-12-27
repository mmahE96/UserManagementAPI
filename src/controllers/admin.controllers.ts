import { RequestHandler } from "express";
import { updateRole, findUnique } from "../services/user.service";

import validator from "email-validator";
import {
  passwordAndEmailNotSent,
  emailNotValid,
  roleNotValid,
  userDoesNotExist,
} from "../validation/index";
require("dotenv").config();

import { User } from "../types/user.type";

const changeRole: RequestHandler = async (req, res) => {
  try {
    const { role, email } = req.body as { role: string; email: string };

    if (!role || !email) {
      return res.status(400).json(passwordAndEmailNotSent);
    }

    if (!validator.validate(email)) {
      return res.status(400).json(emailNotValid);
    }

    if (role !== "admin" && role !== "user") {
      return res.status(400).json(roleNotValid);
    }

    const checkUser = (await findUnique(email)) as User;
    console.log("checkUser", checkUser);

    if (!checkUser) {
      return res.status(400).json(userDoesNotExist);
    }

    const user = (await updateRole(email, role)) as User;

    if (user) {
      res.send({ message: "Role changed successfully" });
    }
  } catch (error: any) {
    return res.status(400).send(error);
  }
};

export { changeRole };
