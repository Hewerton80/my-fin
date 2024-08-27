// import axios from "axios";
import { hash } from "bcrypt";
import prisma from "../lib/prisma";
import { getRandomRGBColor } from "../utils/colors";
import { isNumber } from "../utils/isType";
import { TransitionHistoryService } from "../modules/transitionHistory/service";
import { TransitionHistoryFrequency } from "@prisma/client";
import { sortObjectsByProperty } from "../utils/array";
import { format, addMonths } from "date-fns";

export async function main() {
  console.log("Start seed");

  const allTransitionHistory = await prisma.transitionHistory.findMany({
    include: { creditCard: true },
    orderBy: [{ registrationDate: "asc" }, { paidAt: "asc" }],
  });

  const transitionObject: { [key: string]: Date } = {};
  for (const transition of allTransitionHistory) {
    if (
      transition?.frequency === "MONTHLY" &&
      transition?.name &&
      transition?.registrationDate
    ) {
      if (transitionObject?.[transition.name]) {
        const newRegistrationDate = transitionObject[transition.name];
        console.log(
          "transition: ",
          transition.name,
          format(newRegistrationDate, "yyyy-MM-dd"),
          transition?.paidAt
            ? format(new Date(transition?.paidAt!), "yyyy-MM-dd")
            : "notPaid"
        );
        await prisma.transitionHistory.update({
          where: { id: transition?.id },
          data: { registrationDate: newRegistrationDate },
        });
        transitionObject[transition.name] = addMonths(newRegistrationDate, 1);
      } else {
        transitionObject[transition.name] = new Date(
          transition.registrationDate
        );
      }
    }
  }

  const _allTransitionHistory = await prisma.transitionHistory.findMany({
    include: { creditCard: true },
  });

  for (const transition of _allTransitionHistory) {
    const registrationDate = transition?.registrationDate;
    if (registrationDate) {
      if (transition?.creditCard) {
        const { referenceMonth } =
          TransitionHistoryService.getDueDateAndReferenceMonthByRegistrationDateAndCreditCard(
            registrationDate,
            transition?.creditCard
          );
        await prisma.transitionHistory.update({
          where: { id: transition?.id },
          data: { referenceMonth },
        });
        console.log("Updated transitionHistory: ", {
          name: transition?.name,
          referenceMonth: referenceMonth,
        });
      } else {
        const referenceMonth = new Date(
          registrationDate?.getFullYear(),
          registrationDate?.getMonth(),
          1
        );
        await prisma.transitionHistory.update({
          where: { id: transition?.id },
          data: {
            referenceMonth,
          },
        });
        console.log("Updated transitionHistory: ", {
          name: transition?.name,
          referenceMonth,
        });
      }
    }
  }
}

main();
