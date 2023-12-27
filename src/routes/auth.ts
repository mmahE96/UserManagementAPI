import { Router } from "express";
const router = Router();

import {
  forgotPassword,
  resetPassword,
  changePassword,
  dashboard,
  getAllUsers,  
  refresh_token,
  paginationResults,
  
} from "../controllers/user.controllers";

import { login, register, removeUser, generateQR,
  verifyToken } from "../controllers/auth.controllers";
import { changeRole } from "../controllers/admin.controllers";
import { userRoute, adminRoute } from "../middlewares/auth.middleware";

import { checkRole } from "../util/checkRole"

// Define the roles
enum Role {
  Base = 'Base',
  Manager = 'Manager',
  Admin = 'Admin',
  Audit = 'Audit'
}

//Authentication routes

router.post("/login", login);

router.post("/register", register);

router.post("/forgotpassword", forgotPassword);

router.get("/resetpassword/:id/:token", resetPassword);

router.post("/changepassword", checkRole("Base"), changePassword);

router.get("/removeuser/:id",checkRole("Admin"),  removeUser);

router.post("/changerole", adminRoute, changeRole);

router.get("/dashboard/:id", userRoute, dashboard);

router.get("/getallusers", getAllUsers);

router.get("/refreshtoken", refresh_token);

router.get("/pagination/:page/:limit", paginationResults);

router.post("/generateQR", generateQR);

router.post("/verifyToken", verifyToken);





export default router;
