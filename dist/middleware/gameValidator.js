"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateGame = validateCreateGame;
const Status_codes_1 = require("../factory/Status_codes");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateCreateGame(req, res, next) {
    const { grid, boatSizes, boatNumber, opponent, vs } = req.body;
    //  vs deve essere PVP o PVE
    if (vs !== 'PVP' && vs !== 'PVE') {
        return res
            .status(Status_codes_1.StatusCodes.BAD_REQUEST)
            .json({ error: 'The field "vs" must be either "PVP" or "PVE".' });
    }
    // se PVP, serve opponent valido
    if (vs === 'PVP') {
        if (!opponent) {
            return res
                .status(Status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ error: 'Opponent email is required when vs is "PVP".' });
        }
        if (!emailRegex.test(opponent)) {
            return res
                .status(Status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ error: 'Opponent must be a valid email.' });
        }
    }
    else {
        //  se PVE, opponent non deve esserci
        if (opponent) {
            return res
                .status(Status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ error: 'Opponent must not be provided when vs is "PVE".' });
        }
    }
    //  numeri interi positivi
    if (typeof grid !== 'number' ||
        !Number.isInteger(grid) ||
        grid <= 0) {
        return res
            .status(Status_codes_1.StatusCodes.BAD_REQUEST)
            .json({ error: 'Grid size must be a positive integer.' });
    }
    if (typeof boatSizes !== 'number' ||
        !Number.isInteger(boatSizes) ||
        boatSizes <= 0) {
        return res
            .status(Status_codes_1.StatusCodes.BAD_REQUEST)
            .json({ error: 'Boat size must be a positive integer.' });
    }
    if (typeof boatNumber !== 'number' ||
        !Number.isInteger(boatNumber) ||
        boatNumber <= 0) {
        return res
            .status(Status_codes_1.StatusCodes.BAD_REQUEST)
            .json({ error: 'Boat number must be a positive integer.' });
    }
    next();
}
