import express, { Router } from 'express';
import { UserController } from '../controller/userController';
import { UserDao } from '../dao/userDao';
import { UserRepository } from '../repository/userRepository';
import { UserService } from '../service/userService';
import { validateAddToken } from '../middleware/adminValidator';
import { jwtAuth } from '../middleware/jwtAuth';
import { AuthService } from '../service/authService';

const userDao=new UserDao();
const userRepository=new UserRepository(userDao);
const userService=new UserService(userRepository);
const authService=new AuthService(userRepository)
const userController=new UserController(userService,authService);

const userRouter: Router = Router();

userRouter.get('/players', userController.getPlayers);
userRouter.get('/ranking', userController.getRanking);
userRouter.post('/tokens',jwtAuth ,validateAddToken,userController.addToken);
userRouter.post('/auth/login',userController.login);

export default userRouter;
