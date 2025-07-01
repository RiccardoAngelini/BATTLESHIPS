"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameDao = void 0;
const game_1 = require("../models/game");
const sequelize_1 = require("sequelize");
//classe GameDao che implementa IDao e definisce le CRUD dell'oggetto game 
class GameDao {
    //ritorna un insieme di game
    getAll() {
        throw new Error("Method not implemented.");
    }
    //ritorna un game a partire dall'id
    async get(id) {
        return await game_1.game.findByPk(id);
    }
    //ritorna tutti i game in cui è coinvolto un player  
    async getAllGame(id) {
        return await game_1.game.findAll({
            where: { [sequelize_1.Op.or]: [
                    { creator_id: id },
                    { opponent_id: id }
                ] }
        });
    }
    //crea un game 
    async create(data) {
        return await game_1.game.create(data);
    }
    //aggiorna un game
    async update(game, data) {
        return await game.update(data);
    }
    //elimina un game
    async delete(game) {
        return game.destroy();
    }
}
exports.GameDao = GameDao;
