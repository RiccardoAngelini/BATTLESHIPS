"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRepository = void 0;
class GameRepository {
    constructor(gameDao) {
        this.gameDao = gameDao;
    }
    async getAllGames(id) {
        return await this.gameDao.getAllGame(id);
    }
    async getById(id) {
        return await this.gameDao.get(id);
    }
    async createGame(data) {
        return await this.gameDao.create(data);
    }
    async updateGame(game, data) {
        return await this.gameDao.update(game, data);
    }
    async deleteGame(game) {
        await this.gameDao.delete(game);
    }
}
exports.GameRepository = GameRepository;
