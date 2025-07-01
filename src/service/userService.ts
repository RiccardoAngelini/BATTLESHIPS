
import { errorFactory } from "../factory/errorFactory";
import { StatusCodes } from "../factory/Status_codes";
import { player, playerAttributes } from "../models/player";
import { UserRepository } from "../repository/userRepository";

 export class UserService{
   
   constructor(private userRepository: UserRepository){}
 
  //Restituisce la lista degli utenti decrescente sulla base del punteggio
  async getRanking(): Promise<{ name: string; score: number }[]> {
    const ranking = await this.userRepository.getUserRanking();
    return ranking.map(p => ({  name: p.name ?? '' , score: p.score ?? 0 }));
  }
//funzione che consente all'utente con ruolo admin di assegnare token (credito) all'utente inserendo l'email
   async addToken(adminID: string, email: string, token: number): Promise<player> {
    const admin = await this.userRepository.getById(adminID);
    const player = await this.userRepository.getByEmail(email);

    if (!admin || admin.role !== 'ADMIN') {
     throw errorFactory.getError(StatusCodes.UNAUTHORIZED);
    }

    if (!player) {
      throw new Error('Player not found');
    }

    player.tokens += token;
    await this.userRepository.save(player);
    return player;
  }

// Restituisce tutti gli utenti nel DB
 async getAllPlayers(): Promise<player[]> {
    return await this.userRepository.getAll();
  }

  async getUserByEmail(email:string):Promise<player | null>{
    return await this.userRepository.getByEmail(email);
  }

 }