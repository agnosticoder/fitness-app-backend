import { NextFunction, Request, Response } from 'express';

const hasAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user?.id) {
        res.send(401).json({ code: 401, error: 'Unauthorized' });
    } else {
        next();
    }
};

export default hasAuth;