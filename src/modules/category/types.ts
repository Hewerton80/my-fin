import { Category } from "@prisma/client";
import { SubCategory } from "@prisma/client";

export interface SubCategoryWitchComputedFields extends Partial<SubCategory> {}

export interface CategoryWitchComputedFields extends Partial<Category> {
  subCategories?: SubCategoryWitchComputedFields[];
}

export enum CategoryQueryKeys {
  LIST = "CATEGORY_LIST",
}
