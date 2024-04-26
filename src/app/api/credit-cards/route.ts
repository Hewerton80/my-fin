// import { verifyIfUserIsTeacher } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

export async function GET() {
// request: NextRequest
  //   if (!(await verifyIfUserIsTeacher(request))) {
  //     return NextResponse.json(
  //       { message: USER_HAS_NO_PERMISSION },
  //       { status: 401 }
  //     );
  //   }
  const creditCards = await prisma.creditCard.findMany();
  return NextResponse.json(creditCards, { status: 200 });
}
