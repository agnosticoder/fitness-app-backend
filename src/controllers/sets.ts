import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/getPrismaClient';
import { Data } from '../lib/interfaces/IData';

const CreatSetBody = z.object({
    exerciseId: z.string(),
    reps: z.string().optional(),
    weight: z.string().optional(),
});

export type CreateSetPayload = z.infer<typeof CreatSetBody>;

export const createSet = async (
    req: Request,
    res: Response<Data>,
    next: NextFunction
) => {
    try {
        const { exerciseId, reps, weight } = CreatSetBody.parse(req.body);
        console.log('createSet', exerciseId);

        const exercise = await prisma.exercise.update({
            where: {
                id: exerciseId,
            },
            data: {
                sets: { create: {
                    reps,
                    weight,
                } },
            },
        });

        console.log('createSet', exercise);

        res.status(200).json({ code: 200, data: exercise });
    } catch (err) {
        console.log('createSet error: ', err);
        next(err);
    } 
};

const DeleteSetBody = z.object({
    setId: z.string(),
});

export type DeleteSetPayload = z.infer<typeof DeleteSetBody>;

export const deleteSet = async (
    req: Request,
    res: Response<Data>,
    next: NextFunction
) => {
    try {
        const { setId } = DeleteSetBody.parse(req.body);
        console.log('deleteSet', setId);

        const set = await prisma.set.delete({
            where: {id: setId},
        });

        console.log('deleteSet', set);

        res.status(200).json({ code: 200, data: set });
    } catch (err) {
        console.log('deleteSet error: ', err);
        next(err);
    } 
};

const UpdateSetBody = z.object({
    setId: z.string(),
    reps: z.nullable(z.string()).optional(),
    weight: z.nullable(z.string()).optional(),
    isDone: z.boolean().optional(),
});

export const updateSet = async (
    req: Request,
    res: Response<Data>,
    next: NextFunction
) => {
    try {
        const {setId, reps, weight, isDone} = UpdateSetBody.parse(req.body);

        console.log('setId', setId);
        console.log('reps', reps);
        console.log('weight', weight);
        console.log('isDone', isDone);

        if(!reps && !weight && isDone === undefined){
            res.status(202).json({ code: 202});
        }

        const set = await prisma.set.update({
            where: {id: setId},
            data: {
                reps,
                weight,
                isDone
            },
        });

        console.log('updateSet', set);

        res.status(200).json({ code: 200, data: set });
    } catch (err) {
        console.log('updateSet error: ', err);
        next(err);
    } 
};
