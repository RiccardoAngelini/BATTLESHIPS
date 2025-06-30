import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from '../factory/Status_codes';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const jwtAuth = ( req: Request, res: Response, next: NextFunction) => {
  console.log(' [jwtAuth] headers:', req.headers);
  console.log('jwtAuth: user è', req.user);
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Missing or malformed Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
     console.log('✅ [jwtAuth] payload:', decoded);
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (err: any) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid token', message: err.message });
  }
};