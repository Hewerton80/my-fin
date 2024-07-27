import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addDays } from "date-fns";

export async function PATCH(request: NextRequest) {
  console.log("---START PATCH JOBS---");
  const now = new Date();

  await prisma.expense.updateMany({
    where: { status: null },
    data: { status: "ON_DAY" },
  });

  await prisma.expense.updateMany({
    where: {
      status: "ON_DAY",
      dueDate: { gt: now, lt: addDays(now, 7) },
    },
    data: { status: "PENDING" },
  });

  await prisma.expense.updateMany({
    where: {
      status: "PENDING",
      dueDate: { lt: now },
    },
    data: { status: "OVERDUE" },
  });

  console.log("---END PATCH JOBS---");
  return NextResponse.json({ message: "ok" });
}
