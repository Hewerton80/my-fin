import { ExerciseWithComputedFields } from "@/types/Exercise";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

interface ExerciseCardProps {
  exercise: ExerciseWithComputedFields;
  actionButtonElement?: ReactNode;
}

export function ExerciseCard({
  exercise,
  actionButtonElement,
}: ExerciseCardProps) {
  return (
    <div
      key={exercise?.id}
      className={twMerge(
        "flex flex-col lg:flex-row items-center lg:items-start gap-4 pb-4 border-b border-border"
      )}
    >
      <Image
        className="w-[7.5rem]"
        width={120}
        height={135}
        alt="exercice"
        src={exercise?.image || ""}
      />
      <div className="flex flex-col h-full w-full">
        <h3 className="font-semibold text-sm md:text-base text-heading dark:text-white mb-2">
          {exercise?.name}
        </h3>

        {exercise?.description && (
          <p className="line-clamp-3 text-xs sm:text-sm mb-1">
            {exercise?.description}
          </p>
        )}
        <div className="flex flex-col">
          <strong className="text-xs sm:text-sm">
            Descanso: {exercise?.intervalInSeconds}s
          </strong>
        </div>
        {actionButtonElement && (
          <div
            className={twMerge("flex items-center w-full h-full justify-end")}
          >
            {actionButtonElement}
          </div>
        )}
      </div>
    </div>
  );
}
