import express from 'express';
import { deleteWorkout, getAllWorkouts, getWorkout, postWorkout } from '../controllers/workouts';

const workoutsRouter = express.Router();

workoutsRouter.get('/workout/:id', getWorkout);
workoutsRouter.get('/workouts', getAllWorkouts);
workoutsRouter.post('/workout', postWorkout);
workoutsRouter.delete('/workout', deleteWorkout);

export default workoutsRouter;