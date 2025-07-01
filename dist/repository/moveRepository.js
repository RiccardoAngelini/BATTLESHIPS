"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveRepository = void 0;
class MoveRepository {
    constructor(moveDao) {
        this.moveDao = moveDao;
    }
    //crea una mossa
    async createMove(data) {
        return await this.moveDao.createMove(data);
    }
    //restituisce tutte le mosse da un gameId
    async getAllMoves(id) {
        return await this.moveDao.getAllMoves(id);
    }
}
exports.MoveRepository = MoveRepository;
