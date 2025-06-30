
import { player, playerAttributes, playerCreationAttributes } from "../models/player";
import { IDao } from "./IDao";

export class UserDao implements IDao<player,playerCreationAttributes>{
    async get(id: string): Promise<player | null> {
        return await player.findByPk(id);
    }
    async getAll(): Promise<player[]> {
       return await player.findAll()
    }
    async getByEmail(email:string): Promise < player |null>{
    return await player.findOne({where: {email}});
    }

    async getRanking():Promise<player[]>{
        return await player.findAll({
            order:[['score','DESC']],
            attributes:['name','score']
        })
    }

    async create(data: playerCreationAttributes): Promise<player> {
        return await player.create(data);
    }

    async update(player: player, data: Partial<playerCreationAttributes>): Promise<player> { //in questo modo tutti i campi sono modificabili 
       return await player.update(data); 
    }

    async delete(player: player): Promise<void> {
        return await player.destroy();
    }

}