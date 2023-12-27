// authenticator.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './tokenService';

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Attach the decoded user information to the request object
    next();
  } catch (error) {
    res.sendStatus(403);
  }
};

export { authenticateToken };
