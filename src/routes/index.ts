import { Router } from "express";

import auth from "./auth.ts";
import emailUpdate from "./emailUpdate.ts";
import personalInfo from "./personalInfo.ts";

import notFoundError from "../middlewares/not-found.handler";
import genericErrorHandler from "../middlewares/generic-error.handler";

const router = Router();

router.use("/auth", auth);

router.use("/emailupdate", emailUpdate);

router.use("/personalinfo", personalInfo);

//Custom error handler
router.use(genericErrorHandler);

//router.post("/updateprofilepicture", updateProfilePicture);
//Page not found handlers
router.get("*", notFoundError);
router.post("*", notFoundError);

export default router;
