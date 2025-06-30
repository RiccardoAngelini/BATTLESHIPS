"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const Status_codes_1 = require("../factory/Status_codes");
class GameController {
    constructor(gameService) {
        this.gameService = gameService;
        //funzione che definisce il body della rotta per creare un gioco e restituisce l'oggetto game come json
        this.createGame = async (req, res, next) => {
            try {
                const { grid, boatSizes, boatNumber, opponent, vs } = req.body;
                const creatorId = req.user.id;
                const battle = await this.gameService.createGameWithGrid(creatorId, grid, boatSizes, boatNumber, opponent, vs);
                return res
                    .status(Status_codes_1.StatusCodes.CREATED)
                    .json({ battle });
            }
            catch (err) {
                next(err);
            }
        };
        //funzione che definisce il parametro della rotta gameId e restituisce i campi dell'oggetto game (creator, opponent, type, winnerId, status...)
        this.getStatus = async (req, res, next) => {
            try {
                const { id: gameId } = req.params;
                const player = req.user.id;
                console.log('ID', req.user.id);
                const battle = await this.gameService.statusGame(gameId, player);
                return res
                    .status(Status_codes_1.StatusCodes.OK)
                    .json({ battle });
            }
            catch (err) {
                next(err);
            }
        };
        //funzione che definisce il body della rotta che permette al player di abbandonare una partita in corso
        this.abandonGame = async (req, res, next) => {
            try {
                const { id: gameId } = req.params;
                const playerId = req.user.id;
                const { abandoned } = req.body;
                console.log('BODY:', req.body);
                console.log('ID', req.user.id);
                if (abandoned !== 'abandoned') {
                    return res
                        .status(400)
                        .json({ error: 'You must insert "abandoned" to left the game.' });
                }
                await this.gameService.abandonedGame(gameId, playerId, abandoned);
                return res
                    .status(Status_codes_1.StatusCodes.NO_CONTENT)
                    .send();
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.GameController = GameController;
