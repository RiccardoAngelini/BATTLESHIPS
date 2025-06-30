// middleware/validateDoYourMove.ts
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from '../factory/Status_codes';

export function validateDoYourMove(
  req: Request,
  res: Response,
  next: NextFunction
) {

  // gameId nel path
  const { id:gameId } = req.params;
  if (!gameId || typeof gameId !== 'string' ) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'GameId is required' });
  } 
  // x e y nel body
  const { x, y } = req.body;

  if (!x) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Field "x" is required.' });
  } else if (typeof x !== 'number' || !Number.isInteger(x) || x < 0) {
   return res.status(StatusCodes.BAD_REQUEST).json({  error: 'Field "x" must be a non-negative integer.'});
  }

  if (!y) {
   return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Field "y" is required.' }); 
  } else if (typeof y !== 'number' || !Number.isInteger(y) || y < 0) {
     return res.status(StatusCodes.BAD_REQUEST).json({  error: 'Field "y" must be a non-negative integer.'});
  }

  next();
}
