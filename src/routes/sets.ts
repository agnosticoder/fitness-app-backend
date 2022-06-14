import express from 'express';
import { createSet, deleteSet, updateSet } from '../controllers/sets';

const setsRouter = express.Router();

setsRouter.post('/set', createSet);
setsRouter.delete('/set', deleteSet);
setsRouter.put('/set', updateSet);

export default setsRouter;