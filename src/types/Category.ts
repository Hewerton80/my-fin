import { Category } from "@prisma/client";
import { SubCategoryWitchComputedFields } from "./SubCategory";

export interface CategoryWitchComputedFields extends Category {
  subCategories: SubCategoryWitchComputedFields[];
}
