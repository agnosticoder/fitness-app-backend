import express from 'express';
import { getUser, login, logout, signup } from '../controllers/user';

const userRouter = express.Router();

userRouter.post('/user/signup', signup);
userRouter.post('/user/login', login);
userRouter.post('/user/logout', logout);
userRouter.get('/user/get', getUser);

export default userRouter;