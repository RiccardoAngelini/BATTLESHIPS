"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
class UserRepository {
    constructor(userDao) {
        this.userDao = userDao;
    }
    async getUserRanking() {
        return await this.userDao.getRanking();
    }
    async getById(id) {
        return await this.userDao.get(id);
    }
    async getByEmail(email) {
        return await this.userDao.getByEmail(email);
    }
    async getAll() {
        return await this.userDao.getAll();
    }
    async save(player) {
        return await player.save();
    }
}
exports.UserRepository = UserRepository;
