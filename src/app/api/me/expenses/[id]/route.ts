import { NextAuthOptions } from "@/lib/nextAuthConfig";
import { ExpenseServices } from "@/modules/expenses/service";
import { CONSTANTS } from "@/shared/constants";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const { USER_HAS_NO_PERMISSION } = CONSTANTS.API_RESPONSE_MESSAGES;

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(NextAuthOptions);
  if (!session) {
    return NextResponse.json(
      { message: USER_HAS_NO_PERMISSION },
      { status: 401 }
    );
  }
  const expenseWitchComputedFields = await ExpenseServices.getOneById(
    params?.id
  );
  return NextResponse.json(expenseWitchComputedFields, { status: 200 });
}
