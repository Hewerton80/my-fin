import { handleZodValidationError } from "@/lib/zodHelpers";
import { AuthService } from "@/modules/auth/service";
import { apiFormTransitionHistoryReceiveSchema } from "@/modules/transitionHistory/schemas/apiFormTransitionHistoryReceiveSchema";
import { CONSTANTS } from "@/shared/constants";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const { USER_HAS_NO_PERMISSION, USER_NOT_FOUND } =
  CONSTANTS.API_RESPONSE_MESSAGES;

export async function POST(request: NextRequest) {
  const { loggedUser } = await AuthService.getLoggedUser(request);
  if (!loggedUser) {
    return NextResponse.json(
      { message: USER_HAS_NO_PERMISSION },
      { status: 401 }
    );
  }
  const userId = loggedUser?.id;

  const transitionRequest = (await request.json()) as z.infer<
    typeof apiFormTransitionHistoryReceiveSchema
  >;

  try {
    apiFormTransitionHistoryReceiveSchema.parse(transitionRequest);
  } catch (error: any) {
    return NextResponse.json(handleZodValidationError(error), { status: 400 });
  }

  try {
    console.log(transitionRequest);
    const { name, amount, paidAt } = transitionRequest;
    await prisma.transitionHistory.create({
      data: { name, amount, paidAt: new Date(paidAt), userId, type: "RECEIPT" },
    });
    return NextResponse.json(
      { message: "Transition created" },
      { status: 201 }
    );
  } catch (error: any) {
    console.log({ apiError: error });
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error?.meta?.field_name === "userId") {
        return NextResponse.json({ message: USER_NOT_FOUND }, { status: 404 });
      }
    }
    return NextResponse.json(error, { status: 500 });
  }
}
