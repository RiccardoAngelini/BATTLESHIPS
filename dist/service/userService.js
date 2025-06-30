"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const errorFactory_1 = require("../factory/errorFactory");
const Status_codes_1 = require("../factory/Status_codes");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    //Restituisce la lista degli utenti decrescente sulla base del punteggio
    async getRanking() {
        const ranking = await this.userRepository.getUserRanking();
        return ranking.map(p => ({ name: p.name ?? '', score: p.score ?? 0 }));
    }
    async addToken(adminID, email, token) {
        const admin = await this.userRepository.getById(adminID);
        const player = await this.userRepository.getByEmail(email);
        if (!admin || admin.role !== 'ADMIN') {
            throw errorFactory_1.errorFactory.getError(Status_codes_1.StatusCodes.UNAUTHORIZED);
        }
        if (!player) {
            throw new Error('Player not found');
        }
        player.tokens += token;
        await this.userRepository.save(player);
        return player;
    }
    // Restituisce tutti gli utenti nel DB
    async getAllPlayers() {
        return await this.userRepository.getAll();
    }
    async getUserByEmail(email) {
        return await this.userRepository.getByEmail(email);
    }
}
exports.UserService = UserService;
