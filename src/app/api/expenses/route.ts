import { createExpenseSchema } from "@/lib/apiZodSchemas/expenseSchema";
import { verifyIfUserIsTeacher } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  parseExpenseSearchParams,
  prismaPagination,
} from "@/lib/prismaHelpers";
import { handleZodValidationError } from "@/lib/zodHelpers";
import { CONSTANTS } from "@/shared/constants";
import {
  ExpernseWithComputedFields,
  getExpensesWitchComputedFields,
} from "@/types/Expense";
import { endOfDay } from "date-fns/endOfDay";
import { Frequency, PaymantType, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const { USER_HAS_NO_PERMISSION, INTERNAL_SERVER_ERROR, VALIDATION_ERROR } =
  CONSTANTS.API_RESPONSE_MESSAGES;

export async function GET(request: NextRequest) {
  //   if (!(await verifyIfUserIsTeacher(request))) {
  //     return NextResponse.json(
  //       { message: USER_HAS_NO_PERMISSION },
  //       { status: 401 }
  //     );
  //   }
  const { searchParams } = new URL(request.url);
  const { currentPage, perPage } = parseExpenseSearchParams(searchParams);
  const paginedExpenses = await prismaPagination<
    ExpernseWithComputedFields,
    Prisma.ExpenseWhereInput,
    Prisma.ExpenseOrderByWithRelationInput,
    Prisma.ExpenseInclude
  >({
    model: prisma.expense,
    paginationArgs: { currentPage, perPage },
    include: {
      subCategories: { select: { id: true, name: true, iconName: true } },
      creditCard: { select: { id: true, name: true } },
    },
    // orderBy,
    // where: {
    //   isTeacher: role === "TEACHER" || undefined,
    //   isAdmin: role === "ADMIN" || undefined,
    //   gender,
    //   isActive,
    //   OR: [{ name: { contains: keyword } }, { email: { contains: keyword } }],
    // },
  });
  paginedExpenses.docs = getExpensesWitchComputedFields(paginedExpenses.docs);
  return NextResponse.json(paginedExpenses, { status: 200 });
}

export async function POST(request: NextRequest) {
  // if (!(await verifyIfUserIsTeacher(request))) {
  //   return NextResponse.json(
  //     { message: USER_HAS_NO_PERMISSION },
  //     { status: 401 }
  //   );
  // }

  const expense = (await request.json()) as z.infer<typeof createExpenseSchema>;

  try {
    createExpenseSchema.parse(expense);
  } catch (error: any) {
    return NextResponse.json(handleZodValidationError(error), { status: 400 });
  }
  try {
    const {
      name,
      subCategories,
      description,
      amount,
      isPaid,
      paymentType,
      frequency,
      totalInstallments,
      creditCard,
      dueDate,
      registrationDate,
    } = expense;
    const createExpenseData: any = {
      userId: "clw29jrns001z8rpl4940ce1e",
      name,
      description,
      amount,
      isPaid,
      registrationDate: new Date(registrationDate!),
    };
    if (subCategories) {
      createExpenseData.subCategories = {
        connect: subCategories?.map((subCategoryId) => ({
          id: subCategoryId,
        })),
      };
    }
    if (isPaid) {
      createExpenseData.paymentType = paymentType as PaymantType;
      if (paymentType === PaymantType.CREDIT_CARD) {
        createExpenseData.creditCardId = creditCard?.id;
      }
    } else {
      createExpenseData.frequency = frequency as Frequency;
      createExpenseData.creditCardId = creditCard?.id;
      if (frequency !== Frequency.DO_NOT_REPEAT) {
        createExpenseData.totalInstallments = totalInstallments;
      }
    }
    if (createExpenseData?.creditCardId) {
      createExpenseData.paymentType = PaymantType.CREDIT_CARD;
      const now = new Date(registrationDate!);
      const currentDayOfMonth = now.getDate();
      const creditCardDueDay = creditCard?.dueDay!;
      const creditCardInvoiceClosingDay = creditCard?.invoiceClosingDay!;
      const handledDueDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        creditCardDueDay
      );
      if (creditCardInvoiceClosingDay <= creditCardDueDay) {
        if (currentDayOfMonth > creditCardInvoiceClosingDay) {
          handledDueDate.setMonth(handledDueDate.getMonth() + 1);
        }
      } else {
        if (currentDayOfMonth > creditCardInvoiceClosingDay) {
          handledDueDate.setMonth(handledDueDate.getMonth() + 2);
        } else {
          handledDueDate.setMonth(handledDueDate.getMonth() + 1);
        }
      }
      createExpenseData.dueDate = endOfDay(handledDueDate);
    } else if (dueDate) {
      createExpenseData.dueDate = endOfDay(new Date(dueDate));
    }
    await prisma.expense.create({
      data: createExpenseData,
      // data: {
      //   userId: "clvqt0co5001z11vxc52s97la",
      //   name,
      //   subCategories: subCategories
      //     ? {
      //         connect: subCategories?.map((subCategoryId) => ({
      //           id: subCategoryId,
      //         })),
      //       }
      //     : undefined,
      //   description,
      //   amount,
      //   isPaid,
      //   paymentType: paymentType as PaymantType,
      //   frequency: frequency as Frequency,
      //   totalInstallments,
      //   creditCardId,
      //   dueDate,
      //   registrationDate,
      // },
    });
    return NextResponse.json(expense, { status: 201 });
  } catch (error: any) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error?.code === "P2018") {
        return NextResponse.json(
          { message: "SubCategory not found" },
          { status: 404 }
        );
      }
      if (error?.meta?.field_name === "creditCardId") {
        return NextResponse.json(
          { message: "Credit card not found" },
          { status: 404 }
        );
      }
      if (error?.meta?.field_name === "userId") {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(error, { status: 500 });
  }
}
