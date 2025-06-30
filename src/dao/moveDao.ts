import { Moves, MovesCreationAttributes } from "../models/moves";
import { IDao } from "./IDao";

export class MoveDao implements IDao<Moves,MovesCreationAttributes>{
    //restituisce tutte le moves di un game
   async getAllMoves(id: string): Promise<Moves[]> {
  try {
    return await Moves.findAll({
      where: { gameId: id },
    });
  } catch (err) {
    console.error('DAO.getAllMoves SQL error:', err);
    throw err;
  }
}

    //crea una move
   async createMove(data: MovesCreationAttributes): Promise<Moves> {
   return await Moves.create(data);
}

    get(...ids: string[]): Promise<Moves | null> {
        throw new Error("Method not implemented.");
    }
    getAll(): Promise<Moves[]> {
        throw new Error("Method not implemented.");
    }
    create(data: MovesCreationAttributes): Promise<Moves> {
        throw new Error("Method not implemented.");
    }
    update?(entity: Moves, data: Partial<Moves>): Promise<Moves> {
        throw new Error("Method not implemented.");
    }
    delete(entity: Moves): Promise<void> {
        throw new Error("Method not implemented.");
    }

}