// import axios from "axios";
import prisma from "../lib/prisma";
import { addDays } from "date-fns/addDays";

export async function main() {
  console.log("Start seeding...");
  const categories = [
    {
      name: "Food",
      subCategories: [
        { name: "Supermarket", iconName: "🛒" },
        { name: "Restaurant", iconName: "🍝" },
      ],
    },
    {
      name: "Services",
      subCategories: [
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
        { name: "Ifood", iconName: "🍔" },
        { name: "Dating app", iconName: "💑" },
      ],
    },
    {
      name: "Subscriptions",
      subCategories: [
        { name: "Streamings", iconName: "🎬" },
        { name: "Musics Subscriptions", iconName: "🎵" },
        { name: "Games Subscriptions", iconName: "🎮" },
      ],
    },
    {
      name: "Transport",
      subCategories: [
        { name: "Uber", iconName: "🚕" },
        { name: "Bus", iconName: "🚌" },
      ],
    },
    {
      name: "Housing",
      subCategories: [{ name: "Rent", iconName: "🏠" }],
    },
    {
      name: "Health",
      subCategories: [
        { name: "Medicine", iconName: "💊" },
        { name: "Dentist", iconName: "🦷" },
        { name: "Health Insurance", iconName: "🏥" },
        { name: "Doctor", iconName: "👨‍⚕️" },
      ],
    },
    {
      name: "Aesthetic",
      subCategories: [
        { name: "Beard and Hair", iconName: "💈" },
        { name: "Nails", iconName: "💅" },
        { name: "Skin", iconName: "🧖" },
      ],
    },
    {
      name: "Leisure",
      subCategories: [
        {
          name: "Cinema",
          iconName: "🎥",
        },
        { name: "Travel", iconName: "✈️" },
      ],
    },
    {
      name: "Knowledge/Education",
      subCategories: [
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
      subCategories: [
        { name: "Gift Card", iconName: "💳" },
        { name: "Games", iconName: "🎮" },
      ],
    },
    {
      name: "Esportes",
      subCategories: [
        { name: "Gym", iconName: "💪" },
        { name: "Crossfit", iconName: "🏋️" },
        { name: "Swimming", iconName: "🏊" },
        { name: "Soccer", iconName: "⚽" },
        { name: "Hit", iconName: "🥊" },
      ],
    },
    {
      name: "Pets",
      subCategories: [
        { name: "Pets Medicine", iconName: "🐶" },
        { name: "Pets Food", iconName: "🐱" },
      ],
    },
    {
      name: "Clothing",
      subCategories: [
        { name: "T-Shirts", iconName: "👕" },
        { name: "Pants", iconName: "👖" },
        { name: "Shoes", iconName: "👟" },
      ],
    },
    {
      name: "Home",
      subCategories: [
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
      subCategories: [
        { name: "Smartphone", iconName: "📱" },
        { name: "Computer", iconName: "💻" },
        { name: "Video game", iconName: "👾" },
        { name: "peripherals", iconName: "🖱️" },
      ],
    },
    {
      name: "Supplements",
      subCategories: [
        { name: "Proteins", iconName: "🥛" },
        { name: "Vitamins", iconName: "🍊" },
        { name: "Creatine", iconName: "💪" },
      ],
    },
    {
      name: "Money",
      subCategories: [
        { name: "Investment", iconName: "💰" },
        { name: "Donation", iconName: "🎁" },
        { name: "Loan", iconName: "💸" },
      ],
    },
    {
      name: "Others",
      subCategories: [{ name: "Other" }],
    },
  ];

  // for (const category of categories) {
  //   console.log(`Creating category ${category.name}`);
  //   await prisma.category.create({
  //     data: {
  //       name: category.name,
  //       subCategories: { create: category.subCategories },
  //     },
  //   });
  // }

  // const allExpense = await prisma.expense.findMany({
  //   where: {
  //     OR: [{ frequency: "DO_NOT_REPEAT" }, { frequency: null }],
  //   },
  // });
  // for (const expense of allExpense) {
  //   console.log(expense?.frequency);
  // }
  // const allTranstionHistory = await prisma.transitionHistory.findMany({
  //   include: { expense: true },
  // });
  // for (const transtionHistory of allTranstionHistory) {
  //   console.log(transtionHistory?.expense?.name);
  //   if (
  //     !transtionHistory?.expense?.frequency ||
  //     transtionHistory?.expense?.frequency === "DO_NOT_REPEAT"
  //   ) {
  //     await prisma.transitionHistory.update({
  //       where: {
  //         id: transtionHistory?.id,
  //       },
  //       data: {
  //         paidAt: new Date(transtionHistory?.expense?.registrationDate!),
  //       },
  //     });
  //   }
  // }
}

main();
