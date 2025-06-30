"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/games.ts (o dove definisci le rotte)
const express_1 = require("express");
const gameDao_1 = require("../dao/gameDao");
const gameRepository_1 = require("../repository/gameRepository");
const gameService_1 = require("../service/gameService");
const userRepository_1 = require("../repository/userRepository");
const userDao_1 = require("../dao/userDao");
const moveDao_1 = require("../dao/moveDao");
const moveRepository_1 = require("../repository/moveRepository");
const gameController_1 = require("../controller/gameController");
const gameValidator_1 = require("../middleware/gameValidator");
const jwtAuth_1 = require("../middleware/jwtAuth");
const userDao = new userDao_1.UserDao();
const userRepository = new userRepository_1.UserRepository(userDao);
const moveDao = new moveDao_1.MoveDao();
const moveRepository = new moveRepository_1.MoveRepository(moveDao);
const gameDao = new gameDao_1.GameDao();
const gameRepository = new gameRepository_1.GameRepository(gameDao);
const gameService = new gameService_1.GameService(gameRepository, moveRepository, userRepository);
const gameController = new gameController_1.GameController(gameService);
const gameRouter = (0, express_1.Router)();
//questa rotta restituisce lo stato di una battaglia
gameRouter.get('/games/:id/status', jwtAuth_1.jwtAuth, gameController.getStatus);
//questa rotta permette di abbandonare una battaglia
gameRouter.post('/games/:id/abandon', jwtAuth_1.jwtAuth, gameController.abandonGame);
//questa rotta permette di creare una battaglia 
gameRouter.post('/games', jwtAuth_1.jwtAuth, gameValidator_1.validateCreateGame, gameController.createGame);
exports.default = gameRouter;
