import { CreditCard, Expense, SubCategory } from "@prisma/client";
import { removeElementsRepeated } from "@/shared/array";
import { isAfter } from "date-fns/isAfter";
import { isBefore } from "date-fns/isBefore";

export enum ExpenseStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  "ON DAY" = "ON DAY",
}

export interface ExpernseWithComputedFields extends Expense {
  status?: ExpenseStatus;
  subCategories?: SubCategory[];
  creditCard?: CreditCard;
}

export const getExpenseWitchComputedFields = ({
  ...expense
}: Expense): ExpernseWithComputedFields => {
  const now = new Date();
  let status;
  if (expense?.isPaid) {
    status = ExpenseStatus.PAID;
  } else if (expense?.dueDate && isAfter(now, expense?.dueDate)) {
    console.log({
      now,
      dueDate: expense?.dueDate,
      isAfter: isAfter(now, expense?.dueDate),
    });
    status = ExpenseStatus.OVERDUE;
  } else if (
    expense?.registrationDate &&
    isAfter(now, expense?.registrationDate)
  ) {
    status = ExpenseStatus.PENDING;
  } else if (
    expense?.registrationDate &&
    isBefore(now, expense?.registrationDate)
  ) {
    status = ExpenseStatus["ON DAY"];
  }

  return { ...expense, status };
};

export const getExpensesWitchComputedFields = (expenses: Expense[]) => {
  return expenses?.map((expense) => getExpenseWitchComputedFields(expense));
};

// export interface TrainingWithComputedFields extends Training {
//   trainingHistories?: TrainingHistoryWithComputedFields[];
//   trainingExercises?: TrainingExerciseWithComputedFields[];
//   exercises?: ExerciseWithComputedFields[];
//   title?: string;
//   exercicesCount: number;
// }

// const getTrainingTitle = (training: any) => {
//   const letter = String.fromCharCode(training.order + 64);
//   const musclesNames = training?.trainingExercises?.map(
//     (trainingExercise: any) => trainingExercise?.exercise?.muscle?.name
//   );
//   return `${letter} - ${removeElementsRepeated(musclesNames || [])?.join(
//     ", "
//   )}`;
// };

// export const getTrainingWithComputedFields = (
//   training: any
// ): TrainingWithComputedFields => {
//   const title = getTrainingTitle(training);

//   const exercises = (
//     training?.trainingExercises as TrainingExerciseWithComputedFields[]
//   )?.map((trainingExercise) => ({
//     ...(trainingExercise?.exercise || {}),
//     status: trainingExercise?.status,
//     intervalInSeconds: trainingExercise?.intervalInSeconds,
//     trainingExerciseId: trainingExercise?.id,
//   }));

//   delete training?.trainingExercises;

//   const trainingWithComputedFields = { ...training, title };
//   if (Array.isArray(exercises)) {
//     trainingWithComputedFields.exercises = exercises;
//   }

//   return trainingWithComputedFields;
// };

// export const getTrainingsWithComputedFields = (trainings: any[]) => {
//   return trainings?.map((training) => {
//     const trainingWithComputedFields = getTrainingWithComputedFields(training);
//     trainingWithComputedFields.exercicesCount =
//       trainingWithComputedFields?.exercises?.length || 0;
//     delete trainingWithComputedFields?.exercises;
//     return trainingWithComputedFields;
//   });
// };
