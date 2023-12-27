// tokenService.ts
import jwt from 'jsonwebtoken';

const generateToken = (payload: object): string => {
  const token = jwt.sign(payload, 'your_secret_key', { expiresIn: '1h' });
  return token;
};

const verifyToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export { generateToken, verifyToken };
