import { PrismaClient, Workout } from "@prisma/client";
import {faker} from '@faker-js/faker';
const prisma = new PrismaClient();

const exercises = [{name: 'Biceps'}, {name: 'Triceps'}, {name: 'Chest'}, {name: 'Back'}, {name: 'Shoulders'}, {name: 'Legs'}];

const workouts = Array.from({length: 30}, () => {
    return {
        name: faker.name.findName(),
        isDone: true,
        isTemplate: false,
        exercises: Array.from(exercises, (exercise) => {
            return {
                ...exercise,
                isDone: true,
                sets: Array.from({length: 3}, (_, i) => {
                    return {
                        reps: faker.random.numeric(2),
                        weight: faker.random.numeric(2),
                        isDone: true,
                        setOrder: String(i + 1)
                    }
                }),
            }
        }),
    }
});

const main = async () => {
    //cleanup
    await prisma.workout.deleteMany({});

    //seeding
    workouts.forEach(async (workout) => {
        const result = await prisma.workout.create({
            data: {
                name: workout.name,
                isDone: workout.isDone,
                isTemplate: workout.isTemplate,
                exercises: {
                    create: workout.exercises.map((exercise) => ({
                        name: exercise.name,
                        isDone: exercise.isDone,
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
    });
};

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });