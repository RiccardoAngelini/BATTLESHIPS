"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Status_codes_1 = require("../factory/Status_codes");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const jwtAuth = (req, res, next) => {
    console.log(' [jwtAuth] headers:', req.headers);
    // Ottieni header Authorization e verifica formato bearer
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(Status_codes_1.StatusCodes.UNAUTHORIZED).json({ error: 'Missing or malformed Authorization header' });
    }
    const token = authHeader.split(' ')[1];
    try {
        // Verifica firma e decodifica payload
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        console.log(' [jwtAuth] payload:', decoded);
        req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
        console.log('jwtAuth: user è', req.user);
        next();
    }
    catch (err) {
        return res.status(Status_codes_1.StatusCodes.UNAUTHORIZED).json({ error: 'Invalid token', message: err.message });
    }
};
exports.jwtAuth = jwtAuth;
