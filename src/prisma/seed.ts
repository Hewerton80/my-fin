// import axios from "axios";
import { hash } from "bcrypt";
import prisma from "../lib/prisma";
import { getRandomRGBColor } from "../shared/colors";
// import { format } from "date-fns/set";

export async function main() {
  // const password = await hash("123456789", 10);
  // const user = await prisma.user.create({
  //   data: {
  //     email: "hewerton80@gmail.com",
  //     name: "Hewerton",
  //     avatarBgColor: getRandomRGBColor(),
  //     password,
  //   },
  // });
  // for (const uberExpense of expenses) {
  //   const name = `Uber - ${uberExpense.title}`;
  //   const date = format(
  //     new Date(uberExpense.subtitle.split(" • ")[0]),
  //     "yyyy-MM-dd"
  //   );
  //   const time = uberExpense.subtitle
  //     .split(" • ")[1]
  //     .replace(" AM", "")
  //     .replace(" PM", "");
  //   const dateTime = `${date} ${time}`;
  //   const amount = Number(
  //     uberExpense.description.replace("R$", "").replace(",", ".")
  //   );
  //   await prisma.expense.create({
  //     data: {
  //       name,
  //       userId,
  //       categoryId: "clxqkkice000ltyu6cvo0tcfd",
  //       creditCardId: "clxrujim1000011hppkr14gym",
  //       paymentType: "CREDIT_CARD",
  //       isPaid: true,
  //       registrationDate: new Date(dateTime),
  //       amount,
  //       transitionHistory: {
  //         create: {
  //           name,
  //           amount,
  //           paidAt: new Date(dateTime),
  //         },
  //       },
  //     },
  //   });
  //   console.log(`Expense ${name}`);
  // }
  // const getHandledName = (name: string) => {
  //   if (name.includes("Travessa Nemésio")) {
  //     return "Uber - casa";
  //   }
  //   if (name.includes("Alberto Maranhão")) {
  //     return "Uber - Clínica integrada";
  //   }
  //   if (name.includes("João Câmara")) {
  //     return "Uber - CFC Auto Escola";
  //   }
  //   if (name.includes("Lima e Silva")) {
  //     return "Uber - Clínica Trauma center";
  //   }
  //   return name;
  // };
  // const expenses = await prisma.expense.findMany({
  //   where: { name: { contains: "uber" } },
  // });
  // for (const expense of expenses) {
  //   const handledName = getHandledName(expense.name);
  //   if (handledName !== expense.name) {
  //     await prisma.expense.update({
  //       where: { id: expense.id },
  //       data: { name: handledName },
  //     });
  //   }
  // }
  // const transitions = await prisma.transitionHistory.findMany({
  //   where: { name: { contains: "uber" } },
  // });
  // for (const transition of transitions) {
  //   const handledName = getHandledName(transition.name);
  //   if (handledName !== transition.name) {
  //     await prisma.transitionHistory.update({
  //       where: { id: transition.id },
  //       data: { name: handledName },
  //     });
  //   }
  // }
  // for (const expense of italkiExpenses) {
  //   const date = new Date(expense.registrationDate);
  //   const name = `Italki - Aula de inglês`;
  //   const amount = expense.amount;
  //   await prisma.expense.create({
  //     data: {
  //       name,
  //       userId,
  //       categoryId: "clxqkkkpq0015tyu6zyp76t7b",
  //       creditCardId: "clxrujim1000011hppkr14gym",
  //       paymentType: "CREDIT_CARD",
  //       isPaid: true,
  //       registrationDate: date,
  //       amount,
  //       transitionHistory: {
  //         create: {
  //           name,
  //           amount,
  //           paidAt: date,
  //         },
  //       },
  //     },
  //   });
  //   console.log(`Expense ${name}`);
  // }
  // for (const ifood of ifoods) {
  //   const name = `Ifood - ${ifood.merchant.name}`;
  //   const date = new Date(ifood.closedAt);
  //   const amount = ifood.payments.total.value / 10;
  //   await prisma.expense.create({
  //     data: {
  //       name,
  //       userId,
  //       categoryId: "clxqkkgq50002tyu6jjfdpegl",
  //       creditCardId: "clxrujim1000011hppkr14gym",
  //       paymentType: "CREDIT_CARD",
  //       isPaid: true,
  //       registrationDate: date,
  //       amount,
  //       transitionHistory: {
  //         create: {
  //           name,
  //           amount,
  //           paidAt: date,
  //         },
  //       },
  //     },
  //   });
  //   console.log(`Expense ${name}`);
  // }
  // await prisma.creditCard.createMany({
  //   data: [
  //     {
  //       name: "Nubank",
  //       userId: user.id,
  //       invoiceClosingDay: 29,
  //       dueDay: 5,
  //       color: "rgb(130, 10, 209)",
  //     },
  //     {
  //       name: "Riachuelo",
  //       userId: user.id,
  //       invoiceClosingDay: 22,
  //       dueDay: 30,
  //       color: "rgb(33, 31, 32)",
  //     },
  //   ],
  // });
  // for (const groupCategory of groupCategories) {
  //   await prisma.groupCategory.create({
  //     data: {
  //       name: groupCategory.name,
  //       categories: {
  //         create: groupCategory.categories.map((category) => ({
  //           name: category.name,
  //           iconName: category.iconName,
  //         })),
  //       },
  //     },
  //   });
  //   console.log(`Group Category ${groupCategory.name}`);
  // }
  // await prisma.expense.updateMany({
  //   where: { isPaid: true },
  //   data: { status: "PAID" },
  // });
}
main();
