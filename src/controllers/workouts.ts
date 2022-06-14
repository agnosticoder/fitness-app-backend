import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import throwError from '../utils/throwError';
import { Data } from './exercises';

const prisma = new PrismaClient();

export const Exercise = z.object({
    name: z.string(),
});

export const Workout = z.object({
    name: z.string(),
    exercises: z.array(Exercise),
});

export const getWorkout = async (req: Request, res: Response<Data>) => {
    try {
        const { id } = req.params;
        if (id) {
            const workout = await prisma.workout.findUnique({
                where: { id },
                include: {
                    exercises: {
                        include: {
                            sets: true,
                        },
                    },
                },
            });

            res.status(200).json({ code: 200, data: workout });
        }
    } catch (err) {
        console.error({ err });
    } finally {
        prisma.$disconnect();
    }
};

export const getAllWorkouts = async (req:Request, res:Response<Data>) => {
    try {
        const allWorkouts = await prisma.workout.findMany({
            include: { exercises: true },
        });
        res.status(200).json({code:200, data: allWorkouts });
        // res.status(400).json({code:400, error: 'Bad request'});
    } catch (err) {
        console.error({ err });
    } finally {
        prisma.$disconnect();
    }
};

export const postWorkout = async (req:Request, res:Response<Data>, next: NextFunction) => {
    //* This is a great peace of code
    const workout = Workout.parse(req.body);
    try {
        if (workout) {
            const newWorkout = await prisma.workout.create({
                data: {
                    name: workout.name,
                    exercises: {
                        create: workout.exercises.map((exercise) => ({
                            name: exercise.name,
                        })),
                    },
                },
            });
            res.status(201).json({code:201, data: newWorkout});
        }
    } catch (err) {
        console.error({ err });
        next(err);
    } finally {
        prisma.$disconnect();
    }
};

const WorkoutId = z.object({
    workoutId: z.string(),
});

export const deleteWorkout = async (req:Request, res:Response<Data>, next:NextFunction) => {
    try{
        const { workoutId } = WorkoutId.parse(req.body);
        console.log('workoutId: ', workoutId);
        const workout = await prisma.workout.delete({
            where: {id: workoutId},
        });
        res.status(200).json({code:200, data: workout});
    }catch(err){
        console.log('deleteWorkout error: ', err);
        next(err);
    }finally{
        prisma.$disconnect();
    }
};