"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDao = void 0;
const player_1 = require("../models/player");
class UserDao {
    async get(id) {
        return await player_1.player.findByPk(id);
    }
    async getAll() {
        return await player_1.player.findAll();
    }
    async getByEmail(email) {
        return await player_1.player.findOne({ where: { email } });
    }
    async getRanking() {
        return await player_1.player.findAll({
            order: [['score', 'DESC']],
            attributes: ['name', 'score']
        });
    }
    async create(data) {
        return await player_1.player.create(data);
    }
    async update(player, data) {
        return await player.update(data);
    }
    async delete(player) {
        return await player.destroy();
    }
}
exports.UserDao = UserDao;
