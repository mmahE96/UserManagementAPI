import { Router } from "express";
const router = Router();

import {
  createProfilePicture,
  updateProfilePicture,
  removeProfilePicture,
  createProfileData,
  updatePersonalInfo,
  disableAccount,
  deleteAccount,
  downloadUserData,
    getUserWithWallet,
} from "../controllers/user.controllers";

import { getAllProfiles } from "../controllers/user.controllers";

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "./testbucket",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
});

//Personal info update routes

router.post(
  "/createprofilepicture/:id",
  upload.single("profilePicture"),
  createProfilePicture
);

router.post(
  "/updateprofilepicture/:id",
  upload.single("profilePicture"),
  updateProfilePicture
);

router.post(
  "/removeprofilepicture/:id",
  upload.single("profilePicture"),
  removeProfilePicture
);

router.post("/createprofile", createProfileData);

router.post("/updatepersonalinfo/:id", updatePersonalInfo);

router.post("/disableaccount", disableAccount);

router.post("/deleteaccount", deleteAccount);

router.get("/downloaduserdata/:id", downloadUserData);

router.get("/getallprofiles", getAllProfiles);

router.get("/getuserwithwallet/:id", getUserWithWallet);

export default router;
