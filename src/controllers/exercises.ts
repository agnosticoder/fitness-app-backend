import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Exercise } from './workouts';
import { z } from 'zod';

const prisma = new PrismaClient();

export const getAllExercises = async (req: Request, res: Response<Data>) => {
    try {
        const allExercises = await prisma.exercise.findMany();
        res.status(200).json({code:200, data: allExercises});
    } catch (err) {
        console.error({ err });
    } finally {
        prisma.$disconnect();
    }
};

export const postExercise = async (req: Request, res: Response<Data>) => {
    try {
        const { name, workoutId } = req.body;
        // if (name && workoutId) {
        //     // const exercise = await prisma.exercise.create({
        //     //     data: { name },
        //     // });

        //     const workout = await prisma.workout.update({
        //         where: { id: workoutId },
        //         data: { exercises: { connect: { id: exercise.id } } },
        //     });

        //     return res.json({ workout });
        // }
        return res.status(400).json({code:400, error: 'Exercise name not found'});
    } catch (err) {
        console.error({ err });
    } finally {
        prisma.$disconnect();
    }
};

const Exercises = z.array(Exercise);
const CreateExercisesBody = z.object({
    workoutId: z.string(),
    exercises: Exercises,
});

export const createExercises = async (req: Request, res: Response<Data>, next:NextFunction) => {
    try{
        const body = CreateExercisesBody.parse(req.body);
        const { workoutId, exercises } = body;
        const workout = await prisma.workout.update({
            where: {id: workoutId},
            data: {
                exercises: {
                    create: exercises.map(exercise => ({
                        name: exercise.name,
                    })),
                }
            }
        });

        res.status(200).json({code:200, data: workout});
    }catch(err){
        console.log('createExercies error: ', err);
        next(err);
    }finally{
        prisma.$disconnect();
    }
};


export type Data =
    | { data: any, code: 200} // GET request with data - OK
    | { data: any, code: 201} //in case of POST - Created
    | { code: 202 } // in case of PUT - Accepted
    | { code: 204 } // useful to upadate cache or put request(update an move on) - No Content
    | { error: string, code: 400 } // malformed request - Bad Request
    | { error: string, code: 401 } // client must authenticate - Unauthorized
    | { error: string, code: 403 } // server know the client but content is forbidden (unauthorized) - Forbidden
    | { error: string, code: 404 } // resource not found - Not Found
    | { error: string, code: 405 } // does recogonize method but target resource does not support it - Method Not Allowed
    | { error: string, code: 409 } //in case of put request - Conflict
    | { error:string, code: 500 } // server error - Internal Server Error
    | { error: string, code: 501 } //in case of delete request - Not Implemented
    | { error: string, code: 503 }; //server down for maintenance, user friendly page should be shown - Service Unavailable