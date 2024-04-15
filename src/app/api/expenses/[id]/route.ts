import prisma from "@/lib/prisma";
import { CONSTANTS } from "@/shared/constants";
import { getTrainingWithComputedFields } from "@/types/Expense";
import { verifyIfUserIsTeacher } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { trainingSchema } from "@/lib/apiZodSchemas/trainingSchema";
import { handleZodValidationError } from "@/lib/zodHelpers";
import { z } from "zod";

const {
  USER_HAS_NO_PERMISSION,
  INTERNAL_SERVER_ERROR,
  EXERCISE_NOT_FOUND,
  VALIDATION_ERROR,
  TRAINING_NOT_FOUND,
} = CONSTANTS.API_RESPONSE_MENSSAGES;

export async function GET(_: unknown, { params }: { params: { id: string } }) {
  const { id } = params;
  const foundTraning = await prisma.training.findUnique({
    where: { id: id },
    include: {
      trainingExercises: {
        orderBy: { order: "asc" },
        include: {
          exercise: {
            include: { muscle: true },
          },
        },
      },
    },
  });

  if (!foundTraning) {
    return NextResponse.json({ message: TRAINING_NOT_FOUND }, { status: 404 });
  }

  const foundTraningWithComputedFields =
    getTrainingWithComputedFields(foundTraning);

  return NextResponse.json(foundTraningWithComputedFields, { status: 200 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await verifyIfUserIsTeacher(request))) {
    return NextResponse.json(
      { message: USER_HAS_NO_PERMISSION },
      { status: 401 }
    );
  }

  const traning = (await request.json()) as z.infer<typeof trainingSchema>;

  try {
    trainingSchema.parse(traning);
  } catch (error: any) {
    return NextResponse.json(handleZodValidationError(error), { status: 400 });
  }

  const lastTraining = await prisma.training.findFirst({
    where: { trainingPlanId: params?.id },
    orderBy: { order: "desc" },
  });
  const nextOrder = lastTraining?.order ? lastTraining?.order + 1 : 1;
  const letter = String.fromCharCode(nextOrder + 64);
  try {
    await prisma.training.update({
      where: { id: params?.id },
      data: {
        order: nextOrder,
        name: `Treino - ${letter}`,
        trainingExercises: {
          deleteMany: {},
          createMany: {
            data: traning?.exercises?.map((training) => ({
              exerciseId: training?.exerciseId,
              order: training?.order,
              intervalInSeconds: training?.intervalInSeconds,
            })),
          },
        },
      },
    });
    return NextResponse.json({ message: "ok" }, { status: 201 });
  } catch (error: any) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error?.code === "P2003") {
        if (error?.meta?.field_name === "trainingId") {
          return NextResponse.json(
            { message: TRAINING_NOT_FOUND },
            { status: 404 }
          );
        }
        if (error?.meta?.field_name === "exerciseId") {
          return NextResponse.json(
            { message: EXERCISE_NOT_FOUND },
            { status: 404 }
          );
        }
      }
      return NextResponse.json({ message: VALIDATION_ERROR }, { status: 400 });
    }
    return NextResponse.json(
      { message: INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
