"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveDao = void 0;
const moves_1 = require("../models/moves");
class MoveDao {
    //restituisce tutte le moves di un game
    async getAllMoves(id) {
        try {
            return await moves_1.Moves.findAll({
                where: { gameId: id },
            });
        }
        catch (err) {
            console.error('DAO.getAllMoves SQL error:', err);
            throw err;
        }
    }
    //crea una move
    async createMove(data) {
        return await moves_1.Moves.create(data);
    }
    get(...ids) {
        throw new Error("Method not implemented.");
    }
    getAll() {
        throw new Error("Method not implemented.");
    }
    create(data) {
        throw new Error("Method not implemented.");
    }
    update(entity, data) {
        throw new Error("Method not implemented.");
    }
    delete(entity) {
        throw new Error("Method not implemented.");
    }
}
exports.MoveDao = MoveDao;
