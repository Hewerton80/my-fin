"use client";
import { Button } from "@/components/ui/buttons/Button";
import { IconButton } from "@/components/ui/buttons/IconButton";
import { Card } from "@/components/ui/cards/Card";
import {
  DataTable,
  IColmunDataTable,
  IRowDataTable,
} from "@/components/ui/dataDisplay/DataTable";
import { useGetUsers } from "@/hooks/api/useUser";
import {
  UserRole,
  UserRolesNamesType,
  UserWithComputedFields,
} from "@/types/User";
import { isUndefined } from "@/shared/isType";
import Link from "next/link";
import { useMemo } from "react";
import { MdEdit } from "react-icons/md";
import { orderByUserOptions, usersRolesOptions } from "@/shared/pickerOptions";
import { Picker } from "@/components/ui/forms/Picker";
import { Input } from "@/components/ui/forms/Input";
import { HorizontalScrollView } from "@/components/ui/navigation/HorizontalScrollView";

type UsersPageProps = keyof UserWithComputedFields;

export default function UsersPage() {
  const {
    users,
    isLoadingUsers,
    usersError,
    usersQueryParams,
    refetchUsers,
    changeUserFilter,
    goToPage,
  } = useGetUsers();

  const cols = useMemo<IColmunDataTable<UserWithComputedFields>[]>(
    () => [
      {
        label: "Nome",
        field: "name",
      },
      {
        label: "Email",
        field: "email",
      },
      {
        label: "Funções",
        field: "roles",
        onParse: (value) =>
          value?.roles
            ?.map((role) => UserRole[role as UserRolesNamesType])
            ?.join(", "),
      },
      {
        label: "Status",
        field: "isActive",
        onParse: (value) => (value?.isActive ? "Ativo" : "Inativo"),
      },
      {
        label: "",
        field: "actions",
        onParse: (value) => (
          <div className="flex" key={`${value?.id}-action`}>
            {value?.id && (
              <IconButton
                className="ml-auto"
                key="0 - 1"
                asChild
                icon={
                  <Link href={`/admin/users/${value?.id}/edit`}>
                    <MdEdit />
                  </Link>
                }
              />
            )}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>Usuários</Card.Title>
        <Card.Actions>
          <Button asChild>
            <Link href="/admin/users/create">Adicionar usuário</Link>
          </Button>
        </Card.Actions>
      </Card.Header>
      <Card.Body>
        <div className="flex items-center gap-2 sm:gap-2 flex-wrap">
          <HorizontalScrollView>
            <Picker
              label="Status"
              value={usersQueryParams.isActive}
              onChange={(value) => changeUserFilter({ isActive: value })}
              hideInput
              options={[
                { label: "Ativo", value: "true" },
                { label: "Inativo", value: "false" },
              ]}
            />
            <Picker
              label="Função"
              value={usersQueryParams.role}
              onChange={(value) => changeUserFilter({ role: value })}
              hideInput
              options={usersRolesOptions}
            />
            <Picker
              label="Ordenar por"
              value={usersQueryParams.orderBy}
              onChange={(value) => changeUserFilter({ orderBy: value })}
              hideInput
              hideCloseButton
              options={orderByUserOptions}
            />
          </HorizontalScrollView>
          <div className="ml-auto w-full sm:w-auto">
            <Input
              value={usersQueryParams.keyword}
              onChange={(e) => changeUserFilter({ keyword: e.target.value })}
              placeholder="Pesquisar"
            />
          </div>
        </div>
        <DataTable
          columns={cols}
          data={users?.docs}
          onTryAgainIfError={refetchUsers}
          isError={Boolean(usersError)}
          isLoading={isLoadingUsers || isUndefined(users)}
          paginationConfig={{
            currentPage: users?.currentPage || 1,
            totalPages: users?.lastPage || 1,
            perPage: users?.perPage || 25,
            totalRecords: users?.total || 1,
            onChangePage: goToPage,
          }}
        />
      </Card.Body>
    </Card.Root>
  );
}
