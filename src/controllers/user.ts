import { NextFunction, Request, Response } from 'express';
import { Data } from '../lib/interfaces/IData';
import { z } from 'zod';
import { prisma } from '../lib/getPrismaClient';
import throwError from '../utils/throwError';
import bcryptjs from 'bcryptjs';


const SignupBody = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string().min(8),
});

export type SignupPayload = z.infer<typeof SignupBody>;

export const signup = async (req: Request, res: Response<Data>, next: NextFunction) => {
    try{
        const { name, email, password } = SignupBody.parse(req.body);
        const isEmail = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (isEmail) return throwError({code: 400, error: 'Email already exists'});

        const hash = await bcryptjs.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hash },
        });
        req.session.user = {
            id: user.id,
        };
        await req.session.save();
        res.status(200).json({code: 200, data: 'User created'});
    }catch(err){
        console.log('signup error', err);
        next(err);
    }
};

const LoginBody = z.object({
    email: z.string(),
    password: z.string(),
});

export type LoginPayload = z.infer<typeof LoginBody>;

export const login = async (req: Request, res: Response<Data>, next: NextFunction) => {
    try{
        const { email, password } = LoginBody.parse(req.body);
        //*check if user exist by email
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        //* if not user by email not found
        if (!user) return throwError({ code: 400, error: 'Email or password incorrect' });

        //* get hash from database
        const hash = user.password;
        const isMatch = await bcryptjs.compare(password, hash);

        if (!isMatch) return throwError({ code: 400, error: 'Email or password incorrect' });

        //* setup the session
        //* todo: don't pass user email and password in session
        req.session.user = {
            id: user.id,
        };
        await req.session.save();
        res.status(200).json({code: 200, data: 'User logged in'});
    }catch(err){
        console.log('login error', err);
        next(err);
    }
};

export const logout = async (req: Request, res: Response<Data>, next: NextFunction) => {
    try{
        await req.session.destroy();
        res.status(200).json({code: 200, data: 'User logged out'});
    }catch(err){
        console.log('logout error', err);
        next(err);
    }
}

export const getUser = async (
    req: Request,
    res: Response<Data>,
    next: NextFunction
) => {
    try {
        if (req.session.user?.id) {
            const user = await prisma.user.findUnique({
                where: {id: req.session.user.id},
                select: {
                    name: true,
                    email: true,
                }
            });
            res.status(200).json({ code: 200, data: user });
        } else {
            res.status(200).json({ code: 200, data: null });
        }
    } catch (err) {
        console.log('getUser error', err);
        next(err);
    }
};