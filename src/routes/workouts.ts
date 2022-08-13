import express from 'express';
import { copyWokoutToTemplate, createWorkoutTemplate, deleteWorkout, finishWorkout, getAllWorkouts, getWorkout, postWorkout, saveTemplate, updateWorkout } from '../controllers/workouts';

const workoutsRouter = express.Router();

workoutsRouter.get('/workout/:id', getWorkout);
workoutsRouter.get('/workouts', getAllWorkouts);
workoutsRouter.post('/workout', postWorkout);
workoutsRouter.post('/workout/template', createWorkoutTemplate);
workoutsRouter.post('/workout/copytotemplate', copyWokoutToTemplate);
workoutsRouter.put('/finishworkout', finishWorkout);
workoutsRouter.put('/saveTemplate', saveTemplate);
workoutsRouter.put('/workout/update', updateWorkout);
workoutsRouter.delete('/workout', deleteWorkout);

export default workoutsRouter;