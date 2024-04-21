// import { verifyIfUserIsTeacher } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  //   if (!(await verifyIfUserIsTeacher(request))) {
  //     return NextResponse.json(
  //       { message: USER_HAS_NO_PERMISSION },
  //       { status: 401 }
  //     );
  //   }
  const categories = await prisma.category.findMany({
    include: { subCategories: { select: { id: true, name: true } } },
  });
  return NextResponse.json(categories, { status: 200 });
}
