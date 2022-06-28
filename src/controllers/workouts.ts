import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/getPrismaClient';
import { Data } from '../lib/interfaces/IData';

const Set  = z.object({
    reps: z.string().optional(),
    weight: z.string().optional(),
});

export const Exercise = z.object({
    name: z.string(),
    sets: z.array(Set).optional(),
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
    } 
};

export const getAllWorkouts = async (req:Request, res:Response<Data>) => {
    try {
        const allWorkouts = await prisma.workout.findMany({
            include: { exercises: {
                include: { sets: true },
            } },
        });
        res.status(200).json({code:200, data: allWorkouts });
        // res.status(400).json({code:400, error: 'Bad request'});
    } catch (err) {
        console.error({ err });
    } 
};

export const postWorkout = async (
    req: Request,
    res: Response<Data>,
    next: NextFunction
) => {
    //* This is a great peace of code
    try {
        const { exercises, name } = Workout.parse(req.body);

        const newWorkout = await prisma.workout.create({
            data: {
                name: name,
                exercises: {
                    create: exercises.map((exercise) => ({
                        name: exercise.name,
                        sets: {
                            create: exercise.sets?.map((set) => ({
                                reps: set.reps,
                                weight: set.weight,
                            })),
                        },
                    })),
                },
            },
        });
        res.status(201).json({ code: 201, data: newWorkout });
    } catch (err) {
        console.error({ err });
        next(err);
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
    }
};




const FinishSet = z.object({
    id: z.string(),
    reps: z.string(),
    weight: z.string(),
    setOrder: z.string(),
    isDone: z.boolean(),
    exerciseId: z.string(),
});

const FinishExercise = z.object({
    id: z.string(),
    name: z.string(),
    workoutId: z.string(),
    sets: z.array(FinishSet),
});

const FinishWorkout = z.object({
    id: z.string(),
    name: z.string(),
    exercises: z.array(FinishExercise)
});

export const finishWorkout = async (req:Request, res:Response<Data>, next:NextFunction) => {
    try{
        const {id, name, exercises} = FinishWorkout.parse(req.body);

        const workout = await prisma.workout.update({
            where: { id },
            data: {
                name,
                isDone: true,
                exercises: {
                    update: exercises.map((exercise) => ({
                        where: { id: exercise.id },
                        data: {
                            name: exercise.name,
                            isDone: true,
                            sets: {
                                update: exercise.sets.map((set) => ({
                                    where: { id: set.id },
                                    data: {
                                        reps: set.reps,
                                        weight: set.weight,
                                        setOrder: set.setOrder,
                                        isDone: set.isDone,
                                    },
                                })),
                            },
                        },
                    })),
                },
            },
        });

        res.status(200).json({code:200, data: workout});
    }catch(err){
        console.log('finishWorkout error: ', err);
        next(err);
    }
}

export const createWorkoutTemplate = async (req:Request, res:Response<Data>, next:NextFunction) => {
    try{
        const {exercises, name} = Workout.parse(req.body);

        console.log('exercises, name: ', exercises, name);

        const workout = await prisma.workout.create({
            data: {
                name,
                isTemplate: true,
                exercises: {
                    create: exercises.map((exercise) => ({
                        name: exercise.name,
                    })),
                },
            },
        });

        res.status(200).json({code:200, data: workout});
    }catch(err){
        console.log('createWorkoutTemplate error: ', err);
        next(err);
    }
}

const TemplateSet = z.object({
    id: z.string(),
    reps: z.string().optional(),
    weight: z.string().optional(),
    setOrder: z.string(),
    isDone: z.boolean().optional(),
    exerciseId: z.string(),
});

const TemplateExercise = z.object({
    id: z.string(),
    name: z.string(),
    workoutId: z.string(),
    sets: z.array(TemplateSet),
});

const TemplateWorkout = z.object({
    id: z.string(),
    name: z.string(),
    exercises: z.array(TemplateExercise)
});

//Todo: Try to convert into finishWorkout route
export const saveTemplate = async (
    req: Request,
    res: Response<Data>,
    next: NextFunction
) => {
    try {
        const { id, name, exercises } = TemplateWorkout.parse(req.body);

        const workout = await prisma.workout.update({
            where: { id },
            data: {
                name,
                isDone: true,
                exercises: {
                    update: exercises.map((exercise) => ({
                        where: { id: exercise.id },
                        data: {
                            name: exercise.name,
                            sets: {
                                update: exercise.sets.map((set) => ({
                                    where: { id: set.id },
                                    data: {
                                        reps: set.reps,
                                        weight: set.weight,
                                        setOrder: set.setOrder,
                                        isDone: set.isDone,
                                    },
                                })),
                            },
                        },
                    })),
                },
            },
        });

        res.status(200).json({code:200, data: workout});
    } catch (err) {
        console.log('saveTemplate error: ', err);
        next(err);
    }
};


const CopySet = z.object({
    reps: z.string(),
    weight: z.string(),
    setOrder: z.string(),
    isDone: z.boolean(),
});

const CopyExercise = z.object({
    name: z.string(),
    sets: z.array(CopySet),
});

const CopyWorkout = z.object({
    name: z.string(),
    exercises: z.array(CopyExercise),
});

export const copyWokoutToTemplate = async (req:Request, res:Response<Data>, next:NextFunction) => {
    try{
        const {name, exercises} = CopyWorkout.parse(req.body);

        const workout = await prisma.workout.create({
            data: {
                name,
                isTemplate: true,
                isDone: true,
                exercises: {
                    create: exercises.map((exercise) => ({
                        name: exercise.name,
                        sets: {
                            create: exercise.sets.map((set) => ({
                                reps: set.reps,
                                weight: set.weight,
                                setOrder: set.setOrder,
                                isDone: set.isDone,
                            })),
                        },
                    })),
                },
            },
        });

        res.status(200).json({code:200, data: workout});
    }
    catch(err){
        console.log('copyWokoutToTemplate error: ', err);
        next(err);
    }
};

const UpdateWorkoutBody = z.object({
    id: z.string(),
    name: z.string().optional(),
    isDone: z.boolean().optional(),
    isTemplate: z.boolean().optional(),
});

export const updateWorkout = async (req:Request, res:Response<Data>, next:NextFunction) => {
    try{
        const {id, name, isDone, isTemplate} = UpdateWorkoutBody.parse(req.body);

        const workout = await prisma.workout.update({
            where: { id },
            data: {
                name,
                isDone,
                isTemplate,
            },
        });

        res.status(200).json({code:200, data: workout});
    }catch(err){
        console.log('updateWorkout error: ', err);
        next(err);
    }
}
