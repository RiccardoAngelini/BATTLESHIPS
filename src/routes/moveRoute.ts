import { Router } from "express";
import { GameController } from "../controller/gameController";
import { GameDao } from "../dao/gameDao";
import { MoveDao } from "../dao/moveDao";
import { UserDao } from "../dao/userDao";
import { GameRepository } from "../repository/gameRepository";
import { MoveRepository } from "../repository/moveRepository";
import { UserRepository } from "../repository/userRepository";
import { GameService } from "../service/gameService";
import { MoveController } from "../controller/moveController";
import { MoveService } from "../service/moveService";
import { validateDoYourMove } from "../middleware/moveValidator";
import { jwtAuth } from "../middleware/jwtAuth";



const userDao=new UserDao();
const userRepository=new UserRepository(userDao);
const moveDao= new MoveDao();
const moveRepository=new MoveRepository(moveDao);

const gameDao=new GameDao();
const gameRepository= new GameRepository(gameDao);
const moveService=new MoveService(gameRepository,moveRepository,userRepository);
const moveController=new MoveController(moveService);

const moveRouter:Router=Router(); 
//questa rotta consente di fare una mossa 
moveRouter.post('/game/:id/move',jwtAuth,validateDoYourMove ,moveController.doYourMove);
//questa rotta restituisce tutte le mosse di una battaglia 
moveRouter.get('/game/:id/allmoves',jwtAuth,moveController.getAllMoves);
export default moveRouter