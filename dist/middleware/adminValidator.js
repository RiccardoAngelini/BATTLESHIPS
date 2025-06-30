"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAddToken = validateAddToken;
const Status_codes_1 = require("../factory/Status_codes");
function validateAddToken(req, res, next) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const { email, token } = req.body;
    console.log('[validateAddToken] req.user =', req.user);
    console.log('[validateAddToken] req.body =', req.body);
    //email presente
    if (!email) {
        return res.status(Status_codes_1.StatusCodes.BAD_REQUEST).json({ error: 'Email is required' });
    }
    // formato email valido
    if (!emailRegex.test(email)) {
        return res.status(Status_codes_1.StatusCodes.BAD_REQUEST).json({ error: 'Email must be a valid email' });
    }
    // token presente 
    if (token == null) {
        return res.status(Status_codes_1.StatusCodes.BAD_REQUEST).json({ error: 'Tokens are required.' });
    }
    //  token deve essere un numero > 0
    if (typeof token !== 'number' || token <= 0) {
        return res.status(Status_codes_1.StatusCodes.BAD_REQUEST).json({ error: 'Tokens must be a positive number.' });
    }
    next();
}
