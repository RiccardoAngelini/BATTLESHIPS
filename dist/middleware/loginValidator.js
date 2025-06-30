"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = validateEmail;
const Status_codes_1 = require("../factory/Status_codes");
function validateEmail(req, res, next) {
    const { email } = req.body;
    // regex per validare un'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //email presente
    if (!email) {
        return res.status(Status_codes_1.StatusCodes.BAD_REQUEST).json({ error: 'Email is required' });
    }
    // formato email valido
    if (!emailRegex.test(email)) {
        return res.status(Status_codes_1.StatusCodes.BAD_REQUEST).json({ error: 'Email must be a valid email' });
    }
    next();
}
module.exports = validateEmail;
