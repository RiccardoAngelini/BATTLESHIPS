"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gameDao_1 = require("../dao/gameDao");
const moveDao_1 = require("../dao/moveDao");
const userDao_1 = require("../dao/userDao");
const gameRepository_1 = require("../repository/gameRepository");
const moveRepository_1 = require("../repository/moveRepository");
const userRepository_1 = require("../repository/userRepository");
const moveController_1 = require("../controller/moveController");
const moveService_1 = require("../service/moveService");
const moveValidator_1 = require("../middleware/moveValidator");
const jwtAuth_1 = require("../middleware/jwtAuth");
const userDao = new userDao_1.UserDao();
const userRepository = new userRepository_1.UserRepository(userDao);
const moveDao = new moveDao_1.MoveDao();
const moveRepository = new moveRepository_1.MoveRepository(moveDao);
const gameDao = new gameDao_1.GameDao();
const gameRepository = new gameRepository_1.GameRepository(gameDao);
const moveService = new moveService_1.MoveService(gameRepository, moveRepository, userRepository);
const moveController = new moveController_1.MoveController(moveService);
const moveRouter = (0, express_1.Router)();
//questa rotta consente di fare una mossa 
moveRouter.post('/game/:id/move', jwtAuth_1.jwtAuth, moveValidator_1.validateDoYourMove, moveController.doYourMove);
//questa rotta restituisce tutte le mosse di una battaglia 
moveRouter.get('/game/:id/allmoves', jwtAuth_1.jwtAuth, moveController.getAllMoves);
exports.default = moveRouter;
