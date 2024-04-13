import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CONSTANTS } from "@/shared/constants";

const {
  TRAINING_NOT_FOUND,
  TRAINING_ALWREADY_NOT_PROGRESS,
  THERE_IS_EXERCISES_NOT_FINISHED,
} = CONSTANTS.API_RESPONSE_MENSSAGES;

export async function PATCH(
  _: unknown,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const foundTraning = await prisma.training.findUnique({
    where: { id },
    include: {
      trainingExercises: true,
      trainingPlan: { include: { trainings: { orderBy: { order: "asc" } } } },
    },
  });

  if (!foundTraning) {
    return NextResponse.json({ message: TRAINING_NOT_FOUND }, { status: 404 });
  }

  if (!foundTraning.isInProgress) {
    return NextResponse.json(
      { message: TRAINING_ALWREADY_NOT_PROGRESS },
      { status: 409 }
    );
  }

  const thereIsExercisesNotFinished = foundTraning?.trainingExercises?.some(
    (trainingExercise) => trainingExercise?.status !== "FINISHED"
  );

  if (thereIsExercisesNotFinished) {
    return NextResponse.json(
      { message: THERE_IS_EXERCISES_NOT_FINISHED },
      { status: 409 }
    );
  }

  await prisma.training.update({
    where: { id: foundTraning?.id },
    data: { isInProgress: false },
  });

  await prisma.trainingExercise.updateMany({
    where: { treiningId: foundTraning?.id },
    data: { status: "READY_TO_START" },
  });

  const trainings = foundTraning?.trainingPlan?.trainings;
  const currentTraningIndex = trainings?.findIndex(
    (training) => training?.id === foundTraning?.id
  );

  if (currentTraningIndex >= 0) {
    const nextTraningIndex =
      trainings?.length - 1 === currentTraningIndex
        ? 0
        : currentTraningIndex + 1;
    const nextTrainig = trainings?.[nextTraningIndex];

    await prisma.training.update({
      where: { id: nextTrainig?.id },
      data: { isRecommendedToDay: true },
    });
  }

  const trainingHistory = await prisma.trainingHistory.findFirst({
    where: { trainingId: foundTraning?.id, endDate: null },
    orderBy: { startDate: "desc" },
  });
  if (trainingHistory) {
    await prisma.trainingHistory.update({
      where: { id: trainingHistory?.id },
      data: { endDate: new Date() },
    });
  }

  return NextResponse.json(null, { status: 201 });
}
