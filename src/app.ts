import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const app= express();

/* ------------------------------- Middlewares ------------------------------ */
// setting up body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({messsage: 'Everything is good so far'});
});

app.get('/workouts', async (req, res) => {
    try {
        const allWorkouts = await prisma.workout.findMany({
            include: { exercises: true },
        });
        res.json(allWorkouts);
    } catch (err) {
        console.error({ err });
    }finally{
      prisma.$disconnect();
    }
});

app.post('/workout', async (req, res) => {
    try {
        const { workoutName } = req.body;
        if (workoutName) {
            const workout = await prisma.workout.create({data: {name: workoutName}});
            console.log({workout});
            return res.json({ workout });
        }
        res.json({});
    } catch (err) {
        console.error({ err });
    } finally {
        prisma.$disconnect();
    }
});


app.get('/workout/:id', async (req, res) => {
    try {
      const {id} = req.params;
      if(id){
        const workout = await prisma.workout.findUnique({where:{id},include:{exercises: true}});
        res.json(workout);
      }
    } catch (err) {
        console.error({ err });
    }finally{
      prisma.$disconnect();
    }
});

app.get('/exercises', async (req, res) => {
    try {
        const allExercises = await prisma.exercise.findMany();
        res.json(allExercises);
    } catch (err) {
        console.error({ err });
    } finally {
        prisma.$disconnect();
    }
});

app.post('/exercise', async (req, res) => {
    try {
        const {name, workoutId} = req.body;
        if (name && workoutId) {
            const exercise = await prisma.exercise.create({
                data: {name},
            });

            const workout = await prisma.workout.update({
                where: { id: workoutId },
                data: { exercises: { connect: { id: exercise.id } } },
            });

            return res.json({workout});
        }
        return res.json({ message: 'Excercise name not found' });
    } catch (err) {
        console.error({ err });
    } finally {
        prisma.$disconnect();
    }
});


app.listen(8000, () => console.log('yoo go to http://localhost:3000'));