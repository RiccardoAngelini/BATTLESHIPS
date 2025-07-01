"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDao = void 0;
const player_1 = require("../models/player");
class UserDao {
    //ritorna un player dall'id
    async get(id) {
        return await player_1.player.findByPk(id);
    }
    //ritorna tutti i player
    async getAll() {
        return await player_1.player.findAll();
    }
    //ritorna un player a partire dall'email
    async getByEmail(email) {
        return await player_1.player.findOne({ where: { email } });
    }
    //ritorna la classifica dei player in base allo score in modo decrescente
    async getRanking() {
        return await player_1.player.findAll({
            order: [['score', 'DESC']],
            attributes: ['name', 'score']
        });
    }
    //crea un player
    async create(data) {
        return await player_1.player.create(data);
    }
    //aggiorna un player
    async update(player, data) {
        return await player.update(data);
    }
    //elimina un player
    async delete(player) {
        return await player.destroy();
    }
}
exports.UserDao = UserDao;
