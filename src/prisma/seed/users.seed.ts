import prisma from "../../lib/prisma";
import { Gender } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { hash } from "bcrypt";
import { getRange } from "../../shared/getRange";
import { getRandomRGBColor } from "../../shared/colors";

export async function seedUser() {
  const countUsers = await prisma.user.count();
  if (countUsers >= 20) {
    return;
  }
  const password = await hash("123456789", 10);
  await prisma.user.createMany({
    data: getRange(30).map(() => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      isAdmin: faker.datatype.boolean(),
      isTeacher: faker.datatype.boolean(),
      gender: faker.helpers.enumValue(Gender),
      heightInMt: faker.number.float({ min: 1.5, max: 2.0, precision: 0.01 }),
      weightInKg: faker.number.float({ min: 50, max: 120, precision: 0.1 }),
      dateOfBirth: faker.date.birthdate(),
      avatarBgColor: getRandomRGBColor(),
      password,
    })),
  });
}
