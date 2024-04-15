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
        { name: "Supermarket" },
        { id: subCategoryRestaurantId, name: "Restaurant" },
      ],
    },
    {
      name: "Services",
      subCategories: [
        { name: "Cleaning" },
        { name: "Laundry" },
        { name: "Electrician" },
        { name: "Funerary" },
        { name: "Mason" },
        { name: "MEI" },
        { name: "Plumber" },
        { name: "Gardener" },
        { name: "Internet" },
        { name: "Cell phone" },
        { id: subCategoryIfooId, name: "Ifood" },
      ],
    },
    {
      name: "Subscriptions",
      subCategories: [
        { name: "Streamings" },
        { name: "Musics Subscriptions" },
        { name: "Games Subscriptions" },
      ],
    },
    {
      name: "Transport",
      subCategories: [{ name: "Uber" }, { name: "Bus" }],
    },
    {
      name: "Housing",
      subCategories: [{ id: subCategoryRentId, name: "Rent" }],
    },
    {
      name: "Health",
      subCategories: [{ name: "Medicine" }, { name: "Dentist" }],
    },
    {
      name: "Aesthetic",
      subCategories: [
        { name: "Beard and Hair" },
        { name: "Nails" },
        { name: "Skin" },
      ],
    },
    {
      name: "Leisure",
      subCategories: [{ name: "Cinema" }, { name: "Travel" }],
    },
    {
      name: "Knowledge/Education",
      subCategories: [
        { name: "Book" },
        { name: "Magazine" },
        { name: "Newspaper" },
        { name: "English" },
        { name: "Course" },
        { name: "Ebook" },
      ],
    },
    {
      name: "Info products",
      subCategories: [
        { name: "Gift Card", id: subCategoryInfoProdictGitfitCardId },
        { name: "Games" },
      ],
    },
    {
      name: "Esportes",
      subCategories: [
        { name: "Gym" },
        { name: "Crossfit" },
        { name: "Swimming" },
        { name: "Soccer" },
        { name: "Hit" },
      ],
    },
    {
      name: "Pets",
      subCategories: [{ name: "Pets Medicine" }, { name: "Food" }],
    },
    {
      name: "Clothing",
      subCategories: [
        { name: "Shoes" },
        { name: "T-Shirts" },
        { name: "Pants" },
        { name: "Shoes" },
      ],
    },
    {
      name: "Home",
      subCategories: [
        { name: "Furniture" },
        { name: "Decoration" },
        { name: "Home appliances" },
        { name: "gas" },
        { name: "Electronics" },
        { name: "Power and lighting" },
        { name: "Water" },
      ],
    },
    {
      name: "Electronics",
      subCategories: [
        { name: "Smartphone" },
        { name: "Computer" },
        { name: "Video game" },
      ],
    },
    {
      name: "Supplements",
      subCategories: [
        { name: "Proteins" },
        { name: "Vitamins" },
        { name: "Creatine" },
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
        registrationDay: 29,
        userId: createdUser.id,
      },
      {
        id: creditCardRiachueloId,
        name: "Riachuelo",
        dueDay: 30,
        registrationDay: 24,
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
