import prisma from "../../lib/prisma";
import { faker } from "@faker-js/faker";

export async function seedTrainings() {
  const exercises = await prisma.exercise.findMany();
  const exercisesTrainigsA = [...exercises].splice(0, 7).map((exercise) => ({
    exerciseId: exercise.id,
    intervalInSeconds: 60,
    order: 1,
  }));
  const exercisesTrainigsB = [...exercises].splice(7, 14).map((exercise) => ({
    exerciseId: exercise.id,
    intervalInSeconds: 60,
    order: 2,
  }));
  const exercisesTrainigsC = [...exercises].splice(14, 21).map((exercise) => ({
    exerciseId: exercise.id,
    intervalInSeconds: 60,
    order: 3,
  }));
  const exercisesTrainigsD = [...exercises].splice(21, 31).map((exercise) => ({
    exerciseId: exercise.id,
    intervalInSeconds: 60,
    order: 4,
  }));

  const teachers = await prisma.user.findMany({ where: { isTeacher: true } });
  const students = await prisma.user.findMany({ where: { isTeacher: false } });

  for (const student of students) {
    const studentHasTraining = await prisma.trainingPlan.count({
      where: { studentId: student.id },
    });
    if (!studentHasTraining) {
      const teacher = faker.helpers.arrayElement(teachers);
      await prisma.trainingPlan.create({
        data: {
          name: faker.helpers.arrayElement([
            "Treino para hipertrofia",
            "Treino para emagrecimento",
            "Treino para força",
          ]),
          studentId: student.id,
          teacherId: teacher.id,
          teacherEmail: teacher.email,
          teacherName: teacher.name,
          trainings: {
            create: [
              {
                name: "Treino A",
                trainingExercises: { create: exercisesTrainigsA },
                order: 1,
                trainingHistory: {
                  create: [
                    {
                      startDate: new Date("2023-10-03T17:59:24"),
                      endDate: new Date("2023-10-03T20:59:24"),
                    },
                    {
                      startDate: new Date("2023-10-07T17:59:24"),
                      endDate: new Date("2023-10-07T20:59:24"),
                    },
                  ],
                },
              },
              {
                name: "Treino B",
                trainingExercises: { create: exercisesTrainigsB },
                order: 2,
                trainingHistory: {
                  create: [
                    {
                      startDate: new Date("2023-10-04T17:59:24"),
                      endDate: new Date("2023-10-04T20:59:24"),
                    },
                    {
                      startDate: new Date("2023-10-08T17:59:24"),
                      endDate: new Date("2023-10-08T20:59:24"),
                    },
                  ],
                },
              },
              {
                name: "Treino C",
                trainingExercises: { create: exercisesTrainigsC },
                order: 3,
                trainingHistory: {
                  create: [
                    {
                      startDate: new Date("2023-10-05T17:59:24"),
                      endDate: new Date("2023-10-05T20:59:24"),
                    },
                  ],
                },
              },
              {
                name: "Treino D",
                trainingExercises: { create: exercisesTrainigsD },
                order: 4,
                isInProgress: false,
                isRecommendedToDay: true,
                trainingHistory: {
                  create: [
                    {
                      startDate: new Date("2023-10-06T17:59:24"),
                      endDate: new Date("2023-10-06T18:59:24"),
                    },
                  ],
                },
              },
            ],
          },
        },
      });
    }
  }
}
