import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../factory/Status_codes";

export function validateAddToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { email, token } = req.body;
  console.log('[validateAddToken] req.user =', req.user);
  console.log('[validateAddToken] req.body =', req.body);
 //email presente
  if (!email) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email is required' });
  }
  // formato email valido
  if (!emailRegex.test(email)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email must be a valid email' });
  }
  // token presente 
  if (token == null) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Tokens are required.' });
  }
  //  token deve essere un numero > 0
  if (typeof token !== 'number' || token <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Tokens must be a positive number.' });
  }
  next();
}