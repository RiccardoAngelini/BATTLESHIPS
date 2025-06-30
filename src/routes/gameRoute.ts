// routes/games.ts (o dove definisci le rotte)
import express, { Router } from 'express';
import { GameDao } from '../dao/gameDao';
import { GameRepository } from '../repository/gameRepository';
import { GameService } from '../service/gameService';
import { UserRepository } from '../repository/userRepository';
import { UserDao } from '../dao/userDao';
import { MoveDao } from '../dao/moveDao';
import { MoveRepository } from '../repository/moveRepository';
import { GameController } from '../controller/gameController';
import {validateCreateGame} from '../middleware/gameValidator'
import { jwtAuth } from '../middleware/jwtAuth';

const userDao=new UserDao();
const userRepository=new UserRepository(userDao);
const moveDao= new MoveDao();
const moveRepository=new MoveRepository(moveDao);

const gameDao=new GameDao();
const gameRepository= new GameRepository(gameDao);
const gameService=new GameService(gameRepository,moveRepository,userRepository);
const gameController=new GameController(gameService);

const gameRouter: Router = Router();
//questa rotta restituisce lo stato di una battaglia
gameRouter.get('/games/:id/status',jwtAuth, gameController.getStatus);
//questa rotta permette di abbandonare una battaglia
gameRouter.post('/games/:id/abandon', jwtAuth,gameController.abandonGame);
//questa rotta permette di creare una battaglia 
gameRouter.post('/games',jwtAuth, validateCreateGame, gameController.createGame);

export default gameRouter;