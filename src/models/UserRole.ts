import {SubCategory} from "./SubCategory";

export type UserRole = {
  roleId: number,
  displayValue: string,
  value: string,
  subCategory: SubCategory[],
}

export default UserRole;
