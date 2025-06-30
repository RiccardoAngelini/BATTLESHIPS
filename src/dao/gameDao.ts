
import { game, gameAttributes, gameCreationAttributes } from "../models/game";
import { IDao } from "./IDao";
import { Moves, MovesCreationAttributes } from "../models/moves";
import { Op } from "sequelize";
//classe GameDao che implementa IDao e definisce le CRUD dell'oggetto game 
export class GameDao implements IDao<game,gameCreationAttributes>{
    
    getAll(): Promise<game[]> {
        throw new Error("Method not implemented.");
    }

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

    async create(data: gameCreationAttributes): Promise<game> {
        return await game.create(data);
    }
    async update(game: game, data: Partial<game>): Promise<game> {
        return await game.update(data);
    }
    async delete(game: game): Promise<void> {
        return game.destroy()
    }

}