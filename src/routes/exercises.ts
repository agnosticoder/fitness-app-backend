import express from 'express';
import { createExercises, deleteExercise, getAllExercises, getLatestExercise, getLatestExercises, postExercise } from '../controllers/exercises';

const exerciesRouter = express.Router();

exerciesRouter.get('/exercises', getAllExercises);
exerciesRouter.get('/exercise/:name', getLatestExercise);
exerciesRouter.get('/exercises/latest', getLatestExercises);
exerciesRouter.post('/exercise', postExercise);
exerciesRouter.post('/exercises', createExercises);
exerciesRouter.delete('/exercise', deleteExercise);

export default exerciesRouter;