import { GameDao } from "../dao/gameDao";
import { game, gameCreationAttributes } from "../models/game";
import { Moves } from "../models/moves";
//gameRepository che istanzia una oggetto della classe gameDao
export class GameRepository {
  
   constructor(private gameDao: GameDao) {}
//restituisce tutti i game da un player id 
  async getAllGames(id:string): Promise<game[]> {
    return await this.gameDao.getAllGame(id);
  }
  //restituisce un game a partire da un gameId 
  async getById(id: string): Promise<game | null> {
    return await this.gameDao.get(id);
  }
  //crea un game
  async createGame(data: gameCreationAttributes): Promise<game>{
 return await this.gameDao.create(data);
  }
 //aggiorna un game
  async updateGame(game:game,data: Partial<game>,):Promise<game>{
  return await this.gameDao.update(game, data);
  }
 //elimina un game
  async deleteGame(game:game):Promise<void>{
  await this.gameDao.delete(game);
  }


}
