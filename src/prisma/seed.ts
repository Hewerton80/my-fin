// import axios from "axios";
import { hash } from "bcrypt";
import prisma from "../lib/prisma";
import { getRandomRGBColor } from "../shared/colors";
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
}
main();
