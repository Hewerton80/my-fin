import { GroupCategory } from "@prisma/client";
import { Category } from "@prisma/client";

export interface CategoryWitchComputedFields extends Partial<Category> {}

export interface GroupCategoryWitchComputedFields
  extends Partial<GroupCategory> {
  categories?: CategoryWitchComputedFields[];
}

export enum GroupCategoryQueryKeys {
  LIST = "GROUP_CATEGORY_LIST",
}

export enum CategoryQueryKeys {
  LIST = "CATEGORY_LIST",
}
