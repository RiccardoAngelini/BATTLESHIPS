
import  { Request, Response, NextFunction,  } from 'express';
import {  UserService } from "../service/userService";
import { StatusCodes } from '../factory/Status_codes';
import { AuthService } from '../service/authService';

export class UserController{
  
  constructor(private userService:UserService, private authService:AuthService){}
  
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
     // console.log('BODY:', req.body);
      const token = await this.authService.authenticate(email);
      return res.status(StatusCodes.OK).json({ token });
    } catch (err) {
       next(err);
    }
  };

   addToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminId  = req.user.id as string;
      const { email, token } = req.body;

    const player= await this.userService.addToken(adminId, email, token);
    return res.status(StatusCodes.OK).json(player);
    } catch (err) {
      next(err);
    }
  };

  getRanking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ranking = await this.userService.getRanking();
      return res.status(StatusCodes.OK).json(ranking);
    } catch (err) {
      next(err);
    }
  };

  getPlayers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const players = await this.userService.getAllPlayers();
      return res.status(StatusCodes.OK).json(players);
    } catch (err) {
      next(err);
    }
  };


}













