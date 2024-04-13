import prisma from "../../lib/prisma";

const muscles = [
  {
    name: "Bíceps",
    exercises: [
      {
        name: "Rosca bíceps direta com barra W",
        image: "rosca-biceps-direta-na-barra-ez.png",
      },
      {
        name: "Rosca bíceps direta com halteres",
        image: "rosca-biceps-direta-com-halteres.png",
      },
      {
        name: "Rosca bíceps martelo em pé com halteres",
        image: "rosca-biceps-martelo-com-halteres.png",
      },
      {
        name: "Rosca bíceps com halteres no banco inclinado",
        image: "rosca-biceps-com-halteres-no-banco-inclinado.png",
      },
      {
        name: "Rosca bíceps apoiado no banco Scott e com a barra EZ",
        image: "rosca-biceps-no-banco-scott-com-barra-w.png",
      },
      {
        name: "Rosca bíceps no cabo e usando a corda",
        image: "rosca-biceps-no-cabo.png",
      },
    ],
  },
  {
    name: "Tríceps",
    exercises: [
      {
        name: "Tríceps na máquina",
        image: "triceps-maquina.png",
      },
      {
        name: "Tríceps na polia alta com barra reta",
        image: "triceps-puxada-no-pulley-com-barra.png",
      },
      {
        name: "Tríceps na polia alta com corda",
        image: "triceps-puxada-no-pulley-com-corda.png",
      },
    ],
  },
  {
    name: "Lombares",
    exercises: [],
  },
  {
    name: "Oblícos",
    exercises: [],
  },
  {
    name: "Peitoral",
    exercises: [
      {
        name: "Supino reto com barra",
        image: "supino-reto-com-barra.png",
      },
      {
        name: "Supino reto com halteres",
        image: "supino-reto-com-halteres.png",
      },
      {
        name: "Supino inclinado com barra",
        image: "supino-inclinado-com-barra.png",
      },
      {
        name: "Supino inclinado com halteres",
        image: "supino-inclinado-com-halteres.png",
      },
      {
        name: "Crucifixo no voador (Peck deck)",
        image: "cruxifixo-no-voador-no-peck-deck.png",
      },
    ],
  },
  {
    name: "Antebraços",
    exercises: [],
  },
  {
    name: "Ombros",
    exercises: [
      {
        name: "Desenvolvimento de ombros com halteres",
        image: "desenvolvimento-para-ombros-com-halteres.png",
      },
      {
        name: "Elevação lateral de ombros com halteres",
        image: "ombros-elevacao-lateral-de-ombros-com-halteres.png",
      },
      {
        name: "Voador invertido na máquina",
        image: "ombros-voador-invertido-na-maquina.png",
      },
    ],
  },
  {
    name: "Trapézio",
    exercises: [],
  },
  {
    name: "Dorsais",
    exercises: [
      {
        name: "Remada curvada com barra e pegada pronada",
        image: "costas-remada-curvada-barra.png",
      },
      {
        name: "Remada unilateral com halter (remada serrote)",
        image: "costas-remada-unilateral-com-halter-serrote-no-banco.png",
      },
      {
        name: "Puxada com barra no pulley",
        image: "costas-puxada-aberta-com-barra-no-pulley-1.png",
      },
      {
        name: "Remada na máquina de cabos",
        image: "remada-sentado-com-cabos-e-triangulo-para-costas.png",
      },
    ],
  },
  {
    name: "Abdômen",
    exercises: [],
  },
  {
    name: "Glúteos",
    exercises: [],
  },
  {
    name: "Isquiotibiais",
    exercises: [
      {
        name: "Levantamento Stiff",
        image: "pernas-levantamento-stiff-com-halteres.png",
      },
      {
        name: "Mesa flexora",
        image: "pernas-flexao-de-pernas-na-maquina.png",
      },
    ],
  },
  {
    name: "Abdutores",
    exercises: [
      {
        name: "Abdução de pernas na máquina",
        image: "pernas-abducao-de-pernas-na-maquina.png",
      },
      {
        name: "Adução de pernas na máquina",
        image: "pernas-aducao-de-pernas-na-maquina.png",
      },
    ],
  },
  {
    name: "Quadríceps",
    exercises: [
      {
        name: "Agachamento no rack",
        image: "agachamento-no-rack.png",
      },
      {
        name: "Leg press 45º",
        image: "pernas-leg-press-45-tradicional.png",
      },
      {
        name: "Agachamento na máquina Smith",
        image: "agachamento-no-smith.png",
      },
      {
        name: "Extensão de pernas",
        image: "pernas-extensao-de-pernas-na-maquina.png",
      },
    ],
  },
  {
    name: "Adutores",
    exercises: [],
  },
  {
    name: "Panturrilha",
    exercises: [
      {
        name: "Elevação de panturrilha em pé no aparelho",
        image: "panturrilha-em-pe-no-aparelho.png",
      },
      {
        name: "Elevação de panturrilha no leg press",
        image: "panturrilha-no-leg-press.png",
      },
    ],
  },
  {
    name: "Cardio",
    exercises: [],
  },
];

export async function seedExercisesAndMuscles() {
  const currentExistingMuscles = await prisma.muscle.findMany();
  const currentExistingExercies = await prisma.exercise.findMany();
  const currentExistingMusclesNames = currentExistingMuscles.map(
    (muscle) => muscle.name
  );
  const currentExistingExercisesNames = currentExistingExercies.map(
    (muscle) => muscle.name
  );
  const musclesToCreate = [...muscles]
    .filter((muscle) => !currentExistingMusclesNames.includes(muscle.name))
    .map(({ ...muscle }) => ({
      ...muscle,
      exercises: muscle.exercises.filter(
        (exercise) => !currentExistingExercisesNames.includes(exercise.name)
      ),
    }));
  await Promise.all(
    musclesToCreate.map(async (muscle) => {
      await prisma.muscle.create({
        data: {
          name: muscle.name,
          isActive: true,
          exercises: {
            create: muscle.exercises.map((exercise) => ({
              ...exercise,
              isActive: true,
              image: `https://raw.githubusercontent.com/Hewerton80/gym-power-front/master/public/exercisies/${exercise.image}`,
            })),
          },
        },
      });
    })
  );
}
