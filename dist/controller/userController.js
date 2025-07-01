"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const Status_codes_1 = require("../factory/Status_codes");
class UserController {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
        this.login = async (req, res, next) => {
            try {
                const { email } = req.body;
                // console.log('BODY:', req.body);
                const token = await this.authService.authenticate(email);
                return res.status(Status_codes_1.StatusCodes.OK).json({ token });
            }
            catch (err) {
                next(err);
            }
        };
        this.addToken = async (req, res, next) => {
            try {
                const adminId = req.user.id;
                const { email, token } = req.body;
                const player = await this.userService.addToken(adminId, email, token);
                return res.status(Status_codes_1.StatusCodes.OK).json(player);
            }
            catch (err) {
                next(err);
            }
        };
        this.getRanking = async (req, res, next) => {
            try {
                const ranking = await this.userService.getRanking();
                return res.status(Status_codes_1.StatusCodes.OK).json(ranking);
            }
            catch (err) {
                next(err);
            }
        };
        this.getPlayers = async (req, res, next) => {
            try {
                const players = await this.userService.getAllPlayers();
                return res.status(Status_codes_1.StatusCodes.OK).json(players);
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.UserController = UserController;
