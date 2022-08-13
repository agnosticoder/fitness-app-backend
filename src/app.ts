import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import exerciesRouter from './routes/exercises';
import workoutsRouter from './routes/workouts';
import errorHandler from './middlewares/errorHandler';
import throwError from './utils/throwError';
import setsRouter from './routes/sets';
import { Data } from './lib/interfaces/IData';
import { ironSession } from 'iron-session/express';
import { LOGIN_SESS_OPTIONS } from './config/session';
import userRouter from './routes/user';
import hasAuth from './middlewares/hasAuth';

const PORT = process.env.PORT || 8000;

const app = express();

/* ------------------------------- Middlewares ------------------------------ */
// setting up body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: 'http://satinder.local:3000',
    optionsSuccessStatus: 200,
    credentials: true,
}));
app.use(ironSession(LOGIN_SESS_OPTIONS));

/* --------------------------------- Routes --------------------------------- */
app.get('/', async (req: Request, res: Response<Data>, next: NextFunction) => {
    try {
        // throwError({
        //     code: 400,
        //     error: 'Bad request - should be handled by errorHandler middlewareare',
        // });
        // res.status(400).json({ code: 400, error: 'Bad Request' });
        req.session.user = {
            id: '1',
        }
        await req.session.save();
        res.json({code: 200, data: 'Hello World'});
    } catch (err) {
        next(err);
    }
});

app.use(userRouter);
app.use(hasAuth, exerciesRouter);
app.use(hasAuth, workoutsRouter);
app.use(hasAuth, setsRouter);

/* ------------------------------- Middleware ------------------------------- */
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
