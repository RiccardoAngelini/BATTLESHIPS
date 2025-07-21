
import { BattleshipGrid, Grid } from "../models/Grid";
import { player } from "../models/player";
import { game } from "../models/game";
import { GameRepository } from "../repository/gameRepository";
import { MoveRepository } from "../repository/moveRepository";
import { UserRepository } from "../repository/userRepository";
import { errorFactory } from "../factory/errorFactory";
import { StatusCodes } from "../factory/Status_codes";
import { HttpError } from "../factory/httpError";

export class GameService{

constructor(
   private gameRepository:GameRepository, 
   private moveRepository:MoveRepository, 
   private userRepository:UserRepository){}

//funzione che consente al player corrente di creare un nuovo gioco specificandone: l'avversario, grandezza della griglia e delle barche, numero delle barche. Infine riduce i token per completare l'operazione 
 async createGameWithGrid(
  creatorId:string,
  gridSize: number,
  boatSizes: number,
  boatNumber: number,
  opponentEmail?:string,  
  opponent_type?: 'PVP' | 'PVE'
):Promise<game> {
  try{
     // Recupero e controllo creator
    const creator = await this.userRepository.getById(creatorId);
    if (!creator) throw errorFactory.getError(StatusCodes.BAD_REQUEST, "Creator not found");;

    // Controllo token
    if(creator.tokens>0.20){
 
 //NUOVO, recuper l'istanza di ai, se poi viene settato PVP lo cambia
  const ai = await this.userRepository.getAi();
  if (!ai) throw errorFactory.getError(StatusCodes.BAD_REQUEST, "AI not found");
  let opponentId = ai.id;
  let message = 'Your opponent is AI';
  if (opponent_type === 'PVP') {
    const opponent = await this.userRepository.getByEmail(opponentEmail!);
    if (!opponent) throw errorFactory.getError(StatusCodes.BAD_REQUEST,`Opponent with email ${opponentEmail} not found`);
    opponentId = opponent.id;
    message = `Your opponent is ${opponent.name}`;
  }

    //creazione griglia
  const gridInstance = new BattleshipGrid(gridSize, boatSizes, boatNumber);

  const battle=await this.gameRepository.createGame({
    type:  opponent_type!,
    state:"ONGOING",
    current_turn_user: creatorId,
    creator_id:creatorId,
     opponent_id: opponentId,
    grid_creator:gridInstance.getGrid(),
    grid_opponent:gridInstance.getGrid(),
    winner_id: null, 
  });

  creator.tokens-=0.20; 
  await this.userRepository.save(creator);
  // salva opponent, anche se IA 
  const opponentToUpdate = await this.userRepository.getById(opponentId!);
      if (opponentToUpdate) await this.userRepository.save(opponentToUpdate);
  
   return battle;
}else throw errorFactory.getError(StatusCodes.UNAUTHORIZED);

  } catch (err) {
     if (err instanceof HttpError) throw err;
    console.error('[createGameWithGrid] Unexpected error:', err);
    throw errorFactory.getError(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}



//funzione che restituice: stato del gioco, quale utente che deve attaccare o il vincitore 
 async statusGame(gameId: string, playerId: string): Promise<game>
  {
  
     const battle = await this.gameRepository.getById(gameId);
     if(!battle){
      throw errorFactory.getError(StatusCodes.BAD_REQUEST, "Game not found");
     }
       // Verifica che il player sia uno dei due partecipanti
     const isCreator = playerId === battle.creator_id;
     const isOpponent = playerId === battle.opponent_id;
     if (!isCreator && !isOpponent) throw errorFactory.getError(StatusCodes.BAD_REQUEST, "Player not part of this game");

   return battle;
 }

 //funzione che permette al player corrente di abbandonare una partita e assegnare 0.75 score all'avversario
  async abandonedGame(gameId:string, playerId:string, abandoned:string):Promise<game>{

 const battle = await this.gameRepository.getById(gameId);
     if(!battle){
       throw errorFactory.getError(StatusCodes.BAD_REQUEST, "Game not found");
     }
       // Verifica che il player sia uno dei due partecipanti
     const isCreator = playerId === battle.creator_id;
     const isOpponent = playerId === battle.opponent_id;
     if (!isCreator && !isOpponent) throw errorFactory.getError(StatusCodes.BAD_REQUEST, "Player not part of this game");
     if(battle.state==='ONGOING' && abandoned==="abandoned"){

    const winnerId = playerId === battle.creator_id ? battle.opponent_id : battle.creator_id;
 
    //console.log('Before update:', battle.winner_id);
    const updateBattle = await this.gameRepository.updateGame(
    battle,
    {
    winner_id: winnerId,
    state: 'ABANDONED',
    }
  );
  

if (winnerId) {
  const winner = await this.userRepository.getById(winnerId);
  if (winner) {
     
        const rawScore = typeof winner.score === 'string' ? parseFloat(winner.score) : winner.score;
       const newScore = rawScore + 0.75;
    
    await this.userRepository.update(winner,
      {
        score:newScore
      }
    );
 
  }else {
        console.warn(`[abandonedGame] Winner not found in DB (id: ${winnerId})`);
      }
}
return updateBattle;

     }else throw errorFactory.getError(StatusCodes.BAD_REQUEST , "Game already finished or invalid abandon flag");
 }
  
}