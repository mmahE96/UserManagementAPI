import { Router } from "express";
const router = Router();

import {
  verifyEmail,
  verifyEmailUrl,
  changePasswordUrl,
  updateEmail,
  updateEmailUrl,
  verifyUserTwoFactor,
} from "../controllers/user.controllers";

//Email update routes

//Password reset routes

router.get("/changepasswordurl/:id/:token", changePasswordUrl);

router.post("/updateemail/:id", updateEmail);

router.get("/updateemailurl/:id/:token", updateEmailUrl);

router.get("/verifyemail/:id", verifyEmail);

router.get("/verifyemailurl/:id/:token", verifyEmailUrl);

router.get("/verifyusertwofactor/:id/:token", verifyUserTwoFactor);

export default router;
