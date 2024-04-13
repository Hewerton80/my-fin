import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";
import { CONSTANTS } from "@/shared/constants";
import { getTrainingsWithComputedFields } from "@/types/Training";

export async function GET(request: NextRequest) {
  const { payload, error } = await verifyJWT(request);
  if (error) {
    return NextResponse.json({ message: error }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: payload?.sub },
    include: {
      trainingPlans: {
        where: { isActive: true },
        include: {
          trainings: {
            orderBy: { order: "asc" },
            include: {
              trainingExercises: {
                orderBy: { order: "asc" },
                include: { exercise: { include: { muscle: true } } },
              },
            },
          },
        },
      },
    },
  });
  if (!user) {
    return NextResponse.json(
      { message: CONSTANTS.API_RESPONSE_MENSSAGES.USER_NOT_FOUND },
      { status: 404 }
    );
  }
  const trainingsWichComputedfields = user?.trainingPlans?.length
    ? getTrainingsWithComputedFields(
        user?.trainingPlans?.[0]?.trainings as any[]
      )
    : [];

  //   const userWichComputedfields = getUserWithComputedFields(user);
  return NextResponse.json(trainingsWichComputedfields, { status: 200 });
}
