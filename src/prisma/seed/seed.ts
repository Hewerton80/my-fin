import prisma from "../../lib/prisma";
import { seedExercisesAndMuscles } from "./exercises-muscles.seed";
// import { seedTrainings } from "./trainings.seed";
// import { seedUser } from "./users.seed";

async function main() {
  await seedExercisesAndMuscles();
  // await seedUser();
  // await seedTrainings();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
