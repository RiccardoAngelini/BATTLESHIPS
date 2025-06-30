import { MoveDao } from "../dao/moveDao";
import { Moves, MovesCreationAttributes } from "../models/moves";

export class MoveRepository{

    constructor(private moveDao:MoveDao){}
      async createMove(data: MovesCreationAttributes): Promise<Moves>{
      return await this.moveDao.createMove(data);
     }
     
  async getAllMoves(id:string):Promise<Moves[]>{
    return await this.moveDao.getAllMoves(id);
 }
}