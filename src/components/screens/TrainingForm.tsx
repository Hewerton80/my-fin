"use client";
import { useGetStudent } from "@/hooks/api/useUser";
import { Card } from "@/components/ui/cards/Card";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FeedBackError } from "@/components/ui/feedback/FeedBackError";
import { FeedBackLoading } from "@/components/ui/feedback/FeedBackLoading";
import { isUndefined } from "@/shared/isType";
import { Input } from "@/components/ui/forms/Input";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetExercises } from "@/hooks/api/useExercise";
import { Select } from "@/components/ui/forms/Select";
import { Button } from "@/components/ui/buttons/Button";
import { Modal } from "@/components/ui/overlay/Modal";
import { ExerciseCard } from "@/components/ui/cards/ExerciseCard";
import { ExerciseWithComputedFields } from "@/types/Exercise";
import {
  ITrainingForm,
  TrainingFormSchemaType,
  trainingSchema,
  useGetTraining,
  useMutateTraning,
} from "@/hooks/api/useTraining";
import {
  FaPen,
  FaTrash,
  FaLongArrowAltUp,
  FaLongArrowAltDown,
  FaPlus,
} from "react-icons/fa";
import { IconButton } from "@/components/ui/buttons/IconButton";
import { Dropdown } from "@/components/ui/overlay/Dropdown/Dropdown";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useAlertModal } from "@/hooks/utils/useAlertModal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { handleErrorMessage } from "@/shared/handleErrorMessage";

interface ITrainingFormProps {
  studentId: string;
  trainingId?: string;
}

export const TrainingForm = ({ studentId, trainingId }: ITrainingFormProps) => {
  const { showAlert } = useAlertModal();
  const router = useRouter();
  const {
    studentError,
    isLoadingStudent,
    student,
    personalInfosList,
    refetchStudent,
  } = useGetStudent(studentId);

  const { createTraining, updateTraining, isSubmitingTraining } =
    useMutateTraning();

  const { exercises, exercisesError, isLoadingExercises, refetchExercises } =
    useGetExercises();

  const {
    isLoadingTraining,
    trainingError,
    training: currentTraining,
    refetchTraining,
  } = useGetTraining(trainingId);

  const isEditTraining = useMemo(() => Boolean(trainingId), [trainingId]);

  const defaultTrainigFormValues = useMemo<TrainingFormSchemaType>(
    () => ({
      exerciseOption: null,
      intervalInSeconds: 60,
    }),
    []
  );

  useEffect(() => {
    if (isEditTraining && currentTraining) {
      setStateTrainings(
        currentTraining?.exercises?.map((exercise) => ({
          exerciseOption: {
            value: exercise?.id || "",
            label: exercise?.name || "",
          },
          intervalInSeconds: Number(exercise?.intervalInSeconds),
        })) || []
      );
    }
  }, [currentTraining, isEditTraining]);

  const { control, formState, reset, handleSubmit } =
    useForm<TrainingFormSchemaType>({
      defaultValues: defaultTrainigFormValues,
      mode: "onTouched",
      resolver: zodResolver(trainingSchema),
    });

  const [stateExercises, setStateTrainings] = useState<
    TrainingFormSchemaType[]
  >([]);

  const [stateExerciseIndexToEdit, setStateExerciseIndexToEdit] = useState(-1);

  const [openExerciseFormModal, setOpenExerciseFormModal] = useState(false);

  const hasTrainingPlan = useMemo(() => {
    return Boolean(student?.trainingPlan);
  }, [student?.trainingPlan]);

  const isLoadingForm = useMemo(
    () => isLoadingStudent || isLoadingExercises || isLoadingTraining,
    [isLoadingStudent, isLoadingExercises, isLoadingTraining]
  );

  const exercisesMapped = useMemo<{
    [key: string]: ExerciseWithComputedFields;
  }>(() => {
    const exercisesMappedTmp: { [key: string]: ExerciseWithComputedFields } =
      {};
    exercises?.forEach((exercise) => {
      exercisesMappedTmp[String(exercise?.id)] = exercise;
    });
    return exercisesMappedTmp;
  }, [exercises]);

  const stateExercisesMapped = useMemo<{
    [key: string]: TrainingFormSchemaType;
  }>(() => {
    const stateExercisesMappedTmp: {
      [key: string]: TrainingFormSchemaType;
    } = {};
    stateExercises?.forEach((exercise) => {
      stateExercisesMappedTmp[String(exercise?.exerciseOption?.value)] =
        exercise;
    });
    return stateExercisesMappedTmp;
  }, [stateExercises]);

  const exercisesOptions = useMemo(
    () =>
      exercises
        ?.filter((exercise) => !stateExercisesMapped[String(exercise?.id)])
        ?.map((exercise) => ({
          value: exercise?.id || "",
          label: exercise?.name || "",
        })) || [],
    [exercises, stateExercisesMapped]
  );

  const handleOpenExerciseFormModal = useCallback(() => {
    setOpenExerciseFormModal(true);
    if (stateExerciseIndexToEdit >= 0) {
      const stateExercise = stateExercises[stateExerciseIndexToEdit];
      reset({
        exerciseOption: stateExercise?.exerciseOption,
        intervalInSeconds: stateExercise?.intervalInSeconds,
      });
    }
  }, [stateExerciseIndexToEdit, stateExercises, reset]);

  const handleCloseExerciseFormModal = useCallback(() => {
    setOpenExerciseFormModal(false);
    reset(defaultTrainigFormValues);
    setStateExerciseIndexToEdit(-1);
  }, [defaultTrainigFormValues, reset]);

  const handleSubmitiExercise = useCallback(
    (exerviseFormValues: TrainingFormSchemaType) => {
      console.log({ exerviseFormValues });
      if (stateExerciseIndexToEdit >= 0) {
        setStateTrainings(([...prev]) => {
          prev[stateExerciseIndexToEdit] = exerviseFormValues;
          return prev;
        });
      } else {
        setStateTrainings(([...prev]) => {
          prev.push(exerviseFormValues);
          return prev;
        });
      }
      handleCloseExerciseFormModal();
    },
    [stateExerciseIndexToEdit, handleCloseExerciseFormModal]
  );

  const handleRemoveExercise = useCallback((index: number) => {
    setStateTrainings((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const hamdleChangeExercisePosition = useCallback(
    (fromIndex: number, toIndex: number) => {
      setStateTrainings(([...prev]) => {
        const fromExercise = prev[fromIndex];
        const toExercise = prev[toIndex];
        prev[fromIndex] = toExercise;
        prev[toIndex] = fromExercise;
        return prev;
      });
    },
    []
  );

  const handleSubmitTraining = useCallback(() => {
    if (stateExercises.length === 0) return;
    const training: ITrainingForm = {
      exercises:
        stateExercises.map((exercise, i) => ({
          exerciseId: exercise.exerciseOption?.value || "",
          intervalInSeconds: exercise?.intervalInSeconds,
          order: i + 1,
        })) || [],
    };
    const onSuccess = () => {
      toast.success(
        `Treino ${isEditTraining ? "criado" : "editado"} com sucesso!`
      );
      router.push(`/teacher/students/${studentId}/training-plans`);
    };
    const onError = (error: any) => {
      showAlert({
        title: `Erro ao ${isEditTraining ? "criar" : "editar"} treino!`,
        description: handleErrorMessage(error),
        variant: "danger",
      });
    };
    if (isEditTraining) {
      updateTraining({ ...training, trainingId }, { onSuccess, onError });
    } else {
      createTraining(
        { ...training, trainingPlanId: student?.trainingPlan?.id || "" },
        { onSuccess, onError }
      );
    }
  }, [
    studentId,
    trainingId,
    router,
    student,
    stateExercises,
    isEditTraining,
    showAlert,
    createTraining,
    updateTraining,
  ]);

  const exercisesElement = useMemo(() => {
    if (stateExercises.length === 0) return <></>;
    return (
      <>
        <span className="text-xs sm:text-base">
          <b>Exercícios adicionados:</b>
        </span>
        {stateExercises?.map((exercise, i) => {
          const isFirstIndex = i === 0;
          const isLastIndex = i === stateExercises.length - 1;
          return (
            <ExerciseCard
              key={`${i}-exercise-card`}
              exercise={{
                ...exercisesMapped[String(exercise.exerciseOption?.value)],
                intervalInSeconds: Number(exercise.intervalInSeconds),
              }}
              actionButtonElement={
                <Dropdown>
                  <Dropdown.Toogle asChild>
                    <IconButton
                      variantStyle="info"
                      icon={<BsThreeDotsVertical />}
                    />
                  </Dropdown.Toogle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      className="gap-2"
                      onClick={() => setStateExerciseIndexToEdit(i)}
                    >
                      <FaPen />
                      editar
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="gap-2"
                      onClick={() => handleRemoveExercise(i)}
                    >
                      <FaTrash />
                      remover
                    </Dropdown.Item>
                    {!isFirstIndex && (
                      <Dropdown.Item
                        className="gap-2"
                        onClick={() => hamdleChangeExercisePosition(i, i - 1)}
                      >
                        <FaLongArrowAltUp />
                        Mover para cima
                      </Dropdown.Item>
                    )}
                    {!isLastIndex && (
                      <Dropdown.Item
                        className="gap-2"
                        onClick={() => hamdleChangeExercisePosition(i, i + 1)}
                      >
                        <FaLongArrowAltDown />
                        Mover para baixo
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              }
            />
          );
        })}
      </>
    );
  }, [
    stateExercises,
    exercisesMapped,
    handleRemoveExercise,
    hamdleChangeExercisePosition,
  ]);

  const handledContent = useMemo(() => {
    if (studentError) {
      return <FeedBackError onTryAgain={refetchStudent} />;
    }
    if (exercisesError) {
      return <FeedBackError onTryAgain={refetchExercises} />;
    }
    if (trainingError) {
      return <FeedBackError onTryAgain={refetchTraining} />;
    }
    if (isLoadingForm || isUndefined(student) || isUndefined(exercises)) {
      return <FeedBackLoading />;
    }
    return (
      <div className="flex flex-col space-y-4">
        {hasTrainingPlan && (
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-base">
              <b>Plano de treino:</b> {student?.trainingPlan?.name}{" "}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-base">
            <b>Aluno:</b> {student?.name}{" "}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap gap-x-4 gap-y-1">
          {personalInfosList?.map((info, i) => (
            <span key={i} className="text-xs sm:text-base">
              <b>{info.label}:</b> {info.value}
            </span>
          ))}
        </div>
        <div className="border border-border dark:border-dark-border" />
        <div className="flex flex-col space-y-4">{exercisesElement}</div>
        <Button
          className="ml-auto"
          onClick={handleOpenExerciseFormModal}
          rightIcon={<FaPlus />}
          variantStyle="info"
        >
          Adicionar Exercício
        </Button>
      </div>
    );
  }, [
    studentError,
    exercisesError,
    isLoadingForm,
    trainingError,
    student,
    exercises,
    hasTrainingPlan,
    personalInfosList,
    exercisesElement,
    refetchTraining,
    refetchStudent,
    refetchExercises,
    handleOpenExerciseFormModal,
  ]);

  useEffect(() => {
    if (stateExerciseIndexToEdit >= 0) {
      handleOpenExerciseFormModal();
    }
  }, [stateExerciseIndexToEdit, handleOpenExerciseFormModal]);

  return (
    <>
      <div className="flex flex-col space-y-8">
        <Card.Root>
          <Card.Header>
            <Card.Title>
              {isEditTraining ? "Editar" : "Criar"} treino
            </Card.Title>
          </Card.Header>
          <Card.Body>{handledContent}</Card.Body>
        </Card.Root>
        <Button
          fullWidth
          disabled={stateExercises.length === 0}
          isLoading={isSubmitingTraining}
          onClick={handleSubmitTraining}
        >
          {isEditTraining ? "Editar" : "Criar"} treino
        </Button>
      </div>
      <Modal.Root
        show={openExerciseFormModal}
        onClose={handleCloseExerciseFormModal}
        disableBackdropClick
      >
        <Modal.Title>
          {stateExerciseIndexToEdit >= 0 ? "Editar" : "Adicionar"} exercício
        </Modal.Title>
        <Modal.Body asChild>
          <form
            className="grid grid-cols-2 gap-x-8 gap-y-4 w-full"
            onSubmit={handleSubmit(handleSubmitiExercise)}
          >
            <Controller
              control={control}
              name="exerciseOption"
              render={({ field: { onChange, ...restField }, fieldState }) => (
                <Select
                  formControlClassName="col-span-2"
                  required
                  label="Exercício"
                  isAutocomplite
                  options={exercisesOptions}
                  onChangeSingleOption={onChange}
                  error={fieldState.error?.message}
                  {...restField}
                />
              )}
            />
            <Controller
              control={control}
              name="intervalInSeconds"
              render={({
                field: { value, onChange, ...restField },
                fieldState,
              }) => (
                <Input
                  formControlClassName="col-span-1"
                  value={String(value)}
                  onChange={(e) => onChange(Number(e.target.value))}
                  required
                  label="Descanso entre séries (s)"
                  error={fieldState.error?.message}
                  type="number"
                  {...restField}
                />
              )}
            />
            <div className="col-span-2 flex justify-end gap-4">
              <Button
                variantStyle="light"
                onClick={handleCloseExerciseFormModal}
              >
                Fechar
              </Button>
              <Button
                type="submit"
                variantStyle="primary"
                disabled={!formState.isDirty}
              >
                {stateExerciseIndexToEdit >= 0 ? "Editar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal.Root>
    </>
  );
};
