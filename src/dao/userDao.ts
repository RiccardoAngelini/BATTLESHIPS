
import { player, playerAttributes, playerCreationAttributes } from "../models/player";
import { IDao } from "./IDao";

export class UserDao implements IDao<player,playerCreationAttributes>{
    //variabile di sola lettura dell'email dell'ai 
    private readonly AI_EMAIL = 'ai@example.com';
   //ritorna un player dall'id
    async get(id: string): Promise<player | null> {
        return await player.findByPk(id);
    } 
    //ritorna tutti i player
    async getAll(): Promise<player[]> {
       return await player.findAll()
    }
    //ritorna un player a partire dall'email
    async getByEmail(email:string): Promise < player |null>{
    return await player.findOne({where: {email}});
    }
    //ritorna il player AI
    async getAi():Promise<player |null>{
        return await player.findOne({where: {email:this.AI_EMAIL}});
   }
    
    //ritorna la classifica dei player in base allo score in modo decrescente
    async getRanking():Promise<player[]>{
        return await player.findAll({
            order:[['score','DESC']],
            attributes:['name','score']
        })
    }
//crea un player
    async create(data: playerCreationAttributes): Promise<player> {
        return await player.create(data);
    }
//aggiorna un player
    async update(player: player, data: Partial<playerCreationAttributes>): Promise<player> { //in questo modo tutti i campi sono modificabili 
       return await player.update(data); 
    }
//elimina un player
    async delete(player: player): Promise<void> {
        return await player.destroy();
    }
     async save(player: player): Promise<player> {
    return await player.save();
  }

}