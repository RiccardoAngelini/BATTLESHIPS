import { Request, Response, NextFunction } from 'express';
import { GameRepository } from '../repository/gameRepository';
import { MoveRepository } from '../repository/moveRepository';
import { UserRepository } from '../repository/userRepository';
import { MoveService } from '../service/moveService';
import { StatusCodes } from '../factory/Status_codes';
import { errorFactory } from '../factory/errorFactory';


export class MoveController {
    constructor(private moveService:MoveService){}
    //funzione che definisce il body della rotta per effettuare una mossa e ritorna l'oggetto Moves sotto forma di json
 public doYourMove = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
       const { id:gameId } = req.params;
      const playerId = req.user.id;
     // console.log('BODY:', req.params.gameId);
      // console.log('ID',req.user.id );
      const { x, y } = req.body;
      const result = await this.moveService.doYourMove(gameId, playerId, x, y);
      return res.status(StatusCodes.CREATED).json(result);
    }  catch (err) {
      next(err);
    }
  };
//funzione che definisce i parametri della rotta e ritorna tutte le mosse di una battaglia in json
public getAllMoves = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id:gameId } = req.params;
      const moves = await this.moveService.getAllMoves(gameId);
      return res.status(StatusCodes.OK).json(moves);
    }  catch (err) {
      next(err);
    }
  };
}

