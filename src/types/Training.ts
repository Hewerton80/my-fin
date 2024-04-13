import { ExerciseWithComputedFields } from "@/types/Exercise";
import { Training } from "@prisma/client";
import { TrainingHistoryWithComputedFields } from "./trainingHistory";
import { TrainingExerciseWithComputedFields } from "./trainingExercise";
import { removeElementsRepeated } from "@/shared/array";

export interface TrainingWithComputedFields extends Training {
  trainingHistories?: TrainingHistoryWithComputedFields[];
  trainingExercises?: TrainingExerciseWithComputedFields[];
  exercises?: ExerciseWithComputedFields[];
  title?: string;
  exercicesCount: number;
}

const getTrainingTitle = (training: any) => {
  const letter = String.fromCharCode(training.order + 64);
  const musclesNames = training?.trainingExercises?.map(
    (trainingExercise: any) => trainingExercise?.exercise?.muscle?.name
  );
  return `${letter} - ${removeElementsRepeated(musclesNames || [])?.join(
    ", "
  )}`;
};

export const getTrainingWithComputedFields = (
  training: any
): TrainingWithComputedFields => {
  const title = getTrainingTitle(training);

  const exercises = (
    training?.trainingExercises as TrainingExerciseWithComputedFields[]
  )?.map((trainingExercise) => ({
    ...(trainingExercise?.exercise || {}),
    status: trainingExercise?.status,
    intervalInSeconds: trainingExercise?.intervalInSeconds,
    trainingExerciseId: trainingExercise?.id,
  }));

  delete training?.trainingExercises;

  const trainingWithComputedFields = { ...training, title };
  if (Array.isArray(exercises)) {
    trainingWithComputedFields.exercises = exercises;
  }

  return trainingWithComputedFields;
};

export const getTrainingsWithComputedFields = (trainings: any[]) => {
  return trainings?.map((training) => {
    const trainingWithComputedFields = getTrainingWithComputedFields(training);
    trainingWithComputedFields.exercicesCount =
      trainingWithComputedFields?.exercises?.length || 0;
    delete trainingWithComputedFields?.exercises;
    return trainingWithComputedFields;
  });
};
