
import { game, gameAttributes, gameCreationAttributes } from "../models/game";
import { IDao } from "./IDao";
import { Moves, MovesCreationAttributes } from "../models/moves";
import { Op } from "sequelize";
//classe GameDao che implementa IDao e definisce le CRUD dell'oggetto game 
export class GameDao implements IDao<game,gameCreationAttributes>{
    //ritorna un insieme di game
    getAll(): Promise<game[]> {
        throw new Error("Method not implemented.");
    }
//ritorna un game a partire dall'id
     async get(id: string): Promise<game | null> {
          return await game.findByPk(id);
      }
      
    //ritorna tutti i game in cui è coinvolto un player  
    async getAllGame (id: string): Promise<game[]> {
       return await game.findAll({
    where: { [Op.or]: [
        { creator_id: id },
        { opponent_id: id }
      ] }
      });
    }
//crea un game 
    async create(data: gameCreationAttributes): Promise<game> {
        return await game.create(data);
    }
    //aggiorna un game
    async update(game: game, data: Partial<game>): Promise<game> {
        return await game.update(data);
    }
    //elimina un game
    async delete(game: game): Promise<void> {
        return game.destroy()
    }

}