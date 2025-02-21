import { instance } from "@/config";
import { CreateProductRequestInterface } from "@/types";

export const useCreateProduct = async (
  values: CreateProductRequestInterface,
) => {
  const { data } = await instance.post(`/admin/product/create`, values);

  return data;
};
