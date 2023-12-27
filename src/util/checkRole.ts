import jwt from "jsonwebtoken";
import express from "express";

// Define the roles
enum Role {
  Base = "Base",
  Manager = "Manager",
  Admin = "Admin",
  Audit = "Audit",
}

// Define a middleware function to check if the user has the required role
function checkRole(role: Role) {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // Get the JWT from the request headers
    const token = req.headers["authorization"]?.split(" ")[1];

    // Verify the JWT and extract the user's role
    try {
      const decoded = jwt.verify(token, "YOUR_SECRET_KEY") as { role: Role };
      const userRole = decoded.role;

      // Check if the user has the required role
      if (userRole === role) {
        next();
      } else {
        res.status(403).send("Forbidden");
      }
    } catch (err) {
      res.status(401).send("Unauthorized");
    }
  };
}

//export function

export { checkRole };

//import {checkRole} from './checkRole.ts'
