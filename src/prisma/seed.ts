import prisma from "../lib/prisma";

export async function main() {
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
      name: "Clothing",
      subCategories: [
        { name: "T-Shirts", iconName: "👕" },
        { name: "Pants", iconName: "👖" },
        { name: "Shoes", iconName: "👟" },
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
    await prisma.category.create({
      data: {
        name: category.name,
        subCategories: { create: category.subCategories },
      },
    });
  }
}

main();
