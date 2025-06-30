import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from '../factory/Status_codes';

export function validateEmail( req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;

  // regex per validare un'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

 //email presente
  if (!email) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email is required' });
  }
  // formato email valido
  if (!emailRegex.test(email)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email must be a valid email' });
  }
  next(); 
}
module.exports = validateEmail;
