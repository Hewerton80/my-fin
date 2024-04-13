"use client";
import { Button } from "@/components/ui/buttons/Button";
import { Card } from "@/components/ui/cards/Card";
import { Input } from "@/components/ui/forms/Input";
import {
  IUserForm,
  useGetUser,
  useMutateUser,
  createFormSchema,
  updateUserFormSchema,
} from "@/hooks/api/useUser";
import { Controller } from "react-hook-form";
import { useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { useAlertModal } from "@/hooks/utils/useAlertModal";
import { useRouter } from "next/navigation";
import { FeedBackLoading } from "@/components/ui/feedback/FeedBackLoading";
import { isUndefined } from "@/shared/isType";
import { FeedBackError } from "@/components/ui/feedback/FeedBackError";
import { Checkbox } from "@/components/ui/forms/Checkbox";
import { Select, SelectOption } from "@/components/ui/forms/Select";
import { Gender } from "@prisma/client";
import { genderOptions } from "@/shared/pickerOptions";
import { format as formatDate } from "date-fns";
import { GenderPtBr } from "@/types/User";
import { handleErrorMessage } from "@/shared/handleErrorMessage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CONSTANTS } from "@/shared/constants";

interface IUserFormProps {
  userId?: string;
}

export function UserForm({ userId }: IUserFormProps) {
  const router = useRouter();
  const { showAlert } = useAlertModal();

  const { createUser, updateUser, isSubmitingUser } = useMutateUser();

  const { control, formState, reset, setError, handleSubmit } =
    useForm<IUserForm>({
      defaultValues: {
        id: "",
        name: "",
        email: "",
        dateOfBirth: "",
        genderOption: null,
        password: "",
        confirmPassword: "",
        isAdmin: false,
        isTeacher: false,
        isEditUser: false,
      },
      mode: "onTouched",
      resolver: zodResolver(userId ? updateUserFormSchema : createFormSchema),
    });

  const {
    isLoadingUser,
    userError,
    refetchUser,
    user: currentFormUserData,
  } = useGetUser(userId);

  const isEditUser = useMemo(() => Boolean(userId), [userId]);
  const isLoadingForm = useMemo(
    () => isEditUser && isLoadingUser,
    [isEditUser, isLoadingUser]
  );

  useEffect(() => {
    if (isEditUser && currentFormUserData) {
      console.log({ currentFormUserData });
      reset({
        id: currentFormUserData?.id,
        name: currentFormUserData?.name,
        email: currentFormUserData?.email,
        dateOfBirth: currentFormUserData?.dateOfBirth
          ? formatDate(
              new Date(String(currentFormUserData?.dateOfBirth)),
              "yyyy-MM-dd"
            )
          : "",
        genderOption: {
          label: GenderPtBr?.[currentFormUserData?.gender as Gender],
          value: currentFormUserData?.gender,
        },

        isAdmin: currentFormUserData?.roles?.includes("ADMIN"),
        isTeacher: currentFormUserData?.roles?.includes("TEACHER"),
        isEditUser: true,
      });
    }
  }, [isEditUser, currentFormUserData, reset]);

  const handleUserDataForm = useCallback(
    ({ ...userDataForm }: IUserForm) => {
      userDataForm.gender = userDataForm.genderOption?.value as Gender;
      if (isEditUser) {
        delete userDataForm?.password;
        delete (userDataForm as any)?.email;
      }
      delete userDataForm?.confirmPassword;
      delete userDataForm?.isEditUser;
      delete (userDataForm as any)?.genderOption;

      return userDataForm;
    },
    [isEditUser]
  );

  const handleSubmitUser = useCallback(
    (userDataForm: IUserForm) => {
      const onSuccess = () => {
        toast(`Usuário ${isEditUser ? "editado" : "criado"} com sucesso!`);
        router.push("/admin/users");
      };
      const onError = (error: any) => {
        if (error?.response?.status === 409) {
          setError("email", {
            message: CONSTANTS.API_RESPONSE_MENSSAGES.USER_ALREADY_EXISTS,
          });
        } else {
          showAlert({
            title: `Erro ao ${isEditUser ? "editar" : "criar"} usuário`,
            description: handleErrorMessage(error),
            variant: "danger",
          });
        }
      };
      console.log({ handleSubmitUser: userDataForm });
      const handledUserDataForm = handleUserDataForm(userDataForm);
      if (isEditUser) {
        updateUser(handledUserDataForm, { onSuccess, onError });
      } else {
        createUser(handledUserDataForm, { onSuccess, onError });
      }
    },
    [
      router,
      isEditUser,
      createUser,
      updateUser,
      showAlert,
      handleUserDataForm,
      setError,
    ]
  );

  const handleFormContent = useMemo(() => {
    if (isEditUser) {
      if (userError) {
        return <FeedBackError onTryAgain={refetchUser} />;
      }
      if (isLoadingForm || isUndefined(currentFormUserData)) {
        return <FeedBackLoading />;
      }
    }
    return (
      <form
        onSubmit={handleSubmit(handleSubmitUser)}
        className="flex flex-col gap-8"
      >
        <div className="grid grid-cols-12 gap-x-8 gap-y-4">
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                formControlClassName="col-span-12 md:col-span-6 xl:col-span-4"
                required
                label="Nome"
                placeholder="Gymbson da Silva"
                error={fieldState?.error?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            // disabled={isEditUser}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                disabled={isEditUser}
                formControlClassName="col-span-12 md:col-span-6 xl:col-span-4"
                required
                label="Email"
                placeholder="Gym@email.com"
                type="email"
                error={fieldState?.error?.message}
              />
            )}
          />
          <Controller
            name="dateOfBirth"
            control={control}
            // disabled={isEditUser}
            render={({ field: { value, ...restField }, fieldState }) => {
              return (
                <Input
                  value={value || ""}
                  formControlClassName="col-span-12 md:col-span-6 xl:col-span-4"
                  required
                  label="Data de Nascimento"
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  error={fieldState?.error?.message}
                  {...restField}
                />
              );
            }}
          />
          <Controller
            name="genderOption"
            control={control}
            // disabled={isEditUser}
            render={({
              field: { onChange, value, ...restField },
              fieldState,
            }) => {
              return (
                <Select
                  value={value}
                  required
                  formControlClassName="col-span-12 md:col-span-6 xl:col-span-4"
                  onChangeSingleOption={(option) => {
                    onChange(option);
                  }}
                  label="Sexo"
                  options={genderOptions}
                  error={fieldState?.error?.message}
                  {...restField}
                />
              );
            }}
          />

          {!isEditUser && (
            <>
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    formControlClassName="col-span-12 md:col-span-6 xl:col-span-4"
                    required
                    label="Senha"
                    placeholder="********"
                    type="password"
                    error={fieldState?.error?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    formControlClassName="col-span-12 md:col-span-6 xl:col-span-4"
                    required
                    label="Confirmar senha"
                    placeholder="********"
                    type="password"
                    error={fieldState?.error?.message}
                    {...field}
                  />
                )}
              />
            </>
          )}
          <div className="flex items-end gap-4 sm:gap-6 col-span-12">
            <Controller
              name="isTeacher"
              control={control}
              render={({ field: { value, onChange, ...restField } }) => (
                <Checkbox
                  id={restField.name}
                  label="É Professor?"
                  onCheckedChange={(checked) => onChange(checked)}
                  checked={value}
                  {...restField}
                />
              )}
            />
            <Controller
              name="isAdmin"
              control={control}
              render={({ field: { value, onChange, ...restField } }) => (
                <Checkbox
                  id={restField.name}
                  label="É Administrador?"
                  onCheckedChange={(checked) => onChange(checked)}
                  checked={value}
                  {...restField}
                />
              )}
            />
          </div>
        </div>
        <Button
          type="submit"
          className="ml-auto"
          disabled={!formState.isDirty}
          isLoading={isSubmitingUser}
        >
          {isEditUser ? "Editar" : "Criar"}
        </Button>
      </form>
    );
  }, [
    control,
    userError,
    formState.isDirty,
    currentFormUserData,
    isLoadingForm,
    isEditUser,
    isSubmitingUser,
    handleSubmit,
    handleSubmitUser,
    refetchUser,
  ]);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>{isEditUser ? "Editar" : "Criar"} Usuário</Card.Title>
      </Card.Header>
      <Card.Body>{handleFormContent}</Card.Body>
    </Card.Root>
  );
}
