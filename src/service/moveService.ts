
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
  if (!battle) throw new Error('Game not found');

  // Verifica che il player sia uno dei due partecipanti
  const isCreator = playerId === battle.creator_id;
  const isOpponent = playerId === battle.opponent_id;
  if (!isCreator && !isOpponent) throw new Error('Player not part of this game');

  //verifica se c'è un già un vincitore
  if (battle.winner_id) {
  throw new Error('Game already finished');
}
//verifica di quale player è il turno
if (battle.current_turn_user !== playerId) {
  throw new Error('Not your turn');
}
  // Verifica di chi è la griglia da aggiornare
 const gridKeyToUpdate = isCreator ? 'grid_opponent' : 'grid_creator';
 //calcola il prossimo giocatore 
 const nextPlayer = isCreator ? battle.opponent_id : battle.creator_id;

 const gridOpponent = this.getGridTarget(battle, playerId);
  
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
  const updateBattle= await this.gameRepository.getById(gameId);
  if(updateBattle){
   // Se l'avversario è IA (opponent_id === null), lancia subito la sua mossa
 if (updateBattle.opponent_id === null && nextPlayer === null) {
    await this.doAIMove(updateBattle);
  }
}

/*// dopo recordMove e reducePlayerToken... TROPPI UPDATE
// calcola qui se ho vinto:
const hasWon = this.checkIfPlayerHasWon(gridOpponent);

// raccogli i dati da aggiornare
const updateData: Partial<gameAttributes> = {
  [gridKeyToUpdate]: gridOpponent,
  current_turn_user: nextPlayer,
};

if (hasWon) {
  updateData.winner_id = playerId;
  updateData.state = 'FINISHED';
}

// un’unica chiamata
await this.gameRepository.updateGame(battle, updateData);

// poi, se serve, lancia l’IA
if (battle.opponent_id === null && nextPlayer === null) {
  await this.doAIMove({ ...battle, ...updateData } as game);
}

*/
  return move;
}


//funzione che valuta se le coordinate inserite dall'utente rientrano nella grigia avversaria
private async validateCoordinates(grid: Grid, x: number, y: number) {
  const sizeX = grid.cells.length;
  const sizeY = grid.cells[0]?.length ?? 0;

  if (x < 0 || x >= sizeX || y < 0 || y >= sizeY) {
    throw new Error(`Coordinate out of bounds`);
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
    boat.hits = (boat.hits ?? 0) + 1;
    if (boat.hits === boat.positions.length) {
      boat.sunk = true;
      finalResult = HitResult.SUNK;
    }
  }

  grid.cells[x][y] =
    finalResult === HitResult.HIT || finalResult === HitResult.SUNK
      ? 'hit'
      : 'empty';

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
 getGridTarget(battle: game, playerId: string|null): Grid {
    // Caso PVE: opponent_id === null e sono l'IA (playerId === null)
  if (battle.opponent_id === null && playerId === null) {
    return battle.grid_creator as Grid;
  }
//caso PVP 
  const target = playerId === battle.creator_id
    ? battle.grid_opponent
    : battle.grid_creator;

  if (!target) {
    throw new Error('Griglia non inizializzata');
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
  const gridKeyToUpdate = 'grid_creator'; // IA attacca il giocatore
 const gridOpponent = this.getGridTarget(battle, null);

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
  //  return "AI has no moves left!";
  }

  // Mossa casuale
  const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
  const { x, y } = randomMove;

  // Applica la mossa
 const finalResult = this.applyMove(gridOpponent, x, y);
 //salva la mossa
 await this.recordMove(battle.id, null, x, y, finalResult);


  const hasWon = this.checkIfPlayerHasWon(gridOpponent);
  if (hasWon) {
    await battle.update({
      winner_id: null, // IA vincente
      state: 'FINISHED',
      [gridKeyToUpdate]: gridOpponent,
    });

  //  return `AI sank your last ship! You lose.`;
  }

  await this.gameRepository.updateGame(battle, {
    [gridKeyToUpdate]: gridOpponent,
    current_turn_user: battle.creator_id, // Tocca di nuovo al player umano
  });

 // return finalResult === HitResult.WATER ? "AI:Miss!" : finalResult === HitResult.HIT ? "AI:Hit!" : "AI:Ship sunk!";
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