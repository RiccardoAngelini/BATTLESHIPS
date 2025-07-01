"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRepository = void 0;
//gameRepository che istanzia una oggetto della classe gameDao
class GameRepository {
    constructor(gameDao) {
        this.gameDao = gameDao;
    }
    //restituisce tutti i game da un player id 
    async getAllGames(id) {
        return await this.gameDao.getAllGame(id);
    }
    //restituisce un game a partire da un gameId 
    async getById(id) {
        return await this.gameDao.get(id);
    }
    //crea un game
    async createGame(data) {
        return await this.gameDao.create(data);
    }
    //aggiorna un game
    async updateGame(game, data) {
        return await this.gameDao.update(game, data);
    }
    //elimina un game
    async deleteGame(game) {
        await this.gameDao.delete(game);
    }
}
exports.GameRepository = GameRepository;
