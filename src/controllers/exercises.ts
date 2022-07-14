import { NextFunction, Request, Response } from 'express';
import { Exercise } from './workouts';
import { z } from 'zod';
import { Data } from '../lib/interfaces/IData';
import { prisma } from '../lib/getPrismaClient';

export const getAllExercises = async (req: Request, res: Response<Data>) => {
    try {
        const allExercises = await prisma.exercise.findMany();
        res.status(200).json({code:200, data: allExercises});
    } catch (err) {
        console.error({ err });
    }
};

export const getLatestExercise = async (
    req: Request,
    res: Response<Data>,
    next: NextFunction
) => {
    try {
        const { name } = req.params;
        if (name) {
            //get latest exercise whose sets isDone is true
            const exercise = await prisma.exercise.findMany({
                where: {
                    name,
                    isDone: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: 1,
                include: {
                    sets: true,
                }
            });

            return res.status(200).json({ code: 200, data: exercise });
        }

        res.status(400).json({code:400, error: 'Bad request'});
    } catch (err) {
        console.log('getLatestExercise error: ', err);
        next(err);
    }
};

export const getLatestExercises = async (
    req: Request,
    res: Response<Data>,
    next: NextFunction
) => {
    try {
        const names = (req.query.names as string).split(',');

        if (names.length > 0) {
            // get the latest exercise for each name
            const latestExercises = await Promise.all(
                names.map(async (name) => {
                    const exercise = await prisma.exercise.findMany({
                        where: {
                            name,
                            isDone: true,
                        },
                        orderBy: {
                            createdAt: 'desc',
                        },
                        take: 1,
                        include: {
                            sets: true,
                        },
                    });
                    //send back the latest exercise or name object if no exercise found
                    return exercise[0] ?? {name};
                })
            );

            return res.status(200).json({ code: 200, data: latestExercises });
        }

        res.status(400).json({code:400, error: 'Bad request'});
    } catch (err) {
        console.log('getLatestExercises error: ', err);
        next(err);
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
                        sets: {
                            create: exercise.sets?.map(set => ({
                                reps: set.reps,
                                weight: set.weight,
                            })),
                        }
                    })),
                }
            }
        });

        res.status(200).json({code:200, data: workout});
    }catch(err){
        console.log('createExercies error: ', err);
        next(err);
    }
};

const DeleteExerciseBody = z.object({
    exerciseId: z.string(),
});

export const deleteExercise = async (
    req: Request,
    res: Response<Data>,
    next: NextFunction
) => {
    try {
        const { exerciseId } = DeleteExerciseBody.parse(req.body);

        const exercise = await prisma.exercise.delete({
            where: { id: exerciseId },
        });

        res.status(200).json({code:200, data: exercise});
    } catch (err) {
        console.log('deleteExercise error: ', err);
        next(err);
    }
};
