import { GameDao } from "../dao/gameDao";
import { game, gameCreationAttributes } from "../models/game";
import { Moves } from "../models/moves";

export class GameRepository {
  
   constructor(private gameDao: GameDao) {}

  async getAllGames(id:string): Promise<game[]> {
    return await this.gameDao.getAllGame(id);
  }
  async getById(id: string): Promise<game | null> {
    return await this.gameDao.get(id);
  }
  async createGame(data: gameCreationAttributes): Promise<game>{
 return await this.gameDao.create(data);
  }

  async updateGame(game:game,data: Partial<game>,):Promise<game>{
  return await this.gameDao.update(game, data);
  }

  async deleteGame(game:game):Promise<void>{
  await this.gameDao.delete(game);
  }


}
