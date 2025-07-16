import { UserDao } from "../dao/userDao";
import { player, playerAttributes } from "../models/player";

export class UserRepository {
 

   constructor(private userDao: UserDao){}
  


  async getUserRanking(): Promise<player[]> {
    return await this.userDao.getRanking();
  }

  
  async getById(id: string): Promise<player | null> {
    return await this.userDao.get(id);
  }

  async getByEmail(email: string): Promise<player | null> {
    return await this.userDao.getByEmail(email);
  }

  

  async getAll(): Promise<player[]> {
    return await this.userDao.getAll();
  }

  
  async save(player: player): Promise<player> {
    return await this.userDao.save(player);
  }

    async update(player: player, data: Partial<playerAttributes>): Promise<player | null> {
        return await this.userDao.update(player, data);
    }
}
