// import axios from "axios";
import prisma from "../lib/prisma";
import { addDays } from "date-fns/addDays";
import { getRandomRGBColor } from "../shared/colors";
import { hash } from "bcrypt";

export async function main() {
  console.log("Start seeding...");
  // const groupCategories = [
  //   {
  //     name: "Food",
  //     categories: [
  //       { name: "Supermarket", iconName: "🛒" },
  //       { name: "Restaurant", iconName: "🍝" },
  //     ],
  //   },
  //   {
  //     name: "Services",
  //     categories: [
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
  //       { name: "Dating app", iconName: "💑" },
  //     ],
  //   },
  //   {
  //     name: "Subscriptions",
  //     categories: [
  //       { name: "Streamings", iconName: "🎬" },
  //       { name: "Musics Subscriptions", iconName: "🎵" },
  //       { name: "Games Subscriptions", iconName: "🎮" },
  //     ],
  //   },
  //   {
  //     name: "Transport",
  //     categories: [
  //       { name: "Uber", iconName: "🚕" },
  //       { name: "Bus", iconName: "🚌" },
  //     ],
  //   },
  //   {
  //     name: "Housing",
  //     categories: [{ name: "Rent", iconName: "🏠" }],
  //   },
  //   {
  //     name: "Health",
  //     categories: [
  //       { name: "Medicine", iconName: "💊" },
  //       { name: "Dentist", iconName: "🦷" },
  //       { name: "Health Insurance", iconName: "🏥" },
  //       { name: "Doctor", iconName: "👨‍⚕️" },
  //     ],
  //   },
  //   {
  //     name: "Aesthetic",
  //     categories: [
  //       { name: "Beard and Hair", iconName: "💈" },
  //       { name: "Nails", iconName: "💅" },
  //       { name: "Skin", iconName: "🧖" },
  //     ],
  //   },
  //   {
  //     name: "Leisure",
  //     categories: [
  //       {
  //         name: "Cinema",
  //         iconName: "🎥",
  //       },
  //       { name: "Travel", iconName: "✈️" },
  //     ],
  //   },
  //   {
  //     name: "Knowledge/Education",
  //     categories: [
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
  //     categories: [
  //       { name: "Gift Card", iconName: "💳" },
  //       { name: "Games", iconName: "🎮" },
  //     ],
  //   },
  //   {
  //     name: "Esportes",
  //     categories: [
  //       { name: "Gym", iconName: "💪" },
  //       { name: "Crossfit", iconName: "🏋️" },
  //       { name: "Swimming", iconName: "🏊" },
  //       { name: "Soccer", iconName: "⚽" },
  //       { name: "Hit", iconName: "🥊" },
  //     ],
  //   },
  //   {
  //     name: "Pets",
  //     categories: [
  //       { name: "Pets Medicine", iconName: "🐶" },
  //       { name: "Pets Food", iconName: "🐱" },
  //     ],
  //   },
  //   {
  //     name: "Clothing",
  //     categories: [
  //       { name: "T-Shirts", iconName: "👕" },
  //       { name: "Pants", iconName: "👖" },
  //       { name: "Shoes", iconName: "👟" },
  //     ],
  //   },
  //   {
  //     name: "Home",
  //     categories: [
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
  //     categories: [
  //       { name: "Smartphone", iconName: "📱" },
  //       { name: "Computer", iconName: "💻" },
  //       { name: "Video game", iconName: "👾" },
  //       { name: "peripherals", iconName: "🖱️" },
  //     ],
  //   },
  //   {
  //     name: "Supplements",
  //     categories: [
  //       { name: "Proteins", iconName: "🥛" },
  //       { name: "Vitamins", iconName: "🍊" },
  //       { name: "Creatine", iconName: "💪" },
  //     ],
  //   },
  //   {
  //     name: "Money",
  //     categories: [
  //       { name: "Investment", iconName: "💰" },
  //       { name: "Donation", iconName: "🎁" },
  //       { name: "Loan", iconName: "💸" },
  //     ],
  //   },
  //   {
  //     name: "Others",
  //     categories: [{ name: "Other", iconName: "🤷" }],
  //   },
  // ];
  // const password = await hash("@Arquivo3703", 10);
  // await prisma.user.create({
  //   data: {
  //     email: "hewerton80@gmail.com",
  //     name: "Hewerton",
  //     avatarBgColor: getRandomRGBColor(),
  //     password,
  //   },
  // });
}

main();
