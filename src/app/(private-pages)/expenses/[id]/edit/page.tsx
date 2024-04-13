"use client";
import { UserForm } from "@/components/screens/UserForm";
import { useParams } from "next/navigation";

export default function EditUsersPage() {
  const params = useParams<{ id: string }>();
  return <UserForm userId={params?.id} />;
}
