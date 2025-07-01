"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const Grid_1 = require("../models/Grid");
const errorFactory_1 = require("../factory/errorFactory");
const Status_codes_1 = require("../factory/Status_codes");
class GameService {
    constructor(gameRepository, moveRepository, userRepository) {
        this.gameRepository = gameRepository;
        this.moveRepository = moveRepository;
        this.userRepository = userRepository;
    }
    //funzione che consente al player corrente di creare un nuovo gioco specificandone: l'avversario, grandezza della griglia e delle barche, numero delle barche. Infine riduce i token per completare l'operazione 
    async createGameWithGrid(creatorId, gridSize, boatSizes, boatNumber, opponentEmail, opponent_type) {
        try {
            // Recupero e controllo creator
            const creator = await this.userRepository.getById(creatorId);
            if (!creator)
                throw new Error('Creator not found');
            // Controllo token
            if (creator.tokens > 0.20) {
                // Se è PVP, cerco l’avversario in DB altrimenti è un PVE
                let opponentId = null;
                let message = 'Your opponent is AI';
                if (opponent_type === 'PVP') {
                    const opponent = await this.userRepository.getByEmail(opponentEmail);
                    if (!opponent)
                        throw new Error(`Opponent with email ${opponentEmail} not found`);
                    opponentId = opponent.id;
                    message = `Your opponent is ${opponent.name}`;
                }
                //creazione griglia
                const gridInstance = new Grid_1.BattleshipGrid(gridSize, boatSizes, boatNumber);
                const battle = await this.gameRepository.createGame({
                    type: opponent_type,
                    state: "ONGOING",
                    current_turn_user: creatorId,
                    creator_id: creatorId,
                    opponent_id: opponentId,
                    grid_creator: gridInstance.getGrid(),
                    grid_opponent: gridInstance.getGrid(),
                    winner_id: null,
                });
                creator.tokens -= 0.20;
                await this.userRepository.save(creator);
                if (opponent_type === 'PVP') {
                    const opponent = await this.userRepository.getByEmail(opponentEmail);
                    if (opponent)
                        await this.userRepository.save(opponent);
                }
                return battle;
            }
            else
                throw errorFactory_1.errorFactory.getError(Status_codes_1.StatusCodes.UNAUTHORIZED);
        }
        catch (err) {
            throw errorFactory_1.errorFactory.getError(Status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    //funzione che restituice: stato del gioco, quale utente che deve attaccare o il vincitore 
    async statusGame(gameId, playerId) {
        const battle = await this.gameRepository.getById(gameId);
        if (!battle) {
            throw new Error('Game not found');
        }
        // Verifica che il player sia uno dei due partecipanti
        const isCreator = playerId === battle.creator_id;
        const isOpponent = playerId === battle.opponent_id;
        if (!isCreator && !isOpponent)
            throw new Error('Player not part of this game');
        return battle;
    }
    //funzione che permette al player corrente di abbandonare una partita e assegnare 0.75 score all'avversario
    async abandonedGame(gameId, playerId, abandoned) {
        const battle = await this.gameRepository.getById(gameId);
        if (!battle) {
            throw new Error('Game not found');
        }
        // Verifica che il player sia uno dei due partecipanti
        const isCreator = playerId === battle.creator_id;
        const isOpponent = playerId === battle.opponent_id;
        if (!isCreator && !isOpponent)
            throw new Error('Player not part of this game');
        if (battle.state === 'ONGOING' && abandoned === "abandoned") {
            const winnerId = playerId === battle.creator_id ? battle.opponent_id : battle.creator_id;
            console.log('Before update:', battle.winner_id);
            const updateBattle = await this.gameRepository.updateGame(battle, {
                winner_id: winnerId,
                state: 'ABANDONED',
            });
            console.log('Updating winner_id to', winnerId);
            if (winnerId) {
                const winner = await this.userRepository.getById(winnerId);
                if (winner) {
                    winner.score += 0.75;
                    await this.userRepository.save(winner);
                }
            }
            return updateBattle;
        }
        else
            throw new Error('Game is already finished');
    }
}
exports.GameService = GameService;
