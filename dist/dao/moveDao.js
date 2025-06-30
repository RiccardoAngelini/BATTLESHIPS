"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveDao = void 0;
const moves_1 = require("../models/moves");
class MoveDao {
    async getAllMoves(id) {
        try {
            console.log('🔍 DAO.getAllMoves: cerca tutte le mosse di gameId=', id);
            return await moves_1.Moves.findAll({
                where: { gameId: id },
                // questo ti stamperà in console la query esatta generata
                logging: console.log
            });
        }
        catch (err) {
            console.error('DAO.getAllMoves SQL error:', err);
            throw err;
        }
    }
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
