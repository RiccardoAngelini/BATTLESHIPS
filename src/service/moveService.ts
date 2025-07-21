
import { errorFactory } from "../factory/errorFactory";
import { StatusCodes } from "../factory/Status_codes";
import { game, gameAttributes } from "../models/game";
import { Boat, Grid } from "../models/Grid";
import { Moves } from "../models/moves";
import { player } from "../models/player";
import { GameRepository } from "../repository/gameRepository";
import { MoveRepository } from "../repository/moveRepository";
import { UserRepository } from "../repository/userRepository";

export enum HitResult {
  HIT = "HIT",
  WATER = "WATER",
  SUNK="SUNK"
}

export class MoveService{
constructor(
   private gameRepository:GameRepository, 
   private moveRepository:MoveRepository, 
   private userRepository:UserRepository){}

   async getAllMoves(gameId: string): Promise<Moves[]> {
    return await this.moveRepository.getAllMoves(gameId);
  }


 async doYourMove(
  gameId: string,
  playerId: string,
  x: number,
  y: number
): Promise<Moves> {
  //verifica che il game esiste
  const battle = await this.gameRepository.getById(gameId);
  if (!battle) throw errorFactory.getError(StatusCodes.BAD_REQUEST, "Game not found");

  // Verifica che il player sia uno dei due partecipanti
  const isCreator = playerId === battle.creator_id;
  const isOpponent = playerId === battle.opponent_id;
  if (!isCreator && !isOpponent) throw errorFactory.getError(StatusCodes.BAD_REQUEST, "Player not part of this game");

  //verifica se c'è un già un vincitore
  if (battle.winner_id) {
  throw errorFactory.getError(StatusCodes.BAD_REQUEST, "Game already finished");;
}
//verifica di quale player è il turno
if (battle.current_turn_user !== playerId) {
 throw errorFactory.getError(StatusCodes.BAD_REQUEST, " Not your turn");;
}
  // Verifica di chi è la griglia da aggiornare
 const gridKeyToUpdate = isCreator ? 'grid_opponent' : 'grid_creator';
 //calcola il prossimo giocatore 
 const nextPlayer = isCreator ? battle.opponent_id : battle.creator_id;

 const gridOpponent = await this.getGridTarget(battle, playerId);
  
 await this.validateCoordinates(gridOpponent, x, y);
    // Applica la mossa
 const finalResult = this.applyMove(gridOpponent, x, y);

  //  Registra la mossa e riduci token
  const move= await this.recordMove(gameId, playerId, x, y, finalResult);
  await this.reducePlayerToken(playerId);


// Salva la griglia aggiornata nel gioco e il prossimo giocatore
  await this.gameRepository.updateGame(
    battle,
    {
    [gridKeyToUpdate]: gridOpponent,
    current_turn_user: nextPlayer
  });

   // Controlla vittoria
  if (this.checkIfPlayerHasWon(gridOpponent)) {
    await this.gameRepository.updateGame(battle, {
      winner_id: playerId,
      state: 'FINISHED',
      [gridKeyToUpdate]: gridOpponent,
    });
  
  const winner = await this.userRepository.getById(playerId)
  if(winner) {
    winner.score+=1;
  await this.userRepository.save(winner);
  }
}

  //carica la nuova battaglia con i nuovi dati per verificare se il prossimo turno è dell'ia
  // const updateBattle= await this.gameRepository.getById(gameId); lo tolgo perche ridondante
  
    const ai= await this.userRepository.getAi();
   // Se l'avversario è IA, lancia la sua mossa 
 if (ai && battle.current_turn_user === ai.id ) {
    await this.doAIMove(battle);
  
  }
  return move;
}



//funzione che valuta se le coordinate inserite dall'utente rientrano nella grigia avversaria
private async validateCoordinates(grid: Grid, x: number, y: number) {
  const sizeX = grid.cells.length;
  const sizeY = grid.cells[0]?.length ?? 0;

  if (x < 0 || x >= sizeX || y < 0 || y >= sizeY) {
   throw errorFactory.getError(StatusCodes.BAD_REQUEST, "Coordinate out of bounds");
  }
}


//questa funzione applica il colpo, esegue checkhit ed assegna un risultato
private applyMove(
  grid: Grid,
  x: number,
  y: number
): HitResult {
  const { result, boat } = this.checkHit(x, y, grid.placedBoats);
  let finalResult = result;
 
  if (result === HitResult.HIT && boat) {
    console.log("[applyMove] Colpita barca ID:", boat.id);
    const updateBoats= grid.placedBoats.map((b)=>{
      if(b.id===boat.id){
            const hits = (b.hits ?? 0) + 1;
        const sunk = hits === b.positions.length;
        finalResult = sunk ? HitResult.SUNK : HitResult.HIT;
        console.log(`[applyMove] Boat aggiornata - ID: ${b.id}, Hits: ${hits}, Sunk: ${sunk}`);
        return { ...b, hits, sunk }; //copia tutte le proprietà dell'oggetto b e sovrascrive le vecchie
      }
      return b;
    });

    grid.placedBoats=updateBoats;
  }

  grid.cells[x][y] =
    finalResult === HitResult.HIT || finalResult === HitResult.SUNK
      ? 'hit'
      : 'empty';

    console.log("[applyMove] Stato cella dopo:", grid.cells[x][y]);
  console.log("[applyMove] Stato griglia aggiornato:", JSON.stringify(grid, null, 2));

  return finalResult;
}

//crea la mossa
private async recordMove(
  gameId: string,
  playerId: string | null,
  x: number,
  y: number,
  result: HitResult
): Promise<Moves> {
  const move= await this.moveRepository.createMove({
    gameId,
    playerId,
    x,
    y,
    result,
  });
  return move;
}


//questa funzione fa il check della mossa effettuata e valuta se le barche avversarie sono state colpite 
 checkHit(x: number, y: number, placedBoats: Boat[]): { result: HitResult, boat?: Boat } {
  for (const boat of placedBoats) {
    if (boat.positions.some(pos => pos.row === x && pos.col === y)) {
      return { result: HitResult.HIT, boat };
    }
  }
  return { result: HitResult.WATER };
}


//restituisce la griglia dell'avversario
  async getGridTarget(battle: game, playerId: string): Promise <Grid> {
    // Caso PVE: 
    const ai= await this.userRepository.getAi();
  if (ai && battle.opponent_id === ai.id) {
    return battle.grid_creator as Grid;
  }
//caso PVP 
  const target = playerId === battle.creator_id
    ? battle.grid_opponent
    : battle.grid_creator;

  if (!target) {
    throw errorFactory.getError(StatusCodes.BAD_REQUEST, "Grid not created");;
  }
  return target as Grid
}


 checkIfPlayerHasWon(grid: Grid): boolean {
  for (const boat of grid.placedBoats) {
    if (!boat.sunk) return false;
  }
  return true;
}

//Aggiorna i token di un utente per effettare le mosse. Se il credito è minore del costo di una mossa allora viene settato a zero, ma l'utente continuerà lo stesso la partita corrente 
async reducePlayerToken(playerId:string):Promise<void>{
  const currentPlayer=await this.userRepository.getById(playerId);
   if (!currentPlayer) return;
  if (currentPlayer.tokens < 0.01) {
    currentPlayer.tokens = 0;
  } else {
    currentPlayer.tokens -= 0.01;
  }

  await this.userRepository.save(currentPlayer);
}

//mossa dell'ia
private async doAIMove(battle: game): Promise<void> {
  //prendo l'AI player
  const ai = await this.userRepository.getAi();
  if(!ai) throw new Error('AI not found');

  if (battle.state === 'FINISHED' || battle.winner_id) throw errorFactory.getError(StatusCodes.BAD_REQUEST, "Game already finished");;

  const gridKeyToUpdate = 'grid_creator'; // IA attacca il giocatore
  const gridOpponent = await this.getGridTarget(battle, battle.creator_id);

  // Trova le celle non colpite, fare il check se truccato
  const validMoves: { x: number; y: number }[] = [];
  for (let x = 0; x < gridOpponent.cells.length; x++) {
    for (let y = 0; y < gridOpponent.cells[x].length; y++) {
      if (!['hit', 'empty'].includes(gridOpponent.cells[x][y])) {
        validMoves.push({ x, y });
      }
    }
  }

  if (validMoves.length === 0) {
  return 
  }

  // Mossa casuale
  const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
  const { x, y } = randomMove;

  // Applica la mossa
 const finalResult = this.applyMove(gridOpponent, x, y);
 //salva la mossa
 await this.recordMove(battle.id, ai.id, x, y, finalResult);

  const hasWon = this.checkIfPlayerHasWon(gridOpponent);
  if (hasWon) {
    await battle.update({
      winner_id: ai.id, // IA vincente
      state: 'FINISHED',
      [gridKeyToUpdate]: gridOpponent,
    });

  //  return `AI sank your last ship! You lose.`;
  }
// per debugging
  console.log(JSON.stringify(gridOpponent, null, 2));

  await this.gameRepository.updateGame(battle, {
    [gridKeyToUpdate]: gridOpponent,
    current_turn_user: battle.creator_id, // Tocca di nuovo al player umano
  });

}

}

/*funzione doYourMOve iniziale dove si implementano tutte le possibili situazioni che si susseguono ad una mossa

 async doYourMove(
  gameId: string,
  playerId: string,
  x: number,
  y: number
): Promise<{message: string}> {
  //verifica che il game esiste
  const battle = await this.gameRepository.getById(gameId);
  if (!battle) throw new Error('Game not found');

  // Verifica che il player sia uno dei due partecipanti
  const isCreator = playerId === battle.creator_id;
  const isOpponent = playerId === battle.opponent_id;
  if (!isCreator && !isOpponent) throw new Error('Player not part of this game');

  //verifica se c'è un già un vincitore
  if (battle.winner_id) {
  throw new Error('Game already finished');
}

  // Verifica di chi è la griglia da aggiornare
 const gridKeyToUpdate = isCreator ? 'grid_opponent' : 'grid_creator';
 //calcola il prossimo giocatore 
 const nextPlayer = isCreator ? battle.opponent_id : battle.creator_id;

 const gridOpponent = this.getGridTarget(battle, playerId);
  
    // Applica la mossa
 const finalResult = this.applyMove(gridOpponent, x, y);

   // Controlla vittoria
  if (this.checkIfPlayerHasWon(gridOpponent)) {
    await this.gameRepository.updateGame(battle, {
      winner_id: playerId,
      state: 'FINISHED',
      [gridKeyToUpdate]: gridOpponent,
    });
  
  const winner = await this.userRepository.getById(playerId)
  if(winner) {
    winner.score+=1;
  await this.userRepository.save(winner);
  }
  return {
    message: 'You sank the last ship! You win!'
  };
}
 //  Registra la mossa e riduci token
  await this.recordMove(gameId, playerId, x, y, finalResult);
  await this.reducePlayerToken(playerId);

  
// Salva la griglia aggiornata nel gioco e il prossimo giocatore
  await this.gameRepository.updateGame(
    battle,
    {
    [gridKeyToUpdate]: gridOpponent,
    current_turn_user: nextPlayer
  });

    let message = 'Miss!';
  if (finalResult === HitResult.HIT) message = 'Hit!';
  else if (finalResult === HitResult.SUNK) message = 'Ship sunk!';

  //carica la nuova battaglia con i nuovi dati per verificare se il prossimo turno è dell'ia
  const updateBattle= await this.gameRepository.getById(gameId);
  if(updateBattle){
   // Se l'avversario è IA (opponent_id === null), lancia subito il suo turno
 if (updateBattle.opponent_id === null && nextPlayer === null) {
    const aiMessage = await this.doAIMove(updateBattle);
    message += ` | AI's move: ${aiMessage}`;
  }
}

  return { message };
}

*/