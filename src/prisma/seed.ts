// import axios from "axios";
import { hash } from "bcrypt";
import prisma from "../lib/prisma";
import { getRandomRGBColor } from "../shared/colors";
import { isNumber } from "../shared/isType";
import { addMonths } from "date-fns";
import { TransitionHistoryService } from "../modules/transitionHistory/service";
// import { format } from "date-fns/set";

export async function main() {
  // start seeding
  const allExpensese = await prisma.expense.findMany();
  for (const expense of allExpensese) {
    await prisma.transitionHistory.updateMany({
      where: { expenseId: expense.id },
      data: {
        name: expense?.name || undefined,
        frequency:
          expense?.frequency === "MONTHLY" ? "MONTHLY" : "DO_NOT_REPEAT",
        paymentType: expense?.paymentType || undefined,
        categoryId: expense?.categoryId,
        creditCardId: expense?.creditCardId || undefined,
        registrationDate: expense?.registrationDate || undefined,
      },
    });
    console.log("Updated transitionHistory for expense: ", expense?.name);
  }
  for (const expense of allExpensese) {
    if (
      !expense?.isPaid &&
      expense?.creditCardId &&
      expense?.frequency === "MONTHLY" &&
      expense?.dueDate &&
      //TODO add criation transitions to expenses without installments
      isNumber(expense?.currentInstallment as number) &&
      isNumber(expense?.totalInstallments as number)
    ) {
      const totalInstallments = expense?.totalInstallments as number;
      const currentInstallment = expense?.currentInstallment as number;
      const dueDate = expense?.dueDate;
      const startIndex = currentInstallment;
      const endIndex = totalInstallments;

      // const rangeInstallments = getRange(currentInstallment, totalInstallments);
      const rangeInstallments = Array.from(
        { length: endIndex - startIndex + 1 },
        (_, i) => startIndex + i
      );
      for (let index = 0; index < rangeInstallments.length; index++) {
        const _currentInstallment = rangeInstallments[index];
        const newDueDate = addMonths(new Date(dueDate), index);
        const newStatus =
          TransitionHistoryService.getStatusByDueDate(newDueDate);
        await prisma.transitionHistory.create({
          data: {
            name: expense?.name || undefined,
            frequency:
              expense?.frequency === "MONTHLY" ? "MONTHLY" : "DO_NOT_REPEAT",
            paymentType: expense?.paymentType || undefined,
            categoryId: expense?.categoryId,
            creditCardId: expense?.creditCardId || undefined,
            registrationDate: expense?.registrationDate || undefined,
            amount: expense?.amount,
            userId: expense?.userId,
            type: "PAYMENT",
            dueDate: newDueDate,
            status: newStatus,
            totalInstallments: totalInstallments,
            currentInstallment: _currentInstallment,
          },
        });
        console.log("Created transitionHistory for expense: ", expense?.name);
      }
    }
  }
}
main();
