import express from 'express';
import { createExercises, getAllExercises, postExercise } from '../controllers/exercises';

const exerciesRouter = express.Router();

exerciesRouter.get('/exercises', getAllExercises);
exerciesRouter.post('/exercise', postExercise);
exerciesRouter.post('/exercises', createExercises);

export default exerciesRouter;