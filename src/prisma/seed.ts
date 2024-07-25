// import axios from "axios";
import { hash } from "bcrypt";
import prisma from "../lib/prisma";
import { getRandomRGBColor } from "../shared/colors";
// import { format } from "date-fns/set";

export async function main() {
  console.log("Start seeding...");
  const groupCategories = [
    {
      name: "Food",
      categories: [
        { name: "Supermarket", iconName: "🛒" },
        { name: "Restaurant", iconName: "🍝" },
        { name: "Supplements", iconName: "🥛" },
      ],
    },
    {
      name: "Services",
      categories: [
        { name: "Cleaning", iconName: "🧹" },
        { name: "Laundry", iconName: "🧺" },
        { name: "Electrician", iconName: "🔌" },
        { name: "Funerary", iconName: "⚰️" },
        { name: "Mason", iconName: "🧱" },
        { name: "MEI", iconName: "📝" },
        { name: "Plumber", iconName: "🚿" },
        { name: "Gardener", iconName: "🌳" },
        { name: "Internet", iconName: "🌐" },
        { name: "Cell phone", iconName: "📱" },
        { name: "Dating app", iconName: "💑" },
        { name: "Credit card", iconName: "💳" },
      ],
    },
    {
      name: "Subscriptions",
      categories: [
        { name: "Streamings", iconName: "🎬" },
        { name: "Musics Subscriptions", iconName: "🎵" },
        { name: "Games Subscriptions", iconName: "🎮" },
      ],
    },
    {
      name: "Transport",
      categories: [
        { name: "Uber", iconName: "🚕" },
        { name: "Bus", iconName: "🚌" },
      ],
    },
    {
      name: "Housing",
      categories: [{ name: "Rent", iconName: "🏠" }],
    },
    {
      name: "Health",
      categories: [
        { name: "Medicine", iconName: "💊" },
        { name: "Dentist", iconName: "🦷" },
        { name: "Health Insurance", iconName: "🏥" },
        { name: "Doctor", iconName: "👨‍⚕️" },
      ],
    },
    {
      name: "Aesthetic",
      categories: [
        { name: "Beard and Hair", iconName: "💈" },
        { name: "Nails", iconName: "💅" },
        { name: "Skin", iconName: "🧖" },
      ],
    },
    {
      name: "Leisure",
      categories: [
        {
          name: "Cinema",
          iconName: "🎥",
        },
        { name: "Travel", iconName: "✈️" },
      ],
    },
    {
      name: "Knowledge/Education",
      categories: [
        { name: "Book", iconName: "📖" },
        { name: "Magazine", iconName: "📰" },
        { name: "Newspaper", iconName: "🗞️" },
        { name: "Languages", iconName: "🗣️" },
        { name: "Course", iconName: "📚" },
        { name: "Ebook", iconName: "📘" },
      ],
    },
    {
      name: "Info products",
      categories: [
        { name: "Gift Card", iconName: "💳" },
        { name: "Games", iconName: "🎮" },
      ],
    },
    {
      name: "Esportes",
      categories: [
        { name: "Gym", iconName: "💪" },
        { name: "Crossfit", iconName: "🏋️" },
        { name: "Swimming", iconName: "🏊" },
        { name: "Soccer", iconName: "⚽" },
        { name: "Hit", iconName: "🥊" },
      ],
    },
    {
      name: "Pets",
      categories: [
        { name: "Pets Medicine", iconName: "🐶" },
        { name: "Pets Food", iconName: "🐱" },
      ],
    },
    {
      name: "Clothing",
      categories: [{ name: "Clothes", iconName: "👕" }],
    },
    {
      name: "Home",
      categories: [
        { name: "Furniture", iconName: "🪑" },
        { name: "Decoration", iconName: "🖼️" },
        { name: "Home appliances", iconName: "🧺" },
        { name: "gas", iconName: "🔥" },
        { name: "Electronics", iconName: "📺" },
        { name: "Refrigerator", iconName: "🧊" },
        { name: "Power and lighting", iconName: "💡" },
        { name: "Water", iconName: "🚿" },
        { name: "Hygiene", iconName: "🧼" },
      ],
    },
    {
      name: "Electronics",
      categories: [
        { name: "Smartphone", iconName: "📱" },
        { name: "Computer", iconName: "💻" },
        { name: "Video game", iconName: "👾" },
        { name: "peripherals", iconName: "🖱️" },
      ],
    },
    {
      name: "Money",
      categories: [
        { name: "Investment", iconName: "💰" },
        { name: "Donation", iconName: "🎁" },
        { name: "Loan", iconName: "💸" },
      ],
    },
    {
      name: "Others",
      categories: [{ name: "Other", iconName: "🤷" }],
    },
    {
      name: "Investiments",
      categories: [
        { name: "Cryptocurrency", iconName: "💰" },
        { name: "Real estate funds", iconName: "💰" },
      ],
    },
  ];

  const userId = "clxqkp44r0000bjq2spxzrfry";
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
