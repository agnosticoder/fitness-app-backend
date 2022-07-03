import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import exerciesRouter from './routes/exercises';
import workoutsRouter from './routes/workouts';
import errorHandler from './middlewares/errorHandler';
import throwError from './utils/throwError';
import setsRouter from './routes/sets';
import { Data } from './lib/interfaces/IData';

const PORT = process.env.PORT || 8000;

const app = express();

/* ------------------------------- Middlewares ------------------------------ */
// setting up body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

/* --------------------------------- Routes --------------------------------- */
app.get('/', async (req:Request, res:Response<Data>, next:NextFunction) => {
    try {
        throwError({code: 400, error: 'Bad request - should be handled by errorHandler middlewareare'});
        // res.status(400).json({ code: 400, error: 'Bad Request' });
        // res.json({ messsage: 'Everything is good so far' });
    } catch (err) {
        next(err);
    }
});

app.use(exerciesRouter);
app.use(workoutsRouter);
app.use(setsRouter);

/* ------------------------------- Middleware ------------------------------- */
app.use(errorHandler);

app.listen(PORT, () => console.log('yoo go to http://localhost:8000'));