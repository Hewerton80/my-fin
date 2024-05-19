import prisma from "../lib/prisma";
import { faker } from "@faker-js/faker";
import { hash } from "bcrypt";
import { getRandomRGBColor } from "../shared/colors";
import { Prisma } from "@prisma/client";
import { cuid } from "../shared/cuid";

export async function main() {
  const subCategoryRentId = cuid();
  const subCategoryIfooId = cuid();
  const subCategoryRestaurantId = cuid();
  const subCategoryInfoProdictGitfitCardId = cuid();
  const categories = [
    {
      name: "Food",
      subCategories: [
        { name: "Supermarket", iconName: "🛒" },
        { id: subCategoryRestaurantId, name: "Restaurant", iconName: "🍝" },
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
        { id: subCategoryIfooId, name: "Ifood", iconName: "🍔" },
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
      subCategories: [{ id: subCategoryRentId, name: "Rent", iconName: "🏠" }],
    },
    {
      name: "Health",
      subCategories: [
        { name: "Medicine", iconName: "🩺" },
        { name: "Dentist", iconName: "🦷" },
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
        {
          name: "Gift Card",
          id: subCategoryInfoProdictGitfitCardId,
          iconName: "💳",
        },
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
        { name: "Power and lighting", iconName: "💡" },
        { name: "Water", iconName: "🚿" },
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
      name: "Others",
      subCategories: [{ name: "Other" }],
    },
  ];
  const countUsers = await prisma.user.count();
  if (countUsers) return;

  for (const category of categories) {
    console.log(category.subCategories);
    await prisma.category.create({
      data: {
        name: category.name,
        subCategories: { create: category.subCategories },
      },
    });
  }

  const password = await hash("123456789", 10);
  const createdUser = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarBgColor: getRandomRGBColor(),
      password,
    },
  });
  const creditCardNubankId = cuid();
  const creditCardRiachueloId = cuid();
  await prisma.creditCard.createMany({
    data: [
      {
        id: creditCardNubankId,
        name: "Nubank",
        dueDay: 4,
        invoiceClosingDay: 29,
        userId: createdUser.id,
      },
      {
        id: creditCardRiachueloId,
        name: "Riachuelo",
        dueDay: 30,
        invoiceClosingDay: 22,
        userId: createdUser.id,
      },
    ],
  });
  const createExpenses: Prisma.ExpenseCreateArgs[] = [
    {
      data: {
        name: "Aluguel",
        iconName: "🏠",
        amount: 450,
        userId: createdUser.id,
        paymentType: "PIX",
        frequency: "MONTHLY",
        registrationDate: new Date("2024-05-01T00:00:01"),
        dueDate: new Date("2024-05-05T23:59:00"),
        subCategories: {
          connect: { id: subCategoryRentId },
        },
      },
    },
    {
      data: {
        name: "Gift Card PlayStation Store R$100",
        amount: 100,
        userId: createdUser.id,
        paymentType: "PIX",
        isPaid: true,
        subCategories: {
          connect: { id: subCategoryInfoProdictGitfitCardId },
        },
      },
    },
    {
      data: {
        name: "ifood Ana Cleide Campos",
        amount: 16.99,
        frequency: "DO_NOT_REPEAT",
        userId: createdUser.id,
        paymentType: "CREDIT_CARD",
        registrationDate: new Date("2024-04-29T00:00:01"),
        dueDate: new Date("2024-05-04T23:59:00"),
        creditCardId: creditCardNubankId,
        subCategories: {
          connect: [{ id: subCategoryIfooId }, { id: subCategoryRestaurantId }],
        },
      },
    },
  ];
  for (const expense of createExpenses) {
    await prisma.expense.create(expense);
  }
}

main();
