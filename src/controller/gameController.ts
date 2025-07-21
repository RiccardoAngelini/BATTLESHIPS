import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from '../factory/Status_codes';
import { GameService } from '../service/gameService';

export class GameController{
  constructor(private gameService:GameService){}

//funzione che definisce il body della rotta per creare un gioco e restituisce l'oggetto game come json
   createGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { grid, boatSizes, boatNumber, opponent, vs } = req.body;
      const creatorId = req.user.id;

      const battle = await this.gameService.createGameWithGrid(
        creatorId,
        grid,
        boatSizes,
        boatNumber,
        opponent,
        vs
      );

      return res
        .status(StatusCodes.CREATED)
        .json({ battle });

    } catch (err) {
      next(err);
    }
  };
//funzione che definisce il parametro della rotta gameId e restituisce i campi dell'oggetto game (creator, opponent, type, winnerId, status...)
  getStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: gameId } = req.params;
      const player = req.user.id;
   // console.log('ID',req.user.id );
      const battle = await this.gameService.statusGame(gameId, player);
      return res
        .status(StatusCodes.OK)
        .json({  battle });

    } catch (err) {
      next(err);
    }
  }

  //funzione che definisce il body della rotta che permette al player di abbandonare una partita in corso
  abandonGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id:gameId } = req.params;
      const playerId = req.user.id;
      const {abandoned}=req.body
         if (abandoned !== "abandoned") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'You must insert "abandoned" to left the game.' });
    }

     const battle = await this.gameService.abandonedGame(gameId, playerId,abandoned); 
      return res
        .status(StatusCodes.OK)
        .json({  battle });

    } catch (err) {
      next(err);
    }
  };
}


