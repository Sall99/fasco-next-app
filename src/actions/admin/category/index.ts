import { instance } from "@/config";
import { CreateCategoryInput } from "@/types";

export const useCreateCategory = async (values: CreateCategoryInput) => {
  const { data } = await instance.post(`/admin/category/create`, values);

  return data;
};

export const useUpdateCategory = async (
  values: CreateCategoryInput,
  categoryId: string,
) => {
  const { data } = await instance.post(`/admin/category/update`, {
    ...values,
    id: categoryId,
  });

  return data;
};

export const useDeleteCategory = async (categoryId: string) => {
  const { data } = await instance.post(`/admin/category/delete`, {
    id: categoryId,
  });

  return data;
};
