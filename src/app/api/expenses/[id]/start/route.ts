import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CONSTANTS } from "@/shared/constants";
const {
  TRAINING_NOT_FOUND,
  TRAINING_ALWREADY_PROGRESS,
  ALWREADY_HAS_TRAINING_IN_PROGRESS,
} = CONSTANTS.API_RESPONSE_MENSSAGES;

export async function PATCH(
  _: unknown,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const foundTraning = await prisma.training.findUnique({
    where: { id },
    include: { trainingPlan: { include: { trainings: true } } },
  });

  if (!foundTraning) {
    return NextResponse.json({ message: TRAINING_NOT_FOUND }, { status: 404 });
  }

  if (foundTraning?.isInProgress) {
    return NextResponse.json(
      { message: TRAINING_ALWREADY_PROGRESS },
      { status: 409 }
    );
  }

  const trainings = foundTraning?.trainingPlan?.trainings;

  const alwreadyHasSomeTrainingInProgress = trainings?.some(
    (training) => training?.isInProgress
  );

  if (alwreadyHasSomeTrainingInProgress) {
    return NextResponse.json(
      { message: ALWREADY_HAS_TRAINING_IN_PROGRESS },
      { status: 409 }
    );
  }

  const progressTrainingsToUpdate = trainings?.map((training) => ({
    id: training?.id,
    isInProgress: training?.id === foundTraning?.id,
  }));

  for (const training of progressTrainingsToUpdate) {
    await prisma.training.update({
      where: { id: training?.id },
      data: { isInProgress: training?.isInProgress, isRecommendedToDay: false },
    });
  }

  await prisma.trainingHistory.create({
    data: { trainingId: foundTraning?.id },
  });

  return NextResponse.json({}, { status: 201 });
}
