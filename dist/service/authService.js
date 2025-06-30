"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const errorFactory_1 = require("../factory/errorFactory");
const Status_codes_1 = require("../factory/Status_codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '1h';
class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    /*
     Autentica un utente tramite email.
      Ritorna un JWT HS256 con payload { id, email, role }.
     */
    async authenticate(email) {
        const user = await this.userRepository.getByEmail(email);
        if (!user)
            throw errorFactory_1.errorFactory.getError(Status_codes_1.StatusCodes.UNAUTHORIZED);
        const payload = { id: user.id, email: user.email, role: user.role };
        return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }
}
exports.AuthService = AuthService;
