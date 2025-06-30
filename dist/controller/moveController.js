"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveController = void 0;
const Status_codes_1 = require("../factory/Status_codes");
const errorFactory_1 = require("../factory/errorFactory");
class MoveController {
    constructor(moveService) {
        this.moveService = moveService;
        //funzione che definisce il body della rotta per effettuare una mossa e ritorna l'oggetto Moves sotto forma di json
        this.doYourMove = async (req, res, next) => {
            try {
                const { id: gameId } = req.params;
                const playerId = req.user.id;
                console.log('BODY:', req.params.gameId);
                console.log('ID', req.user.id);
                const { x, y } = req.body;
                // ricordati l’await!
                const result = await this.moveService.doYourMove(gameId, playerId, x, y);
                return res.status(200).json(result);
            }
            catch (err) {
                console.error(' doYourMove error:', err);
                return next(errorFactory_1.errorFactory.getError(Status_codes_1.StatusCodes.BAD_REQUEST));
            }
        };
        //funzione che definisce i parametri della rotta e ritorna tutte le mosse di una battaglia in json
        this.getAllMoves = async (req, res, next) => {
            try {
                const { id: gameId } = req.params;
                console.log('BODY:', req.params.gameId);
                console.log('ID', req.user.id);
                const moves = await this.moveService.getAllMoves(gameId);
                return res.status(200).json(moves);
            }
            catch (err) {
                return next(errorFactory_1.errorFactory.getError(Status_codes_1.StatusCodes.BAD_REQUEST));
            }
        };
    }
}
exports.MoveController = MoveController;
