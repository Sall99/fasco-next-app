import { instance } from "@/config";
import { CreateCategoryInput } from "@/types";

export const useCreateCategory = async (values: CreateCategoryInput) => {
  const { data } = await instance.post(`/admin/category/create`, values);

  return data;
};
