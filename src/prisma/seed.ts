// import axios from "axios";
import prisma from "../lib/prisma";

export async function main() {
  // const categories = [
  //   {
  //     name: "Food",
  //     subCategories: [
  //       { name: "Supermarket", iconName: "🛒" },
  //       { name: "Restaurant", iconName: "🍝" },
  //     ],
  //   },
  //   {
  //     name: "Services",
  //     subCategories: [
  //       { name: "Cleaning", iconName: "🧹" },
  //       { name: "Laundry", iconName: "🧺" },
  //       { name: "Electrician", iconName: "🔌" },
  //       { name: "Funerary", iconName: "⚰️" },
  //       { name: "Mason", iconName: "🧱" },
  //       { name: "MEI", iconName: "📝" },
  //       { name: "Plumber", iconName: "🚿" },
  //       { name: "Gardener", iconName: "🌳" },
  //       { name: "Internet", iconName: "🌐" },
  //       { name: "Cell phone", iconName: "📱" },
  //       { name: "Ifood", iconName: "🍔" },
  //     ],
  //   },
  //   {
  //     name: "Subscriptions",
  //     subCategories: [
  //       { name: "Streamings", iconName: "🎬" },
  //       { name: "Musics Subscriptions", iconName: "🎵" },
  //       { name: "Games Subscriptions", iconName: "🎮" },
  //     ],
  //   },
  //   {
  //     name: "Transport",
  //     subCategories: [
  //       { name: "Uber", iconName: "🚕" },
  //       { name: "Bus", iconName: "🚌" },
  //     ],
  //   },
  //   {
  //     name: "Housing",
  //     subCategories: [{ name: "Rent", iconName: "🏠" }],
  //   },
  //   {
  //     name: "Health",
  //     subCategories: [
  //       { name: "Medicine", iconName: "💊" },
  //       { name: "Dentist", iconName: "🦷" },
  //       { name: "Health Insurance", iconName: "🏥" },
  //       { name: "Doctor", iconName: "👨‍⚕️" },
  //     ],
  //   },
  //   {
  //     name: "Aesthetic",
  //     subCategories: [
  //       { name: "Beard and Hair", iconName: "💈" },
  //       { name: "Nails", iconName: "💅" },
  //       { name: "Skin", iconName: "🧖" },
  //     ],
  //   },
  //   {
  //     name: "Leisure",
  //     subCategories: [
  //       {
  //         name: "Cinema",
  //         iconName: "🎥",
  //       },
  //       { name: "Travel", iconName: "✈️" },
  //     ],
  //   },
  //   {
  //     name: "Knowledge/Education",
  //     subCategories: [
  //       { name: "Book", iconName: "📖" },
  //       { name: "Magazine", iconName: "📰" },
  //       { name: "Newspaper", iconName: "🗞️" },
  //       { name: "Languages", iconName: "🗣️" },
  //       { name: "Course", iconName: "📚" },
  //       { name: "Ebook", iconName: "📘" },
  //     ],
  //   },
  //   {
  //     name: "Info products",
  //     subCategories: [
  //       { name: "Gift Card", iconName: "💳" },
  //       { name: "Games", iconName: "🎮" },
  //     ],
  //   },
  //   {
  //     name: "Esportes",
  //     subCategories: [
  //       { name: "Gym", iconName: "💪" },
  //       { name: "Crossfit", iconName: "🏋️" },
  //       { name: "Swimming", iconName: "🏊" },
  //       { name: "Soccer", iconName: "⚽" },
  //       { name: "Hit", iconName: "🥊" },
  //     ],
  //   },
  //   {
  //     name: "Pets",
  //     subCategories: [
  //       { name: "Pets Medicine", iconName: "🐶" },
  //       { name: "Pets Food", iconName: "🐱" },
  //     ],
  //   },
  //   {
  //     name: "Clothing",
  //     subCategories: [
  //       { name: "T-Shirts", iconName: "👕" },
  //       { name: "Pants", iconName: "👖" },
  //       { name: "Shoes", iconName: "👟" },
  //     ],
  //   },
  //   {
  //     name: "Home",
  //     subCategories: [
  //       { name: "Furniture", iconName: "🪑" },
  //       { name: "Decoration", iconName: "🖼️" },
  //       { name: "Home appliances", iconName: "🧺" },
  //       { name: "gas", iconName: "🔥" },
  //       { name: "Electronics", iconName: "📺" },
  //       { name: "Refrigerator", iconName: "🧊" },
  //       { name: "Power and lighting", iconName: "💡" },
  //       { name: "Water", iconName: "🚿" },
  //       { name: "Hygiene", iconName: "🧼" },
  //     ],
  //   },
  //   {
  //     name: "Electronics",
  //     subCategories: [
  //       { name: "Smartphone", iconName: "📱" },
  //       { name: "Computer", iconName: "💻" },
  //       { name: "Video game", iconName: "👾" },
  //       { name: "peripherals", iconName: "🖱️" },
  //     ],
  //   },
  //   {
  //     name: "Supplements",
  //     subCategories: [
  //       { name: "Proteins", iconName: "🥛" },
  //       { name: "Vitamins", iconName: "🍊" },
  //       { name: "Creatine", iconName: "💪" },
  //     ],
  //   },
  //   {
  //     name: "Others",
  //     subCategories: [{ name: "Other" }],
  //   },
  // ];
  // const countUsers = await prisma.user.count();
  // if (countUsers) return;
  // for (const category of categories) {
  //   await prisma.category.create({
  //     data: {
  //       name: category.name,
  //       subCategories: { create: category.subCategories },
  //     },
  //   });
  // }
  // const expensesToCreate = [
  //   {
  //     name: "Italki - Aula de inglês",
  //     registrationDate: "2024-01-11",
  //     amount: 56.94,
  //     dueDate: "2024-02-05",
  //   },
  //   {
  //     name: "Italki - Aula de inglês",
  //     registrationDate: "2024-01-26",
  //     amount: 57.33,
  //     dueDate: "2024-02-05",
  //   },
  //   {
  //     name: "Italki - Aula de inglês",
  //     registrationDate: "2024-01-28",
  //     amount: 57.33,
  //     dueDate: "2024-02-05",
  //   },
  //   {
  //     name: "Italki - Aula de inglês",
  //     registrationDate: "2024-02-21",
  //     amount: 57.53,
  //     dueDate: "2024-03-05",
  //   },
  //   {
  //     name: "Italki - Aula de inglês",
  //     registrationDate: "2024-03-22",
  //     amount: 58.22,
  //     dueDate: "2024-04-05",
  //   },
  //   {
  //     name: "Italki - Aula de inglês",
  //     registrationDate: "2024-04-20",
  //     amount: 61.0,
  //     dueDate: "2024-05-05",
  //   },
  //   {
  //     name: "Italki - Aula de inglês",
  //     registrationDate: "2024-04-20",
  //     amount: 61.0,
  //     dueDate: "2024-05-05",
  //   },
  //   {
  //     name: "Italki - Aula de inglês",
  //     registrationDate: "2024-05-10",
  //     amount: 61.06,
  //     dueDate: "2024-06-05",
  //   },
  //   {
  //     name: "Italki - Aula de inglês",
  //     registrationDate: "2024-05-17",
  //     amount: 59.69,
  //     dueDate: "2024-06-05",
  //   },
  // ];
  // for (const { dueDate, registrationDate, ...expense } of expensesToCreate) {
  //   await prisma.expense.create({
  //     data: {
  //       userId: "clwtbi7wy000008mi1rar1f7f",
  //       isPaid: true,
  //       iconsName: "🗣️",
  //       subCategoriesName: "Languages",
  //       subCategories: {
  //         connect: [{ id: "clwtbgo7o0012gk0keeix3bnp" }],
  //       },
  //       paymentType: "CREDIT_CARD",
  //       creditCardId: "clwtblzib000208mi0njwgk4r",
  //       transitionHistory: {
  //         create: { name: expense.name, amount: expense.amount },
  //       },
  //       registrationDate: new Date(registrationDate),
  //       dueDate: new Date(dueDate),
  //       ...expense,
  //     },
  //   });
  //   console.log(`Expense ${expense.name} created`);
  // }
}

main();
