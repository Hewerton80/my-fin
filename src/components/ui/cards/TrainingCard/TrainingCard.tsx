"use client";
import { TrainingWithComputedFields } from "@/types/Training";
import { Button } from "../../buttons/Button";
import { Badge } from "../../dataDisplay/Badge";
import { twMerge } from "tailwind-merge";
import { useAlertModal } from "@/hooks/utils/useAlertModal";
import { useCallback, useMemo, forwardRef } from "react";
import { useMutateTraning } from "@/hooks/api/useTraining";
import { handleErrorMessage } from "@/shared/handleErrorMessage";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaDumbbell } from "react-icons/fa6";

interface TrainingCardProps {
  training?: TrainingWithComputedFields;
  hideStartTrainingButton?: boolean;
  hideGoToTrainingButton?: boolean;
  customActionButton?: React.ReactNode;
}

export const TrainingCard = forwardRef(
  (
    {
      training,
      hideStartTrainingButton,
      hideGoToTrainingButton,
      customActionButton,
    }: TrainingCardProps,
    ref?: any
  ) => {
    const router = useRouter();
    const { showAlert, closeAlert } = useAlertModal();

    const { startTraining } = useMutateTraning();

    const traningPath = useMemo(
      () => `/student/training/${training?.id}`,
      [training]
    );

    const handleStartTraining = useCallback(() => {
      const onSuccess = () => {
        closeAlert();
        router.push(traningPath);
      };

      const onError = (error: any) => {
        closeAlert();
        showAlert({
          title: "Erro ao iniciar treino",
          description: handleErrorMessage(error),
          variant: "danger",
        });
      };

      showAlert({
        title: "Tem certeza que deseja iniciar treino?",
        showCancelButton: true,
        confirmButtonText: "Sim, iniciar treino",
        cancelButtonText: "Depois",
        isAsync: true,
        onClickConfirmButton: () => {
          startTraining(training?.id || "", { onSuccess, onError });
        },
      });
    }, [training, showAlert, startTraining, closeAlert, router, traningPath]);

    return (
      <div
        ref={ref}
        className={twMerge(
          "flex flex-col xl:flex-row items-start xl:items-center gap-2 sm:gap-4 p-2 sm:p-4 w-full",
          "border-b-border dark:border-dark-border border-b rounded-[1.25rem]"
        )}
      >
        <div className="flex gap-4">
          <div
            className={twMerge(
              "flex justify-center items-center",
              "w-12 h-12 md:w-16 md:h-16 aspect-square",
              "bg-primary/20 rounded-[0.625rem]"
            )}
          >
            <strong className="text-primary text-lg">
              {training?.title?.split(" - ")?.[0]}
            </strong>
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-xs md:text-lg text-left font-medium text-heading dark:text-light">
              {training?.title?.split(" - ")?.[1]}
            </h4>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <Badge variant="primary">
                {Number(training?.exercicesCount) > 0 ? (
                  <>
                    <FaDumbbell className="mr-1" />{" "}
                    {`${training?.exercicesCount} Exercícios`}
                  </>
                ) : (
                  "Não há exercícios"
                )}
              </Badge>
              {training?.isRecommendedToDay && (
                <Badge variant="warning">Recomendado</Badge>
              )}
              {training?.isInProgress && (
                <Badge variant="success">Em andamento</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="ml-auto">
          {customActionButton ? (
            customActionButton
          ) : (
            <>
              {!hideStartTrainingButton && (
                <Button onClick={handleStartTraining}>Iniciar treino</Button>
              )}
              {!hideGoToTrainingButton && training?.isInProgress && (
                <Button asChild>
                  <Link href={traningPath}>Ir para treino</Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
);
